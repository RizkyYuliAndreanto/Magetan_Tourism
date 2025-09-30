# Tourism Backend - Enhanced Features Documentation

## 🚀 Fitur Baru yang Telah Ditambahkan

### 1. Sistem Interaksi Konten (Like, Comment, Share)

#### **Fitur Like**

- Toggle like/unlike untuk semua jenis konten (berita, event, destinasi, umkm, sejarah)
- Tracking jumlah like per konten
- Check status like user per konten

#### **Fitur Comment**

- Tambah komentar dengan moderasi (pending -> disetujui/ditolak)
- Lihat komentar yang sudah disetujui
- Admin dapat mengelola status komentar
- Hapus komentar (admin only)

#### **Fitur Share**

- Logging share ke berbagai platform (Facebook, WhatsApp, Twitter, dll)
- Statistik share per platform
- Total count share per konten

### 2. File Management System

#### **Auto Compression**

- Kompresi otomatis gambar > 10MB menjadi JPEG quality 70%
- Rules berbeda per field upload
- Middleware kompresi otomatis
- Support resize dan thumbnail generation

#### **File Deletion**

- Hapus file fisik saat update konten (file lama)
- Hapus semua file terkait saat delete konten
- Cleanup file yang tidak terpakai
- Support multiple file deletion

### 3. Enhanced Services

#### **InteractionService**

```javascript
// Like/Unlike content
InteractionService.toggleLike(userId, tipeKonten, idKonten);

// Add comment
InteractionService.addComment(commentData);

// Get all interactions for content
InteractionService.getContentInteractions(tipeKonten, idKonten, userId);

// Delete all interactions (untuk cleanup saat delete content)
InteractionService.deleteAllInteractionsByContent(tipeKonten, idKonten);
```

#### **FileHelper**

```javascript
// Delete single file
FileHelper.deleteFile(filePath);

// Delete multiple files
FileHelper.deleteMultipleFiles(filePaths);

// Get file info
FileHelper.getFileInfo(filePath);

// Cleanup unused files in folder
FileHelper.cleanupFolder(folderPath, usedFiles);
```

#### **CompressionHelper**

```javascript
// Compress single image
CompressionHelper.compressImage(file, maxSize, quality);

// Compress multiple images
CompressionHelper.compressImages(files, maxSize, quality);

// Compress by field rules
CompressionHelper.compressFilesByField(reqFiles, rules);

// Resize image
CompressionHelper.resizeImage(file, width, height, options);

// Generate thumbnail
CompressionHelper.generateThumbnail(file, size);
```

## 📁 Struktur File Baru

```
src/
├── controllers/
│   └── interactionController.js      # Controller untuk like, comment, share
├── services/
│   └── interactionService.js        # Service untuk interactions
├── routes/
│   └── interactionRoutes.js         # Routes untuk interactions
├── middleware/
│   └── compressionMiddleware.js     # Middleware kompresi otomatis
└── utils/
    ├── fileHelper.js               # Helper untuk file operations
    └── compressionHelper.js        # Helper untuk kompresi gambar
```

## 🔗 API Endpoints Baru

### Interactions API

```
POST   /api/interactions/:tipeKonten/:idKonten/like
GET    /api/interactions/:tipeKonten/:idKonten/like-count
POST   /api/interactions/:tipeKonten/:idKonten/comment
GET    /api/interactions/:tipeKonten/:idKonten/comments
PUT    /api/interactions/comment/:commentId/status
DELETE /api/interactions/comment/:commentId
POST   /api/interactions/:tipeKonten/:idKonten/share
GET    /api/interactions/:tipeKonten/:idKonten/share-stats
GET    /api/interactions/:tipeKonten/:idKonten/interactions
```

### Enhanced Content APIs

Content APIs sekarang mengembalikan data dengan interactions:

```javascript
// GET /api/berita/:id
{
  "id_berita": 1,
  "judul": "Judul Berita",
  "isi_berita": "...",
  "interactions": {
    "likes": 15,
    "shares": 5,
    "comments": [...],
    "commentCount": 3,
    "userLiked": true
  }
}
```

## 🛠️ Cara Penggunaan

### 1. Like/Unlike Content

```javascript
// Frontend request
fetch("/api/interactions/berita/1/like", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId: 123 }),
});
```

### 2. Add Comment

```javascript
fetch("/api/interactions/berita/1/comment", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: 123,
    namaKomentator: "John Doe",
    emailKomentator: "john@example.com",
    isiKomentar: "Great article!",
  }),
});
```

### 3. Share Content

```javascript
fetch("/api/interactions/berita/1/share", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    userId: 123,
    platformShare: "Facebook",
  }),
});
```

### 4. Upload dengan Kompresi Otomatis

File gambar akan otomatis dikompresi jika melebihi 10MB:

```javascript
// Multer + compression middleware akan handle otomatis
// Tidak perlu perubahan di frontend
```

## 📊 Database Changes

Model yang sudah ada (Like, Komentar, Share_Log) sudah mendukung:

- Polymorphic relations dengan semua content types
- Proper indexing untuk performa
- Soft delete support (jika diperlukan)

## 🔧 Configuration

### Compression Rules

```javascript
// Dapat dikustomisasi per field
const compressionRules = {
  gambar_hero_berita: { maxSize: 10 * 1024 * 1024, quality: 70 },
  foto_anggota: { maxSize: 2 * 1024 * 1024, quality: 80 },
  // dst...
};
```

### File Size Limits

- Gambar: 10MB (dengan auto compression)
- PDF: 50MB
- Video: 50MB

## ⚡ Performance Improvements

1. **File Management**: Tidak ada file yang menumpuk di server
2. **Auto Compression**: Menghemat storage dan bandwidth
3. **Efficient Queries**: Optimized database queries untuk interactions
4. **Caching Ready**: Structure siap untuk implementasi caching

## 🚨 Breaking Changes

### Services Updated

- `BeritaService.getBeritaById()` sekarang memiliki parameter `userId` optional
- `BeritaService` dan `EventService` sekarang otomatis menghapus file dan interactions
- Semua service delete sekarang melakukan cleanup lengkap

### Controllers Updated

- Upload handlers sekarang menggunakan compression middleware
- Response format untuk content detail sekarang include interactions

## 🔮 Future Enhancements

1. **Notification System**: Notif untuk like, comment baru
2. **Content Analytics**: Dashboard analytics untuk admin
3. **Advanced Compression**: Support untuk video compression
4. **CDN Integration**: Upload langsung ke cloud storage
5. **Search Enhancement**: Search dengan popularity score dari interactions

## 📝 Notes

- Semua file interaction bisa diakses tanpa auth untuk public content
- Comment moderation default ke "pending"
- File compression berjalan di background, tidak blocking request
- Cleanup file berjalan otomatis saat delete content
