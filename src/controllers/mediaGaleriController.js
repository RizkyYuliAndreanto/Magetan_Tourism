// src/controllers/mediaGaleriController.js
const MediaGaleriService = require("../services/mediaGaleriService");

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

  // CREATE new Media_Galeri
  static async createMediaGaleri(req, res) {
    const {
      id_konten,
      tipe_konten,
      deskripsi_file,
      jenis_file,
      urutan_tampil,
    } = req.body;

    // KOREKSI UTAMA: Akses file dari req.file, bukan req.files
    const path_file = req.file // req.file adalah objek tunggal jika menggunakan .single()
      ? `/uploads/galeri/${req.file.filename}` // Path sesuai multerConfig
      : null;

    // Validasi dasar: file harus ada
    if (!path_file) {
      return res.status(400).json({ error: "File media is required." });
    }

    try {
      const newMedia = await MediaGaleriService.createMediaGaleri(
        {
          id_konten: parseInt(id_konten),
          tipe_konten,
          path_file,
          deskripsi_file,
          jenis_file,
          urutan_tampil: parseInt(urutan_tampil) || 0,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "Media uploaded successfully",
        media: newMedia,
      });
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
      res.status(403).json({ error: error.message });
    }
  }

  // UPDATE Media_Galeri by ID
  static async updateMediaGaleri(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const level_akses_requester = req.user.level_akses;

    // KOREKSI UTAMA: Akses file dari req.file, bukan req.files
    if (req.file) {
      // Jika ada file baru yang diupload untuk mengganti
      updateData.path_file = `/uploads/galeri/${req.file.filename}`;
    }

    if (updateData.urutan_tampil) {
      updateData.urutan_tampil = parseInt(updateData.urutan_tampil);
    }
    if (updateData.id_konten) {
      updateData.id_konten = parseInt(updateData.id_konten);
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
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Media not found") {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message.includes("Jenis file tidak didukung") ||
        error.message.includes("Unexpected field name")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
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
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = MediaGaleriController;
