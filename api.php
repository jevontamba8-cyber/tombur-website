<?php
/**
 * REST API PHP Bridge for Website Tombur (Parheheon HKBP Cibubur)
 * Connects HTML/JS frontend to MySQL Database
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// -----------------------------------------------------------------------------
// Database Configuration
// -----------------------------------------------------------------------------
$db_host = 'localhost';
$db_user = 'root';
$db_pass = ''; // Sesuaikan jika ada password MySQL
$db_name = 'db_tombur';

try {
    $pdo = new PDO("mysql:host=$db_host;dbname=$db_name;charset=utf8mb4", $db_user, $db_pass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Koneksi Database Gagal: ' . $e->getMessage()]);
    exit();
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

// -----------------------------------------------------------------------------
// Route Handlers
// -----------------------------------------------------------------------------
switch ($action) {

    // 1. GET ALL ORDERS (For Admin & Search)
    case 'get_orders':
        try {
            $stmt = $pdo->query("SELECT * FROM orders ORDER BY created_at DESC");
            $orders = $stmt->fetchAll();
            echo json_encode(['success' => true, 'data' => $orders]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // 2. GET CURRENT TICKET STOCK
    case 'get_stock':
        try {
            $stmt = $pdo->query("SELECT day_key, stock_remaining FROM ticket_stock");
            $rows = $stmt->fetchAll();
            $stock = [];
            foreach ($rows as $r) {
                $stock[$r['day_key']] = (int)$r['stock_remaining'];
            }
            echo json_encode(['success' => true, 'data' => $stock]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // 3. CREATE NEW ORDER (With Transaction & Stock Check)
    case 'create_order':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;

        $id          = $data['id'] ?? ('TRX-' . rand(100000, 999999));
        $name        = trim($data['name'] ?? '');
        $church      = trim($data['church'] ?? '');
        $day         = $data['day'] ?? 'day1';
        $category    = $data['category'] ?? 'tiket';
        $productName = $data['productName'] ?? 'Tiket Masuk Wristband';
        $unitPrice   = (float)($data['unitPrice'] ?? 10000);
        $qty         = (int)($data['qty'] ?? 1);
        $total       = $unitPrice * $qty;
        $payMethod   = $data['payMethod'] ?? 'qris';
        $status      = ($payMethod === 'qris') ? 'menunggu_verifikasi' : 'menunggu_pembayaran';
        $proofImage  = $data['proofImage'] ?? null;

        if (empty($name) || empty($church)) {
            echo json_encode(['success' => false, 'message' => 'Nama dan Asal Gereja wajib diisi.']);
            exit();
        }

        try {
            $pdo->beginTransaction();

            $dayKey = ($day === 'day1') ? 'tiket_day1' : 'tiket_day2';

            // Check & Lock Stock Row
            $stmtStock = $pdo->prepare("SELECT stock_remaining FROM ticket_stock WHERE day_key = ? FOR UPDATE");
            $stmtStock->execute([$dayKey]);
            $currentStock = (int)$stmtStock->fetchColumn();

            if ($currentStock < $qty) {
                $pdo->rollBack();
                echo json_encode(['success' => false, 'message' => "Kuota tiket tersisa $currentStock tiket. Pemesanan gagal!"]);
                exit();
            }

            // Deduct Stock
            $stmtDeduct = $pdo->prepare("UPDATE ticket_stock SET stock_remaining = stock_remaining - ? WHERE day_key = ?");
            $stmtDeduct->execute([$qty, $dayKey]);

            // Insert Order
            $sqlInsert = "INSERT INTO orders (id, name, church, day, category, product_name, unit_price, qty, total, pay_method, status, pickup_status, proof_image) 
                          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'belum_diambil', ?)";
            $stmtInsert = $pdo->prepare($sqlInsert);
            $stmtInsert->execute([$id, $name, $church, $day, $category, $productName, $unitPrice, $qty, $total, $payMethod, $status, $proofImage]);

            $pdo->commit();

            echo json_encode([
                'success' => true, 
                'message' => 'Pemesanan berhasil disimpan!',
                'data' => [
                    'id' => $id,
                    'name' => $name,
                    'church' => $church,
                    'day' => $day,
                    'total' => $total,
                    'status' => $status
                ]
            ]);

        } catch (Exception $e) {
            $pdo->rollBack();
            echo json_encode(['success' => false, 'message' => 'Gagal menyimpan pesanan: ' . $e->getMessage()]);
        }
        break;

    // 4. UPDATE ORDER STATUS (LUNAS / DITOLAK)
    case 'update_status':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $orderId = $data['id'] ?? '';
        $status  = $data['status'] ?? '';

        if (empty($orderId) || empty($status)) {
            echo json_encode(['success' => false, 'message' => 'Order ID dan Status wajib diisi.']);
            exit();
        }

        try {
            $stmt = $pdo->prepare("UPDATE orders SET status = ? WHERE id = ?");
            $stmt->execute([$status, $orderId]);
            echo json_encode(['success' => true, 'message' => "Status transaksi $orderId diubah ke " . strtoupper($status)]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // 5. TOGGLE PICKUP STATUS
    case 'toggle_pickup':
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: $_POST;
        $orderId = $data['id'] ?? '';

        try {
            $stmtGet = $pdo->prepare("SELECT pickup_status FROM orders WHERE id = ?");
            $stmtGet->execute([$orderId]);
            $curr = $stmtGet->fetchColumn();

            $next = ($curr === 'tiket_diambil') ? 'belum_diambil' : 'tiket_diambil';

            $stmtUpd = $pdo->prepare("UPDATE orders SET pickup_status = ? WHERE id = ?");
            $stmtUpd->execute([$next, $orderId]);

            echo json_encode(['success' => true, 'pickup_status' => $next]);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    // 6. RESET DATABASE (ADMIN)
    case 'reset_database':
        try {
            $pdo->exec("TRUNCATE TABLE orders");
            $pdo->exec("UPDATE ticket_stock SET stock_remaining = initial_stock");
            echo json_encode(['success' => true, 'message' => 'Database pesanan berhasil dikosongkan & kuota di-reset!']);
        } catch (Exception $e) {
            echo json_encode(['success' => false, 'message' => $e->getMessage()]);
        }
        break;

    default:
        echo json_encode(['success' => false, 'message' => 'Aksi API tidak valid.']);
        break;
}
