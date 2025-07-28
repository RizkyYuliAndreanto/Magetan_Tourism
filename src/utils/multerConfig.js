// src/utils/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const configureMulter = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadFolder = "";
      // Tentukan folder berdasarkan nama field
      if (file.fieldname === "brosur_event") {
        uploadFolder = "event/brosur";
      } else if (file.fieldname === "gambar_event") {
        uploadFolder = "event/gambar-event";
      } else if (file.fieldname === "gambar_sejarah") {
        uploadFolder = "sejarah/gambar";
      } else if (file.fieldname === "gambar_produk_utama") {
        uploadFolder = "umkm/gambar-produk";
      } else if (file.fieldname === "gambar_utama") {
        // Untuk destinasi
        uploadFolder = "destinasi/gambar-utama";
      } else if (file.fieldname === "gambar_hero_berita") {
        // Untuk berita
        uploadFolder = "berita/gambar-hero";
      } else if (file.fieldname === "media_galeri_file") {
        uploadFolder = "galeri";
      } else if (file.fieldname === "foto_anggota") {
        // BARU: Logika untuk foto_anggota
        uploadFolder = "struktur-anggota/foto"; // Folder untuk foto anggota
      } else {
        return cb(new Error("Unexpected field name for file upload!"), false);
      }

      const uploadDir = path.join(
        __dirname,
        "..",
        "..",
        "uploads",
        uploadFolder
      );

      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      cb(
        null,
        file.fieldname + "-" + Date.now() + path.extname(file.originalname)
      );
    },
  });

  const fileFilter = (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/bmp",
      "image/tiff",
      "image/jpg",
      "application/pdf",
      "video/mp4", // Ditambahkan untuk video
      "video/webm", // Ditambahkan untuk video
      "video/ogg", // Ditambahkan untuk video (jika diperlukan)
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Jenis file tidak didukung! Hanya gambar JPEG, PNG, GIF, WEBP, SVG, BMP, TIFF, JPG, PDF, dan video MP4/WEBM/OGG yang diizinkan."
        ),
        false
      );
    }
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 1024 * 1024 * 20, // Batasi ukuran file hingga 20MB (contoh, tingkatkan jika perlu untuk video)
    },
  });
};

module.exports = configureMulter;
