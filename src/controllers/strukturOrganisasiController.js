// src/controllers/strukturOrganisasiController.js
const StrukturOrganisasiService = require("../services/strukturOrganisasiService");

class StrukturOrganisasiController {
  // GET struktur organisasi (biasanya hanya satu entri aktif)
  static async getStrukturOrganisasi(req, res) {
    try {
      const struktur = await StrukturOrganisasiService.getStrukturOrganisasi();
      if (!struktur) {
        return res
          .status(404)
          .json({ message: "Organizational structure not found" });
      }
      res.status(200).json(struktur);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Struktur Organisasi
  static async createStrukturOrganisasi(req, res) {
    const { judul_struktur, deskripsi_struktur } = req.body;
    const id_admin = req.user.id; // Asumsi id_admin tersedia dari req.user setelah authMiddleware

    // Mengambil path file dari req.files karena kita akan pakai upload.fields() di routes
    const gambar_struktur_path =
      req.files &&
      req.files["gambar_struktur_organisasi"] &&
      req.files["gambar_struktur_organisasi"][0]
        ? `/uploads/struktur-organisasi/${req.files["gambar_struktur_organisasi"][0].filename}` // Path sesuai multerConfig
        : null;

    if (!gambar_struktur_path) {
      return res
        .status(400)
        .json({
          error: "Image file for organizational structure is required.",
        });
    }

    try {
      const newStruktur =
        await StrukturOrganisasiService.createStrukturOrganisasi(
          {
            judul_struktur,
            deskripsi_struktur,
            gambar_struktur_path,
            tanggal_pembaruan: new Date(), // Set tanggal pembaruan saat ini
            id_admin,
          },
          req.user.level_akses
        );
      res.status(201).json({
        message: "Organizational structure created successfully",
        struktur: newStruktur,
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

  // UPDATE Struktur Organisasi by ID (id_struktur_organisasi)
  static async updateStrukturOrganisasi(req, res) {
    const { id } = req.params; // id_struktur_organisasi
    const updateData = req.body;
    const level_akses_requester = req.user.level_akses;

    // Jika ada file gambar baru yang diupload, tambahkan ke updateData
    if (
      req.files &&
      req.files["gambar_struktur_organisasi"] &&
      req.files["gambar_struktur_organisasi"][0]
    ) {
      updateData.gambar_struktur_path = `/uploads/struktur-organisasi/${req.files["gambar_struktur_organisasi"][0].filename}`;
      updateData.tanggal_pembaruan = new Date(); // Update tanggal pembaruan
    } else if (Object.keys(updateData).length > 0) {
      // Jika ada data lain yang diupdate tanpa file baru, update tanggal pembaruan juga
      updateData.tanggal_pembaruan = new Date();
    }

    try {
      const updatedStruktur =
        await StrukturOrganisasiService.updateStrukturOrganisasi(
          id,
          updateData,
          level_akses_requester
        );
      res.status(200).json({
        message: "Organizational structure updated successfully",
        struktur: updatedStruktur,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Organizational structure not found") {
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

  // DELETE Struktur Organisasi by ID
  static async deleteStrukturOrganisasi(req, res) {
    const { id } = req.params;
    const level_akses_requester = req.user.level_akses;

    try {
      await StrukturOrganisasiService.deleteStrukturOrganisasi(
        id,
        level_akses_requester
      );
      res
        .status(200)
        .json({ message: "Organizational structure deleted successfully" });
    } catch (error) {
      if (error.message === "Organizational structure not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = StrukturOrganisasiController;
