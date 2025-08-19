const {
  UniqueConstraintError,
  ValidationError,
  SequelizeForeignKeyConstraintError,
} = require("sequelize");
const EventController = require("../src/controllers/eventController");
const EventService = require("../src/services/eventService");

// Mock seluruh modul service
jest.mock("../src/services/eventService");

// Siapkan objek req dan res tiruan
const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

// Grupkan tes
describe("EventController", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();

    // Secara eksplisit definisikan implementasi mock untuk setiap metode
    EventService.getAllEvent = jest.fn();
    EventService.getEventById = jest.fn();
    EventService.createEvent = jest.fn();
    EventService.updateEvent = jest.fn();
    EventService.deleteEvent = jest.fn();
  });

  // --- Tes untuk EventController ---
  // Tes getAllEvent
  describe("getAllEvent", () => {
    it("seharusnya mengembalikan semua event", async () => {
      req = {};
      const mockEvents = [{ id_event: 1, nama_event: "Konser Amal" }];
      EventService.getAllEvent.mockResolvedValue(mockEvents);

      await EventController.getAllEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvents);
    });

    it("seharusnya mengembalikan 500 jika terjadi kesalahan server", async () => {
      req = {};
      EventService.getAllEvent.mockRejectedValue(
        new Error("Database connection failed")
      );

      await EventController.getAllEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database connection failed",
      });
    });
  });

  // Tes getEventById
  describe("getEventById", () => {
    it("seharusnya mengembalikan event berdasarkan ID", async () => {
      req = { params: { id: "1" } }; // KOREKSI: Gunakan string
      const mockEvent = { id_event: 1, nama_event: "Konser Amal" };
      EventService.getEventById.mockResolvedValue(mockEvent);

      await EventController.getEventById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockEvent);
    });

    it("seharusnya mengembalikan 404 jika event tidak ditemukan", async () => {
      req = { params: { id: "999" } }; // KOREKSI: Gunakan string
      EventService.getEventById.mockResolvedValue(null);

      await EventController.getEventById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Event not found" });
    });
  });

  // Tes createEvent
  describe("createEvent", () => {
    it("seharusnya berhasil membuat event baru dengan satu file", async () => {
      req = {
        body: {
          nama_event: "Konser Musik",
          deskripsi_event: "Deskripsi",
          tanggal_mulai: "2025-01-01",
          tanggal_selesai: "2025-01-02",
          lokasi_event: "Lapangan",
          jumlah_dilihat: "0",
          jumlah_share: "0",
        },
        user: { id: 1, level_akses: "admin" },
        files: {
          gambar_event: [{ filename: "event_gambar.jpg" }],
        },
      };
      const mockEvent = { id_event: 1, nama_event: "Konser Musik" };
      EventService.createEvent.mockResolvedValue(mockEvent);

      await EventController.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Event created successfully",
        event: mockEvent,
      });
      expect(EventService.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          nama_event: "Konser Musik",
          gambar_event: "/uploads/event/gambar-event/event_gambar.jpg",
          id_admin: 1,
        }),
        "admin"
      );
    });

    it("seharusnya berhasil membuat event baru dengan dua file", async () => {
      req = {
        body: {
          nama_event: "Pameran Seni",
          deskripsi_event: "Deskripsi",
          tanggal_mulai: "2025-02-01",
          tanggal_selesai: "2025-02-02",
          lokasi_event: "Gedung",
          jumlah_dilihat: "0",
          jumlah_share: "0",
        },
        user: { id: 1, level_akses: "admin" },
        files: {
          brosur_event: [{ filename: "event_brosur.pdf" }],
          gambar_event: [{ filename: "pameran_gambar.jpg" }],
        },
      };
      const mockEvent = { id_event: 2, nama_event: "Pameran Seni" };
      EventService.createEvent.mockResolvedValue(mockEvent);

      await EventController.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Event created successfully",
        event: mockEvent,
      });
      expect(EventService.createEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          nama_event: "Pameran Seni",
          brosur_event: "/uploads/event/brosur/event_brosur.pdf",
          gambar_event: "/uploads/event/gambar-event/pameran_gambar.jpg",
          id_admin: 1,
        }),
        "admin"
      );
    });

    it("seharusnya mengembalikan 400 jika validasi gagal", async () => {
      req = {
        body: {
          nama_event: "Acara",
          deskripsi_event: "", // Deskripsi tidak valid
          tanggal_mulai: "2025-01-01",
          tanggal_selesai: "2025-01-02",
          lokasi_event: "Lapangan",
        },
        user: { id: 1, level_akses: "admin" },
        files: {},
      };
      EventService.createEvent.mockRejectedValue(
        new ValidationError("Validation failed")
      );

      await EventController.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation failed" });
    });

    it("seharusnya mengembalikan 403 jika pengguna tidak memiliki peran yang diizinkan", async () => {
      req = {
        body: {
          nama_event: "Acara",
          deskripsi_event: "Deskripsi",
          tanggal_mulai: "2025-01-01",
          tanggal_selesai: "2025-01-02",
          lokasi_event: "Lapangan",
        },
        user: { id: 1, level_akses: "user" },
      };
      EventService.createEvent.mockRejectedValue(
        new Error("Forbidden: Only Admin or Super Admin can create events.")
      );

      await EventController.createEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can create events.",
      });
    });
  });

  // Tes updateEvent
  describe("updateEvent", () => {
    it("seharusnya berhasil memperbarui event", async () => {
      req = {
        params: { id: "1" }, // KOREKSI: Gunakan string
        body: { nama_event: "Konser Amal Diperbarui" },
        user: { id: 1, level_akses: "admin" },
        files: {},
      };
      const mockUpdatedEvent = {
        id_event: 1,
        nama_event: "Konser Amal Diperbarui",
      };
      EventService.updateEvent.mockResolvedValue(mockUpdatedEvent);

      await EventController.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Event updated successfully",
        event: mockUpdatedEvent,
      });
      expect(EventService.updateEvent).toHaveBeenCalledWith(
        "1",
        { nama_event: "Konser Amal Diperbarui" },
        1,
        "admin"
      );
    });

    it("seharusnya mengembalikan 404 jika event yang akan diperbarui tidak ditemukan", async () => {
      req = {
        params: { id: "999" }, // KOREKSI: Gunakan string
        body: { nama_event: "Non-existent" },
        user: { id: 1, level_akses: "admin" },
        files: {},
      };
      EventService.updateEvent.mockRejectedValue(new Error("Event not found"));

      await EventController.updateEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
    });
  });

  // Tes deleteEvent
  describe("deleteEvent", () => {
    it("seharusnya berhasil menghapus event", async () => {
      req = { params: { id: "1" }, user: { id: 1, level_akses: "superadmin" } }; // KOREKSI: Gunakan string
      EventService.deleteEvent.mockResolvedValue();

      await EventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Event deleted successfully",
      });
      expect(EventService.deleteEvent).toHaveBeenCalledWith(
        "1",
        1,
        "superadmin"
      );
    });

    it("seharusnya mengembalikan 404 jika event yang akan dihapus tidak ditemukan", async () => {
      req = { params: { id: "999" }, user: { id: 1, level_akses: "admin" } }; // KOREKSI: Gunakan string
      EventService.deleteEvent.mockRejectedValue(new Error("Event not found"));

      await EventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Event not found" });
    });

    it("seharusnya mengembalikan 403 jika pengguna tidak memiliki peran yang diizinkan", async () => {
      req = { params: { id: "1" }, user: { id: 2, level_akses: "user" } }; // KOREKSI: Gunakan string
      EventService.deleteEvent.mockRejectedValue(
        new Error("Forbidden: Only Admin or Super Admin can delete events.")
      );

      await EventController.deleteEvent(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can delete events.",
      });
    });
  });
});
