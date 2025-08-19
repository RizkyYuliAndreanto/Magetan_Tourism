// src/controllers/kategoriBudayaController.js
const KategoriBudayaService = require("../services/kategoriBudayaService");

class KategoriBudayaController {
  static async getAllKategoriBudaya(req, res) {
    try {
      const kategori = await KategoriBudayaService.getAllKategoriBudaya();
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getKategoriBudayaById(req, res) {
    try {
      const { id } = req.params;
      const kategori = await KategoriBudayaService.getKategoriBudayaById(id);
      if (!kategori) {
        return res.status(404).json({ message: "Culture category not found" });
      }
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createKategoriBudaya(req, res) {
    const { nama_kategori,deskripsi_kategori } = req.body;
    const gambar_sampul =
      req.file && req.file.filename
        ? `/uploads/budaya/kategori-sampul/${req.file.filename}`
        : null;

    if (!gambar_sampul) {
      return res.status(400).json({ error: "Cover image is required." });
    }

    try {
      const newKategori = await KategoriBudayaService.createKategoriBudaya(
        {
          nama_kategori,
              gambar_sampul,
            deskripsi_kategori,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "Culture category created successfully",
        kategori: newKategori,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  static async updateKategoriBudaya(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    if (req.file) {
      updateData.gambar_sampul = `/uploads/budaya/kategori-sampul/${req.file.filename}`;
    }

    try {
      const updatedKategori = await KategoriBudayaService.updateKategoriBudaya(
        id,
        updateData,
        req.user.level_akses
      );
      res.status(200).json({
        message: "Culture category updated successfully",
        kategori: updatedKategori,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Culture category not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  static async deleteKategoriBudaya(req, res) {
    const { id } = req.params;
    try {
      await KategoriBudayaService.deleteKategoriBudaya(
        id,
        req.user.level_akses
      );
      res
        .status(200)
        .json({ message: "Culture category deleted successfully" });
    } catch (error) {
      if (error.message === "Culture category not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = KategoriBudayaController;
