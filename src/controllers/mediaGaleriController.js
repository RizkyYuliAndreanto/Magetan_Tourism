// src/controllers/mediaGaleriController.js
const MediaGaleriService = require("../services/mediaGaleriService");
const { UniqueConstraintError, ValidationError } = require("sequelize");

class MediaGaleriController {
  // GET all Media_Galeri
  static async getAllMediaGaleri(req, res) {
    try {
      const mediaGaleri = await MediaGaleriService.getAllMediaGaleri();
      res.status(200).json(mediaGaleri);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Media_Galeri by ID
  static async getMediaGaleriById(req, res) {
    try {
      const { id } = req.params;
      const mediaGaleri = await MediaGaleriService.getMediaGaleriById(id);
      if (!mediaGaleri) {
        return res.status(404).json({ message: "Media not found" });
      }
      res.status(200).json(mediaGaleri);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Media_Galeri (mendukung multiple file)
  static async createMediaGaleri(req, res) {
    const { id_konten, tipe_konten, deskripsi_file, urutan_tampil } = req.body;
    let uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: "File media is required." });
    }

    // Kompresi gambar jika size > 10MB menggunakan sharp
    // (PDF/video tidak dikompresi di sini, hanya gambar)
    const sharp = require("sharp");
    const fs = require("fs");
    const path = require("path");
    const MAX_IMAGE_SIZE = 1024 * 1024 * 10; // 10 MB

    // Proses kompresi gambar secara async
    const compressImageIfNeeded = async (file) => {
      if (file.mimetype.startsWith("image/") && file.size > MAX_IMAGE_SIZE) {
        const inputPath = file.path;
        const ext = path.extname(file.originalname);
        const outputPath = inputPath.replace(ext, `-compressed${ext}`);
        try {
          await sharp(inputPath)
            .jpeg({ quality: 70 }) // Kompresi ke JPEG, quality bisa diatur
            .toFile(outputPath);
          // Hapus file asli, ganti info file ke file hasil kompresi
          fs.unlinkSync(inputPath);
          file.path = outputPath;
          file.filename = path.basename(outputPath);
          file.size = fs.statSync(outputPath).size;
        } catch (err) {
          // Jika gagal kompresi, biarkan file asli
        }
      }
      return file;
    };

    // Kompresi semua gambar yang perlu dikompresi
    uploadedFiles = await Promise.all(
      uploadedFiles.map((file) => compressImageIfNeeded(file))
    );

    try {
      const mediaData = {
        id_konten: id_konten ? parseInt(id_konten, 10) : null,
        tipe_konten: tipe_konten || null,
        deskripsi_file: deskripsi_file || null,
        urutan_tampil: urutan_tampil ? parseInt(urutan_tampil, 10) : 0,
      };

      const newMediaList = await MediaGaleriService.createMediaGaleri(
        mediaData,
        uploadedFiles,
        req.user.level_akses
      );
      res.status(201).json({
        message: "Media uploaded successfully",
        media: newMediaList,
      });
    } catch (error) {
      if (
        error instanceof UniqueConstraintError ||
        error instanceof ValidationError
      ) {
        return res.status(400).json({ error: error.message });
      }
      if (
        error.message.includes("Jenis file tidak didukung") ||
        error.message.includes("Content with ID")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Internal Server Error: " + error.message });
    }
  }

  // UPDATE Media_Galeri by ID (tetap single file)
  static async updateMediaGaleri(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const level_akses_requester = req.user.level_akses;

    if (req.file) {
      updateData.path_file = `/uploads/galeri/${req.file.filename}`;
      updateData.jenis_file = req.file.mimetype.startsWith("image")
        ? "gambar"
        : "video";
    }

    if (updateData.urutan_tampil) {
      updateData.urutan_tampil = parseInt(updateData.urutan_tampil, 10);
    }
    if (updateData.id_konten) {
      updateData.id_konten = parseInt(updateData.id_konten, 10);
    }

    try {
      const updatedMedia = await MediaGaleriService.updateMediaGaleri(
        id,
        updateData,
        req.user.id,
        level_akses_requester
      );
      res.status(200).json({
        message: "Media updated successfully",
        media: updatedMedia,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Media not found") {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message.includes("Jenis file tidak didukung") ||
        error.message.includes("Content with ID")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Internal Server Error: " + error.message });
    }
  }

  // DELETE Media_Galeri by ID
  static async deleteMediaGaleri(req, res) {
    const { id } = req.params;
    const level_akses_requester = req.user.level_akses;

    try {
      await MediaGaleriService.deleteMediaGaleri(
        id,
        req.user.id,
        level_akses_requester
      );
      res.status(200).json({ message: "Media deleted successfully" });
    } catch (error) {
      if (error.message === "Media not found") {
        return res.status(404).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Internal Server Error: " + error.message });
    }
  }

  // Batch DELETE Media_Galeri by IDs
  static async batchDeleteMediaGaleri(req, res) {
    console.log("=== BATCH DELETE CONTROLLER DEBUG ===");
    console.log("Request body:", req.body);
    console.log(
      "Request user:",
      req.user
        ? { id: req.user.id, level_akses: req.user.level_akses }
        : "No user"
    );

    const { mediaIds } = req.body; // Expect array of IDs
    const level_akses_requester = req.user.level_akses;

    console.log("Extracted mediaIds:", mediaIds);
    console.log("User level:", level_akses_requester);

    if (!mediaIds || !Array.isArray(mediaIds) || mediaIds.length === 0) {
      console.log("ERROR: Invalid mediaIds provided");
      return res.status(400).json({ error: "Media IDs array is required" });
    }

    try {
      console.log(
        "Calling MediaGaleriService.batchDeleteMedia with:",
        mediaIds,
        level_akses_requester
      );
      const result = await MediaGaleriService.batchDeleteMedia(
        mediaIds,
        level_akses_requester
      );
      console.log("Service returned result:", result);

      res.status(200).json({
        message: "Media deleted successfully",
        deletedCount: result.deletedCount,
        deletedIds: result.deletedIds,
      });
    } catch (error) {
      console.log("ERROR in batchDeleteMediaGaleri controller:", error.message);
      console.log("ERROR stack:", error.stack);
      if (error.message === "No media found with provided IDs") {
        return res.status(404).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Internal Server Error: " + error.message });
    }
  }

  // GET Media by Content
  static async getMediaByContent(req, res) {
    const { id_konten, tipe_konten } = req.query;

    if (!id_konten || !tipe_konten) {
      return res
        .status(400)
        .json({ error: "id_konten and tipe_konten are required" });
    }

    try {
      const media = await MediaGaleriService.getMediaByContent(
        parseInt(id_konten),
        tipe_konten
      );
      res.status(200).json(media);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // UPDATE Media data only (without file)
  static async updateMediaData(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const level_akses_requester = req.user.level_akses;

    try {
      const updatedMedia = await MediaGaleriService.updateMediaData(
        id,
        updateData,
        level_akses_requester
      );
      res.status(200).json({
        message: "Media data updated successfully",
        media: updatedMedia,
      });
    } catch (error) {
      if (error.message === "Media not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message === "No valid fields to update") {
        return res.status(400).json({ error: error.message });
      }
      res
        .status(500)
        .json({ error: "Internal Server Error: " + error.message });
    }
  }
}

module.exports = MediaGaleriController;
