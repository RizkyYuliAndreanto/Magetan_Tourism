// src/controllers/kategoriUmkmController.js
const KategoriUMKMService = require("../services/kategoriUmkmService");

class KategoriUMKMController {
  static async getAllKategoriUMKM(req, res) {
    try {
      const kategori = await KategoriUMKMService.getAllKategoriUMKM();
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getKategoriUMKMById(req, res) {
    try {
      const { id } = req.params;
      const kategori = await KategoriUMKMService.getKategoriUMKMById(id);
      if (!kategori) {
        return res.status(404).json({ message: "UMKM category not found" });
      }
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createKategoriUMKM(req, res) {
    const { nama_kategori, deskripsi_kategori } = req.body;
    const gambar_sampul =
      req.file && req.file.filename
        ? `/uploads/umkm/kategori-sampul/${req.file.filename}`
        : null;

    try {
      const newKategori = await KategoriUMKMService.createKategoriUMKM(
        {
          nama_kategori,
          gambar_sampul,
          deskripsi_kategori,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "UMKM category created successfully",
        kategori: newKategori,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  static async updateKategoriUMKM(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.gambar_sampul = `/uploads/umkm/kategori-sampul/${req.file.filename}`;
    }

    try {
      const updatedKategori = await KategoriUMKMService.updateKategoriUMKM(
        id,
        updateData,
        req.user.level_akses
      );
      res.status(200).json({
        message: "UMKM category updated successfully",
        kategori: updatedKategori,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "UMKM category not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  static async deleteKategoriUMKM(req, res) {
    const { id } = req.params;
    try {
      await KategoriUMKMService.deleteKategoriUMKM(id, req.user.level_akses);
      res.status(200).json({ message: "UMKM category deleted successfully" });
    } catch (error) {
      if (error.message === "UMKM category not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = KategoriUMKMController;
