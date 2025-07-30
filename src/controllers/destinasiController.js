// src/controllers/destinasiController.js
const DestinasiService = require("../services/destinasiService");

class DestinasiController {
  // GET all Destinasi
  static async getAllDestinasi(req, res) {
    try {
      const destinasi = await DestinasiService.getAllDestinasi();
      res.status(200).json(destinasi);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Destinasi by ID
  static async getDestinasiById(req, res) {
    try {
      const { id } = req.params;
      const destinasi = await DestinasiService.getDestinasiById(id);
      if (!destinasi) {
        return res.status(404).json({ message: "Destinasi not found" });
      }
      res.status(200).json(destinasi);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Destinasi
  static async createDestinasi(req, res) {
    const {
      nama_destinasi,
      deskripsi_destinasi,
      alamat,
      koordinat_lokasi,
      jam_operasional,
      harga_tiket,
      jumlah_dilihat,
      jumlah_share,
      
      id_kategori_destinasi,
    } = req.body;
    const id_admin = req.user.id;
    const gambar_utama = req.file
      ? `/uploads/destinasi/${req.file.filename}`
      : null; // Dapatkan path file yang disimpan

    try {
      const newDestinasi = await DestinasiService.createDestinasi(
        {
          nama_destinasi,
          deskripsi_destinasi,
          alamat,
          koordinat_lokasi,
          jam_operasional,
          harga_tiket,
          jumlah_dilihat,
          jumlah_share,
          gambar_utama,
          id_kategori_destinasi,
          id_admin,
        },
        req.user.level_akses
      );
      res
        .status(201)
        .json({
          message: "Destinasi created successfully",
          destinasi: newDestinasi,
        });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // UPDATE Destinasi by ID
  static async updateDestinasi(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    // Jika ada file gambar baru yang diupload, tambahkan ke updateData
    if (req.file) {
      updateData.gambar_utama = `/uploads/destinasi/${req.file.filename}`;
    }

    try {
      const updatedDestinasi = await DestinasiService.updateDestinasi(
        id,
        updateData,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({
        message: "Destinasi updated successfully",
        destinasi: updatedDestinasi,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Destinasi not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // DELETE Destinasi by ID
  static async deleteDestinasi(req, res) {
    const { id } = req.params;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    try {
      await DestinasiService.deleteDestinasi(
        id,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({ message: "Destinasi deleted successfully" });
    } catch (error) {
      if (error.message === "Destinasi not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi
    }
  }
}

module.exports = DestinasiController;
