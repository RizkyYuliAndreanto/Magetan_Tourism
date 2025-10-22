#!/usr/bin/env node

/**
 * Script untuk menambahkan activity logging ke semua routes
 * Jalankan dengan: node add-activity-logging.js
 */

const fs = require("fs");
const path = require("path");

const routesDir = path.join(__dirname, "src", "routes");

// Daftar routes yang akan diperbarui
const routesToUpdate = [
  { file: "umkmRoutes.js", entity: "umkm", model: "Umkm" },
  { file: "mediaGaleriRoutes.js", entity: "media", model: "MediaGaleri" },
  { file: "pengumumanRoutes.js", entity: "pengumuman", model: "Pengumuman" },
  {
    file: "strukturAnggotaRoutes.js",
    entity: "struktur-anggota",
    model: "StrukturAnggota",
  },
  { file: "visiMisiRoutes.js", entity: "visi-misi", model: "VisiMisi" },
  { file: "budayaRoutes.js", entity: "budaya", model: "Budaya" },
  { file: "akomodasiRoutes.js", entity: "akomodasi", model: "Akomodasi" },
  {
    file: "kategoriBeritaRoutes.js",
    entity: "kategori-berita",
    model: "KategoriBerita",
  },
  {
    file: "kategoriDestinasiRoutes.js",
    entity: "kategori-destinasi",
    model: "KategoriDestinasi",
  },
  {
    file: "kategoriUmkmRoutes.js",
    entity: "kategori-umkm",
    model: "KategoriUmkm",
  },
  {
    file: "kategoriPpidRoutes.js",
    entity: "kategori-ppid",
    model: "KategoriPpid",
  },
  { file: "kontenPpidRoutes.js", entity: "konten-ppid", model: "KontenPpid" },
];

function addActivityLoggingToRoute(filePath, entity, model) {
  try {
    let content = fs.readFileSync(filePath, "utf8");

    // Cek apakah sudah ada activity logging
    if (content.includes("activityLogger")) {
      console.log(`${path.basename(filePath)} sudah memiliki activity logging`);
      return;
    }

    // Tambahkan import untuk activity logging
    const importPattern =
      /const compressionMiddleware = require\("\.\.\/middleware\/compressionMiddleware"\);/;
    const activityLoggerImport = `const compressionMiddleware = require("../middleware/compressionMiddleware");
const { activityLogger, saveOriginalData } = require("../middleware/activityLoggerMiddleware");
const { ${model} } = require("../models");`;

    if (importPattern.test(content)) {
      content = content.replace(importPattern, activityLoggerImport);
    } else {
      // Jika tidak ada compressionMiddleware, tambahkan setelah authorize import
      const authorizePattern =
        /const authorize = require\("\.\.\/middleware\/authorizeMiddleware"\);/;
      const activityLoggerImportAlt = `const authorize = require("../middleware/authorizeMiddleware");
const { activityLogger, saveOriginalData } = require("../middleware/activityLoggerMiddleware");
const { ${model} } = require("../models");`;

      if (authorizePattern.test(content)) {
        content = content.replace(authorizePattern, activityLoggerImportAlt);
      }
    }

    // Tambahkan activity logging ke POST routes
    content = content.replace(
      /(router\.post\(\s*"\/",\s*[\s\S]*?),(\s*\w+Controller\.\w+)/g,
      `$1,
  activityLogger("create", "${entity}"),$2`
    );

    // Tambahkan activity logging ke PUT routes
    content = content.replace(
      /(router\.put\(\s*"\/:([\w]+)",\s*[\s\S]*?),(\s*\w+Controller\.\w+)/g,
      `$1,
  saveOriginalData(${model}),
  activityLogger("update", "${entity}"),$3`
    );

    // Tambahkan activity logging ke DELETE routes
    content = content.replace(
      /(router\.delete\(\s*"\/:([\w]+)",\s*[\s\S]*?),(\s*\w+Controller\.\w+)/g,
      `$1,
  saveOriginalData(${model}),
  activityLogger("delete", "${entity}"),$3`
    );

    // Tulis file yang sudah diperbarui
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`✅ ${path.basename(filePath)} berhasil diperbarui`);
  } catch (error) {
    console.error(
      `❌ Error memperbarui ${path.basename(filePath)}:`,
      error.message
    );
  }
}

// Jalankan script
console.log("🚀 Memulai penambahan activity logging ke semua routes...\n");

routesToUpdate.forEach(({ file, entity, model }) => {
  const filePath = path.join(routesDir, file);

  if (fs.existsSync(filePath)) {
    addActivityLoggingToRoute(filePath, entity, model);
  } else {
    console.log(`⚠️  File ${file} tidak ditemukan`);
  }
});

console.log(
  "\n✨ Selesai! Periksa file routes untuk memastikan semua perubahan sesuai."
);
