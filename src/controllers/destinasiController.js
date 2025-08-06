// src/controllers/destinasiController.js
const DestinasiService = require("../services/destinasiService");
const { UniqueConstraintError, ValidationError } = require("sequelize");

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
      id_kategori_destinasi,
    } = req.body;
    const id_admin = req.user.id;
    // KOREKSI UTAMA: Ambil file dari req.files karena routes menggunakan .fields()
    const gambar_utama_path =
      req.files && req.files["gambar_utama"] && req.files["gambar_utama"][0]
        ? `/uploads/destinasi/gambar-utama/${req.files["gambar_utama"][0].filename}`
        : null;

    try {
      const newDestinasi = await DestinasiService.createDestinasi(
        {
          nama_destinasi,
          deskripsi_destinasi,
          alamat,
          koordinat_lokasi,
          jam_operasional,
          harga_tiket: parseFloat(harga_tiket) || null,
          gambar_utama: gambar_utama_path,
          id_kategori_destinasi: parseInt(id_kategori_destinasi),
          id_admin,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "Destinasi created successfully",
        destinasi: newDestinasi,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        return res
          .status(400)
          .json({
            error: `Destinasi '${req.body.nama_destinasi}' already exists.`,
          });
      } else if (error instanceof ValidationError) {
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

    // KOREKSI UTAMA: Ambil file dari req.files
    if (
      req.files &&
      req.files["gambar_utama"] &&
      req.files["gambar_utama"][0]
    ) {
      updateData.gambar_utama = `/uploads/destinasi/gambar-utama/${req.files["gambar_utama"][0].filename}`;
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
      if (error instanceof UniqueConstraintError) {
        return res
          .status(400)
          .json({
            error: `Destinasi '${req.body.nama_destinasi}' already exists.`,
          });
      } else if (error instanceof ValidationError) {
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
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = DestinasiController;
