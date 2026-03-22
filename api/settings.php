<?php
require_once 'config.php';
$user = requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $group = $_GET['group'] ?? null;
        if ($group) {
            $stmt = $pdo->prepare("SELECT * FROM settings WHERE setting_group = ? ORDER BY id ASC");
            $stmt->execute([$group]);
        } else {
            $stmt = $pdo->query("SELECT * FROM settings ORDER BY setting_group, id ASC");
        }
        $settings = $stmt->fetchAll();
        $grouped = [];
        foreach ($settings as $s) {
            $grouped[$s['setting_group']][$s['setting_key']] = $s['setting_value'];
        }
        jsonResponse(['success' => true, 'data' => $settings, 'grouped' => $grouped]);
        break;

    case 'PUT':
    case 'POST':
        $input = getInput();
        $settings = $input['settings'] ?? [];
        foreach ($settings as $key => $value) {
            $stmt = $pdo->prepare("UPDATE settings SET setting_value = ? WHERE setting_key = ?");
            $stmt->execute([$value, $key]);
            if ($stmt->rowCount() === 0) {
                $group = $input['group'] ?? 'general';
                $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value, setting_group) VALUES (?, ?, ?)");
                $stmt->execute([$key, $value, $group]);
            }
        }
        logActivity($user['id'], 'update', 'settings', null, json_encode($settings, JSON_UNESCAPED_UNICODE));
        jsonResponse(['success' => true, 'message' => 'Ayarlar güncellendi']);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Desteklenmeyen metod'], 405);
}
