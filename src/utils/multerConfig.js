// src/config/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs"); // Tambahkan modul fs untuk menangani pembuatan direktori

// Fungsi untuk mengonfigurasi Multer secara dinamis
// Fungsi ini akan diekspor dan dipanggil di file rute (misal: destinasiRoutes.js)
const configureMulter = (folderName) => {
  // Tentukan path absolut untuk folder unggahan
  // path.join(__dirname, '..', '..', 'uploads', folderName)
  // akan menghasilkan path seperti: <direktori_proyek_anda>/uploads/nama_folder
  const uploadDir = path.join(__dirname, "..", "..", "uploads", folderName);

  // Pastikan direktori unggahan ada. Jika tidak, buatlah.
  // { recursive: true } akan membuat folder induk jika belum ada
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // cb(null, "uploads/"); // Ganti ini
      cb(null, uploadDir); // Gunakan path dinamis yang sudah ditentukan
    },
    filename: (req, file, cb) => {
      // Tentukan nama file yang akan disimpan
      // Contoh: 'fieldname-timestamp.ext'
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  // Filter untuk jenis file yang diizinkan
  const fileFilter = (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff",
      "image/jpg", // Meskipun ini bukan mimetype resmi, sering digunakan
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // Terima file
    } else {
      cb(
        new Error(
          "Jenis file tidak didukung! Hanya gambar JPEG, PNG, GIF, WEBP, SVG, BMP, TIFF, JPG yang diizinkan."
        ),
        false
      ); // Tolak file
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 5, // Batasi ukuran file hingga 5MB
    },
  });
};

module.exports = configureMulter;
