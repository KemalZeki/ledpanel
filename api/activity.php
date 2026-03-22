<?php
require_once 'config.php';
$user = requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $page = max(1, intval($_GET['page'] ?? 1));
    $limit = 30;
    $offset = ($page - 1) * $limit;
    $where = [];
    $params = [];

    if (!empty($_GET['action'])) { $where[] = "al.action = ?"; $params[] = $_GET['action']; }
    if (!empty($_GET['entity_type'])) { $where[] = "al.entity_type = ?"; $params[] = $_GET['entity_type']; }
    if (!empty($_GET['user_id'])) { $where[] = "al.user_id = ?"; $params[] = $_GET['user_id']; }
    if (!empty($_GET['search'])) {
        $where[] = "(u.full_name LIKE ? OR u.username LIKE ? OR al.action LIKE ? OR al.entity_type LIKE ?)";
        $s = "%{$_GET['search']}%";
        $params = array_merge($params, [$s, $s, $s, $s]);
    }

    $whereClause = !empty($where) ? 'WHERE ' . implode(' AND ', $where) : '';
    $total = $pdo->prepare("SELECT COUNT(*) FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id $whereClause");
    $total->execute($params);
    $totalCount = $total->fetchColumn();

    $stmt = $pdo->prepare("SELECT al.*, u.full_name, u.username, u.role as user_role FROM activity_logs al LEFT JOIN users u ON al.user_id = u.id $whereClause ORDER BY al.id DESC LIMIT $limit OFFSET $offset");
    $stmt->execute($params);

    jsonResponse(['success' => true, 'data' => $stmt->fetchAll(), 'total' => intval($totalCount), 'pages' => ceil($totalCount / $limit), 'page' => $page]);
} elseif ($method === 'DELETE') {
    if ($user['role'] !== 'admin') jsonResponse(['success' => false, 'message' => 'Yetkiniz yok'], 403);
    $days = intval($_GET['days'] ?? 90);
    $stmt = $pdo->prepare("DELETE FROM activity_logs WHERE created_at < DATE_SUB(NOW(), INTERVAL ? DAY)");
    $stmt->execute([$days]);
    $deleted = $stmt->rowCount();
    jsonResponse(['success' => true, 'message' => "$deleted eski log silindi"]);
} else {
    jsonResponse(['success' => false, 'message' => 'Desteklenmeyen metod'], 405);
}
