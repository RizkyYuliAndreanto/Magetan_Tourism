-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 27, 2025 at 03:35 PM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `magetan_tourism`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int NOT NULL,
  `adminId` int NOT NULL,
  `action` varchar(50) NOT NULL,
  `entity` varchar(255) NOT NULL COMMENT 'Nama entitas yang diakses (berita, destinasi, event, dll)',
  `entityId` int DEFAULT NULL COMMENT 'ID dari entitas yang diakses',
  `entityName` varchar(255) DEFAULT NULL COMMENT 'Nama/judul dari entitas yang diakses',
  `oldData` json DEFAULT NULL COMMENT 'Data lama sebelum diubah (untuk update)',
  `newData` json DEFAULT NULL COMMENT 'Data baru setelah diubah (untuk create/update)',
  `ipAddress` varchar(255) DEFAULT NULL,
  `userAgent` text,
  `description` text COMMENT 'Deskripsi aktivitas yang dilakukan',
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `adminId`, `action`, `entity`, `entityId`, `entityName`, `oldData`, `newData`, `ipAddress`, `userAgent`, `description`, `createdAt`, `updatedAt`) VALUES
(1, 1, 'login', 'system', NULL, 'Super Administrator', NULL, NULL, '::1', 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36', 'Super Administrator login ke sistem', '2025-10-26 22:16:39', '2025-10-26 22:16:39'),
(2, 2, 'login', 'system', NULL, 'Administrator Biasa', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36 Edg/141.0.0.0', 'Administrator Biasa login ke sistem', '2025-10-26 22:17:12', '2025-10-26 22:17:12'),
(3, 2, 'login', 'system', NULL, 'Administrator Biasa', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'Administrator Biasa login ke sistem', '2025-10-28 00:32:16', '2025-10-28 00:32:16'),
(4, 2, 'create', 'berita', NULL, NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'Administrator Biasa menambahkan berita baru', '2025-10-28 00:33:03', '2025-10-28 00:33:03'),
(5, 2, 'login', 'system', NULL, 'Administrator Biasa', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', 'Administrator Biasa login ke sistem', '2025-10-28 12:12:51', '2025-10-28 12:12:51'),
(6, 1, 'login', 'system', NULL, 'Super Administrator', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator login ke sistem', '2025-12-22 04:58:44', '2025-12-22 04:58:44'),
(7, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-22 05:01:43', '2025-12-22 05:01:43'),
(8, 1, 'delete', 'berita', 1, 'sdfgds', '{\"judul\": \"sdfgds\", \"id_admin\": 2, \"createdAt\": \"2025-10-28T00:33:03.000Z\", \"id_berita\": 1, \"updatedAt\": \"2025-10-28T00:33:03.000Z\", \"isi_berita\": \"wseferwf\", \"id_kategori\": 1, \"jumlah_share\": 0, \"jumlah_dilihat\": 0, \"tanggal_publikasi\": \"2025-10-27T17:32:00.000Z\", \"gambar_hero_berita\": \"/uploads/berita/gambar-hero/gambar_hero_berita-1761611583885.jpg\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator menghapus berita \"sdfgds\"', '2025-12-22 06:52:33', '2025-12-22 06:52:33'),
(9, 1, 'create', 'berita', NULL, NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator menambahkan berita baru', '2025-12-22 06:56:40', '2025-12-22 06:56:40'),
(10, 1, 'create', 'berita', NULL, NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator menambahkan berita baru', '2025-12-22 06:58:33', '2025-12-22 06:58:33'),
(11, 1, 'create', 'berita', NULL, NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator menambahkan berita baru', '2025-12-22 07:00:56', '2025-12-22 07:00:56'),
(12, 1, 'login', 'system', NULL, 'Super Administrator', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator login ke sistem', '2025-12-23 02:37:42', '2025-12-23 02:37:42'),
(13, 1, 'create', 'event', NULL, NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator menambahkan event baru', '2025-12-23 02:42:16', '2025-12-23 02:42:16'),
(14, 1, 'create', 'berita', NULL, NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator menambahkan berita baru', '2025-12-23 02:45:12', '2025-12-23 02:45:12'),
(15, 1, 'create', 'destinasi', NULL, NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator menambahkan destinasi wisata baru', '2025-12-23 03:21:48', '2025-12-23 03:21:48'),
(16, 1, 'create', 'event', NULL, NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator menambahkan event baru', '2025-12-23 03:28:33', '2025-12-23 03:28:33'),
(17, 1, 'update', 'event', 2, 'RELAUNCHING PASAR AHAD TRADISIONAL DEWI SRI', '{\"id_admin\": 1, \"id_event\": 2, \"createdAt\": \"2025-12-23T02:42:16.000Z\", \"updatedAt\": \"2025-12-23T02:42:16.000Z\", \"nama_event\": \"RELAUNCHING PASAR AHAD TRADISIONAL DEWI SRI\", \"brosur_event\": null, \"gambar_event\": \"/uploads/event/gambar-event/gambar_event-1766457736066.png\", \"jumlah_share\": 0, \"lokasi_event\": \"Petirtaan Dewi Sri, Desa Simbatan, Nguntoronadi, Magetan\", \"tanggal_mulai\": \"2025-12-14\", \"jumlah_dilihat\": 0, \"deskripsi_event\": \"*HALO WARGA MAGETAN & SEKITARNYA!* 🎉\\r\\nYuk merapat dan ramaikan bareng-bareng acara *RELAUNCHING PASAR AHAD TRADISIONAL DEWI SRI* oleh tim PM BEM Berdampak Universitas PGRI Madiun\\r\\n\\r\\n📅 Minggu, 14 Desember 2025 ⏰ Mulai jam 06.00 WIB 📍 Petirtaan Dewi Sri, Desa Simbatan, Nguntoronadi, Magetan\\r\\n\\r\\nDimeriahkan oleh: SENI REOG Desa Simbatan dan Senam Fun Aerobic PAKDESRI\\r\\n\\r\\n*ACARA INI GRATIS & TERBUKA UNTUK UMUM!* Ajak keluarga, teman, tetangga, gebetan, semuanya boleh! Semakin rame semakin seru!\\r\\n\\r\\nYuk kita hidupkan lagi Pasar Ahad Tradisional Dewi Sri bareng-bareng!\", \"tanggal_selesai\": \"2025-12-14\", \"koordinat_lokasi\": \"-7.691845, 111.446634\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator mengupdate/edit event \"RELAUNCHING PASAR AHAD TRADISIONAL DEWI SRI\"', '2025-12-23 03:32:35', '2025-12-23 03:32:35'),
(18, 1, 'update', 'event', 3, 'Festival Plaza Ndoyo', '{\"id_admin\": 1, \"id_event\": 3, \"createdAt\": \"2025-12-23T03:28:33.000Z\", \"updatedAt\": \"2025-12-23T03:28:33.000Z\", \"nama_event\": \"Festival Plaza Ndoyo\", \"brosur_event\": null, \"gambar_event\": \"/uploads/event/gambar-event/gambar_event-1766460513358.png\", \"jumlah_share\": 0, \"lokasi_event\": \"Plaza Ndoyo, Selosari, Magetan\", \"tanggal_mulai\": \"2025-12-11\", \"jumlah_dilihat\": 0, \"deskripsi_event\": \"Catat & Saksikan Keseruannya\\r\\nDi Festival Plaza Ndoyo Magetan,\\r\\nLaunching Calendar Of Events (COE) 2026 Kabupaten Magetan\\r\\n\\r\\nSiap-siap untuk tiga hari penuh keseruan, budaya, musik, dan hiburan spektakuler!\\r\\nAjak keluarga, teman, dan orang tersayang untuk menikmati malam penuh warna di Plaza Ndoyo!\\r\\n\\r\\nTanggal : 11 – 13 Desember\\r\\nLokasi : Plaza Ndoyo, Selosari, Magetan\\r\\nMulai pukul : 19.00 WIB\\r\\n\\r\\nSpecial Performance :\\r\\nRomanz.pitu – Band Etnik Milenial dengan energi yang memukau &\\r\\nRina Aditama – Meriahkan suasana dengan suara khasnya\\r\\n\\r\\nNikmati pertunjukan budaya, stand UMKM, kuliner khas, dan berbagai kegiatan seru lainnya!\\r\\nJangan lewatkan ragam acara menarik setiap harinya!\", \"tanggal_selesai\": \"2025-12-13\", \"koordinat_lokasi\": \"-7.651936, 111.315287\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator mengupdate/edit event \"Festival Plaza Ndoyo\"', '2025-12-23 03:33:22', '2025-12-23 03:33:22'),
(19, 1, 'update', 'event', 1, 'Tawang Anom Ekraf Festival', '{\"id_admin\": 2, \"id_event\": 1, \"createdAt\": \"2025-10-26T14:30:34.000Z\", \"updatedAt\": \"2025-10-26T14:31:35.000Z\", \"nama_event\": \"Tawang Anom Ekraf Festival\", \"brosur_event\": null, \"gambar_event\": \"/uploads/event/gambar-event/gambar_event-1761489034853.png\", \"jumlah_share\": 0, \"lokasi_event\": \"Lapangan Kelurahan Tawang Anom\", \"tanggal_mulai\": \"2025-10-23\", \"jumlah_dilihat\": 0, \"deskripsi_event\": \"TAWANGANOM EKRAF FESTIVAL-2 dengan tema “Merajut Kreativitas Mengukir Identitas” merupakan hasil kolaborasi antara Pemerintah Kelurahan Tawanganom dan Karang Taruna Tawanganom Bersatu. Kegiatan ini bertujuan untuk meningkatkan perekonomian masyarakat sekaligus mempromosikan produk kreatif pelaku usaha lokal, khususnya di bidang batik dan UMKM se-Kabupaten Magetan. Dalam sambutannya, Ibu Bupati Magetan berharap kegiatan ini dapat mendorong pertumbuhan ekonomi kerakyatan dan semakin meriah pada penyelenggaraan tahun berikutnya.\", \"tanggal_selesai\": \"2025-10-25\", \"koordinat_lokasi\": \"-7.647637, 111.316375\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator mengupdate/edit event \"Tawang Anom Ekraf Festival\"', '2025-12-23 03:34:48', '2025-12-23 03:34:48'),
(20, 1, 'create', 'event', NULL, NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator menambahkan event baru', '2025-12-23 03:40:14', '2025-12-23 03:40:14'),
(21, 1, 'update', 'event', 4, 'Launching Wisata Sgodean', '{\"id_admin\": 1, \"id_event\": 4, \"createdAt\": \"2025-12-23T03:40:14.000Z\", \"updatedAt\": \"2025-12-23T03:40:14.000Z\", \"nama_event\": \"Launching Wisata Sgodean\", \"brosur_event\": null, \"gambar_event\": \"/uploads/event/gambar-event/gambar_event-1766461214033.png\", \"jumlah_share\": 0, \"lokasi_event\": \"Desa Ngiliran, Kecamatan Panekan, Kabupaten Magetan.\", \"tanggal_mulai\": \"2025-12-01\", \"jumlah_dilihat\": 0, \"deskripsi_event\": \"Wisata Sgodean resmi hadir sebagai destinasi alam baru di lereng Gunung Lawu, tepatnya di Desa Ngiliran, Kecamatan Panekan, Kabupaten Magetan. Pengunjung dapat menikmati suasana yang sejuk, asri, dan natural, cocok untuk relaksasi maupun wisata keluarga.\\r\\nRangkaian acara launching di meriahkan dengan Lomba Hias Tumpeng, menghadirkan kreativitas dan kebersamaan masyarakat Desa Ngiliran.\\r\\nKe depan, Wisata Sgodean akan berkolaborasi dengan Dinas Kebudayaan dan Pariwisata Kabupaten Magetan dalam pengembangan potensi wisata serta peningkatan kualitas layanan bagi masyarakat.\\r\\n\\r\\nHTM GRATIS 1–9 Desember 2025\\r\\nManfaatkan kesempatan berkunjung tanpa biaya selama masa pembukaan!\\r\\n\\r\\n☕ Highlight Wisata\\r\\nNikmati kehangatan Kopi Arabika Gayo Ngiliran, racikan khas yang menjadi unggulan desa.\\r\\n\\r\\nAyo datang dan rasakan sendiri pesona alam Sgodean!\", \"tanggal_selesai\": \"2025-12-09\", \"koordinat_lokasi\": \"-7.603602, 111.270424\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator mengupdate/edit event \"Launching Wisata Sgodean\"', '2025-12-23 03:40:51', '2025-12-23 03:40:51'),
(22, 1, 'update', 'event', 4, 'Launching Wisata Sgodean', '{\"id_admin\": 1, \"id_event\": 4, \"createdAt\": \"2025-12-23T03:40:14.000Z\", \"updatedAt\": \"2025-12-23T03:40:51.000Z\", \"nama_event\": \"Launching Wisata Sgodean\", \"brosur_event\": null, \"gambar_event\": \"/uploads/event/gambar-event/gambar_event-1766461214033.png\", \"jumlah_share\": 0, \"lokasi_event\": \"Desa Ngiliran, Kecamatan Panekan, Kabupaten Magetan.\", \"tanggal_mulai\": \"2025-12-01\", \"jumlah_dilihat\": 0, \"deskripsi_event\": \"Wisata Sgodean resmi hadir sebagai destinasi alam baru di lereng Gunung Lawu, tepatnya di Desa Ngiliran, Kecamatan Panekan, Kabupaten Magetan. Pengunjung dapat menikmati suasana yang sejuk, asri, dan natural, cocok untuk relaksasi maupun wisata keluarga.\\r\\nRangkaian acara launching di meriahkan dengan Lomba Hias Tumpeng, menghadirkan kreativitas dan kebersamaan masyarakat Desa Ngiliran.\\r\\nKe depan, Wisata Sgodean akan berkolaborasi dengan Dinas Kebudayaan dan Pariwisata Kabupaten Magetan dalam pengembangan potensi wisata serta peningkatan kualitas layanan bagi masyarakat.\\r\\n\\r\\nHTM GRATIS 1–9 Desember 2025\\r\\nManfaatkan kesempatan berkunjung tanpa biaya selama masa pembukaan!\\r\\n\\r\\n☕ Highlight Wisata\\r\\nNikmati kehangatan Kopi Arabika Gayo Ngiliran, racikan khas yang menjadi unggulan desa.\\r\\n\\r\\nAyo datang dan rasakan sendiri pesona alam Sgodean!\", \"tanggal_selesai\": \"2025-12-09\", \"koordinat_lokasi\": \"-7.603602, 111.270424\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator mengupdate/edit event \"Launching Wisata Sgodean\"', '2025-12-23 03:41:16', '2025-12-23 03:41:16'),
(23, 1, 'update', 'event', 4, 'Launching Wisata Sgodean', '{\"id_admin\": 1, \"id_event\": 4, \"createdAt\": \"2025-12-23T03:40:14.000Z\", \"updatedAt\": \"2025-12-23T03:41:16.000Z\", \"nama_event\": \"Launching Wisata Sgodean\", \"brosur_event\": null, \"gambar_event\": \"/uploads/event/gambar-event/gambar_event-1766461214033.png\", \"jumlah_share\": 0, \"lokasi_event\": \"Desa Ngiliran, Kecamatan Panekan, Kabupaten Magetan.\", \"tanggal_mulai\": \"2025-12-01\", \"jumlah_dilihat\": 0, \"deskripsi_event\": \"Wisata Sgodean resmi hadir sebagai destinasi alam baru di lereng Gunung Lawu, tepatnya di Desa Ngiliran, Kecamatan Panekan, Kabupaten Magetan. Pengunjung dapat menikmati suasana yang sejuk, asri, dan natural, cocok untuk relaksasi maupun wisata keluarga.\\r\\nRangkaian acara launching di meriahkan dengan Lomba Hias Tumpeng, menghadirkan kreativitas dan kebersamaan masyarakat Desa Ngiliran.\\r\\nKe depan, Wisata Sgodean akan berkolaborasi dengan Dinas Kebudayaan dan Pariwisata Kabupaten Magetan dalam pengembangan potensi wisata serta peningkatan kualitas layanan bagi masyarakat.\\r\\n\\r\\nHTM GRATIS 1–9 Desember 2025\\r\\nManfaatkan kesempatan berkunjung tanpa biaya selama masa pembukaan!\\r\\n\\r\\n☕ Highlight Wisata\\r\\nNikmati kehangatan Kopi Arabika Gayo Ngiliran, racikan khas yang menjadi unggulan desa.\\r\\n\\r\\nAyo datang dan rasakan sendiri pesona alam Sgodean!\", \"tanggal_selesai\": \"2025-12-09\", \"koordinat_lokasi\": \"-7.603602, 111.270424\"}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator mengupdate/edit event \"Launching Wisata Sgodean\"', '2025-12-23 03:41:46', '2025-12-23 03:41:46'),
(24, 1, 'update', 'destinasi', 1, 'Telaga Sarangan', '{\"alamat\": \"Ngluweng, Sarangan, Plaosan, Magetan, Jawa Timur\", \"id_admin\": 2, \"createdAt\": \"2025-10-05T12:53:18.000Z\", \"updatedAt\": \"2025-10-05T12:53:18.000Z\", \"harga_tiket\": \"20000.00\", \"gambar_utama\": \"/uploads/destinasi/gambar-utama/gambar_utama-1759668798184.jpg\", \"id_destinasi\": 1, \"jumlah_share\": 0, \"jumlah_dilihat\": 0, \"nama_destinasi\": \"Telaga Sarangan\", \"jam_operasional\": \"07.00-22.00\", \"koordinat_lokasi\": \"-7.677995, 111.219234\", \"deskripsi_destinasi\": \"Telaga alami yang berada di Kabupaten Magetan. Telaga ini juga menjadi ikon wisata di Magetan.\", \"id_kategori_destinasi\": 1}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator mengupdate/edit destinasi wisata \"Telaga Sarangan\"', '2025-12-23 03:43:45', '2025-12-23 03:43:45'),
(25, 2, 'login', 'system', NULL, 'Administrator Biasa', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Administrator Biasa login ke sistem', '2025-12-23 06:15:28', '2025-12-23 06:15:28'),
(26, 1, 'login', 'system', NULL, 'Super Administrator', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator login ke sistem', '2025-12-23 06:38:56', '2025-12-23 06:38:56'),
(27, 1, 'login', 'system', NULL, 'Super Administrator', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Super Administrator login ke sistem', '2025-12-23 12:05:04', '2025-12-23 12:05:04'),
(28, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-23 14:32:37', '2025-12-23 14:32:37'),
(29, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-23 14:32:49', '2025-12-23 14:32:49'),
(30, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-23 14:32:54', '2025-12-23 14:32:54'),
(31, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-23 14:32:59', '2025-12-23 14:32:59'),
(32, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-23 14:33:04', '2025-12-23 14:33:04'),
(33, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-23 14:33:06', '2025-12-23 14:33:06'),
(34, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-23 14:33:07', '2025-12-23 14:33:07'),
(35, 2, 'login', 'system', NULL, 'Administrator Biasa', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Administrator Biasa login ke sistem', '2025-12-23 14:33:30', '2025-12-23 14:33:30'),
(36, 2, 'login', 'system', NULL, 'Administrator Biasa', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'Administrator Biasa login ke sistem', '2025-12-23 14:43:39', '2025-12-23 14:43:39'),
(37, 1, 'login', 'system', NULL, 'Super Administrator', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator login ke sistem', '2025-12-24 00:15:50', '2025-12-24 00:15:50'),
(38, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-24 00:16:27', '2025-12-24 00:16:27'),
(39, 1, 'update', 'destinasi', 1, 'Telaga Sarangan', '{\"alamat\": \"Ngluweng, Sarangan, Plaosan, Magetan, Jawa Timur\", \"id_admin\": 2, \"createdAt\": \"2025-10-05T12:53:18.000Z\", \"updatedAt\": \"2025-12-23T03:43:45.000Z\", \"harga_tiket\": \"20000.00\", \"gambar_utama\": \"/uploads/destinasi/gambar-utama/gambar_utama-1759668798184.jpg\", \"id_destinasi\": 1, \"jumlah_share\": 0, \"jumlah_dilihat\": 0, \"nama_destinasi\": \"Telaga Sarangan\", \"jam_operasional\": \"07.00-22.00\", \"koordinat_lokasi\": \"-7.677995, 111.219234\", \"deskripsi_destinasi\": \"Telaga Sarangan, yang juga dikenal sebagai Telaga Pasir, adalah ikon wisata legendaris di Kabupaten Magetan yang terletak di ketinggian 1.200 meter di atas permukaan laut, tepat di lereng Gunung Lawu. Danau alami seluas sekitar 30 hektare ini menawarkan panorama yang memukau dengan air yang tenang dan jernih, dikelilingi oleh perbukitan hijau serta udara pegunungan yang sangat sejuk dengan suhu berkisar antara 15 hingga 20 derajat Celsius. Salah satu daya tarik utamanya adalah aktivitas seru seperti berkeliling telaga menggunakan speedboat berkecepatan tinggi atau menunggang kuda menyusuri jalanan setapak yang mengitari danau. Selain keindahan alamnya, Telaga Sarangan juga kental dengan legenda lokal tentang Kyai dan Nyai Pasir yang dipercaya masyarakat sebagai asal-usul terbentuknya telaga ini.\\r\\n\\r\\nKawasan wisata ini sangat lengkap dalam hal fasilitas dan pengalaman kuliner, menjadikannya destinasi favorit untuk liburan keluarga. Pengunjung tidak boleh melewatkan kelezatan sate kelinci dan nasi pecel khas Magetan yang banyak dijajakan di pinggiran telaga sambil menikmati kabut tipis yang sering turun di pagi hari. Fasilitas di sekitar telaga sudah sangat mapan, mulai dari puluhan hotel, vila, hingga pasar wisata yang menjual berbagai suvenir khas dan sayuran segar hasil perkebunanan penduduk setempat. Lokasinya pun sangat dekat dengan Lawu Green Forest, sehingga wisatawan dapat dengan mudah mengunjungi kedua tempat ini dalam satu rangkaian perjalanan untuk mendapatkan paket lengkap wisata alam dan wahana rekreasi modern.\", \"id_kategori_destinasi\": 1}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator mengupdate/edit destinasi wisata \"Telaga Sarangan\"', '2025-12-24 01:24:49', '2025-12-24 01:24:49'),
(40, 1, 'delete', 'destinasi', 4, 'Lawu Green Forest', '{\"alamat\": \"Jl. Sarangan-Cemorosewu Km, Kali Jumok, Sarangan, Kec. Plaosan, Kabupaten Magetan, Jawa Timur 63361\", \"id_admin\": 1, \"createdAt\": \"2025-12-23T03:21:48.000Z\", \"updatedAt\": \"2025-12-23T03:21:48.000Z\", \"harga_tiket\": \"20.00\", \"gambar_utama\": \"/uploads/destinasi/gambar-utama/gambar_utama-1766460108721.jpg\", \"id_destinasi\": 4, \"jumlah_share\": 0, \"jumlah_dilihat\": 0, \"nama_destinasi\": \"Lawu Green Forest\", \"jam_operasional\": \"08.00 - 17.00\", \"koordinat_lokasi\": \"-7.664525, 111.210638\", \"deskripsi_destinasi\": \"Lawu Green Forest (LGF) merupakan destinasi wisata alam unggulan yang terletak di kawasan lereng Gunung Lawu, tepatnya di jalur wisata strategis Sarangan-Cemorosewu, Magetan. Tempat ini menawarkan pesona hutan pinus yang asri dengan udara pegunungan yang sangat sejuk, menjadikannya pelarian sempurna bagi pengunjung yang ingin mencari ketenangan dari hiruk-pikuk perkotaan. Keunggulan utama LGF terletak pada perpaduan harmonis antara keindahan lanskap hijau dengan berbagai wahana modern yang instagenic, mulai dari perosotan pelangi (rainbow slide) yang ikonik, taman salju, hingga area miniatur dunia yang berisi replika bangunan ikonik dari berbagai negara.\\r\\n\\r\\nSelain sebagai tempat rekreasi keluarga, Lawu Green Forest juga menyediakan fasilitas petualangan dan akomodasi yang lengkap. Pengunjung dapat memacu adrenalin dengan menyewa ATV, berkuda, atau mengikuti kegiatan outbound di area terbuka yang luas. Bagi mereka yang ingin merasakan pengalaman bermalam di tengah hutan, tersedia pilihan glamping (camping mewah) dan area perkemahan konvensional yang nyaman. Dengan fasilitas pendukung seperti restoran bertema alam, mushola, dan area parkir yang memadai, Lawu Green Forest menjadi destinasi multifungsi yang sangat ideal untuk sekadar berfoto, bersantai, maupun melakukan kegiatan edukasi di alam terbuka.\", \"id_kategori_destinasi\": 4}', NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator menghapus destinasi wisata \"Lawu Green Forest\"', '2025-12-24 01:24:56', '2025-12-24 01:24:56'),
(41, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-24 01:25:03', '2025-12-24 01:25:03'),
(42, 2, 'login', 'system', NULL, 'Administrator Biasa', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Administrator Biasa login ke sistem', '2025-12-24 01:31:48', '2025-12-24 01:31:48'),
(43, 1, 'login', 'system', NULL, 'Super Administrator', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator login ke sistem', '2025-12-24 01:34:37', '2025-12-24 01:34:37'),
(44, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-24 01:34:39', '2025-12-24 01:34:39'),
(45, 1, 'create_admin', 'Admin', NULL, 'Zainal', NULL, NULL, NULL, NULL, 'Super admin superadmin created new superadmin account: ZainalRizky', '2025-12-24 01:36:09', '2025-12-24 01:36:09'),
(46, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-24 01:36:09', '2025-12-24 01:36:09'),
(47, 1, 'update_user', 'Admin', NULL, 'Zainal', NULL, NULL, NULL, NULL, 'Super admin superadmin updated user ZainalRizky (nama_lengkap, level_akses)', '2025-12-24 01:36:22', '2025-12-24 01:36:22'),
(48, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-24 01:36:22', '2025-12-24 01:36:22'),
(49, 4, 'login', 'system', NULL, 'Zainal', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Zainal login ke sistem', '2025-12-24 01:36:53', '2025-12-24 01:36:53'),
(50, 4, 'create', 'berita', NULL, NULL, NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Zainal menambahkan berita baru', '2025-12-24 01:37:44', '2025-12-24 01:37:44'),
(51, 1, 'login', 'system', NULL, 'Super Administrator', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator login ke sistem', '2025-12-24 03:55:24', '2025-12-24 03:55:24'),
(52, 1, 'view_users', 'Admin', NULL, 'Users Management', NULL, NULL, NULL, NULL, 'Super admin superadmin viewed users list', '2025-12-24 03:57:00', '2025-12-24 03:57:00'),
(53, 1, 'login', 'system', NULL, 'Super Administrator', NULL, NULL, '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36 Edg/143.0.0.0', 'Super Administrator login ke sistem', '2025-12-24 04:02:31', '2025-12-24 04:02:31');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id_admin` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `level_akses` enum('superadmin','admin','user') NOT NULL DEFAULT 'user',
  `resetPasswordToken` varchar(255) DEFAULT NULL,
  `resetPasswordExpires` datetime DEFAULT NULL,
  `is_blocked` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id_admin`, `username`, `password`, `nama_lengkap`, `email`, `level_akses`, `resetPasswordToken`, `resetPasswordExpires`, `is_blocked`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', '$2b$10$JCL6FD7MNpD.OpRg/MtiMO7tT7ALu2vGedB7nnIdiKl3SRYRh6W3i', 'Super Administrator', 'superadmin@example.com', 'superadmin', NULL, NULL, 0, '2025-10-01 06:03:09', '2025-10-01 06:03:09'),
(2, 'admin', '$2b$10$5QFM9/JeCcGyHEFj1pqAsex/X6SCGTbzhEkWO7xFf8vI2gkzoXnQy', 'Administrator Biasa', 'admin@example.com', 'admin', NULL, NULL, 0, '2025-10-01 06:03:10', '2025-10-01 06:03:10'),
(3, 'userbiasa', '$2b$10$GnzUjS1TqeWXkmxSpH2AhukSWvkxgMybmBGkiEvIOrgYBDvqyDdW2', 'Pengguna Umum', 'user@example.com', 'user', NULL, NULL, 0, '2025-10-01 06:03:10', '2025-10-01 06:03:10'),
(4, 'ZainalRizky', '$2b$10$DOAyZGsURptyIEB8h6nwu.c/39bcP5Yx0Xswvau32cGs5//9hh.Fa', 'Zainal', 'zainal@example.com', 'admin', NULL, NULL, 0, '2025-12-24 01:36:09', '2025-12-24 01:36:22');

-- --------------------------------------------------------

--
-- Table structure for table `akomodasis`
--

CREATE TABLE `akomodasis` (
  `id_akomodasi` int NOT NULL,
  `nama_hotel` varchar(255) NOT NULL,
  `deskripsi_hotel` text NOT NULL,
  `alamat_hotel` text NOT NULL,
  `koordinat_lokasi` varchar(255) DEFAULT NULL,
  `fasilitas` text,
  `gambar_utama_hotel` varchar(255) DEFAULT NULL,
  `kontak_hotel` varchar(255) DEFAULT NULL,
  `website_hotel` varchar(255) DEFAULT NULL,
  `rating_hotel` decimal(2,1) DEFAULT NULL,
  `jumlah_dilihat` int DEFAULT '0',
  `jumlah_share` int DEFAULT '0',
  `id_admin` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `beritas`
--

CREATE TABLE `beritas` (
  `id_berita` int NOT NULL,
  `judul` varchar(255) NOT NULL,
  `isi_berita` text NOT NULL,
  `tanggal_publikasi` datetime NOT NULL,
  `gambar_hero_berita` varchar(255) DEFAULT NULL,
  `jumlah_dilihat` int DEFAULT '0',
  `jumlah_share` int DEFAULT '0',
  `id_kategori` int NOT NULL,
  `id_admin` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `beritas`
--

INSERT INTO `beritas` (`id_berita`, `judul`, `isi_berita`, `tanggal_publikasi`, `gambar_hero_berita`, `jumlah_dilihat`, `jumlah_share`, `id_kategori`, `id_admin`, `created_at`, `updated_at`) VALUES
(2, '“Citradiwirya Humangsah” Tampilkan Kisah Heroik dalam Balutan Seni Budaya dan Produk Unggulan Magetan di TMII Jakarta', 'Gelar Seni Budaya, Tari, Lagu Daerah, dan Sendratari Magetan kembali hadir meriah di Taman Mini Indonesia Indah (TMII), Jakarta (27/04), menampilkan sendratari “Citradiwirya Humangsah” yang mengangkat kisah kesetiaan Ki Ngabehi Citrodiwiryo kepada Sunan Pakubuwono II—sebuah sejarah heroik dari Babad Tanah Jawi.\r\n\r\nSebuah peristiwa sejarah yang terdapat dalam karya sastra berjudul Babad Tanah Jawi, The Cronicle of Java: the revised prose version karya Sr. C. F. Winter terjemahan Willem Remmelink. Tepatnya pada tahun 1739 M, Ki Ngabehi Citrodiwiryo dilantik Pakubuwono II menjadi bupati Magetan. Pelantikan ini menjadi momentum sumpah kesetiaan Citrodiwiryo terhadap Kesultanan Mataram di bawah Sunan Pakubuwono II. Hal tersebut dibuktikan ketika tahun 1742 M, terjadi peristiwa perang antara Pakubuwono II dengan Raden Mas Garendi, yang menyebabkan Pakubuwono II pergi dari istana Kartasura menuju Ponorogo. Mendengar peristiwa tersebut, Citrodiwiryo segera bergegas pergi ke desa Kadaren/Kediren (sebuah desa di Magetan) menjemput Pakubuwono II dan para pengikut untuk tinggal di kediamannya.\r\n\r\nKetika Pakubuwono II di Magetan, Citrodiwiryo mendapatkan tugas untuk mempersiapkan pasukan dan mempertahankan Magetan agar tidak jatuh ke tangan musuh. Citrodiwiryo menyanggupi tugas ini dan berhasil mempertahankan Magetan dari serangan pasukan sekutu. Akan tetapi, karena pengkhianatan juru tulisnya bernama Raden Sumaningrat sekaligus Keponakannya sendiri, Citradiwirya dituduh gagal mempertahankan dan menyerahkan Magetan sehingga menyebabkan Citradiwirya dipecat. Akan tetapi, karena kesetiaannya kepada Pakubuwono II, Diakhir hayatnya Citrodiwiryo tetap ikut berperang meskipun sebagai pasukan biasa dan akhirnya para sekutu Pakubuwana II berhasil memenangkan peperangan merebut Mataram.\r\n\r\nSelain pertunjukan seni, acara ini turut menampilkan potensi daerah seperti pariwisata, produk unggulan UMKM, hingga peluang investasi, menjadikan Magetan tak hanya tampil memukau lewat seni, tapi juga lewat kekuatan ekonomi dan budaya lokalnya.\r\n\r\nBagi yang ketinggalan, bisa lihat serunya tampilan budaya Kabupaten Magetan di TMII Jakarta melalui Official Youtube Anjungan Jawa Timur .', '2025-12-21 23:55:00', '/uploads/berita/gambar-hero/gambar_hero_berita-1766386600018.jpg', 0, 0, 1, 1, '2025-12-22 06:56:40', '2025-12-22 06:56:40'),
(3, 'Rekomendasi Destinasi Wisata Magetan Saat Mudik Lebaran 2025', 'Mau liburan seru bareng keluarga? Ini dia rekomendasi wisata di Magetan yang wajib kamu kunjungi\r\n\r\n📍 Dari arah Timur:\r\n🐾 Magetan Park – @minizoo_magetanpark\r\n💦 Kolam Renang Banyu Biru – @banyubiru.wisatamagetan\r\n🌳 Tamris Park – @tamris.park\r\n\r\n📍 Dari arah Barat:\r\n⛰ Telaga Sarangan – @saranganofficial\r\n🌊 Telaga Wahyu – @telagawahyu\r\n⛰Tirtogumarang – @tirtogumarang\r\n⛰Pendakian Cemoro Sewu – @pgl_cemorosewu\r\n🏕 Lawu Green Forest – @lawugreenforest\r\n🌳 Mojosemi Forest Park – @mojosemiforestpark – @mojosemidinosauruspark\r\n🥛 Kampung Susu Lawu – @kampungsusulawu – @outbond.ksl\r\n🌺 Taman Bunga Refugia – @kebunrefugiamagetan\r\n💦 Wisata Lembah Serimpi – @lembahserimpi\r\n\r\n📍 Dari Arah Utara:\r\n🏞 Taman Wisata Desa Jabung – @twd_jabung\r\n🌺 Magetan Green Garden – @magetan_greengarden\r\n💧 Sorbendo Sumberdodol – @dolan_sumberdodol\r\n💧 Umbul Dampit\r\n\r\n📍 Dari Arah Selatan:\r\n🌳 Warna Wisata Alas Tuwo – @wisataalastuwo\r\n🏕 Taman Wisata Genilangit – @tamanwisatagenilangit\r\n🌄 Parang Hill – @paranghillmagetan\r\n💦 Sendang Bening – @sendang_bening\r\n\r\nSemua lokasi bisa diakses via Google Maps. Jangan lupa save & share ke teman dan keluarga biar makin seru…\r\n\r\n#wisatadimagetanaja #magetantourism #magetanngangeni #wisatalebaran #idulfitri #sarangan #LiburanAsyik #WisataMagetan #ExploreMagetan\r\n\r\n ', '2025-12-21 23:57:00', '/uploads/berita/gambar-hero/gambar_hero_berita-1766386713135.png', 0, 0, 1, 1, '2025-12-22 06:58:33', '2025-12-22 06:58:33'),
(4, 'Tari Jalak Lawu telah resmi ditetapkan sebagai Kekayaan Intelektual Komunal (KIK) dalam kategori Ekspresi Budaya Tradisional (EBT)', 'Dengan bangga kami mengumumkan bahwa Tari Jalak Lawu telah resmi ditetapkan sebagai Kekayaan Intelektual Komunal (KIK) dalam kategori Ekspresi Budaya Tradisional (EBT) oleh Kementerian Hukum dan HAM RI.\r\n\r\nTari Jalak Lawu merupakan seni tari khas Magetan yang menggambarkan keindahan Jalak Gading, fauna endemik Gunung Lawu. Tarian ini juga merepresentasikan kisah kepahlawanan Wongso Menggolo, serta melambangkan perjalanan hidup manusia yang penuh pengorbanan menuju surga atau nirwana.\r\n\r\nSebagai bagian upaya Disbudpar Kab. Magetan dalam pelaksanaan pelestarian kesenian, tari ini diinventarisasi berdasarkan PP No. 56 Tahun 2022. Pada 4 Juli 2024, EBT Tari Jalak Lawu secara resmi didokumentasikan dan diarsipkan dalam Sistem Informasi KIK dengan nomor EBT352024000121.\r\n\r\nSelengkapnya:\r\nhttps://kikomunal-indonesia.dgip.go.id/home/explore/cultural/31647', '2025-12-21 23:58:00', '/uploads/berita/gambar-hero/gambar_hero_berita-1766386856437.jpg', 0, 0, 1, 1, '2025-12-22 07:00:56', '2025-12-22 07:00:56'),
(5, 'Pelatihan Desa Wisata Tahun 2025 di Balai Desa Pacalan', 'Dinas Kebudayaan dan Pariwisata (Disbudpar) Kabupaten Magetan mengadakan pembukaan rangkaian Pelatihan Desa Wisata Tahun 2025 di Balai Desa Pacalan, Selasa (9/12/2025). Kegiatan ini melibatkan para pengelola desa wisata se kabupaten magetan, biro perjalanan wisata magetan, influencer @dolanmagetan , serta beberapa pihak penting lainnya untuk memperkuat kolaborasi dalam pengembangan pariwisata berbasis masyarakat.\r\n\r\nSelama dua hari pelatihan, peserta mengikuti rangkaian agenda lapangan dan edukasi budaya yang dirancang untuk memperkaya pemahaman mengenai pengelolaan desa wisata yang kreatif, berkelanjutan, dan berorientasi pada pelayanan.\r\n\r\nMelalui program ini, diharapkan desa wisata di Kabupaten Magetan semakin siap berkembang dan mampu memberikan manfaat yang lebih luas bagi masyarakat.', '2025-12-22 19:43:00', '/uploads/berita/gambar-hero/gambar_hero_berita-1766457912929.png', 0, 0, 1, 1, '2025-12-23 02:45:12', '2025-12-23 02:45:12'),
(6, 'testing', 'Testing', '2025-12-23 18:37:00', '/uploads/berita/gambar-hero/gambar_hero_berita-1766540264814.jpg', 0, 0, 1, 4, '2025-12-24 01:37:44', '2025-12-24 01:37:44');

-- --------------------------------------------------------

--
-- Table structure for table `budayas`
--

CREATE TABLE `budayas` (
  `id_budaya` int NOT NULL,
  `judul_budaya` varchar(255) NOT NULL,
  `gambar_budaya` varchar(255) DEFAULT NULL,
  `deskripsi_budaya` text NOT NULL,
  `kategori_budaya` enum('Objek Pengembangan Budaya','Situs Kebudayaan','Sejarah') DEFAULT NULL,
  `id_admin` int NOT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `budayas`
--

INSERT INTO `budayas` (`id_budaya`, `judul_budaya`, `gambar_budaya`, `deskripsi_budaya`, `kategori_budaya`, `id_admin`, `createdAt`, `updatedAt`) VALUES
(1, 'Petirtaan Dewi Sri', '/uploads/budaya/gambar/gambar_budaya-1761488004231.jpg', 'Situs petirtaan dewi sri adalah situs peninggalan sejarah yang ada di magetan', 'Situs Kebudayaan', 2, '2025-10-26 14:13:24', '2025-10-26 14:13:24'),
(2, 'Sendang Kamal', '/uploads/budaya/gambar/gambar_budaya-1761488117454.jpg', 'Prasasti peninggalan sejarah di magetan bagian timur', 'Situs Kebudayaan', 2, '2025-10-26 14:15:17', '2025-10-26 14:15:17'),
(3, 'Labuhan Sarangan', '/uploads/budaya/gambar/gambar_budaya-1761488303625.jpg', 'Labuhan Sarangan adalah suatu tradisi tanda puji syukur masyarakat kepada leluhur', 'Objek Pengembangan Budaya', 2, '2025-10-26 14:18:23', '2025-10-26 14:20:44');

-- --------------------------------------------------------

--
-- Table structure for table `destinasis`
--

CREATE TABLE `destinasis` (
  `id_destinasi` int NOT NULL,
  `nama_destinasi` varchar(255) NOT NULL,
  `deskripsi_destinasi` text NOT NULL,
  `alamat` text NOT NULL,
  `koordinat_lokasi` varchar(255) DEFAULT NULL,
  `jam_operasional` varchar(255) DEFAULT NULL,
  `harga_tiket` decimal(10,2) DEFAULT NULL,
  `jumlah_dilihat` int DEFAULT '0',
  `jumlah_share` int DEFAULT '0',
  `gambar_utama` varchar(255) DEFAULT NULL,
  `id_kategori_destinasi` int DEFAULT NULL,
  `id_admin` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `destinasis`
--

INSERT INTO `destinasis` (`id_destinasi`, `nama_destinasi`, `deskripsi_destinasi`, `alamat`, `koordinat_lokasi`, `jam_operasional`, `harga_tiket`, `jumlah_dilihat`, `jumlah_share`, `gambar_utama`, `id_kategori_destinasi`, `id_admin`, `created_at`, `updated_at`) VALUES
(1, 'Telaga Sarangan', 'Telaga Sarangan, yang juga dikenal sebagai Telaga Pasir, adalah ikon wisata legendaris di Kabupaten Magetan yang terletak di ketinggian 1.200 meter di atas permukaan laut, tepat di lereng Gunung Lawu. Danau alami seluas sekitar 30 hektare ini menawarkan panorama yang memukau dengan air yang tenang dan jernih, dikelilingi oleh perbukitan hijau serta udara pegunungan yang sangat sejuk dengan suhu berkisar antara 15 hingga 20 derajat Celsius. Salah satu daya tarik utamanya adalah aktivitas seru seperti berkeliling telaga menggunakan speedboat berkecepatan tinggi atau menunggang kuda menyusuri jalanan setapak yang mengitari danau. Selain keindahan alamnya, Telaga Sarangan juga kental dengan legenda lokal tentang Kyai dan Nyai Pasir yang dipercaya masyarakat sebagai asal-usul terbentuknya telaga ini.\r\n\r\nKawasan wisata ini sangat lengkap dalam hal fasilitas dan pengalaman kuliner, menjadikannya destinasi favorit untuk liburan keluarga. Pengunjung tidak boleh melewatkan kelezatan sate kelinci dan nasi pecel khas Magetan yang banyak dijajakan di pinggiran telaga sambil menikmati kabut tipis yang sering turun di pagi hari. Fasilitas di sekitar telaga sudah sangat mapan, mulai dari puluhan hotel, vila, hingga pasar wisata yang menjual berbagai suvenir khas dan sayuran segar hasil perkebunanan penduduk setempat. Lokasinya pun sangat dekat dengan Lawu Green Forest, sehingga wisatawan dapat dengan mudah mengunjungi kedua tempat ini dalam satu rangkaian perjalanan untuk mendapatkan paket lengkap wisata alam dan wahana rekreasi modern.', 'Ngluweng, Sarangan, Plaosan, Magetan, Jawa Timur', '-7.677995, 111.219234', '07.00-22.00', '20000.00', 0, 0, '/uploads/destinasi/gambar-utama/gambar_utama-1759668798184.jpg', 2, 2, '2025-10-05 12:53:18', '2025-12-24 01:24:49'),
(2, 'Desa Wisata Wonomulyo', 'Wonomulyo adalah salah satu desa wisata di magetan yang di juluki nepal van java nya Kabupaten Magetan', 'Genilangit, Poncol, Magetan, Jawa Timur', '-7.707138, 111.200950', '07.00-17.00', '10000.00', 0, 0, '/uploads/destinasi/gambar-utama/gambar_utama-1761487384235.jpg', 2, 2, '2025-10-26 14:03:04', '2025-10-26 14:03:04'),
(3, 'Air Terjun Tirtasari', 'Air terjun yang berada dekat dengan telaga sarangan yang memiliki keindahan yang memukau', 'Ngancar, Plaosan, Magetan, Jawa Timur', '-7.677447, 111.201390', '07.00-17.00', '10000.00', 0, 0, '/uploads/destinasi/gambar-utama/gambar_utama-1761487639538.jpg', 1, 2, '2025-10-26 14:07:19', '2025-10-26 14:07:19');

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id_event` int NOT NULL,
  `nama_event` varchar(255) NOT NULL,
  `deskripsi_event` text NOT NULL,
  `tanggal_mulai` date NOT NULL,
  `tanggal_selesai` date NOT NULL,
  `lokasi_event` text NOT NULL,
  `koordinat_lokasi` varchar(255) DEFAULT NULL,
  `brosur_event` varchar(255) DEFAULT NULL,
  `gambar_event` varchar(255) DEFAULT NULL,
  `jumlah_dilihat` int DEFAULT '0',
  `jumlah_share` int DEFAULT '0',
  `id_admin` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id_event`, `nama_event`, `deskripsi_event`, `tanggal_mulai`, `tanggal_selesai`, `lokasi_event`, `koordinat_lokasi`, `brosur_event`, `gambar_event`, `jumlah_dilihat`, `jumlah_share`, `id_admin`, `created_at`, `updated_at`) VALUES
(1, 'Tawang Anom Ekraf Festival', 'TAWANGANOM EKRAF FESTIVAL-2 dengan tema “Merajut Kreativitas Mengukir Identitas” merupakan hasil kolaborasi antara Pemerintah Kelurahan Tawanganom dan Karang Taruna Tawanganom Bersatu. Kegiatan ini bertujuan untuk meningkatkan perekonomian masyarakat sekaligus mempromosikan produk kreatif pelaku usaha lokal, khususnya di bidang batik dan UMKM se-Kabupaten Magetan. Dalam sambutannya, Ibu Bupati Magetan berharap kegiatan ini dapat mendorong pertumbuhan ekonomi kerakyatan dan semakin meriah pada penyelenggaraan tahun berikutnya.', '2025-12-27', '2025-12-27', 'Lapangan Kelurahan Tawang Anom', '-7.647637, 111.316375', NULL, '/uploads/event/gambar-event/gambar_event-1761489034853.png', 0, 0, 2, '2025-10-26 14:30:34', '2025-12-23 03:34:48'),
(2, 'RELAUNCHING PASAR AHAD TRADISIONAL DEWI SRI', '*HALO WARGA MAGETAN & SEKITARNYA!* 🎉\r\nYuk merapat dan ramaikan bareng-bareng acara *RELAUNCHING PASAR AHAD TRADISIONAL DEWI SRI* oleh tim PM BEM Berdampak Universitas PGRI Madiun\r\n\r\n📅 Minggu, 14 Desember 2025 ⏰ Mulai jam 06.00 WIB 📍 Petirtaan Dewi Sri, Desa Simbatan, Nguntoronadi, Magetan\r\n\r\nDimeriahkan oleh: SENI REOG Desa Simbatan dan Senam Fun Aerobic PAKDESRI\r\n\r\n*ACARA INI GRATIS & TERBUKA UNTUK UMUM!* Ajak keluarga, teman, tetangga, gebetan, semuanya boleh! Semakin rame semakin seru!\r\n\r\nYuk kita hidupkan lagi Pasar Ahad Tradisional Dewi Sri bareng-bareng!', '2025-12-27', '2025-12-27', 'Petirtaan Dewi Sri, Desa Simbatan, Nguntoronadi, Magetan', '-7.691845, 111.446634', NULL, '/uploads/event/gambar-event/gambar_event-1766457736066.png', 0, 0, 1, '2025-12-23 02:42:16', '2025-12-23 03:32:35'),
(3, 'Festival Plaza Ndoyo', 'Catat & Saksikan Keseruannya\r\nDi Festival Plaza Ndoyo Magetan,\r\nLaunching Calendar Of Events (COE) 2026 Kabupaten Magetan\r\n\r\nSiap-siap untuk tiga hari penuh keseruan, budaya, musik, dan hiburan spektakuler!\r\nAjak keluarga, teman, dan orang tersayang untuk menikmati malam penuh warna di Plaza Ndoyo!\r\n\r\nTanggal : 11 – 13 Desember\r\nLokasi : Plaza Ndoyo, Selosari, Magetan\r\nMulai pukul : 19.00 WIB\r\n\r\nSpecial Performance :\r\nRomanz.pitu – Band Etnik Milenial dengan energi yang memukau &\r\nRina Aditama – Meriahkan suasana dengan suara khasnya\r\n\r\nNikmati pertunjukan budaya, stand UMKM, kuliner khas, dan berbagai kegiatan seru lainnya!\r\nJangan lewatkan ragam acara menarik setiap harinya!', '2025-12-26', '2025-12-26', 'Plaza Ndoyo, Selosari, Magetan', '-7.651936, 111.315287', NULL, '/uploads/event/gambar-event/gambar_event-1766460513358.png', 0, 0, 1, '2025-12-23 03:28:33', '2025-12-23 03:33:22'),
(4, 'Launching Wisata Sgodean', 'Wisata Sgodean resmi hadir sebagai destinasi alam baru di lereng Gunung Lawu, tepatnya di Desa Ngiliran, Kecamatan Panekan, Kabupaten Magetan. Pengunjung dapat menikmati suasana yang sejuk, asri, dan natural, cocok untuk relaksasi maupun wisata keluarga.\r\nRangkaian acara launching di meriahkan dengan Lomba Hias Tumpeng, menghadirkan kreativitas dan kebersamaan masyarakat Desa Ngiliran.\r\nKe depan, Wisata Sgodean akan berkolaborasi dengan Dinas Kebudayaan dan Pariwisata Kabupaten Magetan dalam pengembangan potensi wisata serta peningkatan kualitas layanan bagi masyarakat.\r\n\r\nHTM GRATIS 1–9 Desember 2025\r\nManfaatkan kesempatan berkunjung tanpa biaya selama masa pembukaan!\r\n\r\n☕ Highlight Wisata\r\nNikmati kehangatan Kopi Arabika Gayo Ngiliran, racikan khas yang menjadi unggulan desa.\r\n\r\nAyo datang dan rasakan sendiri pesona alam Sgodean!', '2025-12-01', '2025-12-09', 'Desa Ngiliran, Kecamatan Panekan, Kabupaten Magetan.', '-7.603602, 111.270424', NULL, '/uploads/event/gambar-event/gambar_event-1766461214033.png', 0, 0, 1, '2025-12-23 03:40:14', '2025-12-23 03:41:46');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_beritas`
--

CREATE TABLE `kategori_beritas` (
  `id_kategori` int NOT NULL,
  `nama_kategori` varchar(255) NOT NULL,
  `deskripsi_kategori` text,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kategori_beritas`
--

INSERT INTO `kategori_beritas` (`id_kategori`, `nama_kategori`, `deskripsi_kategori`, `created_at`, `updated_at`) VALUES
(1, 'berita Umum', '', '2025-10-28 00:32:40', '2025-12-22 06:52:55'),
(2, 'Berita Wisata', '', '2025-12-22 06:53:05', '2025-12-22 06:53:05');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_destinasis`
--

CREATE TABLE `kategori_destinasis` (
  `id_kategori_destinasi` int NOT NULL,
  `nama_kategori` varchar(255) NOT NULL,
  `deskripsi_kategori` text,
  `sampul_kategori` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kategori_destinasis`
--

INSERT INTO `kategori_destinasis` (`id_kategori_destinasi`, `nama_kategori`, `deskripsi_kategori`, `sampul_kategori`, `created_at`, `updated_at`) VALUES
(1, 'Wisata Alam', 'Wisata Alam yang terdapat pada Kabupaten Magetan', '/uploads/destinasi/kategori-sampul/sampul_kategori-1759668580225.jpg', '2025-10-05 12:49:40', '2025-10-05 12:49:40'),
(2, 'Desa Wisata', 'Desa yang memiliki potensi wisata di Magetan', '/uploads/destinasi/kategori-sampul/sampul_kategori-1761487183777.jpg', '2025-10-26 13:59:43', '2025-10-26 13:59:43'),
(3, 'Wisata Kuliner', 'Wisata Kuliner Magetan', '/uploads/destinasi/kategori-sampul/sampul_kategori-1766385700792.jpg', '2025-12-22 06:41:40', '2025-12-22 06:41:40'),
(4, 'Wisata Buatan', 'Wiata Buatan Magetan', '/uploads/destinasi/kategori-sampul/sampul_kategori-1766385958970.jpg', '2025-12-22 06:45:58', '2025-12-22 06:45:58'),
(5, 'Wisata Sejarah dan Budaya', 'Wisata Sejarah dan Budaya Magetan', '/uploads/destinasi/kategori-sampul/sampul_kategori-1766386020861.jpg', '2025-12-22 06:47:00', '2025-12-22 06:47:00');

-- --------------------------------------------------------

--
-- Table structure for table `kategori_ppids`
--

CREATE TABLE `kategori_ppids` (
  `id_kategori_ppid` int NOT NULL,
  `nama_kategori` varchar(255) NOT NULL,
  `deskripsi_kategori` text,
  `level_kategori` int NOT NULL DEFAULT '1',
  `id_kategori_induk` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kategori_umkms`
--

CREATE TABLE `kategori_umkms` (
  `id_kategori_umkm` int NOT NULL,
  `nama_kategori` varchar(255) NOT NULL,
  `gambar_sampul` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `kategori_umkms`
--

INSERT INTO `kategori_umkms` (`id_kategori_umkm`, `nama_kategori`, `gambar_sampul`, `created_at`, `updated_at`) VALUES
(1, 'Kriya', '/uploads/umkm/gambar-sampul/gambar_sampul-1766384789273.jpg', '2025-10-01 06:04:49', '2025-12-22 06:26:29'),
(2, 'Fashion', '/uploads/umkm/gambar-sampul/gambar_sampul-1766384893317.jpg', '2025-12-22 06:28:13', '2025-12-23 13:14:50'),
(3, 'Kuliner', '/uploads/umkm/gambar-sampul/gambar_sampul-1766385028074.jpg', '2025-12-22 06:30:28', '2025-12-22 06:30:28'),
(4, 'Seni Rupa', '/uploads/umkm/gambar-sampul/gambar_sampul-1766385134278.jpg', '2025-12-22 06:32:14', '2025-12-22 06:32:14'),
(5, 'Musik', '/uploads/umkm/gambar-sampul/gambar_sampul-1766495457162.jpg', '2025-12-23 13:10:57', '2025-12-23 13:10:57');

-- --------------------------------------------------------

--
-- Table structure for table `komentars`
--

CREATE TABLE `komentars` (
  `id_komentar` int NOT NULL,
  `id_pengunjung` int NOT NULL,
  `tipe_konten` enum('berita','event','sejarah','destinasi','umkm') NOT NULL,
  `id_konten` int NOT NULL,
  `nama_komentator` varchar(255) NOT NULL,
  `email_komentator` varchar(255) DEFAULT NULL,
  `isi_komentar` text NOT NULL,
  `tanggal_komentar` datetime NOT NULL,
  `status_komentar` enum('pending','disetujui','ditolak') DEFAULT 'pending',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `konfigurasi_situs`
--

CREATE TABLE `konfigurasi_situs` (
  `id_konfigurasi_situs` int NOT NULL,
  `nama_pengaturan` varchar(255) NOT NULL,
  `nilai_pengaturan` text,
  `tipe_pengaturan` enum('teks','angka','gambar','boolean','json') NOT NULL,
  `terakhir_diubah` datetime NOT NULL,
  `id_admin` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `konten_ppids`
--

CREATE TABLE `konten_ppids` (
  `id_konten_ppid` int NOT NULL,
  `judul_konten` varchar(255) NOT NULL,
  `deskripsi_konten` text,
  `gambar_sampul` varchar(255) NOT NULL,
  `file_pdf_path` varchar(255) NOT NULL,
  `tanggal_publikasi` datetime NOT NULL,
  `id_kategori_ppid` int NOT NULL,
  `id_admin` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `likes`
--

CREATE TABLE `likes` (
  `id_like` int NOT NULL,
  `id_pengunjung` int NOT NULL,
  `tipe_konten` enum('berita','destinasi','sejarah','event','umkm') DEFAULT NULL,
  `id_konten` int NOT NULL,
  `tanggal_like` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `media_galeris`
--

CREATE TABLE `media_galeris` (
  `id_media_galeri` int NOT NULL,
  `tipe_konten` enum('berita','destinasi','sejarah','event','umkm','budaya','akomodasi') DEFAULT NULL,
  `id_konten` int DEFAULT NULL,
  `path_file` varchar(255) NOT NULL,
  `deskripsi_file` varchar(255) DEFAULT NULL,
  `jenis_file` enum('gambar','video') NOT NULL,
  `urutan_tampil` int DEFAULT '0',
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `media_galeris`
--

INSERT INTO `media_galeris` (`id_media_galeri`, `tipe_konten`, `id_konten`, `path_file`, `deskripsi_file`, `jenis_file`, `urutan_tampil`, `created_at`, `updated_at`) VALUES
(4, 'destinasi', 1, '/uploads/galeri/media_galeri_files-1759668798206.jpg', '', 'gambar', 1, '2025-10-05 12:53:18', '2025-10-05 12:53:18'),
(5, 'destinasi', 1, '/uploads/galeri/media_galeri_files-1759668798210.jpg', '', 'gambar', 1, '2025-10-05 12:53:18', '2025-10-05 12:53:18'),
(6, 'destinasi', 2, '/uploads/galeri/media_galeri_files-1761487384266.jpg', '', 'gambar', 1, '2025-10-26 14:03:04', '2025-10-26 14:03:04'),
(7, 'destinasi', 3, '/uploads/galeri/media_galeri_files-1761487639569.jpg', '', 'gambar', 1, '2025-10-26 14:07:19', '2025-10-26 14:07:19'),
(8, 'destinasi', 3, '/uploads/galeri/media_galeri_files-1761487639570.jpg', '', 'gambar', 1, '2025-10-26 14:07:19', '2025-10-26 14:07:19'),
(9, 'budaya', 1, '/uploads/galeri/media_galeri_files-1761488004250.jpg', '', 'gambar', 1, '2025-10-26 14:13:24', '2025-10-26 14:13:24'),
(10, 'budaya', 2, '/uploads/galeri/media_galeri_files-1761488117474.jpeg', '', 'gambar', 1, '2025-10-26 14:15:17', '2025-10-26 14:15:17'),
(11, 'budaya', 3, '/uploads/galeri/media_galeri_files-1761488303653.jpg', '', 'gambar', 1, '2025-10-26 14:18:23', '2025-10-26 14:18:23'),
(12, 'budaya', 3, '/uploads/galeri/media_galeri_files-1761488303657.jpg', '', 'gambar', 1, '2025-10-26 14:18:23', '2025-10-26 14:18:23'),
(13, 'berita', 2, '/uploads/galeri/media_galeri_files-1766386600045.jpg', '', 'gambar', 1, '2025-12-22 06:56:40', '2025-12-22 06:56:40'),
(14, 'berita', 3, '/uploads/galeri/media_galeri_files-1766386713154.png', '', 'gambar', 1, '2025-12-22 06:58:33', '2025-12-22 06:58:33'),
(15, 'berita', 4, '/uploads/galeri/media_galeri_files-1766386856456.jpg', '', 'gambar', 1, '2025-12-22 07:00:56', '2025-12-22 07:00:56'),
(16, 'berita', 5, '/uploads/galeri/media_galeri_files-1766457912955.png', '', 'gambar', 1, '2025-12-23 02:45:12', '2025-12-23 02:45:12'),
(17, 'berita', 5, '/uploads/galeri/media_galeri_files-1766457912960.png', '', 'gambar', 1, '2025-12-23 02:45:12', '2025-12-23 02:45:12'),
(18, 'destinasi', 4, '/uploads/galeri/media_galeri_files-1766460108743.jpg', '', 'gambar', 1, '2025-12-23 03:21:48', '2025-12-23 03:21:48'),
(19, 'destinasi', 4, '/uploads/galeri/media_galeri_files-1766460108746.jpg', '', 'gambar', 1, '2025-12-23 03:21:48', '2025-12-23 03:21:48'),
(20, 'event', 3, '/uploads/galeri/media_galeri_files-1766460513374.png', '', 'gambar', 1, '2025-12-23 03:28:33', '2025-12-23 03:28:33'),
(21, 'event', 3, '/uploads/galeri/media_galeri_files-1766460513381.png', '', 'gambar', 1, '2025-12-23 03:28:33', '2025-12-23 03:28:33'),
(22, 'event', 4, '/uploads/galeri/media_galeri_files-1766461214052.png', '', 'gambar', 1, '2025-12-23 03:40:14', '2025-12-23 03:40:14'),
(23, 'event', 4, '/uploads/galeri/media_galeri_files-1766461214057.png', '', 'gambar', 1, '2025-12-23 03:40:14', '2025-12-23 03:40:14'),
(24, 'event', 4, '/uploads/galeri/media_galeri_files-1766461214061.png', '', 'gambar', 1, '2025-12-23 03:40:14', '2025-12-23 03:40:14'),
(25, 'event', 4, '/uploads/galeri/media_galeri_files-1766461276433.png', '', 'gambar', 1, '2025-12-23 03:41:16', '2025-12-23 03:41:16'),
(26, 'event', 4, '/uploads/galeri/media_galeri_files-1766461306156.png', '', 'gambar', 1, '2025-12-23 03:41:46', '2025-12-23 03:41:46'),
(27, 'umkm', 3, '/uploads/galeri/media_galeri_files-1766470969335.jpg', '', 'gambar', 1, '2025-12-23 06:22:49', '2025-12-23 06:22:49'),
(28, 'umkm', 3, '/uploads/galeri/media_galeri_files-1766470969336.jpg', '', 'gambar', 1, '2025-12-23 06:22:49', '2025-12-23 06:22:49'),
(29, 'umkm', 3, '/uploads/galeri/media_galeri_files-1766470969341.jpg', '', 'gambar', 1, '2025-12-23 06:22:49', '2025-12-23 06:22:49'),
(30, 'umkm', 3, '/uploads/galeri/media_galeri_files-1766470969342.jpg', '', 'gambar', 1, '2025-12-23 06:22:49', '2025-12-23 06:22:49'),
(31, 'umkm', 3, '/uploads/galeri/media_galeri_files-1766470969343.jpg', '', 'gambar', 1, '2025-12-23 06:22:49', '2025-12-23 06:22:49'),
(32, 'berita', 6, '/uploads/galeri/media_galeri_files-1766540264834.jpg', '', 'gambar', 1, '2025-12-24 01:37:44', '2025-12-24 01:37:44');

-- --------------------------------------------------------

--
-- Table structure for table `media_sosials`
--

CREATE TABLE `media_sosials` (
  `id_media_sosial` int NOT NULL,
  `nama_platform` enum('Facebook','Instagram','Twitter','YouTube','LinkedIn','TikTok') NOT NULL,
  `url_link` varchar(255) NOT NULL,
  `icon_path` varchar(255) DEFAULT NULL,
  `urutan_tampil` int DEFAULT '0',
  `id_admin` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pengumumans`
--

CREATE TABLE `pengumumans` (
  `id_pengumuman` int NOT NULL,
  `judul_pengumuman` varchar(255) NOT NULL,
  `sampul_pengumuman` varchar(255) NOT NULL,
  `isi_pengumuman` text,
  `file_pdf_path` varchar(255) NOT NULL,
  `tanggal_publikasi` datetime NOT NULL,
  `id_admin` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `pengumumans`
--

INSERT INTO `pengumumans` (`id_pengumuman`, `judul_pengumuman`, `sampul_pengumuman`, `isi_pengumuman`, `file_pdf_path`, `tanggal_publikasi`, `id_admin`, `created_at`, `updated_at`) VALUES
(1, 'Laporan Kinerja Tahun 2024', '/uploads/pengumuman/sampul/sampul_pengumuman-1761653636375.png', '', '/uploads/pengumuman/pdf/file_pdf_pengumuman-1761653636208.pdf', '2025-10-28 12:13:56', 2, '2025-10-28 12:13:56', '2025-10-28 12:13:56'),
(2, 'PERUBAHAN RENCANA STRATEGIS Dinas Kebudayaan dan Pariwisata Kabupaten Magetan Tahun 2024 - 2026', '/uploads/pengumuman/sampul/sampul_pengumuman-1766500609977.png', '-', '/uploads/pengumuman/pdf/file_pdf_pengumuman-1766500609942.pdf', '2025-12-23 14:36:49', 2, '2025-12-23 14:36:49', '2025-12-23 14:36:49');

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8mb3_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COLLATE=utf8mb3_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20250106000001-create-activity-log.js'),
('20250715135552-create-admin.js'),
('20250715135615-create-kategori-berita.js'),
('20250715135623-create-berita.js'),
('20250715135657-create-kategori-destinasi.js'),
('20250715135706-create-destinasi.js'),
('20250715135713-create-event.js'),
('20250715135714-create-kategori-umkm.js'),
('20250715135720-create-umkm.js'),
('20250715135731-create-media-galeri.js'),
('20250715135754-create-komentar.js'),
('20250715135807-create-like.js'),
('20250715135819-create-media-sosial.js'),
('20250715135902-create-struktur-anggota.js'),
('20250715135915-create-share-log.js'),
('20250729024725-create-struktur-organisasi.js'),
('20250729024735-create-visi-misi.js'),
('20250729024746-create-pengumuman.js'),
('20250730025653-create-akomodasi.js'),
('20250730025713-create-kategori-ppid.js'),
('20250730025720-create-konten-ppid.js'),
('20250730025722-create-budaya.js'),
('20250925000001-update-tipe-konten-enum.js'),
('20251027000000-update-activity-log-action-column.js'),
('add-is-blocked-to-admins.js');

-- --------------------------------------------------------

--
-- Table structure for table `share_logs`
--

CREATE TABLE `share_logs` (
  `id_share_log` int NOT NULL,
  `id_pengunjung` int DEFAULT NULL,
  `tipe_konten` enum('berita','destinasi','sejarah','event','umkm') NOT NULL,
  `id_konten` int NOT NULL,
  `platform_share` enum('Facebook','Wa','Twitter','Copy_link','Email','Telegram','TikTok','LinkedIn','Instagram') NOT NULL,
  `tanggal_share` datetime NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `statistik_kunjungans`
--

CREATE TABLE `statistik_kunjungans` (
  `id_statistik_kunjungan` int NOT NULL,
  `tanggal_kunjungan` date NOT NULL,
  `jumlah_pengunjung_unik` int DEFAULT '0',
  `jumlah_page_views` int DEFAULT '0',
  `id_halaman` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `struktur_anggotas`
--

CREATE TABLE `struktur_anggotas` (
  `id_anggota` int NOT NULL,
  `nama_anggota` varchar(255) NOT NULL,
  `jabatan` varchar(255) NOT NULL,
  `deskripsi_tugas` text,
  `foto_anggota` varchar(255) DEFAULT NULL,
  `urutan_tampilan` int DEFAULT '0',
  `id_admin` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `struktur_anggotas`
--

INSERT INTO `struktur_anggotas` (`id_anggota`, `nama_anggota`, `jabatan`, `deskripsi_tugas`, `foto_anggota`, `urutan_tampilan`, `id_admin`, `created_at`, `updated_at`) VALUES
(1, 'Joko Trihono', 'Kepala Dinas', 'Memiliki tanggung jawab atau semua hal di Dinas Kebudayaan dan Pariwisata Kab. Magetan', '/uploads/struktur-anggota/foto/foto_anggota-1761517169237.jpg', 1, 2, '2025-10-26 22:19:29', '2025-10-26 22:19:29'),
(2, 'Solekan', 'Sekretaris', 'Sebagai Sekretaris Dinas Kebudayaan Dan Pariwisata Kabupaten Magetan', '/uploads/struktur-anggota/foto/foto_anggota-1766491563589.jpg', 2, 1, '2025-12-23 12:06:03', '2025-12-23 12:21:38'),
(3, 'Bang Yos', 'Kepala Bidang Pemasaran', 'Memimpin dan penanggung jawab bidang pemasaran wisata kabupaten magetan', '/uploads/struktur-anggota/foto/foto_anggota-1766491690928.png', 3, 1, '2025-12-23 12:08:10', '2025-12-23 12:08:10'),
(4, 'Pak Eka', 'Kepala Bidang Destinasi', 'Memimpin dan bertanggung jawab pada bidang Destinasi Wisata Kabupaten Magetan', '/uploads/struktur-anggota/foto/foto_anggota-1766491772859.jpg', 4, 1, '2025-12-23 12:09:32', '2025-12-23 12:09:32');

-- --------------------------------------------------------

--
-- Table structure for table `struktur_organisasis`
--

CREATE TABLE `struktur_organisasis` (
  `id_struktur_organisasi` int NOT NULL,
  `judul_struktur` varchar(255) NOT NULL DEFAULT 'Struktur Organisasi',
  `deskripsi_struktur` text,
  `gambar_struktur_path` varchar(255) NOT NULL,
  `tanggal_pembaruan` datetime NOT NULL,
  `id_admin` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `struktur_organisasis`
--

INSERT INTO `struktur_organisasis` (`id_struktur_organisasi`, `judul_struktur`, `deskripsi_struktur`, `gambar_struktur_path`, `tanggal_pembaruan`, `id_admin`, `created_at`, `updated_at`) VALUES
(1, 'Struktur Organisasi', NULL, '/uploads/struktur-organisasi/gambar_struktur_organisasi-1761517084590.png', '2025-10-26 22:18:04', 2, '2025-10-26 22:18:04', '2025-10-26 22:18:04');

-- --------------------------------------------------------

--
-- Table structure for table `umkms`
--

CREATE TABLE `umkms` (
  `id_umkm` int NOT NULL,
  `nama_umkm` varchar(255) NOT NULL,
  `deskripsi_umkm` text NOT NULL,
  `hastag_umkm` varchar(255) DEFAULT NULL,
  `alamat_umkm` text NOT NULL,
  `kontak_umkm` varchar(255) NOT NULL,
  `jam_operasional` varchar(255) DEFAULT NULL,
  `hari_operasional` varchar(255) DEFAULT NULL,
  `website_umkm` varchar(255) DEFAULT NULL,
  `gambar_produk_utama` varchar(255) DEFAULT NULL,
  `gambar_sampul` varchar(255) DEFAULT NULL,
  `jumlah_dilihat` int DEFAULT '0',
  `jumlah_share` int DEFAULT '0',
  `id_admin` int DEFAULT NULL,
  `id_kategori_umkm` int DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `umkms`
--

INSERT INTO `umkms` (`id_umkm`, `nama_umkm`, `deskripsi_umkm`, `hastag_umkm`, `alamat_umkm`, `kontak_umkm`, `jam_operasional`, `hari_operasional`, `website_umkm`, `gambar_produk_utama`, `gambar_sampul`, `jumlah_dilihat`, `jumlah_share`, `id_admin`, `id_kategori_umkm`, `created_at`, `updated_at`) VALUES
(2, 'Batik Alam Berkah', 'Batik Alam Berkah adalah batik asli magetan', '#batikmagetan #ekrafmagetan', 'Purworejo, Nguntoronadi', '-', '07.00-18.00', 'senin-sabtu', 'https://wisatadanbudaya.magetan.go.id/2021/08/16/batik-alam-berkah/', '/uploads/umkm/gambar-produk/gambar_produk_utama-1761489407031.png', '/uploads/umkm/gambar-sampul/gambar_sampul-1761489407037.png', 0, 0, 2, 2, '2025-10-26 14:36:47', '2025-12-23 13:14:28'),
(3, 'Noer Leather', 'Noer Leather merupakan pengrajin kerajinan kulit asli Kab. Magetan yang bertempat di Ds Banjarejo RT 09 RW 02 kec ngariboyo kab. Magetan. Produk kulit yang di hasilkan berupa : Dompet, tas, lanyard, gantungan kunci, dan lainnya.\r\n\r\nMedia Online dan pembelian online melalui\r\nInstagram : @Noer leather\r\nFacebook  : Nur saifudin\r\nNo Hp        : 081359990730', '#kriyamagetan #ekrafmagetan', 'Desa Banjarejo RT 09 RW 02 kec ngariboyo kab. Magetan', '081359990730', '07.00-18.00', 'senin-sabtu', 'https://wisatadanbudaya.magetan.go.id/2023/08/13/noer-leather/', '/uploads/umkm/gambar-produk/gambar_produk_utama-1766470969289.jpg', '/uploads/umkm/gambar-sampul/gambar_sampul-1766470969293.jpg', 0, 0, 2, 1, '2025-12-23 06:22:49', '2025-12-23 06:22:49'),
(5, 'Batik Gepyok Ciprat', 'Batik Gepyok Ciprat adalah batik asli buatan warga magetan', '#batikmagetan #ekrafmagetan', '	\r\nDesa Gebyog RT 01 RW 01 Kec.Karangrejo, Magetan', '-', '08.00 - 17.00', 'senin-sabtu', 'https://wisatadanbudaya.magetan.go.id/2021/08/16/batik-gepyok-ciprat/', '/uploads/umkm/gambar-produk/gambar_produk_utama-1766495625547.jpg', '/uploads/umkm/gambar-sampul/gambar_sampul-1766495625547.jpg', 0, 0, 1, 2, '2025-12-23 13:13:45', '2025-12-23 13:13:45');

-- --------------------------------------------------------

--
-- Table structure for table `visi_misis`
--

CREATE TABLE `visi_misis` (
  `id_visi_misi` int NOT NULL,
  `visi_misi_file_path` varchar(255) DEFAULT NULL,
  `tipe_file_visi_misi` enum('gambar','pdf') DEFAULT NULL,
  `deskripsi` text,
  `tanggal_pembaruan` datetime NOT NULL,
  `id_admin` int NOT NULL,
  `created_at` datetime NOT NULL,
  `updated_at` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `visi_misis`
--

INSERT INTO `visi_misis` (`id_visi_misi`, `visi_misi_file_path`, `tipe_file_visi_misi`, `deskripsi`, `tanggal_pembaruan`, `id_admin`, `created_at`, `updated_at`) VALUES
(1, '/uploads/visi-misi/visi_misi_file-1766491878128.pdf', 'pdf', 'Sesuai Rencana Pembangunan Jangka Menengah Daerah (RPJMD) Kabupaten Magetan Tahun 2018-2023 telah dirumuskan visi sebagai berikut :\r\n\r\n\r\n\r\n            “ MASYARAKAT MAGETAN YANG SMART SEMAKIN MANTAB DAN LEBIH SEJAHTERA”\r\n\r\nSMART = Sehat, Maju, Agamis, Ramah dan Terampil \r\n\r\nMANTAB = Mandiri, Lestari dan Bermartabat\r\n\r\n\r\n\r\nVisi tersebut mengandung pengertian bahwa Kabupaten Magetan dalam periode pembangunan 5 (lima) tahun ke depan akan fokus dalam peningkatan kesejahteraan masyarakat. Kesejahteraan disini dapat didefinisikan sebagai suatu keadaan dimana semua lapisan masyarakat secara menyeluruh dapat terpenuhi hak-hak dasarnya di bidang sosial, ekonomi, budaya dan agama, serta memiliki rasa aman dan kepercayaan yang tinggi kepada pemerintahan sehingga dapat menikmati kehidupan yang lebih berkualitas dan maju.\r\n\r\n\r\n\r\nUntuk mewujudkan visi di atas selanjutnya dijabarkan dalam misi sebagai berikut :\r\n\r\n\r\n\r\nMeningkatkan percepatan dan perluasan pembentukan sumberdaya manusia yang SMART (Sehat, Maju, Agamis, Ramah, Terampil).\r\nMeningkatkan perekonomian daerah melalui keberpihakan dan pemberdayaan koperasi dan usaha mikro sebagai pilar ekonomi kerakyatan serta pemberdayaan masyarakat desa sebagai basis sekaligus ujung tombak pembangunan daerah.\r\nMengoptimalkan pengelolaan dan pendayagunaan sumberdaya alam yang berwawasan lingkungan dan berkelanjutan.\r\nMemantapkan ketercukupan kuantitas dan kualitas sarana prasarana dan fasilitas bagi kegiatan pelayanan masyarakat.\r\nMengembangkan penyelenggaraan tata pemerintahan yang baik dan manajemen pemerintahan yang bersih, profesional dan adil.\r\n\r\n\r\nSesuai dengan tugas pokok dan fungsinya, Dinas Pariwisata dan Kebudayaan mempunyai tugas  untuk ikut mensukseskan :\r\n\r\n\r\n\r\nMisi yang ke 1  yaitu Meningkatkan percepatan dan perluasan pembentukan sumberdaya manusia yang SMART (Sehat, Maju, Agamis, Ramah, Terampil)\r\n\r\n\r\n\r\nPada Tujuan 1 : Meningkatkan kwalitas SDM.\r\n\r\n\r\n\r\nIndikator Tujuan : Indeks Pembangunan Manusia (IPM).\r\n\r\n\r\n\r\nSasaran 1.2 : Meningkatnya taraf pendidikan masyarakat.\r\n\r\n\r\n\r\nIndikator Sasaran : Indeks Pendidikan.\r\n\r\n\r\n\r\nStrategi : Meningkatkan taraf pendidikan karakter masyarakat.\r\n\r\n\r\n\r\nArah Kebijakan : Melestarikan nilai-nilai luhur dan norma budaya jawa.\r\n\r\n\r\n\r\nMisi yang ke 2  yaitu Meningkatkan perekonomian daerah melalui keberpihakan dan pemberdayaan koperasi dan usaha mikro sebagai pilar ekonomi kerakyatan serta pemberdayaan masyarakat desa sebagai basis sekaligus ujung tombak pembangunan daerah.\r\n\r\n\r\n\r\nPada Tujuan 3 : Memperkuat perekonomian daerah yang berkwalitas.\r\n\r\n\r\n\r\nIndikator Tujuan : Pertumbuhan ekonomi.\r\n\r\n\r\n\r\nSasaran 3.1 : Meningkatkan Kinerja Sektor Unggulan.\r\n\r\n\r\n\r\nIndikator Sasaran : Nilai PDRB Sektor Pariwisata (nilai PDRB penyediaan akomodasi dan makan minum) (Juta Rp.).\r\n\r\n\r\n\r\nStrategi : Meningkatkan industri pariwisata\r\n\r\n\r\n\r\nArah Kebijakan : Meningkatkan promosi pariwisata dan meningkatkan daya tarik destinasi wisata.', '2025-12-23 12:11:18', 1, '2025-12-23 12:11:18', '2025-12-23 12:11:18');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `activity_logs_admin_id` (`adminId`),
  ADD KEY `activity_logs_action` (`action`),
  ADD KEY `activity_logs_entity` (`entity`),
  ADD KEY `activity_logs_created_at` (`createdAt`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id_admin`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username_2` (`username`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `username_3` (`username`),
  ADD UNIQUE KEY `email_3` (`email`),
  ADD UNIQUE KEY `username_4` (`username`),
  ADD UNIQUE KEY `email_4` (`email`),
  ADD UNIQUE KEY `username_5` (`username`),
  ADD UNIQUE KEY `email_5` (`email`);

--
-- Indexes for table `akomodasis`
--
ALTER TABLE `akomodasis`
  ADD PRIMARY KEY (`id_akomodasi`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `beritas`
--
ALTER TABLE `beritas`
  ADD PRIMARY KEY (`id_berita`),
  ADD KEY `id_kategori` (`id_kategori`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `budayas`
--
ALTER TABLE `budayas`
  ADD PRIMARY KEY (`id_budaya`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `destinasis`
--
ALTER TABLE `destinasis`
  ADD PRIMARY KEY (`id_destinasi`),
  ADD KEY `id_kategori_destinasi` (`id_kategori_destinasi`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id_event`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `kategori_beritas`
--
ALTER TABLE `kategori_beritas`
  ADD PRIMARY KEY (`id_kategori`),
  ADD UNIQUE KEY `nama_kategori` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_2` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_3` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_4` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_5` (`nama_kategori`);

--
-- Indexes for table `kategori_destinasis`
--
ALTER TABLE `kategori_destinasis`
  ADD PRIMARY KEY (`id_kategori_destinasi`),
  ADD UNIQUE KEY `nama_kategori` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_2` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_3` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_4` (`nama_kategori`);

--
-- Indexes for table `kategori_ppids`
--
ALTER TABLE `kategori_ppids`
  ADD PRIMARY KEY (`id_kategori_ppid`),
  ADD UNIQUE KEY `nama_kategori` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_2` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_3` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_4` (`nama_kategori`),
  ADD UNIQUE KEY `nama_kategori_5` (`nama_kategori`),
  ADD KEY `id_kategori_induk` (`id_kategori_induk`);

--
-- Indexes for table `kategori_umkms`
--
ALTER TABLE `kategori_umkms`
  ADD PRIMARY KEY (`id_kategori_umkm`);

--
-- Indexes for table `komentars`
--
ALTER TABLE `komentars`
  ADD PRIMARY KEY (`id_komentar`);

--
-- Indexes for table `konfigurasi_situs`
--
ALTER TABLE `konfigurasi_situs`
  ADD PRIMARY KEY (`id_konfigurasi_situs`),
  ADD UNIQUE KEY `nama_pengaturan` (`nama_pengaturan`),
  ADD UNIQUE KEY `nama_pengaturan_2` (`nama_pengaturan`),
  ADD UNIQUE KEY `nama_pengaturan_3` (`nama_pengaturan`),
  ADD UNIQUE KEY `nama_pengaturan_4` (`nama_pengaturan`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `konten_ppids`
--
ALTER TABLE `konten_ppids`
  ADD PRIMARY KEY (`id_konten_ppid`),
  ADD KEY `id_kategori_ppid` (`id_kategori_ppid`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `likes`
--
ALTER TABLE `likes`
  ADD PRIMARY KEY (`id_like`);

--
-- Indexes for table `media_galeris`
--
ALTER TABLE `media_galeris`
  ADD PRIMARY KEY (`id_media_galeri`);

--
-- Indexes for table `media_sosials`
--
ALTER TABLE `media_sosials`
  ADD PRIMARY KEY (`id_media_sosial`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `pengumumans`
--
ALTER TABLE `pengumumans`
  ADD PRIMARY KEY (`id_pengumuman`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `share_logs`
--
ALTER TABLE `share_logs`
  ADD PRIMARY KEY (`id_share_log`);

--
-- Indexes for table `statistik_kunjungans`
--
ALTER TABLE `statistik_kunjungans`
  ADD PRIMARY KEY (`id_statistik_kunjungan`);

--
-- Indexes for table `struktur_anggotas`
--
ALTER TABLE `struktur_anggotas`
  ADD PRIMARY KEY (`id_anggota`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `struktur_organisasis`
--
ALTER TABLE `struktur_organisasis`
  ADD PRIMARY KEY (`id_struktur_organisasi`),
  ADD KEY `id_admin` (`id_admin`);

--
-- Indexes for table `umkms`
--
ALTER TABLE `umkms`
  ADD PRIMARY KEY (`id_umkm`),
  ADD KEY `id_admin` (`id_admin`),
  ADD KEY `id_kategori_umkm` (`id_kategori_umkm`);

--
-- Indexes for table `visi_misis`
--
ALTER TABLE `visi_misis`
  ADD PRIMARY KEY (`id_visi_misi`),
  ADD KEY `id_admin` (`id_admin`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id_admin` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `akomodasis`
--
ALTER TABLE `akomodasis`
  MODIFY `id_akomodasi` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `beritas`
--
ALTER TABLE `beritas`
  MODIFY `id_berita` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `budayas`
--
ALTER TABLE `budayas`
  MODIFY `id_budaya` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `destinasis`
--
ALTER TABLE `destinasis`
  MODIFY `id_destinasi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id_event` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `kategori_beritas`
--
ALTER TABLE `kategori_beritas`
  MODIFY `id_kategori` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `kategori_destinasis`
--
ALTER TABLE `kategori_destinasis`
  MODIFY `id_kategori_destinasi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `kategori_ppids`
--
ALTER TABLE `kategori_ppids`
  MODIFY `id_kategori_ppid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kategori_umkms`
--
ALTER TABLE `kategori_umkms`
  MODIFY `id_kategori_umkm` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `komentars`
--
ALTER TABLE `komentars`
  MODIFY `id_komentar` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `konfigurasi_situs`
--
ALTER TABLE `konfigurasi_situs`
  MODIFY `id_konfigurasi_situs` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `konten_ppids`
--
ALTER TABLE `konten_ppids`
  MODIFY `id_konten_ppid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `likes`
--
ALTER TABLE `likes`
  MODIFY `id_like` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `media_galeris`
--
ALTER TABLE `media_galeris`
  MODIFY `id_media_galeri` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT for table `media_sosials`
--
ALTER TABLE `media_sosials`
  MODIFY `id_media_sosial` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pengumumans`
--
ALTER TABLE `pengumumans`
  MODIFY `id_pengumuman` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `share_logs`
--
ALTER TABLE `share_logs`
  MODIFY `id_share_log` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `statistik_kunjungans`
--
ALTER TABLE `statistik_kunjungans`
  MODIFY `id_statistik_kunjungan` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `struktur_anggotas`
--
ALTER TABLE `struktur_anggotas`
  MODIFY `id_anggota` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `struktur_organisasis`
--
ALTER TABLE `struktur_organisasis`
  MODIFY `id_struktur_organisasi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `umkms`
--
ALTER TABLE `umkms`
  MODIFY `id_umkm` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `visi_misis`
--
ALTER TABLE `visi_misis`
  MODIFY `id_visi_misi` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`adminId`) REFERENCES `admins` (`id_admin`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `akomodasis`
--
ALTER TABLE `akomodasis`
  ADD CONSTRAINT `akomodasis_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `akomodasis_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `akomodasis_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `akomodasis_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `akomodasis_ibfk_5` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;

--
-- Constraints for table `beritas`
--
ALTER TABLE `beritas`
  ADD CONSTRAINT `beritas_ibfk_10` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `beritas_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `beritas_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `beritas_ibfk_6` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `beritas_ibfk_8` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `beritas_ibfk_9` FOREIGN KEY (`id_kategori`) REFERENCES `kategori_beritas` (`id_kategori`) ON UPDATE CASCADE;

--
-- Constraints for table `budayas`
--
ALTER TABLE `budayas`
  ADD CONSTRAINT `budayas_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `budayas_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `budayas_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `budayas_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `budayas_ibfk_5` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;

--
-- Constraints for table `destinasis`
--
ALTER TABLE `destinasis`
  ADD CONSTRAINT `destinasis_ibfk_1` FOREIGN KEY (`id_kategori_destinasi`) REFERENCES `kategori_destinasis` (`id_kategori_destinasi`) ON UPDATE CASCADE,
  ADD CONSTRAINT `destinasis_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `destinasis_ibfk_3` FOREIGN KEY (`id_kategori_destinasi`) REFERENCES `kategori_destinasis` (`id_kategori_destinasi`) ON UPDATE CASCADE,
  ADD CONSTRAINT `destinasis_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `destinasis_ibfk_5` FOREIGN KEY (`id_kategori_destinasi`) REFERENCES `kategori_destinasis` (`id_kategori_destinasi`) ON UPDATE CASCADE,
  ADD CONSTRAINT `destinasis_ibfk_6` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `destinasis_ibfk_7` FOREIGN KEY (`id_kategori_destinasi`) REFERENCES `kategori_destinasis` (`id_kategori_destinasi`) ON UPDATE CASCADE,
  ADD CONSTRAINT `destinasis_ibfk_8` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `events_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;

--
-- Constraints for table `kategori_ppids`
--
ALTER TABLE `kategori_ppids`
  ADD CONSTRAINT `kategori_ppids_ibfk_1` FOREIGN KEY (`id_kategori_induk`) REFERENCES `kategori_ppids` (`id_kategori_ppid`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `kategori_ppids_ibfk_2` FOREIGN KEY (`id_kategori_induk`) REFERENCES `kategori_ppids` (`id_kategori_ppid`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `kategori_ppids_ibfk_3` FOREIGN KEY (`id_kategori_induk`) REFERENCES `kategori_ppids` (`id_kategori_ppid`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `kategori_ppids_ibfk_4` FOREIGN KEY (`id_kategori_induk`) REFERENCES `kategori_ppids` (`id_kategori_ppid`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `kategori_ppids_ibfk_5` FOREIGN KEY (`id_kategori_induk`) REFERENCES `kategori_ppids` (`id_kategori_ppid`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `konfigurasi_situs`
--
ALTER TABLE `konfigurasi_situs`
  ADD CONSTRAINT `konfigurasi_situs_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `konfigurasi_situs_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `konfigurasi_situs_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `konfigurasi_situs_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;

--
-- Constraints for table `konten_ppids`
--
ALTER TABLE `konten_ppids`
  ADD CONSTRAINT `konten_ppids_ibfk_1` FOREIGN KEY (`id_kategori_ppid`) REFERENCES `kategori_ppids` (`id_kategori_ppid`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `konten_ppids_ibfk_10` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `konten_ppids_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `konten_ppids_ibfk_3` FOREIGN KEY (`id_kategori_ppid`) REFERENCES `kategori_ppids` (`id_kategori_ppid`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `konten_ppids_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `konten_ppids_ibfk_5` FOREIGN KEY (`id_kategori_ppid`) REFERENCES `kategori_ppids` (`id_kategori_ppid`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `konten_ppids_ibfk_6` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `konten_ppids_ibfk_7` FOREIGN KEY (`id_kategori_ppid`) REFERENCES `kategori_ppids` (`id_kategori_ppid`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `konten_ppids_ibfk_8` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `konten_ppids_ibfk_9` FOREIGN KEY (`id_kategori_ppid`) REFERENCES `kategori_ppids` (`id_kategori_ppid`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `media_sosials`
--
ALTER TABLE `media_sosials`
  ADD CONSTRAINT `media_sosials_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `media_sosials_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `media_sosials_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `media_sosials_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;

--
-- Constraints for table `pengumumans`
--
ALTER TABLE `pengumumans`
  ADD CONSTRAINT `pengumumans_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `pengumumans_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pengumumans_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pengumumans_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `pengumumans_ibfk_5` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;

--
-- Constraints for table `struktur_anggotas`
--
ALTER TABLE `struktur_anggotas`
  ADD CONSTRAINT `struktur_anggotas_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `struktur_anggotas_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `struktur_anggotas_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `struktur_anggotas_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;

--
-- Constraints for table `struktur_organisasis`
--
ALTER TABLE `struktur_organisasis`
  ADD CONSTRAINT `struktur_organisasis_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `struktur_organisasis_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `struktur_organisasis_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `struktur_organisasis_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `struktur_organisasis_ibfk_5` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;

--
-- Constraints for table `umkms`
--
ALTER TABLE `umkms`
  ADD CONSTRAINT `umkms_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `umkms_ibfk_10` FOREIGN KEY (`id_kategori_umkm`) REFERENCES `kategori_umkms` (`id_kategori_umkm`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `umkms_ibfk_2` FOREIGN KEY (`id_kategori_umkm`) REFERENCES `kategori_umkms` (`id_kategori_umkm`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `umkms_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `umkms_ibfk_4` FOREIGN KEY (`id_kategori_umkm`) REFERENCES `kategori_umkms` (`id_kategori_umkm`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `umkms_ibfk_5` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `umkms_ibfk_6` FOREIGN KEY (`id_kategori_umkm`) REFERENCES `kategori_umkms` (`id_kategori_umkm`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `umkms_ibfk_7` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `umkms_ibfk_8` FOREIGN KEY (`id_kategori_umkm`) REFERENCES `kategori_umkms` (`id_kategori_umkm`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `umkms_ibfk_9` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;

--
-- Constraints for table `visi_misis`
--
ALTER TABLE `visi_misis`
  ADD CONSTRAINT `visi_misis_ibfk_1` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `visi_misis_ibfk_2` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `visi_misis_ibfk_3` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `visi_misis_ibfk_4` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE,
  ADD CONSTRAINT `visi_misis_ibfk_5` FOREIGN KEY (`id_admin`) REFERENCES `admins` (`id_admin`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
