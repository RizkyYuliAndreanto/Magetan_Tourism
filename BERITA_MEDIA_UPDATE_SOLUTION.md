# 🛠️ SOLUSI UPDATE BERITA DENGAN MEDIA GALERI

## 🧩 Masalah yang Diidentifikasi:

1. **Race Condition**: Frontend mengirim 4 request terpisah tanpa transaksi
2. **Error "Media Not Found"**: Karena operasi tidak terkoordinasi
3. **Penghapusan Massal**: Logic batch delete tidak tepat
4. **Tidak Ada Rollback**: Jika satu operasi gagal, yang lain tetap dijalankan

## 🎯 Solusi: Endpoint Terpadu dengan Transaksi

### 1. Endpoint Baru: `PUT /api/berita/:id/with-media`

Endpoint ini akan menangani:

- Update data berita
- Synchronize media galeri (hapus, update, tambah) dalam satu transaksi

### 2. Format Data dari Frontend:

```javascript
{
  // Data berita
  "judul": "Berita Update",
  "isi_berita": "Content...",

  // Media galeri operations
  "media_operations": {
    "keep": [1, 3, 5], // ID media yang dipertahankan
    "update": [
      { "id": 1, "deskripsi_file": "New desc", "urutan_tampil": 1 },
      { "id": 3, "deskripsi_file": "Another desc", "urutan_tampil": 2 }
    ],
    "delete": [2, 4], // ID media yang dihapus
    "create": [
      { "file": File, "deskripsi_file": "New media", "urutan_tampil": 3 }
    ]
  }
}
```

### 3. Implementasi Backend dengan Transaksi

Akan dibuat di:

- `src/services/beritaService.js` → `updateBeritaWithMedia()`
- `src/controllers/beritaController.js` → `updateBeritaWithMedia()`
- `src/routes/beritaRoutes.js` → Route baru

### 4. Keuntungan Solusi Ini:

✅ **Atomicity**: Semua operasi dalam satu transaksi
✅ **Consistency**: Data tetap konsisten jika ada error
✅ **No Race Condition**: Operasi berurutan dalam transaksi
✅ **Clear Intent**: Frontend mendeklarasikan apa yang diinginkan
✅ **Rollback Safety**: Jika gagal, semua di-rollback

## 🚀 Implementasi Selanjutnya

1. Buat service method baru
2. Buat controller method baru
3. Tambah route baru
4. Update frontend untuk menggunakan endpoint baru
