# Sistem Activity Logging Admin Dashboard

## Overview

Sistem ini telah diimplementasikan untuk melacak semua aktivitas admin di dalam sistem Magetan Tourism. Sistem ini secara otomatis mencatat setiap aksi CRUD (Create, Read, Update, Delete) yang dilakukan oleh admin.

## Fitur yang Diimplementasikan

### 1. Model Activity Log

- **File**: `src/models/activity_log.js`
- Menyimpan informasi lengkap tentang aktivitas admin
- **Field**: adminId, action, entity, entityId, entityName, oldData, newData, ipAddress, userAgent, description, timestamps

### 2. Dashboard Controller

- **File**: `src/controllers/dashboardController.js`
- **Endpoints**:
  - `GET /api/dashboard/summary` - Ringkasan statistik
  - `GET /api/dashboard/activity` - Aktivitas terbaru
  - `GET /api/dashboard/activity-stats` - Statistik aktivitas
  - `GET /api/dashboard/most-active-admins` - Admin paling aktif
  - `GET /api/dashboard/activity-log` - Log aktivitas dengan filter

### 3. Activity Logger Middleware

- **File**: `src/middleware/activityLoggerMiddleware.js`
- Secara otomatis mencatat aktivitas berdasarkan response
- **Functions**:
  - `activityLogger(action, entity)` - Middleware untuk logging
  - `saveOriginalData(model)` - Menyimpan data asli sebelum update
  - `logManualActivity()` - Logging manual untuk kasus khusus

### 4. Routes yang Telah Diperbarui

- **beritaRoutes.js** - Activity logging untuk berita
- **destinasiRoutes.js** - Activity logging untuk destinasi
- **eventRoutes.js** - Activity logging untuk event
- **authController.js** - Logging untuk login/logout

### 5. Database Migration

- **File**: `src/migrations/20250106000001-create-activity-log.js`
- Membuat tabel `activity_logs` dengan struktur yang sesuai

### 6. Data Seeder

- **File**: `src/seeders/20250106000001-demo-activity-logs.js`
- Data dummy untuk testing sistem

## Cara Penggunaan

### 1. Menjalankan Migration

```bash
cd "d:\PROJECT\Magetan Tourism\Backend"
npx sequelize-cli db:migrate
```

### 2. Menjalankan Seeder (Opsional)

```bash
npx sequelize-cli db:seed --seed 20250106000001-demo-activity-logs.js
```

### 3. Menambahkan Activity Logging ke Routes Baru

```javascript
const {
  activityLogger,
  saveOriginalData,
} = require("../middleware/activityLoggerMiddleware");
const { ModelName } = require("../models");

// Untuk CREATE
router.post(
  "/",
  authMiddleware,
  activityLogger("create", "nama_entity"),
  Controller.createMethod
);

// Untuk UPDATE
router.put(
  "/:id",
  authMiddleware,
  saveOriginalData(ModelName),
  activityLogger("update", "nama_entity"),
  Controller.updateMethod
);

// Untuk DELETE
router.delete(
  "/:id",
  authMiddleware,
  saveOriginalData(ModelName),
  activityLogger("delete", "nama_entity"),
  Controller.deleteMethod
);
```

## API Endpoints

### Dashboard Summary

```
GET /api/dashboard/summary
Response: {
  "success": true,
  "totals": {
    "berita": 10,
    "destinasi": 5,
    "event": 3,
    "umkm": 8,
    "sejarah": 2,
    "media": 15
  }
}
```

### Recent Activity

```
GET /api/dashboard/activity?limit=10&page=1
Response: {
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

### Activity Stats

```
GET /api/dashboard/activity-stats?period=7d
Response: {
  "success": true,
  "period": "7d",
  "stats": [...]
}
```

## Frontend Integration

Frontend sudah siap untuk mengonsumsi API ini. File yang sudah dikonfigurasi:

- `AdminDashboard.vue` - Menampilkan statistik dan aktivitas
- `DashboardCard.vue` - Komponen kartu statistik

## Routes yang Perlu Ditambahkan Activity Logging

Untuk melengkapi sistem, tambahkan activity logging ke routes berikut:

- umkmRoutes.js
- mediaGaleriRoutes.js
- pengumumanRoutes.js
- strukturAnggotaRoutes.js
- visiMisiRoutes.js
- budayaRoutes.js
- akomodasiRoutes.js
- kategoriBeritaRoutes.js
- kategoriDestinasiRoutes.js
- kategoriUmkmRoutes.js
- kategoriPpidRoutes.js
- kontenPpidRoutes.js

## Testing

1. Login sebagai admin
2. Lakukan aktivitas CRUD pada berita, destinasi, atau event
3. Akses dashboard admin untuk melihat aktivitas tercatat
4. Verifikasi data di tabel `activity_logs`

## Error Handling

Sistem ini dirancang untuk tidak mengganggu operasi utama jika terjadi error dalam logging. Error akan dicatat di console tetapi tidak akan menghentikan proses utama.

## Security

- Semua endpoints dashboard memerlukan autentikasi
- IP address dan user agent dicatat untuk audit trail
- Data sensitif dalam `oldData` dan `newData` dapat dikonfigurasi sesuai kebutuhan
