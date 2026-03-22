<?php
require_once 'config.php';
$user = requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$uploadDir = __DIR__ . '/uploads/';

if ($method === 'GET') {
    if (!is_dir($uploadDir)) { jsonResponse(['success' => true, 'data' => [], 'total' => 0]); }
    $files = [];
    $search = $_GET['search'] ?? '';
    foreach (scandir($uploadDir) as $file) {
        if ($file === '.' || $file === '..') continue;
        if ($search && stripos($file, $search) === false) continue;
        $path = $uploadDir . $file;
        $files[] = [
            'name' => $file,
            'url' => '/api/uploads/' . $file,
            'size' => filesize($path),
            'size_formatted' => formatSize(filesize($path)),
            'type' => mime_content_type($path),
            'modified' => date('Y-m-d H:i:s', filemtime($path)),
        ];
    }
    usort($files, fn($a, $b) => strtotime($b['modified']) - strtotime($a['modified']));
    jsonResponse(['success' => true, 'data' => $files, 'total' => count($files)]);
} elseif ($method === 'DELETE') {
    $filename = $_GET['file'] ?? '';
    if (!$filename) jsonResponse(['success' => false, 'message' => 'Dosya adı gerekli'], 400);
    $filepath = $uploadDir . basename($filename);
    if (!file_exists($filepath)) jsonResponse(['success' => false, 'message' => 'Dosya bulunamadı'], 404);
    unlink($filepath);
    logActivity($user['id'], 'delete', 'file', null, $filename);
    jsonResponse(['success' => true, 'message' => 'Dosya silindi']);
} else {
    jsonResponse(['success' => false, 'message' => 'Desteklenmeyen metod'], 405);
}

function formatSize($bytes) {
    if ($bytes >= 1048576) return round($bytes / 1048576, 1) . ' MB';
    if ($bytes >= 1024) return round($bytes / 1024, 1) . ' KB';
    return $bytes . ' B';
}
