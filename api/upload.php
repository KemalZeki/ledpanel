<?php
require_once 'config.php';
$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    jsonResponse(['success' => false, 'message' => 'POST gerekli'], 405);
}

if (!isset($_FILES['file'])) {
    jsonResponse(['success' => false, 'message' => 'Dosya bulunamadı'], 400);
}

$file = $_FILES['file'];
$allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
$maxSize = 10 * 1024 * 1024; // 10MB

if (!in_array($file['type'], $allowed)) {
    jsonResponse(['success' => false, 'message' => 'Geçersiz dosya türü. İzin verilenler: JPG, PNG, WebP, GIF, SVG'], 400);
}

if ($file['size'] > $maxSize) {
    jsonResponse(['success' => false, 'message' => 'Dosya boyutu 10MB\'dan büyük olamaz'], 400);
}

$ext = pathinfo($file['name'], PATHINFO_EXTENSION);
$filename = uniqid('img_') . '_' . time() . '.' . $ext;
$uploadDir = __DIR__ . '/uploads/';

if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);

$destination = $uploadDir . $filename;

if (move_uploaded_file($file['tmp_name'], $destination)) {
    $url = '/api/uploads/' . $filename;
    logActivity($user['id'], 'upload', 'file', null, $filename);
    jsonResponse(['success' => true, 'data' => ['url' => $url, 'filename' => $filename]]);
} else {
    jsonResponse(['success' => false, 'message' => 'Dosya yüklenemedi'], 500);
}
