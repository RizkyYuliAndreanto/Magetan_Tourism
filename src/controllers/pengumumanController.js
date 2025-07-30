// src/controllers/pengumumanController.js
const PengumumanService = require("../services/pengumumanService");

class PengumumanController {
  // GET all Pengumuman
  static async getAllPengumuman(req, res) {
    try {
      const pengumuman = await PengumumanService.getAllPengumuman();
      res.status(200).json(pengumuman);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Pengumuman by ID
  static async getPengumumanById(req, res) {
    try {
      const { id } = req.params;
      const pengumuman = await PengumumanService.getPengumumanById(id);
      if (!pengumuman) {
        return res.status(404).json({ message: "Announcement not found" });
      }
      res.status(200).json(pengumuman);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Pengumuman
  static async createPengumuman(req, res) {
    const { judul_pengumuman, isi_pengumuman } = req.body;
    const id_admin = req.user.id; // Asumsi id_admin tersedia dari req.user setelah authMiddleware

    // Mengambil path file dari req.files karena kita akan pakai upload.fields() di routes
    const file_pdf_path =
      req.files &&
      req.files["file_pdf_pengumuman"] &&
      req.files["file_pdf_pengumuman"][0]
        ? `/uploads/pengumuman/pdf/${req.files["file_pdf_pengumuman"][0].filename}`
        : null;

    if (!file_pdf_path) {
      return res
        .status(400)
        .json({ error: "PDF file for announcement is required." });
    }

    try {
      const newPengumuman = await PengumumanService.createPengumuman(
        {
          judul_pengumuman,
          isi_pengumuman,
          file_pdf_path,
          tanggal_publikasi: new Date(), // Set tanggal publikasi saat ini
          id_admin,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "Announcement created successfully",
        pengumuman: newPengumuman,
      });
    } catch (error) {
      console.error("Error di createPengumuman:", error);
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

  // UPDATE Pengumuman by ID
  static async updatePengumuman(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const level_akses_requester = req.user.level_akses;

    // Jika ada file baru yang diupload untuk mengganti
    if (
      req.files &&
      req.files["file_pdf_pengumuman"] &&
      req.files["file_pdf_pengumuman"][0]
    ) {
      updateData.file_pdf_path = `/uploads/pengumuman/pdf/${req.files["file_pdf_pengumuman"][0].filename}`;
      updateData.tanggal_publikasi = new Date(); // Update tanggal publikasi jika file diubah
    } else if (Object.keys(updateData).length > 0) {
      // Jika ada data lain yang diupdate tanpa file baru, update tanggal publikasi juga
      updateData.tanggal_publikasi = new Date();
    }

    try {
      const updatedPengumuman = await PengumumanService.updatePengumuman(
        id,
        updateData,
        level_akses_requester
      );
      res.status(200).json({
        message: "Announcement updated successfully",
        pengumuman: updatedPengumuman,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Announcement not found") {
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

  // DELETE Pengumuman by ID
  static async deletePengumuman(req, res) {
    const { id } = req.params;
    const level_akses_requester = req.user.level_akses;

    try {
      await PengumumanService.deletePengumuman(id, level_akses_requester);
      res.status(200).json({ message: "Announcement deleted successfully" });
    } catch (error) {
      if (error.message === "Announcement not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = PengumumanController;
