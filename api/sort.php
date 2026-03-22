<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'POST gerekli'], 405);
}

$user = requireAuth();

$input = getInput();
$table = $input['table'] ?? '';
$items = $input['items'] ?? [];

$allowed = ['services', 'products', 'gallery', 'clients', 'testimonials'];
if (!in_array($table, $allowed)) {
    jsonResponse(['success' => false, 'message' => 'Gecersiz tablo: ' . $table], 400);
}

if (empty($items) || !is_array($items)) {
    jsonResponse(['success' => false, 'message' => 'Siralama verisi gerekli'], 400);
}

try {
    $offset = 100000;

    $pdo->beginTransaction();

    // 1. Tum ID'leri gecici yuksek degerlere tasi (cakismayi onle)
    foreach ($items as $index => $item) {
        $oldId = intval($item['id'] ?? 0);
        if ($oldId > 0) {
            $tempId = $oldId + $offset;
            $stmt = $pdo->prepare("UPDATE {$table} SET id = ?, sort_order = ? WHERE id = ?");
            $stmt->execute([$tempId, $index + 1, $oldId]);
        }
    }

    // 2. Gecici ID'leri yeni sirali ID'lere donustur (1, 2, 3, ...)
    foreach ($items as $index => $item) {
        $oldId = intval($item['id'] ?? 0);
        if ($oldId > 0) {
            $tempId = $oldId + $offset;
            $newId = $index + 1;
            $stmt = $pdo->prepare("UPDATE {$table} SET id = ? WHERE id = ?");
            $stmt->execute([$newId, $tempId]);
        }
    }

    $pdo->commit();

    // AUTO_INCREMENT DDL oldugu icin transaction disinda calistirilmali
    $nextId = count($items) + 1;
    try {
        $pdo->exec("ALTER TABLE {$table} AUTO_INCREMENT = {$nextId}");
    } catch (Exception $e) {
        // Kritik degil, atlanabilir
    }

    logActivity($user['id'], 'update', $table, null, 'Siralama ve ID\'ler guncellendi');
    jsonResponse(['success' => true, 'message' => 'Siralama ve ID\'ler guncellendi']);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    jsonResponse(['success' => false, 'message' => 'Veritabani hatasi: ' . $e->getMessage()], 500);
}
