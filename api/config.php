<?php
// ============================================================
// LED Ekran - API Konfigürasyon ve Yardımcı Fonksiyonlar
// ============================================================

error_reporting(E_ALL);
ini_set('display_errors', 0);

// CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ---- Veritabanı Bağlantısı ----
define('DB_HOST', 'localhost');
define('DB_NAME', 'ledekran_db');
define('DB_USER', 'root');
define('DB_PASS', '');

$pdo = null;
try {
    $pdo = new PDO(
        "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4",
        DB_USER, DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
    );
} catch (PDOException $e) {
    jsonResponse(['success' => false, 'message' => 'Veritabanı bağlantı hatası'], 500);
}

// ---- Yardımcı Fonksiyonlar ----

function jsonResponse($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit();
}

function getInput() {
    $raw = file_get_contents('php://input');
    $data = json_decode($raw, true);
    return $data ?: $_POST;
}

function requireAuth() {
    global $pdo;
    $headers = getallheaders();
    $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';

    if (!preg_match('/Bearer\s+(.+)/', $authHeader, $matches)) {
        jsonResponse(['success' => false, 'message' => 'Yetkilendirme gerekli'], 401);
    }

    $token = $matches[1];
    $stmt = $pdo->prepare("SELECT id, username, full_name, role, email FROM users WHERE token = ? AND token_expiry > NOW() AND is_active = 1");
    $stmt->execute([$token]);
    $user = $stmt->fetch();

    if (!$user) {
        jsonResponse(['success' => false, 'message' => 'Geçersiz veya süresi dolmuş oturum'], 401);
    }

    return $user;
}

function logActivity($userId, $action, $entityType = null, $entityId = null, $details = null) {
    global $pdo;
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $stmt = $pdo->prepare("INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$userId, $action, $entityType, $entityId, $details, $ip]);
}

// ---- Genel CRUD İşleyici ----
function handleCRUD($config) {
    global $pdo;
    $user = requireAuth();

    $table      = $config['table'];
    $columns    = $config['columns'];
    $searchable = $config['searchable'] ?? [];
    $required   = $config['required'] ?? [];
    $orderBy    = $config['orderBy'] ?? 'id DESC';

    $method = $_SERVER['REQUEST_METHOD'];

    switch ($method) {
        case 'GET':
            handleGet($pdo, $table, $searchable, $orderBy);
            break;
        case 'POST':
            handleCreate($pdo, $user, $table, $columns, $required);
            break;
        case 'PUT':
            handleUpdate($pdo, $user, $table, $columns);
            break;
        case 'DELETE':
            handleDelete($pdo, $user, $table);
            break;
        default:
            jsonResponse(['success' => false, 'message' => 'Desteklenmeyen metod'], 405);
    }
}

function handleGet($pdo, $table, $searchable, $orderBy) {
    // Tekil kayıt
    if (isset($_GET['id'])) {
        $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        $item = $stmt->fetch();
        if (!$item) jsonResponse(['success' => false, 'message' => 'Kayıt bulunamadı'], 404);
        jsonResponse(['success' => true, 'data' => $item]);
    }

    // Liste
    $page   = max(1, intval($_GET['page'] ?? 1));
    $limit  = min(100, max(1, intval($_GET['limit'] ?? 50)));
    $offset = ($page - 1) * $limit;
    $search = $_GET['search'] ?? '';
    $status = $_GET['status'] ?? '';

    $where = [];
    $params = [];

    if ($search && !empty($searchable)) {
        $searchConds = array_map(fn($col) => "{$col} LIKE ?", $searchable);
        $where[] = '(' . implode(' OR ', $searchConds) . ')';
        $params = array_fill(0, count($searchable), "%{$search}%");
    }

    if ($status !== '' && $status !== 'all') {
        $where[] = 'is_active = ?';
        $params[] = intval($status);
    }

    // Ek filtreler
    foreach ($_GET as $key => $val) {
        if (in_array($key, ['category', 'event_type', 'subject', 'is_read', 'is_starred', 'setting_group', 'role'])) {
            $where[] = "{$key} = ?";
            $params[] = $val;
        }
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';

    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM {$table} {$whereClause}");
    $countStmt->execute($params);
    $total = $countStmt->fetchColumn();

    $dataStmt = $pdo->prepare("SELECT * FROM {$table} {$whereClause} ORDER BY {$orderBy} LIMIT {$limit} OFFSET {$offset}");
    $dataStmt->execute($params);
    $items = $dataStmt->fetchAll();

    jsonResponse([
        'success' => true,
        'data'    => $items,
        'total'   => intval($total),
        'page'    => $page,
        'limit'   => $limit,
        'pages'   => ceil($total / $limit),
    ]);
}

function handleCreate($pdo, $user, $table, $columns, $required) {
    $input = getInput();

    foreach ($required as $field) {
        if (empty($input[$field])) {
            jsonResponse(['success' => false, 'message' => "'{$field}' alanı zorunludur"], 400);
        }
    }

    $data = [];
    foreach ($columns as $col) {
        if (isset($input[$col])) {
            $data[$col] = $input[$col];
        }
    }

    if (empty($data)) {
        jsonResponse(['success' => false, 'message' => 'Veri sağlanmadı'], 400);
    }

    $cols = implode(', ', array_keys($data));
    $placeholders = implode(', ', array_fill(0, count($data), '?'));

    $stmt = $pdo->prepare("INSERT INTO {$table} ({$cols}) VALUES ({$placeholders})");
    $stmt->execute(array_values($data));

    $newId = $pdo->lastInsertId();
    logActivity($user['id'], 'create', $table, $newId, json_encode($data, JSON_UNESCAPED_UNICODE));

    $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE id = ?");
    $stmt->execute([$newId]);

    jsonResponse(['success' => true, 'message' => 'Kayıt oluşturuldu', 'data' => $stmt->fetch()], 201);
}

function handleUpdate($pdo, $user, $table, $columns) {
    $id = $_GET['id'] ?? null;
    if (!$id) jsonResponse(['success' => false, 'message' => 'ID gerekli'], 400);

    $input = getInput();
    $data = [];
    foreach ($columns as $col) {
        if (array_key_exists($col, $input)) {
            $data[$col] = $input[$col];
        }
    }

    if (empty($data)) {
        jsonResponse(['success' => false, 'message' => 'Güncellenecek veri yok'], 400);
    }

    $sets = implode(', ', array_map(fn($col) => "{$col} = ?", array_keys($data)));
    $params = array_values($data);
    $params[] = $id;

    $stmt = $pdo->prepare("UPDATE {$table} SET {$sets} WHERE id = ?");
    $stmt->execute($params);

    logActivity($user['id'], 'update', $table, $id, json_encode($data, JSON_UNESCAPED_UNICODE));

    $stmt = $pdo->prepare("SELECT * FROM {$table} WHERE id = ?");
    $stmt->execute([$id]);

    jsonResponse(['success' => true, 'message' => 'Kayıt güncellendi', 'data' => $stmt->fetch()]);
}

function handleDelete($pdo, $user, $table) {
    $id = $_GET['id'] ?? null;
    if (!$id) jsonResponse(['success' => false, 'message' => 'ID gerekli'], 400);

    $stmt = $pdo->prepare("DELETE FROM {$table} WHERE id = ?");
    $stmt->execute([$id]);

    logActivity($user['id'], 'delete', $table, $id);

    jsonResponse(['success' => true, 'message' => 'Kayıt silindi']);
}
