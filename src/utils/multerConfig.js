// src/utils/multerConfig.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const configureMulter = () => {
  // Peta dari nama field ke folder upload
  const uploadFolders = {
    gambar_akomodasi: "akomodasi/gambar-utama",
    brosur_event: "event/brosur",
    gambar_event: "event/gambar-event",
    gambar_sejarah: "sejarah/gambar",
    gambar_produk_utama: "umkm/gambar-produk",
    gambar_utama: "destinasi/gambar-utama",
    gambar_hero_berita: "berita/gambar-hero",
    media_galeri_file: "galeri",
    media_galeri_files: "galeri",
    foto_anggota: "struktur-anggota/foto",
    file_pdf_pengumuman: "pengumuman/pdf",
    gambar_utama_hotel: "akomodasi/gambar-utama",
    sampul_pengumuman: "pengumuman/sampul",
    file_pdf_ppid: "ppid/pdf",
    gambar_ppid_galeri: "ppid/galeri",
    visi_misi_file: "visi-misi",
    gambar_struktur_organisasi: "struktur-organisasi",
    gambar_sampul_ppid: "ppid/sampul",
    gambar_sampul: "umkm/gambar-sampul",
    gambar_sampul_kategori_umkm: "umkm/kategori-sampul",
    gambar_sampul_kategori_budaya: "budaya/kategori-sampul",
    gambar_budaya: "budaya/gambar",
    // Tambahkan entri baru untuk sampul_kategori_destinasi
    sampul_kategori: "destinasi/kategori-sampul",
  };

  // Custom file size limit per mimetype
  const MAX_IMAGE_SIZE = 1024 * 1024 * 10; // 10 MB
  const MAX_PDF_VIDEO_SIZE = 1024 * 1024 * 50; // 50 MB

  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      const uploadFolder = uploadFolders[file.fieldname];
      if (!uploadFolder) {
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
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
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
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(
        new Error(
          "Jenis file tidak didukung! Hanya gambar JPEG, PNG, GIF, WEBP, SVG, BMP, TIFF, JPG, PDF, dan video MP4/WEBM/OGG yang diizinkan."
        ),
        false
      );
    }
    // Check file size based on mimetype
    if (file.mimetype.startsWith("image/")) {
      if (file.size > MAX_IMAGE_SIZE) {
        return cb(new Error("Ukuran gambar maksimal 10 MB!"), false);
      }
    } else if (
      file.mimetype === "application/pdf" ||
      file.mimetype.startsWith("video/")
    ) {
      if (file.size > MAX_PDF_VIDEO_SIZE) {
        return cb(new Error("Ukuran file PDF/video maksimal 50 MB!"), false);
      }
    }
    cb(null, true);
  };

  // Note: Kompresi file (gambar/pdf/video) dilakukan setelah upload, di controller, menggunakan library seperti sharp (gambar), pdf-lib (pdf), atau ffmpeg (video).

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    // Set limit besar, validasi dilakukan di fileFilter
    limits: {
      fileSize: MAX_PDF_VIDEO_SIZE,
    },
  });
};

module.exports = configureMulter;
