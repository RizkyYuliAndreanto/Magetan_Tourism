// src/controllers/umkmController.js
const UMKMService = require("../services/umkmService");

class UMKMController {
  // GET all UMKM
  static async getAllUMKM(req, res) {
    try {
      const umkm = await UMKMService.getAllUMKM();
      res.status(200).json(umkm);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET UMKM by ID
  static async getUMKMById(req, res) {
    try {
      const { id } = req.params;
      const umkm = await UMKMService.getUMKMById(id);
      if (!umkm) {
        return res.status(404).json({ message: "UMKM not found" });
      }
      res.status(200).json(umkm);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new UMKM
  static async createUMKM(req, res) {
    const {
      nama_umkm,
      deskripsi_umkm,
      jenis_usaha,
      alamat_umkm,
      kontak_umkm,
      website_umkm,
      jumlah_dilihat,
      jumlah_share,
    } = req.body;
    const id_admin = req.user.id; // Asumsi id_admin tersedia dari req.user setelah authMiddleware

    // Mengambil path file dari req.files
    const gambar_produk_utama_path =
      req.files &&
      req.files["gambar_produk_utama"] &&
      req.files["gambar_produk_utama"][0]
        ? `/uploads/umkm/gambar-produk/${req.files["gambar_produk_utama"][0].filename}`
        : null;

    try {
      const newUMKM = await UMKMService.createUMKM(
        {
          nama_umkm,
          deskripsi_umkm,
          jenis_usaha,
          alamat_umkm,
          kontak_umkm,
          website_umkm,
          gambar_produk_utama: gambar_produk_utama_path,
          jumlah_dilihat: parseInt(jumlah_dilihat) || 0, // Pastikan ini angka
          jumlah_share: parseInt(jumlah_share) || 0, // Pastikan ini angka
          id_admin,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "UMKM created successfully",
        umkm: newUMKM,
      });
    } catch (error) {
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

  // UPDATE UMKM by ID
  static async updateUMKM(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    // Jika ada file gambar baru yang diupload, tambahkan ke updateData
    if (
      req.files &&
      req.files["gambar_produk_utama"] &&
      req.files["gambar_produk_utama"][0]
    ) {
      updateData.gambar_produk_utama = `/uploads/umkm/gambar-produk/${req.files["gambar_produk_utama"][0].filename}`;
    }

    // Pastikan nilai angka dikonversi jika ada di updateData
    if (updateData.jumlah_dilihat) {
      updateData.jumlah_dilihat = parseInt(updateData.jumlah_dilihat);
    }
    if (updateData.jumlah_share) {
      updateData.jumlah_share = parseInt(updateData.jumlah_share);
    }

    try {
      const updatedUMKM = await UMKMService.updateUMKM(
        id,
        updateData,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({
        message: "UMKM updated successfully",
        umkm: updatedUMKM,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "UMKM not found") {
        return res.status(404).json({ error: error.message });
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

  // DELETE UMKM by ID
  static async deleteUMKM(req, res) {
    const { id } = req.params;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    try {
      await UMKMService.deleteUMKM(
        id,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({ message: "UMKM deleted successfully" });
    } catch (error) {
      if (error.message === "UMKM not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = UMKMController;
