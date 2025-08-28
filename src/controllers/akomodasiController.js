// src/controllers/akomodasiController.js
const AkomodasiService = require("../services/akomodasiService");

class AkomodasiController {
  static async getAllAkomodasi(req, res) {
    try {
      const akomodasi = await AkomodasiService.getAllAkomodasi();
      res.status(200).json(akomodasi);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getAkomodasiById(req, res) {
    try {
      const { id } = req.params;
      const akomodasi = await AkomodasiService.getAkomodasiById(id);
      if (!akomodasi) {
        return res.status(404).json({ message: "Accommodation not found" });
      }
      res.status(200).json(akomodasi);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createAkomodasi(req, res) {
    const {
      nama_hotel,
      deskripsi_hotel,
      alamat_hotel,
      koordinat_lokasi,
      fasilitas,
      kontak_hotel,
      website_hotel,
      rating_hotel,
      jumlah_dilihat,
      jumlah_share,
    } = req.body;
    const id_admin = req.user.id;

    const gambar_akomodasi_path = // Perbaikan di sini
      req.files &&
      req.files["gambar_akomodasi"] && // Perbaikan di sini
      req.files["gambar_akomodasi"][0]
        ? `/uploads/akomodasi/gambar-utama/${req.files["gambar_akomodasi"][0].filename}` // Perbaikan di sini
        : null;

    if (!nama_hotel || !deskripsi_hotel || !alamat_hotel) {
      return res
        .status(400)
        .json({ error: "Nama, deskripsi, and alamat hotel are required." });
    }

    try {
      const newAkomodasi = await AkomodasiService.createAkomodasi(
        {
          nama_hotel,
          deskripsi_hotel,
          alamat_hotel,
          koordinat_lokasi,
          fasilitas,
          gambar_utama_hotel: gambar_akomodasi_path, // Perbaikan di sini
          kontak_hotel,
          website_hotel,
          rating_hotel: parseFloat(rating_hotel) || null,
          jumlah_dilihat: parseInt(jumlah_dilihat) || 0,
          jumlah_share: parseInt(jumlah_share) || 0,
          id_admin,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "Accommodation created successfully",
        akomodasi: newAkomodasi,
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

  static async updateAkomodasi(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const level_akses_requester = req.user.level_akses;

    if (
      req.files &&
      req.files["gambar_akomodasi"] && // Perbaikan di sini
      req.files["gambar_akomodasi"][0]
    ) {
      updateData.gambar_utama_hotel = `/uploads/akomodasi/gambar-utama/${req.files["gambar_akomodasi"][0].filename}`; // Perbaikan di sini
    }

    if (updateData.rating_hotel !== undefined) {
      updateData.rating_hotel = parseFloat(updateData.rating_hotel) || null;
    }
    if (updateData.jumlah_dilihat !== undefined) {
      updateData.jumlah_dilihat = parseInt(updateData.jumlah_dilihat);
    }
    if (updateData.jumlah_share !== undefined) {
      updateData.jumlah_share = parseInt(updateData.jumlah_share);
    }

    try {
      const updatedAkomodasi = await AkomodasiService.updateAkomodasi(
        id,
        updateData,
        level_akses_requester
      );
      res.status(200).json({
        message: "Accommodation updated successfully",
        akomodasi: updatedAkomodasi,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Accommodation not found") {
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

  static async deleteAkomodasi(req, res) {
    const { id } = req.params;
    const level_akses_requester = req.user.level_akses;

    try {
      await AkomodasiService.deleteAkomodasi(id, level_akses_requester);
      res.status(200).json({ message: "Accommodation deleted successfully" });
    } catch (error) {
      if (error.message === "Accommodation not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = AkomodasiController;
