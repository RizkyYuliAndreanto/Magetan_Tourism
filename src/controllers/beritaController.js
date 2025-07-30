// src/controllers/beritaController.js
const BeritaService = require("../services/beritaService");

class BeritaController {
  // GET all Berita
  static async getAllBerita(req, res) {
    try {
      const berita = await BeritaService.getAllBerita();
      res.status(200).json(berita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Berita by ID
  static async getBeritaById(req, res) {
    try {
      const { id } = req.params;
      const berita = await BeritaService.getBeritaById(id);
      if (!berita) {
        return res.status(404).json({ message: "Berita not found" });
      }
      res.status(200).json(berita);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Berita
  static async createBerita(req, res) {
    const {
      judul,
      teras_berita,
      isi_berita,
      penutup_berita,
      tanggal_publikasi,
      koordinat_lokasi,
      zoom_level_peta,
      id_kategori,
    } = req.body;
    const id_admin = req.user.id;
    const gambar_hero_berita = req.file
      ? `/uploads/${req.file.filename}`
      : null; // Dapatkan path file yang disimpan

    try {
      const newBerita = await BeritaService.createBerita(
        {
          judul,
          teras_berita,
          isi_berita,
          penutup_berita,
          tanggal_publikasi,
          gambar_hero_berita, // Gunakan path file yang diupload
          koordinat_lokasi,
          zoom_level_peta,
          id_kategori,
          id_admin,
        },
        req.user.level_akses
      );
      res
        .status(201)
        .json({ message: "Berita created successfully", berita: newBerita });
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

  // UPDATE Berita by ID
  static async updateBerita(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    // Jika ada file gambar baru yang diupload, tambahkan ke updateData
    if (req.file) {
      updateData.gambar_hero_berita = `/uploads/${req.file.filename}`;
    }

    try {
      const updatedBerita = await BeritaService.updateBerita(
        id,
        updateData,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({
        message: "Berita updated successfully",
        berita: updatedBerita,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Berita not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // DELETE Berita by ID
  static async deleteBerita(req, res) {
    const { id } = req.params;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    try {
      await BeritaService.deleteBerita(
        id,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({ message: "Berita deleted successfully" });
    } catch (error) {
      if (error.message === "Berita not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi
    }
  }
}

module.exports = BeritaController;
