// src/services/eventService.js
const { Event, Admin, Media_Galeri } = require("../models"); // Pastikan path benar
const FileHelper = require("../utils/fileHelper");
const InteractionService = require("./interactionService");

class EventService {
  static async getAllEvent() {
    try {
      const event = await Event.findAll({
        include: [
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "level_akses"],
          },
          {
            // Tambahkan include untuk Media_Galeri di sini
            model: Media_Galeri,
            as: "galeriEvent",
            attributes: [
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
            order: [["urutan_tampil", "ASC"]], // Urutkan media di galeri
          },
        ],
      });
      return event;
    } catch (error) {
      throw new Error("Could not fetch event: " + error.message); // Perbaikan typo 'devent'
    }
  }

  static async getEventById(id) {
    try {
      const event = await Event.findByPk(id, {
        include: [
          {
            model: Admin,
            as: "adminPembuat",
            attributes: ["username", "nama_lengkap", "email", "level_akses"],
          },
          {
            // Tambahkan include untuk Media_Galeri di sini
            model: Media_Galeri,
            as: "galeriEvent",
            attributes: [
              "path_file",
              "deskripsi_file",
              "jenis_file",
              "urutan_tampil",
            ],
            order: [["urutan_tampil", "ASC"]], // Urutkan media di galeri
          },
          // Anda bisa menambahkan include untuk Komentar, Like, dll. jika diperlukan
        ],
      });
      return event;
    } catch (error) {
      throw new Error("Could not fetch event by ID: " + error.message);
    }
  }

  static async createEvent(eventData, requesterLevelAkses) {
    try {
      // Otorisasi: Hanya admin atau superadmin yang bisa membuat event
      if (
        requesterLevelAkses !== "admin" &&
        requesterLevelAkses !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can create events."
        );
      }

      const newEvent = await Event.create(eventData);
      return newEvent;
    } catch (error) {
      // Sequelize validation errors will be caught here and re-thrown
      throw new Error("Could not create event: " + error.message);
    }
  }

  static async updateEvent(
    id,
    updateData,
    idAdminRequester,
    levelAksesRequester
  ) {
    try {
      // Perbaikan: Ganti Destinasi menjadi Event
      const event = await Event.findByPk(id);

      if (!event) {
        throw new Error("Event not found"); // Perbaikan: capital E
      }

      // Otorisasi:
      // Super Admin bisa mengedit event apapun.
      // Admin hanya bisa mengedit event yang dibuatnya sendiri.
      if (
        levelAksesRequester === "admin" &&
        event.id_admin !== idAdminRequester
      ) {
        throw new Error("Forbidden: You can only update your own events.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can update events."
        );
      }

      await event.update(updateData);
      return event;
    } catch (error) {
      throw new Error("Could not update event: " + error.message);
    }
  }

  static async deleteEvent(id, idAdminRequester, levelAksesRequester) {
    try {
      const event = await Event.findByPk(id, {
        include: [
          {
            model: Media_Galeri,
            as: "galeriEvent",
            attributes: ["path_file"],
          },
        ],
      });

      if (!event) {
        throw new Error("Event not found"); // Perbaikan: capital E
      }

      // Otorisasi:
      // Super Admin bisa menghapus event apapun.
      // Admin hanya bisa menghapus event yang dibuatnya sendiri.
      if (
        levelAksesRequester === "admin" &&
        event.id_admin !== idAdminRequester // Perbaikan: Akses id_admin dari instance event
      ) {
        throw new Error("Forbidden: You can only delete your own events.");
      } else if (
        levelAksesRequester !== "admin" &&
        levelAksesRequester !== "superadmin"
      ) {
        throw new Error(
          "Forbidden: Only Admin or Super Admin can delete events."
        );
      }

      // Hapus file gambar dan brosur
      const filesToDelete = [];
      if (event.gambar_event) filesToDelete.push(event.gambar_event);
      if (event.brosur_event) filesToDelete.push(event.brosur_event);

      // Hapus file galeri terkait
      if (event.galeriEvent && event.galeriEvent.length > 0) {
        const galeriFiles = event.galeriEvent.map((item) => item.path_file);
        filesToDelete.push(...galeriFiles);
      }

      FileHelper.deleteMultipleFiles(filesToDelete);

      // Hapus interactions terkait
      await InteractionService.deleteAllInteractionsByContent("event", id);

      await event.destroy();
      return { message: "Event deleted successfully" };
    } catch (error) {
      throw new Error("Could not delete event: " + error.message); // Perbaikan typo 'berita'
    }
  }

  // Method untuk mendapatkan event dengan interaksi
  static async getEventWithInteractions(id, userId = null) {
    try {
      const event = await this.getEventById(id);
      if (!event) {
        throw new Error("Event not found");
      }

      const interactions = await InteractionService.getContentInteractions(
        "event",
        id,
        userId
      );

      return {
        ...event.toJSON(),
        interactions,
      };
    } catch (error) {
      throw new Error(
        "Could not fetch event with interactions: " + error.message
      );
    }
  }
}

module.exports = EventService;
