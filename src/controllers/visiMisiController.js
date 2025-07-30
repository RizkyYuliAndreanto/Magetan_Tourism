// src/controllers/visiMisiController.js
const VisiMisiService = require("../services/visiMisiService");

class VisiMisiController {
  // GET Visi Misi (biasanya hanya satu entri aktif)
  static async getVisiMisi(req, res) {
    try {
      const visiMisi = await VisiMisiService.getVisiMisi();
      if (!visiMisi) {
        return res
          .status(404)
          .json({ message: "Vision and Mission not found" });
      }
      res.status(200).json(visiMisi);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Visi Misi
  static async createVisiMisi(req, res) {
    const { deskripsi } = req.body; // Sekarang 'deskripsi' adalah kolom teks
    const id_admin = req.user.id;

    // Mengambil path file dari req.files untuk visi_misi_file
    const visi_misi_file_path =
      req.files && req.files["visi_misi_file"] && req.files["visi_misi_file"][0]
        ? `/uploads/visi-misi/${req.files["visi_misi_file"][0].filename}`
        : null;

    // Menentukan tipe file berdasarkan MIME type atau ekstensi (lebih baik berdasarkan MIME)
    let tipe_file_visi_misi = null;
    if (
      req.files &&
      req.files["visi_misi_file"] &&
      req.files["visi_misi_file"][0]
    ) {
      const mimeType = req.files["visi_misi_file"][0].mimetype;
      if (mimeType.startsWith("image/")) {
        tipe_file_visi_misi = "gambar";
      } else if (mimeType === "application/pdf") {
        tipe_file_visi_misi = "pdf";
      }
    }

    // Validasi: Jika tidak ada file dan tidak ada deskripsi, atau jika file wajib
    if (!visi_misi_file_path && !deskripsi) {
      return res
        .status(400)
        .json({
          error:
            "Either a file or a description for Vision and Mission is required.",
        });
    }
    // Jika visi_misi_file_path wajib, uncomment ini:
    // if (!visi_misi_file_path) {
    //   return res.status(400).json({ error: "Vision and Mission file is required." });
    // }

    try {
      const newVisiMisi = await VisiMisiService.createVisiMisi(
        {
          visi_misi_file_path, // Gunakan path file
          tipe_file_visi_misi, // Gunakan tipe file
          deskripsi, // Gunakan deskripsi
          tanggal_pembaruan: new Date(),
          id_admin,
        },
        req.user.level_akses
      );
      res.status(201).json({
        message: "Vision and Mission created successfully",
        visiMisi: newVisiMisi,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: error.message });
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

  // UPDATE Visi Misi by ID
  static async updateVisiMisi(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const level_akses_requester = req.user.level_akses;

    // Jika ada file baru yang diupload
    if (
      req.files &&
      req.files["visi_misi_file"] &&
      req.files["visi_misi_file"][0]
    ) {
      updateData.visi_misi_file_path = `/uploads/visi-misi/${req.files["visi_misi_file"][0].filename}`;

      const mimeType = req.files["visi_misi_file"][0].mimetype;
      if (mimeType.startsWith("image/")) {
        updateData.tipe_file_visi_misi = "gambar";
      } else if (mimeType === "application/pdf") {
        updateData.tipe_file_visi_misi = "pdf";
      }
    }

    // Update tanggal pembaruan jika ada data yang diupdate
    if (Object.keys(updateData).length > 0) {
      updateData.tanggal_pembaruan = new Date();
    }

    try {
      const updatedVisiMisi = await VisiMisiService.updateVisiMisi(
        id,
        updateData,
        level_akses_requester
      );
      res.status(200).json({
        message: "Vision and Mission updated successfully",
        visiMisi: updatedVisiMisi,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Vision and Mission not found") {
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

  // DELETE Visi Misi by ID
  static async deleteVisiMisi(req, res) {
    const { id } = req.params;
    const level_akses_requester = req.user.level_akses;

    try {
      await VisiMisiService.deleteVisiMisi(id, level_akses_requester);
      res
        .status(200)
        .json({ message: "Vision and Mission deleted successfully" });
    } catch (error) {
      if (error.message === "Vision and Mission not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = VisiMisiController;
