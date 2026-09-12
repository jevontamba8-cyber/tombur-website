-- ============================================================================
-- DATABASE SCHEMA MYSQL FOR WEBSITE TOMBUR (PARHEHEON HKBP CIBUBUR)
-- Project: SHINE TOMBUR Vol 2 - Ticket & Event Management System
-- Created: 2026
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `db_tombur` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `db_tombur`;

-- ----------------------------------------------------------------------------
-- 1. TABEL ADMIN USERS (Data Login Panitia Admin)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `admin_users`;
CREATE TABLE `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL, -- Disarankan hash (misal bcrypt / md5)
  `name` VARCHAR(100) NOT NULL DEFAULT 'Panitia Admin',
  `role` VARCHAR(50) NOT NULL DEFAULT 'admin',
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed Data Akun Admin Default (User: admin | Pass: admin123)
INSERT INTO `admin_users` (`username`, `password`, `name`, `role`) 
VALUES ('admin', 'admin123', 'Panitia Parheheon', 'superadmin');


-- ----------------------------------------------------------------------------
-- 2. TABEL STOK TIKET (Stok Kuota Per Hari Event)
-- Total Kuota Day 1: 200 Tiket (Terjual: 102 Tiket, Sisa: 98 Tiket)
-- Total Kuota Day 2: 100 Tiket (Terjual: 0 Tiket, Sisa: 100 Tiket)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `ticket_stock`;
CREATE TABLE `ticket_stock` (
  `day_key` VARCHAR(50) NOT NULL PRIMARY KEY,
  `day_name` VARCHAR(255) NOT NULL,
  `stock_remaining` INT NOT NULL DEFAULT 0,
  `initial_stock` INT NOT NULL DEFAULT 0,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `ticket_stock` (`day_key`, `day_name`, `stock_remaining`, `initial_stock`) VALUES
('tiket_day1', 'Sabtu, 12 September 2026 (Day One)', 98, 200),
('tiket_day2', 'Minggu, 13 September 2026 (Day Two)', 100, 100);


-- ----------------------------------------------------------------------------
-- 3. TABEL ORDERS (Data Transaksi Pemesanan Tiket)
-- ----------------------------------------------------------------------------
DROP TABLE IF EXISTS `orders`;
CREATE TABLE `orders` (
  `id` VARCHAR(50) NOT NULL PRIMARY KEY, -- Format TRX-XXXXXX
  `name` VARCHAR(255) NOT NULL, -- Nama Pemesan
  `church` VARCHAR(255) NOT NULL, -- Asal Gereja / Kontingen
  `day` VARCHAR(50) NOT NULL, -- 'day1' atau 'day2'
  `category` VARCHAR(50) NOT NULL DEFAULT 'tiket', -- Kategori produk
  `product_name` VARCHAR(255) NOT NULL DEFAULT 'Tiket Masuk Wristband',
  `unit_price` DECIMAL(12,2) NOT NULL DEFAULT 10000.00,
  `qty` INT NOT NULL DEFAULT 1,
  `total` DECIMAL(12,2) NOT NULL,
  `pay_method` ENUM('qris', 'cash') NOT NULL DEFAULT 'qris',
  `status` ENUM('menunggu_verifikasi', 'menunggu_pembayaran', 'lunas', 'ditolak') NOT NULL DEFAULT 'menunggu_verifikasi',
  `pickup_status` ENUM('belum_diambil', 'tiket_diambil') NOT NULL DEFAULT 'belum_diambil',
  `proof_image` LONGTEXT NULL, -- Foto Bukti Transfer QRIS (Base64 Data URI)
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_name` (`name`),
  INDEX `idx_day` (`day`),
  INDEX `idx_status` (`status`),
  INDEX `idx_pay_method` (`pay_method`),
  INDEX `idx_pickup_status` (`pickup_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- ----------------------------------------------------------------------------
-- SEED DATA TRANSAKSI TIKET DAY ONE (Total: 102 Tiket Terjual)
-- Cash: 24 Tiket | Transfer QRIS: 76 Tiket | Transfer Web: 2 Tiket
-- ----------------------------------------------------------------------------
INSERT INTO `orders` (`id`, `name`, `church`, `day`, `category`, `product_name`, `unit_price`, `qty`, `total`, `pay_method`, `status`, `pickup_status`) VALUES

-- --- A. PEMBAYARAN CASH DAY 1 (Total: 24 Tiket) ---
('TRX-CASH-D1-001', 'Pembeli Cash Tomang Barat', 'HKBP Tomang Barat', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 1, 10000.00, 'cash', 'lunas', 'belum_diambil'),
('TRX-CASH-D1-002', 'Pembeli Cash Rawamangun', 'HKBP Rawamangun', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 2, 20000.00, 'cash', 'lunas', 'belum_diambil'),
('TRX-CASH-D1-003', 'Pembeli Cash Harjamukti', 'HKBP Harjamukti', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 5, 50000.00, 'cash', 'lunas', 'belum_diambil'),
('TRX-CASH-D1-004', 'Pembeli Cash Cibinong', 'HKBP Cibinong', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 2, 20000.00, 'cash', 'lunas', 'belum_diambil'),
('TRX-CASH-D1-005', 'Pembeli Cash Jatisampurna', 'HKBP Jatisampurna', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 5, 50000.00, 'cash', 'lunas', 'belum_diambil'),
('TRX-CASH-D1-006', 'Pembeli Cash Kernolong', 'HKBP Kernolong', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 1, 10000.00, 'cash', 'lunas', 'belum_diambil'),
('TRX-CASH-D1-007', 'Pembeli Cash Cibubur', 'HKBP Cibubur', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 4, 40000.00, 'cash', 'lunas', 'belum_diambil'),
('TRX-CASH-D1-008', 'Pembeli Cash Jatimurni', 'HKBP Jatimurni', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 1, 10000.00, 'cash', 'lunas', 'belum_diambil'),
('TRX-CASH-D1-009', 'Pembeli Cash Tebet', 'HKBP Tebet', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 1, 10000.00, 'cash', 'lunas', 'belum_diambil'),
('TRX-CASH-D1-010', 'Pembeli Cash GPIB Agape', 'GPIB AGAPE', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 2, 20000.00, 'cash', 'lunas', 'belum_diambil'),

-- --- B. PEMBAYARAN TRANSFER / QRIS DAY 1 (Total: 76 Tiket) ---
('TRX-TF-D1-001', 'Pembeli TF Kernolong', 'HKBP Kernolong', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 15, 150000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-002', 'Pembeli TF Cibinong', 'HKBP Cibinong', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 3, 30000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-003', 'Pembeli TF Jatimurni', 'HKBP Jatimurni', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 4, 40000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-004', 'Pembeli TF Jatiwaringin', 'HKBP JATIWARINGIN', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 6, 60000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-005', 'Pembeli TF Rawamangun', 'HKBP Rawamangun', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 10, 100000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-006', 'Pembeli TF Pulo Mas', 'HKBP PULOMAS', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 16, 160000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-007', 'Pembeli TF GKP Yeruel', 'GKP YERUEL', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 5, 50000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-008', 'Pembeli TF Kebon Jeruk', 'HKBP Kebon Jeruk', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 6, 60000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-009', 'Pembeli TF Tomang Barat', 'HKBP Tomang Barat', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 2, 20000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-010', 'Pembeli TF Cibubur', 'HKBP Cibubur', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 3, 30000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-011', 'Pembeli TF Jatisampurna', 'HKBP Jatisampurna', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 3, 30000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-012', 'Pembeli TF Cipcil', 'Cipcil', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 1, 10000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-TF-D1-013', 'Pembeli TF GPIB Agape', 'GPIB AGAPE', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 2, 20000.00, 'qris', 'lunas', 'belum_diambil'),

-- --- C. PEMBAYARAN TF WEB DAY 1 (Total: 2 Tiket) ---
('TRX-WEB-D1-001', 'Pembeli Web Cibubur', 'HKBP Cibubur', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 1, 10000.00, 'qris', 'lunas', 'belum_diambil'),
('TRX-WEB-D1-002', 'Pembeli Web Anonim', 'Umum / Anonim', 'day1', 'tiket', 'Tiket Masuk Wristband', 10000.00, 1, 10000.00, 'qris', 'lunas', 'belum_diambil');


-- ----------------------------------------------------------------------------
-- 4. VIEW REKAPITULASI KEUANGAN (Views SQL untuk Dashboard & Laporan)
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS `view_laporan_keuangan`;
CREATE VIEW `view_laporan_keuangan` AS
SELECT 
    COUNT(*) AS total_transaksi,
    SUM(CASE WHEN `status` = 'lunas' THEN `total` ELSE 0 END) AS total_uang_masuk,
    SUM(CASE WHEN `status` = 'lunas' AND `pay_method` = 'qris' THEN `total` ELSE 0 END) AS total_qris_lunas,
    SUM(CASE WHEN `status` = 'lunas' AND `pay_method` = 'cash' THEN `total` ELSE 0 END) AS total_cash_lunas,
    SUM(CASE WHEN `status` IN ('menunggu_verifikasi', 'menunggu_pembayaran') THEN `total` ELSE 0 END) AS total_pending,
    SUM(CASE WHEN `status` = 'lunas' THEN `qty` ELSE 0 END) AS total_tiket_terjual
FROM `orders`;

-- VIEW Rekap Per Hari Event
DROP VIEW IF EXISTS `view_rekap_per_hari`;
CREATE VIEW `view_rekap_per_hari` AS
SELECT 
    `day`,
    COUNT(*) AS total_order,
    SUM(CASE WHEN `status` = 'lunas' THEN `qty` ELSE 0 END) AS tiket_terjual,
    SUM(CASE WHEN `status` = 'lunas' THEN `total` ELSE 0 END) AS pendapatan_lunas,
    SUM(CASE WHEN `status` IN ('menunggu_verifikasi', 'menunggu_pembayaran') THEN 1 ELSE 0 END) AS order_pending
FROM `orders`
GROUP BY `day`;
