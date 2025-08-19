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
    const {
      id_konten,
      tipe_konten,
      deskripsi_file,
      jenis_file,
      urutan_tampil,
    } = req.body;

    const uploadedFiles = req.files;

    if (!uploadedFiles || uploadedFiles.length === 0) {
      return res.status(400).json({ error: "File media is required." });
    }

    try {
      // PERBAIKAN: Mengirim data ke service dalam bentuk yang terstruktur
      const mediaData = {
        id_konten: parseInt(id_konten),
        tipe_konten,
        deskripsi_file: Array.isArray(deskripsi_file)
          ? deskripsi_file
          : [deskripsi_file],
        jenis_file: Array.isArray(jenis_file) ? jenis_file : [jenis_file],
        urutan_tampil: Array.isArray(urutan_tampil)
          ? urutan_tampil.map(Number)
          : [parseInt(urutan_tampil)],
      };

      // PERBAIKAN: Menambahkan validasi tambahan untuk memastikan jumlah metadata cocok dengan jumlah file
      if (
        uploadedFiles.length !== mediaData.deskripsi_file.length ||
        uploadedFiles.length !== mediaData.jenis_file.length ||
        uploadedFiles.length !== mediaData.urutan_tampil.length
      ) {
        return res
          .status(400)
          .json({
            error: "Metadata tidak lengkap untuk setiap file yang diunggah.",
          });
      }

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
      if (error.message.includes("Jenis file tidak didukung")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
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
      if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Media not found") {
        return res.status(404).json({ error: error.message });
      }
      if (error.message.includes("Jenis file tidak didukung")) {
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
