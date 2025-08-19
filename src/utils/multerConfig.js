// src/utils/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const configureMulter = () => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let uploadFolder = "";
      if (file.fieldname === "brosur_event") {
        uploadFolder = "event/brosur";
      } else if (file.fieldname === "gambar_event") {
        uploadFolder = "event/gambar-event";
      } else if (file.fieldname === "gambar_sejarah") {
        uploadFolder = "sejarah/gambar";
      } else if (file.fieldname === "gambar_produk_utama") {
        uploadFolder = "umkm/gambar-produk";
      } else if (file.fieldname === "gambar_utama") {
        uploadFolder = "destinasi/gambar-utama";
      } else if (file.fieldname === "gambar_hero_berita") {
        uploadFolder = "berita/gambar-hero";
      } else if (
        file.fieldname === "media_galeri_file" ||
        file.fieldname === "media_galeri_files"
      ) {
        uploadFolder = "galeri";
      } else if (file.fieldname === "foto_anggota") {
        uploadFolder = "struktur-anggota/foto";
      } else if (file.fieldname === "file_pdf_pengumuman") {
        uploadFolder = "pengumuman/pdf";
      } else if (file.fieldname === "gambar_utama_hotel") {
        uploadFolder = "akomodasi/gambar-utama";
      } else if (file.fieldname === "sampul_pengumuman") {
        uploadFolder = "pengumuman/sampul";
      } else if (file.fieldname === "file_pdf_ppid") {
        uploadFolder = "ppid/pdf";
      } else if (file.fieldname === "gambar_ppid_galeri") {
        uploadFolder = "ppid/galeri";
      } else if (file.fieldname === "visi_misi_file") {
        uploadFolder = "visi-misi";
      } else if (file.fieldname === "gambar_struktur_organisasi") {
        uploadFolder = "struktur-organisasi";
      } else if (file.fieldname === "gambar_sampul_ppid") {
        uploadFolder = "ppid/sampul";
      } else if (file.fieldname === "gambar_sampul") {
        uploadFolder = "umkm/gambar-sampul";
      } else if (file.fieldname === "gambar_sampul_kategori_umkm") {
        uploadFolder = "umkm/kategori-sampul";
      } else if (file.fieldname === "gambar_sampul_kategori_budaya") {
        uploadFolder = "budaya/kategori-sampul";
      } else if (file.fieldname === "gambar_budaya") {
        uploadFolder = "budaya/gambar";
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
      "video/mp4",
      "video/webm",
      "video/ogg",
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
      fileSize: 1024 * 1024 * 50,
    },
  });
};

module.exports = configureMulter;
