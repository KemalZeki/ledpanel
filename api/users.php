<?php
require_once 'config.php';
$currentUser = requireAuth();

if ($currentUser['role'] !== 'admin') {
    jsonResponse(['success' => false, 'message' => 'Yetkiniz yok'], 403);
}

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $stmt = $pdo->prepare("SELECT id, username, email, full_name, role, avatar, last_login, is_active, created_at FROM users WHERE id = ?");
            $stmt->execute([$_GET['id']]);
            $user = $stmt->fetch();
            if (!$user) jsonResponse(['success' => false, 'message' => 'Kullanıcı bulunamadı'], 404);
            jsonResponse(['success' => true, 'data' => $user]);
        }
        $search = $_GET['search'] ?? '';
        $page = max(1, intval($_GET['page'] ?? 1));
        $limit = 20;
        $offset = ($page - 1) * $limit;
        $where = '';
        $params = [];
        if ($search) {
            $where = "WHERE username LIKE ? OR email LIKE ? OR full_name LIKE ?";
            $params = ["%$search%", "%$search%", "%$search%"];
        }
        $total = $pdo->prepare("SELECT COUNT(*) FROM users $where");
        $total->execute($params);
        $totalCount = $total->fetchColumn();
        $stmt = $pdo->prepare("SELECT id, username, email, full_name, role, avatar, last_login, is_active, created_at FROM users $where ORDER BY id DESC LIMIT $limit OFFSET $offset");
        $stmt->execute($params);
        jsonResponse(['success' => true, 'data' => $stmt->fetchAll(), 'total' => intval($totalCount), 'pages' => ceil($totalCount / $limit), 'page' => $page]);
        break;

    case 'POST':
        $input = getInput();
        if (empty($input['username']) || empty($input['email']) || empty($input['password'])) {
            jsonResponse(['success' => false, 'message' => 'Kullanıcı adı, e-posta ve şifre zorunlu'], 400);
        }
        $exists = $pdo->prepare("SELECT id FROM users WHERE username = ? OR email = ?");
        $exists->execute([$input['username'], $input['email']]);
        if ($exists->fetch()) jsonResponse(['success' => false, 'message' => 'Bu kullanıcı adı veya e-posta zaten mevcut'], 400);
        $hash = password_hash($input['password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO users (username, email, password, full_name, role, is_active) VALUES (?, ?, ?, ?, ?, ?)");
        $stmt->execute([$input['username'], $input['email'], $hash, $input['full_name'] ?? '', $input['role'] ?? 'editor', $input['is_active'] ?? 1]);
        $newId = $pdo->lastInsertId();
        logActivity($currentUser['id'], 'create', 'users', $newId, "Yeni kullanıcı: {$input['username']}");
        jsonResponse(['success' => true, 'message' => 'Kullanıcı oluşturuldu'], 201);
        break;

    case 'PUT':
        $id = $_GET['id'] ?? null;
        if (!$id) jsonResponse(['success' => false, 'message' => 'ID gerekli'], 400);
        $input = getInput();
        $sets = [];
        $params = [];
        foreach (['username', 'email', 'full_name', 'role', 'is_active'] as $col) {
            if (array_key_exists($col, $input)) { $sets[] = "$col = ?"; $params[] = $input[$col]; }
        }
        if (!empty($input['password'])) {
            $sets[] = "password = ?";
            $params[] = password_hash($input['password'], PASSWORD_DEFAULT);
        }
        if (empty($sets)) jsonResponse(['success' => false, 'message' => 'Güncellenecek veri yok'], 400);
        $params[] = $id;
        $stmt = $pdo->prepare("UPDATE users SET " . implode(', ', $sets) . " WHERE id = ?");
        $stmt->execute($params);
        logActivity($currentUser['id'], 'update', 'users', $id);
        jsonResponse(['success' => true, 'message' => 'Kullanıcı güncellendi']);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? null;
        if (!$id) jsonResponse(['success' => false, 'message' => 'ID gerekli'], 400);
        if ($id == $currentUser['id']) jsonResponse(['success' => false, 'message' => 'Kendinizi silemezsiniz'], 400);
        $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
        $stmt->execute([$id]);
        logActivity($currentUser['id'], 'delete', 'users', $id);
        jsonResponse(['success' => true, 'message' => 'Kullanıcı silindi']);
        break;
}
