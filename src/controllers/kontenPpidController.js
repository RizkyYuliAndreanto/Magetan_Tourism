// src/controllers/kontenPpidController.js
const KontenPpidService = require("../services/kontenPpidService");
const {
  UniqueConstraintError,
  ValidationError,
  SequelizeForeignKeyConstraintError,
} = require("sequelize");

class KontenPpidController {
  // GET all Konten_PPID
  static async getAllKontenPpid(req, res) {
    try {
      const konten = await KontenPpidService.getAllKontenPpid();
      res.status(200).json(konten);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Konten_PPID by ID
  static async getKontenPpidById(req, res) {
    try {
      const { id } = req.params;

      const konten = await KontenPpidService.getKontenPpidById(id);
      if (!konten) {
        return res.status(404).json({ message: "PPID content not found" });
      }
      res.status(200).json(konten);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Konten_PPID
  static async createKontenPpid(req, res) {
    const { judul_konten, deskripsi_konten, id_kategori_ppid } = req.body;
    const id_admin = req.user.id;
    const files = req.files;

    const file_pdf = files?.file_pdf_ppid?.[0];
    const gambar_sampul = files?.gambar_sampul_ppid?.[0];

    const file_pdf_path = file_pdf
      ? `/uploads/ppid/pdf/${file_pdf.filename}`
      : null;
    const gambar_sampul_path = gambar_sampul
      ? `/uploads/ppid/sampul/${gambar_sampul.filename}`
      : null;

    if (!judul_konten || !id_kategori_ppid) {
      return res
        .status(400)
        .json({ error: "Judul konten dan ID kategori PPID wajib diisi." });
    }

    if (!file_pdf_path && !gambar_sampul_path && !deskripsi_konten) {
      return res.status(400).json({
        error:
          "Setidaknya satu dari file PDF, gambar sampul, atau deskripsi wajib diisi.",
      });
    }

    try {
      const newKonten = await KontenPpidService.createKontenPpid(
        {
          judul_konten,
          deskripsi_konten,
          gambar_sampul: gambar_sampul_path,
          file_pdf_path,
          tanggal_publikasi: new Date(),
          id_kategori_ppid: parseInt(id_kategori_ppid),
          id_admin,
        },
        req.user.level_akses
      );

      res.status(201).json({
        message: "PPID content created successfully",
        konten: newKonten,
      });
    } catch (error) {
      if (
        error instanceof ValidationError ||
        error instanceof UniqueConstraintError ||
        error instanceof SequelizeForeignKeyConstraintError
      ) {
        return res.status(400).json({ error: error.message });
      }
      if (
        error.message.includes("Jenis file tidak didukung") ||
        error.message.includes("Unexpected field name") ||
        error.message.includes("Related PPID category not found")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // UPDATE Konten_PPID by ID
  static async updateKontenPpid(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const level_akses_requester = req.user.level_akses;
    const files = req.files;

    const file_pdf = files?.file_pdf_ppid?.[0];
    const gambar_sampul = files?.gambar_sampul_ppid?.[0];

    if (file_pdf) {
      updateData.file_pdf_path = `/uploads/ppid/pdf/${file_pdf.filename}`;
      // Tanggal publikasi diperbarui hanya jika ada file baru diunggah
      updateData.tanggal_publikasi = new Date();
    }

    if (gambar_sampul) {
      updateData.gambar_sampul = `/uploads/ppid/sampul/${gambar_sampul.filename}`;
      // Tanggal publikasi diperbarui hanya jika ada file baru diunggah
      updateData.tanggal_publikasi = new Date();
    }

    // Mengonversi id_kategori_ppid ke integer jika ada
    if (updateData.id_kategori_ppid !== undefined) {
      updateData.id_kategori_ppid = parseInt(updateData.id_kategori_ppid);
    }

    // Jika ada data lain yang diubah, perbarui tanggal publikasi juga
    if (Object.keys(updateData).length > 0 && !updateData.tanggal_publikasi) {
      updateData.tanggal_publikasi = new Date();
    }

    try {
      const updatedKonten = await KontenPpidService.updateKontenPpid(
        id,
        updateData,
        level_akses_requester
      );
      res.status(200).json({
        message: "PPID content updated successfully",
        konten: updatedKonten,
      });
    } catch (error) {
      if (error.message === "PPID content not found") {
        return res.status(404).json({ error: error.message });
      }
      if (
        error.message.includes("Jenis file tidak didukung") ||
        error.message.includes("Unexpected field name") ||
        error.message.includes("Related PPID category for update not found")
      ) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // DELETE Konten_PPID by ID
  static async deleteKontenPpid(req, res) {
    const { id } = req.params;
    const level_akses_requester = req.user.level_akses;

    try {
      await KontenPpidService.deleteKontenPpid(id, level_akses_requester);
      res.status(200).json({ message: "PPID content deleted successfully" });
    } catch (error) {
      if (error.message === "PPID content not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }
}

module.exports = KontenPpidController;
