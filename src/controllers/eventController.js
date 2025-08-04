// src/controllers/eventController.js
const EventService = require("../services/eventService");

class EventController {
  // GET all event
  static async getAllEvent(req, res) {
    try {
      const event = await EventService.getAllEvent();
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // GET Event by ID
  static async getEventById(req, res) {
    try {
      const { id } = req.params;
      const event = await EventService.getEventById(id);
      if (!event) {
        return res.status(404).json({ message: "Event not found" });
      }
      res.status(200).json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // CREATE new Event
  static async createEvent(req, res) {
    const {
      nama_event,
      deskripsi_event,
      tanggal_mulai,
      tanggal_selesai,
      lokasi_event,
      koordinat_lokasi,
      jumlah_dilihat,
      jumlah_share,
    } = req.body;
    const id_admin = req.user.id; // Asumsi id_admin tersedia dari req.user setelah authMiddleware

    // Mengambil path file dari req.files
    // req.files adalah objek, di mana setiap kunci adalah nama field, dan nilainya adalah array file
    const brosur_event_path =
      req.files && req.files["brosur_event"] && req.files["brosur_event"][0]
        ? `/uploads/event/brosur/${req.files["brosur_event"][0].filename}`
        : null;
    const gambar_event_path =
      req.files && req.files["gambar_event"] && req.files["gambar_event"][0]
        ? `/uploads/event/gambar-event/${req.files["gambar_event"][0].filename}`
        : null;

    try {
      const newEvent = await EventService.createEvent(
        {
          nama_event,
          deskripsi_event,
          tanggal_mulai,
          tanggal_selesai,
          lokasi_event,
          koordinat_lokasi,
          jumlah_dilihat: parseInt(jumlah_dilihat) || 0, // Pastikan ini angka
          jumlah_share: parseInt(jumlah_share) || 0, // Pastikan ini angka
          gambar_event: gambar_event_path,
          brosur_event: brosur_event_path,
          id_admin,
        },
        req.user.level_akses // Mengirim level_akses untuk otorisasi di service
      );
      res.status(201).json({
        message: "Event created successfully",
        event: newEvent,
      });
    } catch (error) {
      if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
      ) {
        return res.status(400).json({ error: error.message });
      }
      // Multer error biasanya memiliki nama 'MulterError' atau disebabkan oleh 'fileFilter'
      if (error.message.includes("Jenis file tidak didukung")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi atau lainnya
    }
  }

  // UPDATE Event by ID
  static async updateEvent(req, res) {
    const { id } = req.params;
    const updateData = req.body;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    // Jika ada file baru yang diupload, tambahkan ke updateData
    if (req.files) {
      if (req.files["brosur_event"] && req.files["brosur_event"][0]) {
        updateData.brosur_event = `/uploads/event/brosur/${req.files["brosur_event"][0].filename}`;
      }
      if (req.files["gambar_event"] && req.files["gambar_event"][0]) {
        updateData.gambar_event = `/uploads/event/gambar-event/${req.files["gambar_event"][0].filename}`;
      }
    }

    // Pastikan nilai angka dikonversi jika ada di updateData
    if (updateData.jumlah_dilihat) {
      updateData.jumlah_dilihat = parseInt(updateData.jumlah_dilihat);
    }
    if (updateData.jumlah_share) {
      updateData.jumlah_share = parseInt(updateData.jumlah_share);
    }

    try {
      const updatedEvent = await EventService.updateEvent(
        id,
        updateData,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({
        message: "Event updated successfully",
        event: updatedEvent,
      });
    } catch (error) {
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.message });
      }
      if (error.message === "Event not found") {
        return res.status(404).json({ error: error.message });
      }
      // Multer error
      if (error.message.includes("Jenis file tidak didukung")) {
        return res.status(400).json({ error: error.message });
      }
      res.status(403).json({ error: error.message });
    }
  }

  // DELETE Event by ID
  static async deleteEvent(req, res) {
    const { id } = req.params;
    const id_admin_requester = req.user.id;
    const level_akses_requester = req.user.level_akses;

    try {
      await EventService.deleteEvent(
        id,
        id_admin_requester,
        level_akses_requester
      );
      res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
      if (error.message === "Event not found") {
        return res.status(404).json({ error: error.message });
      }
      res.status(403).json({ error: error.message }); // Untuk error otorisasi
    }
  }
}

module.exports = EventController;
