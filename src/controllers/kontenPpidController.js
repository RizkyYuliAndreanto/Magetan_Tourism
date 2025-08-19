// src/controllers/kontenPpidController.js
const KontenPpidService = require("../services/kontenPpidService");

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

    // Mengambil path file PDF
    const file_pdf_path =
      req.files && req.files["file_pdf_ppid"] && req.files["file_pdf_ppid"][0]
        ? `/uploads/ppid/pdf/${req.files["file_pdf_ppid"][0].filename}`
        : null;

    // Mengambil path gambar sampul
    const gambar_sampul_path =
      req.files &&
      req.files["gambar_sampul_ppid"] &&
      req.files["gambar_sampul_ppid"][0]
        ? `/uploads/ppid/sampul/${req.files["gambar_sampul_ppid"][0].filename}`
        : null;

    // Mengambil file galeri
    const gambar_ppid_galeri_files =
      req.files && req.files["gambar_ppid_galeri"]
        ? req.files["gambar_ppid_galeri"]
        : [];

    // Validasi: harus ada salah satu dari file PDF, gambar sampul, gambar galeri, atau deskripsi
    if (
      !file_pdf_path &&
      !gambar_sampul_path &&
      gambar_ppid_galeri_files.length === 0 &&
      !deskripsi_konten
    ) {
      return res.status(400).json({
        error:
          "At least one of PDF file, cover image, gallery images, or description is required.",
      });
    }
    if (!id_kategori_ppid) {
      return res.status(400).json({ error: "PPID category ID is required." });
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

      const uploadedGalleryMedia = [];
      for (const file of gambar_ppid_galeri_files) {
        const mediaData = {
          id_konten: newKonten.id_konten_ppid,
          tipe_konten: "ppid_konten",
          path_file: `/uploads/ppid/galeri/${file.filename}`,
          deskripsi_file: `Gambar untuk ${newKonten.judul_konten}`,
          jenis_file: file.mimetype.startsWith("image/") ? "gambar" : "video",
        };
        // Logika untuk menyimpan ke tabel Media_Galeri
        console.log(
          "Gambar galeri PPID untuk konten baru:",
          mediaData.path_file
        );
      }

      res.status(201).json({
        message: "PPID content created successfully",
        konten: newKonten,
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

  // UPDATE Konten_PPID by ID
  static async updateKontenPpid(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const level_akses_requester = req.user.level_akses;

    if (
      req.files &&
      req.files["file_pdf_ppid"] &&
      req.files["file_pdf_ppid"][0]
    ) {
      updateData.file_pdf_path = `/uploads/ppid/pdf/${req.files["file_pdf_ppid"][0].filename}`;
      updateData.tanggal_publikasi = new Date();
    }

    // Menambahkan logika untuk update gambar sampul
    if (
      req.files &&
      req.files["gambar_sampul_ppid"] &&
      req.files["gambar_sampul_ppid"][0]
    ) {
      updateData.gambar_sampul = `/uploads/ppid/sampul/${req.files["gambar_sampul_ppid"][0].filename}`;
      updateData.tanggal_publikasi = new Date();
    }

    const new_gambar_ppid_galeri_files =
      req.files && req.files["gambar_ppid_galeri"]
        ? req.files["gambar_ppid_galeri"]
        : [];

    if (updateData.id_kategori_ppid !== undefined) {
      updateData.id_kategori_ppid = parseInt(updateData.id_kategori_ppid);
    }

    if (Object.keys(updateData).length > 0 && !updateData.tanggal_publikasi) {
      updateData.tanggal_publikasi = new Date();
    }

    try {
      const updatedKonten = await KontenPpidService.updateKontenPpid(
        id,
        updateData,
        level_akses_requester
      );

      const uploadedGalleryMedia = [];
      for (const file of new_gambar_ppid_galeri_files) {
        const mediaData = {
          id_konten: updatedKonten.id_konten_ppid,
          tipe_konten: "ppid_konten",
          path_file: `/uploads/ppid/galeri/${file.filename}`,
          deskripsi_file: `Gambar untuk ${updatedKonten.judul_konten}`,
          jenis_file: file.mimetype.startsWith("image/") ? "gambar" : "video",
        };
        // Logika untuk menyimpan ke tabel Media_Galeri
        console.log(
          "Gambar galeri PPID baru diupdate untuk konten:",
          mediaData.path_file
        );
      }

      res.status(200).json({
        message: "PPID content updated successfully",
        konten: updatedKonten,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "PPID content not found") {
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
