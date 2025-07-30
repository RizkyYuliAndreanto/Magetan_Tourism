// src/controllers/strukturAnggotaController.js
const StrukturAnggotaService = require("../services/strukturAnggotaService");

class StrukturAnggotaController {
  // GET all Struktur_Anggota
  static async getAllStrukturAnggota(req, res) {
    try {
      const anggota = await StrukturAnggotaService.getAllStrukturAnggota();
      res.status(200).json(anggota);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Struktur_Anggota by ID
  static async getStrukturAnggotaById(req, res) {
    try {
      const { id } = req.params;
      const anggota = await StrukturAnggotaService.getStrukturAnggotaById(id);
      if (!anggota) {
        return res.status(404).json({ message: "Structure member not found" });
      }
      res.status(200).json(anggota);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Struktur_Anggota
  static async createStrukturAnggota(req, res) {
    const { nama_anggota, jabatan, deskripsi_tugas, urutan_tampilan } =
      req.body;
    const id_admin = req.user.id; // Asumsi id_admin tersedia dari req.user setelah authMiddleware

    // Mengambil path file dari req.files karena kita akan pakai upload.fields() di routes
    const foto_anggota_path =
      req.files && req.files["foto_anggota"] && req.files["foto_anggota"][0]
        ? `/uploads/struktur-anggota/foto/${req.files["foto_anggota"][0].filename}`
        : null;

    try {
      const newAnggota = await StrukturAnggotaService.createStrukturAnggota(
        {
          nama_anggota,
          jabatan,
          deskripsi_tugas,
          foto_anggota: foto_anggota_path,
          urutan_tampilan: parseInt(urutan_tampilan) || 0, // Pastikan ini integer
          id_admin,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "Structure member created successfully",
        anggota: newAnggota,
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

  // UPDATE Struktur_Anggota by ID
  static async updateStrukturAnggota(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    // Jika ada file foto baru yang diupload, tambahkan ke updateData
    if (
      req.files &&
      req.files["foto_anggota"] &&
      req.files["foto_anggota"][0]
    ) {
      updateData.foto_anggota = `/uploads/struktur-anggota/foto/${req.files["foto_anggota"][0].filename}`;
    }

    // Pastikan nilai angka dikonversi jika ada di updateData
    if (updateData.urutan_tampilan) {
      updateData.urutan_tampilan = parseInt(updateData.urutan_tampilan);
    }

    try {
      const updatedAnggota = await StrukturAnggotaService.updateStrukturAnggota(
        id,
        updateData,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({
        message: "Structure member updated successfully",
        anggota: updatedAnggota,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Structure member not found") {
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

  // DELETE Struktur_Anggota by ID
  static async deleteStrukturAnggota(req, res) {
    const { id } = req.params;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    try {
      await StrukturAnggotaService.deleteStrukturAnggota(
        id,
        id_admin_requester,
        level_akses_requester
      );
      res
        .status(200)
        .json({ message: "Structure member deleted successfully" });
    } catch (error) {
      if (error.message === "Structure member not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = StrukturAnggotaController;
