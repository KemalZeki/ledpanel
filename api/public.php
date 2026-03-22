<?php
// Public API - Auth gerektirmeyen, frontend için veri sağlayan endpoint
require_once 'config.php';

$entity = $_GET['entity'] ?? '';

switch ($entity) {
    case 'services':
        $stmt = $pdo->query("SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC");
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'products':
        $stmt = $pdo->query("SELECT * FROM products WHERE is_active = 1 ORDER BY sort_order ASC");
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'gallery':
        $category = $_GET['category'] ?? '';
        if ($category && $category !== 'Tümü') {
            $stmt = $pdo->prepare("SELECT * FROM gallery WHERE is_active = 1 AND category = ? ORDER BY sort_order ASC");
            $stmt->execute([$category]);
        } else {
            $stmt = $pdo->query("SELECT * FROM gallery WHERE is_active = 1 ORDER BY sort_order ASC");
        }
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'clients':
        $stmt = $pdo->query("SELECT * FROM clients WHERE is_active = 1 ORDER BY sort_order ASC");
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'testimonials':
        $stmt = $pdo->query("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC");
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'stats':
        $stmt = $pdo->query("SELECT * FROM stats WHERE is_active = 1 ORDER BY sort_order ASC");
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll()]);
        break;

    case 'settings':
        $stmt = $pdo->query("SELECT setting_key, setting_value, setting_group FROM settings");
        $settings = [];
        foreach ($stmt->fetchAll() as $row) {
            $settings[$row['setting_key']] = $row['setting_value'];
        }
        jsonResponse(['success' => true, 'data' => $settings]);
        break;

    case 'contact':
        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            jsonResponse(['success' => false, 'message' => 'POST gerekli'], 405);
        }
        $input = getInput();
        $required = ['name', 'email', 'message'];
        foreach ($required as $f) {
            if (empty($input[$f])) jsonResponse(['success' => false, 'message' => "'{$f}' alanı zorunludur"], 400);
        }
        $stmt = $pdo->prepare("INSERT INTO contact_messages (name, email, phone, company, subject, event_type, message) VALUES (?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            $input['name'], $input['email'], $input['phone'] ?? null,
            $input['company'] ?? null, $input['subject'] ?? null,
            $input['event_type'] ?? null, $input['message'],
        ]);
        jsonResponse(['success' => true, 'message' => 'Mesajınız başarıyla gönderildi']);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Geçersiz entity'], 400);
}
