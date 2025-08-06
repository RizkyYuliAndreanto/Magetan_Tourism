const { UniqueConstraintError, ValidationError } = require("sequelize");
const BeritaController = require("../src/controllers/beritaController");
const KategoriBeritaController = require("../src/controllers/kategoriBeritaController");
const BeritaService = require("../src/services/beritaService");
const KategoriBeritaService = require("../src/services/kategoriBeritaService");

// Mock seluruh modul service
jest.mock("../src/services/beritaService");
jest.mock("../src/services/kategoriBeritaService");

// Siapkan objek req dan res tiruan
const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

// Grupkan tes
describe("Berita & KategoriBerita Controllers", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
  });

  // --- Tes untuk KategoriBeritaController ---
  describe("KategoriBeritaController", () => {
    // Tes getAllKategoriBerita
    it("seharusnya mengembalikan semua kategori berita", async () => {
      req = {};
      const mockKategoris = [{ id_kategori: 1, nama_kategori: "Budaya" }];
      KategoriBeritaService.getAllKategoriBerita.mockResolvedValue(
        mockKategoris
      );

      await KategoriBeritaController.getAllKategoriBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockKategoris);
    });

    // Tes getKategoriBeritaById
    it("seharusnya mengembalikan kategori berita berdasarkan ID", async () => {
      req = { params: { id: 1 } };
      const mockKategori = { id_kategori: 1, nama_kategori: "Budaya" };
      KategoriBeritaService.getKategoriBeritaById.mockResolvedValue(
        mockKategori
      );

      await KategoriBeritaController.getKategoriBeritaById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockKategori);
    });

    it("seharusnya mengembalikan 404 jika kategori berita tidak ditemukan", async () => {
      req = { params: { id: 999 } };
      KategoriBeritaService.getKategoriBeritaById.mockResolvedValue(null);

      await KategoriBeritaController.getKategoriBeritaById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Kategori Berita not found",
      });
    });

    // Tes createKategoriBerita
    it("seharusnya berhasil membuat kategori berita baru", async () => {
      req = {
        body: {
          nama_kategori: "Olahraga",
          deskripsi_kategori: "Berita tentang olahraga",
        },
        user: { level_akses: "superadmin" },
      };
      const mockKategori = { id_kategori: 2, nama_kategori: "Olahraga" };
      KategoriBeritaService.createKategoriBerita.mockResolvedValue(
        mockKategori
      );

      await KategoriBeritaController.createKategoriBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Kategori Berita created successfully",
        kategori: mockKategori,
      });
      expect(KategoriBeritaService.createKategoriBerita).toHaveBeenCalledWith(
        req.body,
        "superadmin"
      );
    });

    it("seharusnya mengembalikan 400 jika nama kategori sudah ada", async () => {
      req = {
        body: { nama_kategori: "Budaya", deskripsi_kategori: "Berita budaya" },
        user: { level_akses: "admin" },
      };
      KategoriBeritaService.createKategoriBerita.mockRejectedValue(
        new UniqueConstraintError({ errors: [{ path: "nama_kategori" }] })
      );

      await KategoriBeritaController.createKategoriBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Kategori 'Budaya' already exists. Please choose another name.",
      });
    });

    // Tes updateKategoriBerita
    it("seharusnya berhasil memperbarui kategori berita", async () => {
      req = {
        params: { id: 1 },
        body: { nama_kategori: "Budaya dan Seni" },
        user: { level_akses: "admin" },
      };
      const mockUpdatedKategori = {
        id_kategori: 1,
        nama_kategori: "Budaya dan Seni",
      };
      KategoriBeritaService.updateKategoriBerita.mockResolvedValue(
        mockUpdatedKategori
      );

      await KategoriBeritaController.updateKategoriBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Kategori Berita updated successfully",
        kategori: mockUpdatedKategori,
      });
    });

    it("seharusnya mengembalikan 404 jika kategori berita yang akan diperbarui tidak ditemukan", async () => {
      req = {
        params: { id: 999 },
        body: { nama_kategori: "Non-existent" },
        user: { level_akses: "admin" },
      };
      KategoriBeritaService.updateKategoriBerita.mockRejectedValue(
        new Error("Kategori Berita not found")
      );

      await KategoriBeritaController.updateKategoriBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Kategori Berita not found",
      });
    });

    // Tes deleteKategoriBerita
    it("seharusnya berhasil menghapus kategori berita", async () => {
      req = { params: { id: 1 }, user: { level_akses: "superadmin" } };
      KategoriBeritaService.deleteKategoriBerita.mockResolvedValue();

      await KategoriBeritaController.deleteKategoriBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Kategori Berita deleted successfully",
      });
    });

    it("seharusnya mengembalikan 404 jika kategori berita yang akan dihapus tidak ditemukan", async () => {
      req = { params: { id: 999 }, user: { level_akses: "admin" } };
      KategoriBeritaService.deleteKategoriBerita.mockRejectedValue(
        new Error("Kategori Berita not found")
      );

      await KategoriBeritaController.deleteKategoriBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Kategori Berita not found",
      });
    });
  });

  // --- Tes untuk BeritaController ---
  describe("BeritaController", () => {
    // Tes getAllBerita
    it("seharusnya mengembalikan semua berita dengan galeri", async () => {
      req = {};
      const mockBeritas = [
        { id_berita: 1, judul: "Berita 1", galeriBerita: [] },
      ];
      BeritaService.getAllBerita.mockResolvedValue(mockBeritas);

      await BeritaController.getAllBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBeritas);
    });

    // Tes getBeritaById
    it("seharusnya mengembalikan berita berdasarkan ID", async () => {
      req = { params: { id: 1 } };
      const mockBerita = { id_berita: 1, judul: "Berita 1", galeriBerita: [] };
      BeritaService.getBeritaById.mockResolvedValue(mockBerita);

      await BeritaController.getBeritaById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockBerita);
    });

    it("seharusnya mengembalikan 404 jika berita tidak ditemukan", async () => {
      req = { params: { id: 999 } };
      BeritaService.getBeritaById.mockResolvedValue(null);

      await BeritaController.getBeritaById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Berita not found" });
    });

    // Tes createBerita
    it("seharusnya berhasil membuat berita baru", async () => {
      req = {
        body: {
          judul: "Berita Test",
          teras_berita: "Teras...",
          isi_berita: "Isi...",
          tanggal_publikasi: "2025-01-01T00:00:00Z",
          id_kategori: 1,
        },
        user: { id: 1, level_akses: "admin" },
        files: {
          gambar_hero_berita: [{ filename: "test_image.jpg" }],
        },
      };
      const mockBerita = { id_berita: 1, judul: "Berita Test" };
      BeritaService.createBerita.mockResolvedValue(mockBerita);

      await BeritaController.createBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Berita created successfully",
        berita: mockBerita,
      });
      expect(BeritaService.createBerita).toHaveBeenCalledWith(
        expect.objectContaining({
          judul: "Berita Test",
          gambar_hero_berita: "/uploads/berita/gambar-hero/test_image.jpg",
          id_admin: 1,
        }),
        "admin"
      );
    });

    it("seharusnya mengembalikan 400 jika kategori tidak ditemukan", async () => {
      req = {
        body: {
          judul: "Berita Test",
          teras_berita: "Teras...",
          isi_berita: "Isi...",
          tanggal_publikasi: "2025-01-01T00:00:00Z",
          id_kategori: 999,
        },
        user: { id: 1, level_akses: "admin" },
      };
      BeritaService.createBerita.mockRejectedValue(
        new Error("Kategori dengan ID 999 tidak ditemukan.")
      );

      await BeritaController.createBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Kategori dengan ID 999 tidak ditemukan.",
      });
    });

    // Tes updateBerita
    it("seharusnya berhasil memperbarui berita", async () => {
      req = {
        params: { id: 1 },
        body: { judul: "Berita Test Update" },
        user: { id: 1, level_akses: "admin" },
        files: {},
      };
      const mockUpdatedBerita = { id_berita: 1, judul: "Berita Test Update" };
      BeritaService.updateBerita.mockResolvedValue(mockUpdatedBerita);

      await BeritaController.updateBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Berita updated successfully",
        berita: mockUpdatedBerita,
      });
    });

    it("seharusnya mengembalikan 404 jika berita yang akan diperbarui tidak ditemukan", async () => {
      req = {
        params: { id: 999 },
        body: { judul: "Non-existent" },
        user: { id: 1, level_akses: "admin" },
      };
      BeritaService.updateBerita.mockRejectedValue(
        new Error("Berita not found")
      );

      await BeritaController.updateBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Berita not found" });
    });

    // Tes deleteBerita
    it("seharusnya berhasil menghapus berita", async () => {
      req = { params: { id: 1 }, user: { id: 1, level_akses: "superadmin" } };
      BeritaService.deleteBerita.mockResolvedValue();

      await BeritaController.deleteBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Berita deleted successfully",
      });
    });

    it("seharusnya mengembalikan 404 jika berita yang akan dihapus tidak ditemukan", async () => {
      req = { params: { id: 999 }, user: { id: 1, level_akses: "admin" } };
      BeritaService.deleteBerita.mockRejectedValue(
        new Error("Berita not found")
      );

      await BeritaController.deleteBerita(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Berita not found" });
    });
  });
});
