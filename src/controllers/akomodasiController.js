// src/controllers/akomodasiController.js
const AkomodasiService = require("../services/akomodasiService");

class AkomodasiController {
  // GET all Akomodasi
  static async getAllAkomodasi(req, res) {
    try {
      const akomodasi = await AkomodasiService.getAllAkomodasi();
      res.status(200).json(akomodasi);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Akomodasi by ID
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

  // CREATE new Akomodasi
  static async createAkomodasi(req, res) {
    const {
      nama_hotel,
      deskripsi_hotel,
      alamat_hotel,
      koordinat_lokasi,
      fasilitas, // Ini bisa stringified JSON
      kontak_hotel,
      website_hotel,
      rating_hotel,
      jumlah_dilihat,
      jumlah_share,
    } = req.body;
    const id_admin = req.user.id; // Asumsi id_admin tersedia dari req.user setelah authMiddleware

    // Mengambil path file dari req.files
    const gambar_utama_hotel_path =
      req.files &&
      req.files["gambar_utama_hotel"] &&
      req.files["gambar_utama_hotel"][0]
        ? `/uploads/akomodasi/gambar-utama/${req.files["gambar_utama_hotel"][0].filename}` // Path sesuai multerConfig
        : null;

    // Validasi dasar: nama, deskripsi, alamat hotel harus ada
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
          gambar_utama_hotel: gambar_utama_hotel_path, // Gunakan path yang benar
          kontak_hotel,
          website_hotel,
          rating_hotel: parseFloat(rating_hotel) || null, // Konversi ke float, bisa null
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

  // UPDATE Akomodasi by ID
  static async updateAkomodasi(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const level_akses_requester = req.user.level_akses;

    // Jika ada file baru yang diupload untuk mengganti gambar utama
    if (
      req.files &&
      req.files["gambar_utama_hotel"] &&
      req.files["gambar_utama_hotel"][0]
    ) {
      updateData.gambar_utama_hotel = `/uploads/akomodasi/gambar-utama/${req.files["gambar_utama_hotel"][0].filename}`;
    }

    // Pastikan nilai angka dikonversi jika ada di updateData
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

  // DELETE Akomodasi by ID
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
