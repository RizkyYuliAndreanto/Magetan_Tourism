// src/controllers/sejarahController.js
const SejarahService = require("../services/sejarahService");

class SejarahController {
  // GET all Sejarah
  static async getAllSejarah(req, res) {
    try {
      const sejarah = await SejarahService.getAllSejarah();
      res.status(200).json(sejarah);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Sejarah by ID
  static async getSejarahById(req, res) {
    try {
      const { id } = req.params;
      const sejarah = await SejarahService.getSejarahById(id);
      if (!sejarah) {
        return res.status(404).json({ message: "Sejarah not found" });
      }
      res.status(200).json(sejarah);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Sejarah
  static async createSejarah(req, res) {
    const { judul, deskripsi, tanggal_kejadian } = req.body;
    const id_admin = req.user.id; // Asumsi id_admin tersedia dari req.user setelah authMiddleware

    // KOREKSI UTAMA: Akses file dari req.files jika menggunakan .fields()
    // Nama field di Postman harus 'gambar_sejarah', bukan 'gambar_utama'
    const gambar_sejarah_path =
      req.files && req.files["gambar_sejarah"] && req.files["gambar_sejarah"][0]
        ? `/uploads/sejarah/gambar/${req.files["gambar_sejarah"][0].filename}` // Perbaikan path folder
        : null;

    try {
      const newSejarah = await SejarahService.createSejarah(
        {
          judul,
          deskripsi,
          tanggal_kejadian,
          gambar_sejarah: gambar_sejarah_path, // Gunakan path yang benar
          id_admin,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "Sejarah created successfully",
        sejarah: newSejarah,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: error.message });
      }
      // Tambahkan penanganan error Multer jika terjadi
      if (
        error.message.includes("Jenis file tidak didukung") ||
        error.message.includes("Unexpected field name")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // UPDATE Sejarah by ID
  static async updateSejarah(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    // KOREKSI UTAMA: Akses file dari req.files jika menggunakan .fields()
    // Nama field di Postman harus 'gambar_sejarah', bukan 'gambar_utama'
    if (
      req.files &&
      req.files["gambar_sejarah"] &&
      req.files["gambar_sejarah"][0]
    ) {
      updateData.gambar_sejarah = `/uploads/sejarah/gambar/${req.files["gambar_sejarah"][0].filename}`; // Perbaikan path folder dan nama field
    }

    try {
      const updatedSejarah = await SejarahService.updateSejarah(
        id,
        updateData,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({
        message: "Sejarah updated successfully",
        sejarah: updatedSejarah,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Sejarah not found") {
        return res.status(404).json({ error: error.message });
      }
      // Tambahkan penanganan error Multer jika terjadi
      if (
        error.message.includes("Jenis file tidak didukung") ||
        error.message.includes("Unexpected field name")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // DELETE Sejarah by ID
  static async deleteSejarah(req, res) {
    const { id } = req.params;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    try {
      await SejarahService.deleteSejarah(
        id,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({ message: "Sejarah deleted successfully" });
    } catch (error) {
      if (error.message === "Sejarah not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = SejarahController;
