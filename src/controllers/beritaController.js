// src/controllers/beritaController.js
const BeritaService = require("../services/beritaService");
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

class BeritaController {
  // Ambil semua berita
  static async getAllBerita(req, res) {
    try {
      const berita = await BeritaService.getAllBerita();
      res.status(200).json(berita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Ambil berita berdasarkan ID dengan interactions
  static async getBeritaById(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user?.id || req.query.userId;

      const berita = await BeritaService.getBeritaWithInteractions(id, userId);
      if (!berita) {
        return res.status(404).json({ message: "Berita not found" });
      }
      res.status(200).json(berita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // Buat berita baru
  static async createBerita(req, res) {
    const { judul, isi_berita, tanggal_publikasi, id_kategori } = req.body;
    const id_admin = req.user.id;

    let gambar_hero_berita = null;

    // Kompresi gambar jika diperlukan
    if (
      req.files &&
      req.files["gambar_hero_berita"] &&
      req.files["gambar_hero_berita"][0]
    ) {
      const file = req.files["gambar_hero_berita"][0];
      const MAX_IMAGE_SIZE = 1024 * 1024 * 10; // 10 MB

      // Kompresi gambar jika size > 10MB
      if (file.size > MAX_IMAGE_SIZE) {
        const inputPath = file.path;
        const ext = path.extname(file.originalname);
        const outputPath = inputPath.replace(ext, `-compressed.jpg`);

        try {
          await sharp(inputPath).jpeg({ quality: 70 }).toFile(outputPath);

          // Hapus file asli, ganti dengan file yang dikompresi
          fs.unlinkSync(inputPath);
          file.path = outputPath;
          file.filename = path.basename(outputPath);
        } catch (err) {
          console.log("Gagal kompresi gambar:", err.message);
        }
      }

      gambar_hero_berita = `/uploads/berita/gambar-hero/${file.filename}`;
    }

    try {
      const newBerita = await BeritaService.createBerita(
        {
          judul,

          isi_berita,

          tanggal_publikasi,
          gambar_hero_berita,
          id_kategori,
          id_admin,
        },
        req.user.level_akses
      );
      res
        .status(201)
        .json({ message: "Berita created successfully", berita: newBerita });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: error.message });
      }
      if (
        error.message.includes("Jenis file tidak didukung") ||
        error.message.includes("Unexpected field name")
      ) {
        return res.status(400).json({ error: error.message });
      }
      // KOREKSI UTAMA: Ubah status code dari 400 menjadi 404
      if (error.message.includes("tidak ditemukan")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // Perbarui berita
  static async updateBerita(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    // Handle file upload dengan kompresi
    if (
      req.files &&
      req.files["gambar_hero_berita"] &&
      req.files["gambar_hero_berita"][0]
    ) {
      const file = req.files["gambar_hero_berita"][0];
      const MAX_IMAGE_SIZE = 1024 * 1024 * 10; // 10 MB

      // Kompresi gambar jika size > 10MB
      if (file.size > MAX_IMAGE_SIZE) {
        const inputPath = file.path;
        const ext = path.extname(file.originalname);
        const outputPath = inputPath.replace(ext, `-compressed.jpg`);

        try {
          await sharp(inputPath).jpeg({ quality: 70 }).toFile(outputPath);

          // Hapus file asli, ganti dengan file yang dikompresi
          fs.unlinkSync(inputPath);
          file.path = outputPath;
          file.filename = path.basename(outputPath);
        } catch (err) {
          console.log("Gagal kompresi gambar:", err.message);
        }
      }

      updateData.gambar_hero_berita = `/uploads/berita/gambar-hero/${file.filename}`;
    }

    try {
      const updatedBerita = await BeritaService.updateBerita(
        id,
        updateData,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({
        message: "Berita updated successfully",
        berita: updatedBerita,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Berita not found") {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message.includes("Jenis file tidak didukung") ||
        error.message.includes("Unexpected field name")
      ) {
        return res.status(400).json({ error: error.message });
      }
      // KOREKSI LOGIKA: Tangkap error dari service dengan pesan yang lebih spesifik
      if (error.message.includes("tidak ditemukan")) {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // Hapus berita
  static async deleteBerita(req, res) {
    const { id } = req.params;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    try {
      await BeritaService.deleteBerita(
        id,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({ message: "Berita deleted successfully" });
    } catch (error) {
      if (error.message === "Berita not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // Update berita dengan media galeri secara atomic
  static async updateBeritaWithMedia(req, res) {
    const { id } = req.params;
    const beritaData = req.body;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    try {
      console.log("=== UPDATE BERITA WITH MEDIA CONTROLLER ===");
      console.log("Request body keys:", Object.keys(req.body));
      console.log(
        "Request files:",
        req.files ? Object.keys(req.files) : "No files"
      );

      // Handle gambar hero berita upload dengan kompresi
      if (
        req.files &&
        req.files["gambar_hero_berita"] &&
        req.files["gambar_hero_berita"][0]
      ) {
        const file = req.files["gambar_hero_berita"][0];
        const MAX_IMAGE_SIZE = 1024 * 1024 * 10; // 10 MB

        // Kompresi gambar jika size > 10MB
        if (file.size > MAX_IMAGE_SIZE) {
          const inputPath = file.path;
          const ext = path.extname(file.originalname);
          const outputPath = inputPath.replace(ext, `-compressed.jpg`);

          try {
            await sharp(inputPath).jpeg({ quality: 70 }).toFile(outputPath);
            fs.unlinkSync(inputPath);
            file.path = outputPath;
            file.filename = path.basename(outputPath);
          } catch (err) {
            console.log("Gagal kompresi gambar:", err.message);
          }
        }

        beritaData.gambar_hero_berita = `/uploads/berita/gambar-hero/${file.filename}`;
      }

      // Parse media operations dari request body
      let mediaOperations = null;
      if (beritaData.media_operations) {
        try {
          mediaOperations =
            typeof beritaData.media_operations === "string"
              ? JSON.parse(beritaData.media_operations)
              : beritaData.media_operations;
        } catch (parseError) {
          return res.status(400).json({
            error: "Invalid media_operations format: " + parseError.message,
          });
        }
      }

      // Handle new media files
      let newMediaFiles = [];
      if (req.files && req.files["media_galeri_files"]) {
        newMediaFiles = req.files["media_galeri_files"].map((file, index) => ({
          ...file,
          deskripsi_file: beritaData[`media_deskripsi_${index}`] || "",
          urutan_tampil:
            parseInt(beritaData[`media_urutan_${index}`]) || 100 + index,
        }));
      }

      // Remove media operation data from berita data
      delete beritaData.media_operations;
      Object.keys(beritaData).forEach((key) => {
        if (
          key.startsWith("media_deskripsi_") ||
          key.startsWith("media_urutan_")
        ) {
          delete beritaData[key];
        }
      });

      console.log("=== MEDIA OPERATIONS DEBUG ===");
      console.log("🔍 [Controller] Parsed media operations:", mediaOperations);
      console.log(
        "🔍 [Controller] Media operations delete array:",
        mediaOperations?.delete || "undefined"
      );
      console.log(
        "🔍 [Controller] Delete array length:",
        (mediaOperations?.delete || []).length
      );
      console.log(
        "🔍 [Controller] New media files count:",
        newMediaFiles.length
      );
      console.log("=== END MEDIA OPERATIONS DEBUG ===");

      const updatedBerita = await BeritaService.updateBeritaWithMedia(
        id,
        beritaData,
        mediaOperations,
        newMediaFiles,
        id_admin_requester,
        level_akses_requester
      );

      res.status(200).json({
        success: true,
        message: "Berita and media updated successfully",
        berita: updatedBerita,
        media_stats: {
          kept: mediaOperations?.keep?.length || 0,
          updated: mediaOperations?.update?.length || 0,
          deleted: mediaOperations?.delete?.length || 0,
          created: newMediaFiles.length,
        },
      });
    } catch (error) {
      console.log("ERROR in updateBeritaWithMedia controller:", error.message);

      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Berita not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Media not found")) {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Forbidden")) {
        return res.status(403).json({ error: error.message });
      }
      if (
        error.message.includes("Jenis file tidak didukung") ||
        error.message.includes("Unexpected field name") ||
        error.message.includes("Invalid media_operations format")
      ) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({
        error: "Internal Server Error: " + error.message,
      });
    }
  }
}

module.exports = BeritaController;
