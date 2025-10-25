# 🎯 SOLUSI LENGKAP: Update Berita dengan Media Galeri

## 📋 Ringkasan Masalah yang Telah Diperbaiki

### ❌ Masalah Sebelumnya:

1. **Race Condition**: Frontend mengirim 4 request terpisah (update berita → update media → delete media → create media)
2. **Error "Media Not Found"**: Terjadi karena operasi tidak terkoordinasi
3. **Penghapusan Massal**: Batch delete menghapus semua media, bukan yang dipilih
4. **Tidak Ada Rollback**: Jika satu operasi gagal, operasi lain tetap dijalankan
5. **Inkonsistensi Data**: Data bisa corrupt jika salah satu operasi gagal

### ✅ Solusi yang Diimplementasikan:

1. **Endpoint Atomic**: Satu endpoint menangani semua operasi dalam transaksi
2. **Transaksi Database**: Semua operasi di-rollback jika ada yang gagal
3. **Clear Intent**: Frontend mendeklarasikan operasi yang diinginkan
4. **Validation**: Validasi ID media sebelum operasi
5. **Logging**: Debug logging untuk troubleshooting

## 🚀 Implementasi Backend

### 1. Service Layer: `beritaService.js`

```javascript
// Method baru: updateBeritaWithMedia()
static async updateBeritaWithMedia(
  id,
  beritaData,
  mediaOperations,
  newMediaFiles,
  idAdminRequester,
  levelAksesRequester
)
```

**Fitur:**

- ✅ Database transaction untuk atomicity
- ✅ Validasi permission dan media ID
- ✅ Update berita data
- ✅ Media operations: keep, update, delete, create
- ✅ File cleanup untuk deleted media
- ✅ Comprehensive error handling
- ✅ Detailed logging

### 2. Controller Layer: `beritaController.js`

```javascript
// Endpoint baru: updateBeritaWithMedia()
PUT /api/berita/:id/with-media
```

**Fitur:**

- ✅ Multipart form handling
- ✅ Image compression untuk hero image
- ✅ Parse media operations dari JSON
- ✅ Error handling dengan status codes
- ✅ Response dengan media statistics

### 3. Routes: `beritaRoutes.js`

```javascript
router.put("/:id/with-media", /* middlewares */, BeritaController.updateBeritaWithMedia);
```

## 🎨 Frontend Helper

### File: `beritaMediaHelper.js`

**Class `BeritaMediaHelper` menyediakan:**

1. **`prepareUpdateData()`** - Format data untuk backend
2. **`updateBeritaWithMedia()`** - Call endpoint baru
3. **`trackMediaChanges()`** - Track perubahan media existing
4. **`markAsChanged()`** - Mark media yang berubah

## 📡 Format Data Request

### Request Body:

```javascript
{
  // Data berita normal
  "judul": "Berita Update",
  "isi_berita": "Content...",

  // Media operations dalam JSON string
  "media_operations": {
    "keep": [1, 3, 5],           // ID media yang dipertahankan
    "update": [                  // Media yang diupdate deskripsi/urutan
      { "id": 1, "deskripsi_file": "New desc", "urutan_tampil": 1 },
      { "id": 3, "deskripsi_file": "Another desc", "urutan_tampil": 2 }
    ],
    "delete": [2, 4],            // ID media yang dihapus
  },

  // File baru
  "media_galeri_files": [File, File],  // Array file objects
  "media_deskripsi_0": "Desc for first new file",
  "media_urutan_0": "3",
  "media_deskripsi_1": "Desc for second new file",
  "media_urutan_1": "4"
}
```

### Response:

```javascript
{
  "success": true,
  "message": "Berita and media updated successfully",
  "berita": { /* berita object with updated media */ },
  "media_stats": {
    "kept": 2,
    "updated": 2,
    "deleted": 2,
    "created": 2
  }
}
```

## 🔧 Cara Menggunakan

### 1. Import Helper di Frontend:

```javascript
import { BeritaMediaHelper } from "@/utils/beritaMediaHelper";
```

### 2. Update Method Handler:

```javascript
const handleUpdateBerita = async (
  beritaData,
  newGalleryFiles,
  deletedGalleryIds
) => {
  try {
    const token = localStorage.getItem("access_token");

    // Prepare data menggunakan helper
    const formData = BeritaMediaHelper.prepareUpdateData(
      beritaData,
      initialGalleryFiles.value, // Media existing yang sudah di-track
      newGalleryFiles, // Media baru
      deletedGalleryIds // ID media yang dihapus
    );

    // Update dengan endpoint atomic
    const result = await BeritaMediaHelper.updateBeritaWithMedia(
      beritaData.id_berita,
      formData,
      token
    );

    console.log("✅ Update completed:", result.media_stats);
  } catch (error) {
    console.error("❌ Update failed:", error);
  }
};
```

### 3. Track Changes untuk Media Existing:

```javascript
onMounted(() => {
  if (props.isEditing && beritaData.galeriBerita) {
    initialGalleryFiles.value = BeritaMediaHelper.trackMediaChanges(
      beritaData.galeriBerita
    );
  }
});
```

## 🛡️ Keamanan & Validasi

### Backend Validations:

- ✅ **Permission Check**: Admin hanya bisa edit berita sendiri
- ✅ **Media ID Validation**: Semua ID media divalidasi sebelum operasi
- ✅ **File Type Validation**: Hanya gambar/video yang diizinkan
- ✅ **Transaction Rollback**: Auto rollback jika ada error

### Error Handling:

- ✅ **404**: Berita tidak ditemukan
- ✅ **404**: Media tidak ditemukan dengan ID tertentu
- ✅ **403**: Permission denied
- ✅ **400**: Invalid data format
- ✅ **500**: Server error dengan detail logging

## 📊 Monitoring & Debugging

### Logging Output:

```
=== UPDATE BERITA WITH MEDIA START ===
ID Berita: 1
Media Operations: { keep: [1,3], update: [{...}], delete: [2,4] }
New Media Files: 2 files
Existing media count: 5
Keep IDs: [1, 3]
Delete IDs: [2, 4]
Deleted 2 media items
Updated 1 media items
Created 2 new media items
Transaction committed successfully
=== UPDATE BERITA WITH MEDIA END ===
```

## 🎁 Keuntungan Solusi Ini

1. **🔒 Atomicity**: Semua operasi dalam satu transaksi
2. **🔄 Consistency**: Data tetap konsisten meski ada error
3. **⚡ Performance**: Lebih cepat dengan 1 request vs 4 request
4. **🛡️ Safety**: Auto rollback mencegah data corrupt
5. **🎯 Clarity**: Intent jelas dari frontend
6. **🔍 Debugging**: Comprehensive logging
7. **📈 Scalability**: Mudah ditambah fitur baru

## 🚦 Testing

### Test Cases:

1. ✅ Update berita saja (tanpa media operations)
2. ✅ Update + hapus beberapa media
3. ✅ Update + tambah media baru
4. ✅ Update + kombinasi semua operasi
5. ✅ Error handling: media ID tidak valid
6. ✅ Error handling: permission denied
7. ✅ Rollback test: simulasi error di tengah transaksi

Solusi ini mengatasi semua masalah yang Anda alami dengan pendekatan yang aman, atomic, dan mudah di-maintain! 🎉
