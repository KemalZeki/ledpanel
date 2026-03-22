<?php
require_once 'config.php';
$user = requireAuth();

$stats = [];

$tables = [
    ['label' => 'Hizmetler', 'table' => 'services', 'icon' => 'Briefcase'],
    ['label' => 'Ürünler', 'table' => 'products', 'icon' => 'Monitor'],
    ['label' => 'Galeri', 'table' => 'gallery', 'icon' => 'Image'],
    ['label' => 'Referanslar', 'table' => 'clients', 'icon' => 'Building2'],
    ['label' => 'Yorumlar', 'table' => 'testimonials', 'icon' => 'MessageSquare'],
];

foreach ($tables as $t) {
    $count = $pdo->query("SELECT COUNT(*) FROM {$t['table']}")->fetchColumn();
    $stats[] = ['label' => $t['label'], 'count' => intval($count), 'icon' => $t['icon']];
}

// Mesaj istatistikleri
$totalMessages = $pdo->query("SELECT COUNT(*) FROM contact_messages")->fetchColumn();
$unreadMessages = $pdo->query("SELECT COUNT(*) FROM contact_messages WHERE is_read = 0")->fetchColumn();
$starredMessages = $pdo->query("SELECT COUNT(*) FROM contact_messages WHERE is_starred = 1")->fetchColumn();

// Son mesajlar
$recentMessages = $pdo->query("SELECT * FROM contact_messages ORDER BY id DESC LIMIT 5")->fetchAll();

// Son aktiviteler
$recentActivities = $pdo->query("
    SELECT al.*, u.full_name, u.username
    FROM activity_logs al
    LEFT JOIN users u ON al.user_id = u.id
    ORDER BY al.id DESC LIMIT 10
")->fetchAll();

// Aylık mesaj trendi (son 6 ay)
$monthlyMessages = $pdo->query("
    SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
    FROM contact_messages
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY month ORDER BY month ASC
")->fetchAll();

jsonResponse([
    'success' => true,
    'data' => [
        'stats'            => $stats,
        'totalMessages'    => intval($totalMessages),
        'unreadMessages'   => intval($unreadMessages),
        'starredMessages'  => intval($starredMessages),
        'recentMessages'   => $recentMessages,
        'recentActivities' => $recentActivities,
        'monthlyMessages'  => $monthlyMessages,
    ],
]);
