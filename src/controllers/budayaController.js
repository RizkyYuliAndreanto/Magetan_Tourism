// src/controllers/budayaController.js
const BudayaService = require("../services/budayaService");

class BudayaController {
  static async getAllBudaya(req, res) {
    try {
      const budaya = await BudayaService.getAllBudaya();
      res.status(200).json(budaya);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async getBudayaById(req, res) {
    try {
      const { id } = req.params;
      const budaya = await BudayaService.getBudayaById(id);
      if (!budaya) {
        return res.status(404).json({ message: "Culture data not found" });
      }
      res.status(200).json(budaya);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createBudaya(req, res) {
    const { judul_budaya, deskripsi_budaya, id_kategori_budaya } = req.body;
    const id_admin = req.user.id;

    const gambar_budaya_path =
      req.files && req.files["gambar_budaya"] && req.files["gambar_budaya"][0]
        ? `/uploads/budaya/gambar/${req.files["gambar_budaya"][0].filename}`
        : null;

    try {
      const newBudaya = await BudayaService.createBudaya(
        {
          judul_budaya,
          gambar_budaya: gambar_budaya_path,
          deskripsi_budaya,
          id_kategori_budaya,
          id_admin,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "Culture data created successfully",
        budaya: newBudaya,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  static async updateBudaya(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    if (
      req.files &&
      req.files["gambar_budaya"] &&
      req.files["gambar_budaya"][0]
    ) {
      updateData.gambar_budaya = `/uploads/budaya/gambar/${req.files["gambar_budaya"][0].filename}`;
    }

    try {
      const updatedBudaya = await BudayaService.updateBudaya(
        id,
        updateData,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({
        message: "Culture data updated successfully",
        budaya: updatedBudaya,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Culture data not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  static async deleteBudaya(req, res) {
    const { id } = req.params;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    try {
      await BudayaService.deleteBudaya(
        id,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({ message: "Culture data deleted successfully" });
    } catch (error) {
      if (error.message === "Culture data not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = BudayaController;
