// src/controllers/kategoriBeritaController.js
const { Kategori_Berita } = require("../models");

class KategoriBeritaController {
  static async getAllKategoriBerita(req, res) {
    try {
      const kategori = await Kategori_Berita.findAll();
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getKategoriBeritaById(req, res) {
    try {
      const { id } = req.params;
      const kategori = await Kategori_Berita.findByPk(id);
      if (!kategori) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createKategoriBerita(req, res) {
    try {
      const { nama_kategori, deskripsi_kategori } = req.body;

      const newKategori = await Kategori_Berita.create({
        nama_kategori,
        deskripsi_kategori,
      });

      res.status(201).json({
        message: "News category created successfully",
        kategori: newKategori,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async updateKategoriBerita(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const kategori = await Kategori_Berita.findByPk(id);
      if (!kategori) {
        return res.status(404).json({ message: "Category not found" });
      }

      await kategori.update(updateData);
      res.status(200).json({
        message: "News category updated successfully",
        kategori,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      res.status(500).json({ error: error.message });
    }
  }

  static async deleteKategoriBerita(req, res) {
    try {
      const { id } = req.params;

      const kategori = await Kategori_Berita.findByPk(id);
      if (!kategori) {
        return res.status(404).json({ message: "Category not found" });
      }

      await kategori.destroy();
      res.status(200).json({ message: "News category deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = KategoriBeritaController;
