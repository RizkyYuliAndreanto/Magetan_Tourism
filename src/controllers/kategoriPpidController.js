// src/controllers/kategoriPpidController.js
const KategoriPpidService = require("../services/kategoriPpidService");
const {
  UniqueConstraintError,
  ValidationError,
  SequelizeForeignKeyConstraintError, // BARU: Impor kelas error ini
} = require("sequelize");

class KategoriPpidController {
  // GET all Kategori_PPID
  static async getAllKategoriPpid(req, res) {
    try {
      const { includeKonten, includeSubKategori } = req.query; // Ambil dari query params

      const options = {
        includeKonten: includeKonten === "true", // Konversi string 'true' ke boolean true
        includeSubKategori: includeSubKategori === "true",
      };

      const kategoris = await KategoriPpidService.getAllKategoriPpid(options);
      res.status(200).json(kategoris);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Kategori_PPID by ID
  static async getKategoriPpidById(req, res) {
    try {
      const { id } = req.params;
      const { includeKonten, includeSubKategori } = req.query;

      const options = {
        includeKonten: includeKonten === "true",
        includeSubKategori: includeSubKategori === "true",
      };

      const kategori = await KategoriPpidService.getKategoriPpidById(
        id,
        options
      );
      if (!kategori) {
        return res.status(404).json({ message: "PPID category not found" });
      }
      res.status(200).json(kategori);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Kategori_PPID
  static async createKategoriPpid(req, res) {
    const { nama_kategori, deskripsi_kategori, id_kategori_induk } = req.body;
    const requesterLevelAkses = req.user.level_akses; // Dari authMiddleware

    try {
      const newKategori = await KategoriPpidService.createKategoriPpid(
        {
          nama_kategori,
          deskripsi_kategori,
          id_kategori_induk: id_kategori_induk
            ? parseInt(id_kategori_induk)
            : null,
        },
        requesterLevelAkses
      );
      res.status(201).json({
        message: "PPID category created successfully",
        kategori: newKategori,
      });
    } catch (error) {
      // KOREKSI: Tambahkan penanganan error spesifik
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({
          error: `Kategori '${req.body.nama_kategori}' already exists. Please choose another name.`,
        });
      } else if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi
    }
  }

  // UPDATE Kategori_PPID by ID
  static async updateKategoriPpid(req, res) {
    const { id } = req.params;
    const { nama_kategori, deskripsi_kategori, id_kategori_induk } = req.body;
    const requesterLevelAkses = req.user.level_akses;

    const updateData = {};
    if (nama_kategori !== undefined) updateData.nama_kategori = nama_kategori;
    if (deskripsi_kategori !== undefined)
      updateData.deskripsi_kategori = deskripsi_kategori;
    // Jika id_kategori_induk di-set ke null atau angka
    if (id_kategori_induk !== undefined) {
      updateData.id_kategori_induk = id_kategori_induk
        ? parseInt(id_kategori_induk)
        : null;
    }

    try {
      const updatedKategori = await KategoriPpidService.updateKategoriPpid(
        id,
        updateData,
        requesterLevelAkses
      );
      res.status(200).json({
        message: "PPID category updated successfully",
        kategori: updatedKategori,
      });
    } catch (error) {
      // KOREKSI: Tambahkan penanganan error spesifik
      if (error instanceof UniqueConstraintError) {
        return res.status(400).json({
          error: `Kategori '${req.body.nama_kategori}' already exists. Please choose another name.`,
        });
      } else if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "PPID category not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // DELETE Kategori_PPID by ID
  static async deleteKategoriPpid(req, res) {
    const { id } = req.params;
    const requesterLevelAkses = req.user.level_akses;

    try {
      await KategoriPpidService.deleteKategoriPpid(id, requesterLevelAkses);
      res.status(200).json({ message: "PPID category deleted successfully" });
    } catch (error) {
      // KOREKSI: Tambahkan penanganan error spesifik
      if (error.message === "PPID category not found") {
        return res.status(404).json({ error: error.message });
      }
      // Khusus untuk delete, jika ada konten yang masih terhubung
      if (error.name === "SequelizeForeignKeyConstraintError") {
        return res.status(400).json({
          error:
            "Cannot delete category: There are still news articles associated with this category. Please reassign or delete them first.",
        });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = KategoriPpidController;
