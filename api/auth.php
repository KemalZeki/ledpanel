<?php
require_once 'config.php';

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

switch ($action) {
    case 'login':
        if ($method !== 'POST') jsonResponse(['success' => false, 'message' => 'POST gerekli'], 405);
        $input = getInput();
        $username = $input['username'] ?? '';
        $password = $input['password'] ?? '';

        if (!$username || !$password) {
            jsonResponse(['success' => false, 'message' => 'Kullanıcı adı ve şifre gerekli'], 400);
        }

        $stmt = $pdo->prepare("SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = 1");
        $stmt->execute([$username, $username]);
        $user = $stmt->fetch();

        if (!$user || !password_verify($password, $user['password'])) {
            jsonResponse(['success' => false, 'message' => 'Geçersiz kullanıcı adı veya şifre'], 401);
        }

        $token = bin2hex(random_bytes(32));
        $expiry = date('Y-m-d H:i:s', strtotime('+7 days'));

        $stmt = $pdo->prepare("UPDATE users SET token = ?, token_expiry = ?, last_login = NOW() WHERE id = ?");
        $stmt->execute([$token, $expiry, $user['id']]);

        logActivity($user['id'], 'login', 'users', $user['id']);

        jsonResponse([
            'success' => true,
            'message' => 'Giriş başarılı',
            'data' => [
                'token' => $token,
                'user' => [
                    'id' => $user['id'],
                    'username' => $user['username'],
                    'email' => $user['email'],
                    'full_name' => $user['full_name'],
                    'role' => $user['role'],
                    'avatar' => $user['avatar'],
                ],
            ],
        ]);
        break;

    case 'verify':
        $user = requireAuth();
        jsonResponse(['success' => true, 'data' => ['user' => $user]]);
        break;

    case 'logout':
        $user = requireAuth();
        $stmt = $pdo->prepare("UPDATE users SET token = NULL, token_expiry = NULL WHERE id = ?");
        $stmt->execute([$user['id']]);
        logActivity($user['id'], 'logout', 'users', $user['id']);
        jsonResponse(['success' => true, 'message' => 'Çıkış yapıldı']);
        break;

    case 'change-password':
        if ($method !== 'POST') jsonResponse(['success' => false, 'message' => 'POST gerekli'], 405);
        $user = requireAuth();
        $input = getInput();

        $stmt = $pdo->prepare("SELECT password FROM users WHERE id = ?");
        $stmt->execute([$user['id']]);
        $current = $stmt->fetchColumn();

        if (!password_verify($input['current_password'] ?? '', $current)) {
            jsonResponse(['success' => false, 'message' => 'Mevcut şifre yanlış'], 400);
        }

        if (strlen($input['new_password'] ?? '') < 6) {
            jsonResponse(['success' => false, 'message' => 'Yeni şifre en az 6 karakter olmalı'], 400);
        }

        $hashed = password_hash($input['new_password'], PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id = ?");
        $stmt->execute([$hashed, $user['id']]);

        logActivity($user['id'], 'change_password', 'users', $user['id']);
        jsonResponse(['success' => true, 'message' => 'Şifre değiştirildi']);
        break;

    case 'profile':
        $user = requireAuth();
        if ($method === 'PUT' || $method === 'POST') {
            $input = getInput();
            $allowed = ['full_name', 'email'];
            $data = [];
            foreach ($allowed as $col) {
                if (isset($input[$col])) $data[$col] = $input[$col];
            }
            if (!empty($data)) {
                $sets = implode(', ', array_map(fn($c) => "{$c} = ?", array_keys($data)));
                $params = array_values($data);
                $params[] = $user['id'];
                $stmt = $pdo->prepare("UPDATE users SET {$sets} WHERE id = ?");
                $stmt->execute($params);
            }
            $stmt = $pdo->prepare("SELECT id, username, email, full_name, role, avatar FROM users WHERE id = ?");
            $stmt->execute([$user['id']]);
            jsonResponse(['success' => true, 'data' => ['user' => $stmt->fetch()]]);
        }
        jsonResponse(['success' => true, 'data' => ['user' => $user]]);
        break;

    default:
        jsonResponse(['success' => false, 'message' => 'Geçersiz aksiyon'], 400);
}
