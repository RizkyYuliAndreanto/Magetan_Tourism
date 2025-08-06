const {
  UniqueConstraintError,
  ValidationError,
  SequelizeForeignKeyConstraintError,
} = require("sequelize");
const DestinasiController = require("../src/controllers/destinasiController");
const KategoriDestinasiController = require("../src/controllers/kategoriDestinasiController");
const DestinasiService = require("../src/services/destinasiService");
const KategoriDestinasiService = require("../src/services/kategoriDestinasiService");

// Mock seluruh modul service
jest.mock("../src/services/destinasiService");
jest.mock("../src/services/kategoriDestinasiService");

// Siapkan objek req dan res tiruan
const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

// Grupkan tes
describe("Destinasi & KategoriDestinasi Controllers", () => {
  let req;
  let res;

  beforeEach(() => {
    // KOREKSI: Pastikan metode mock terdefinisi ulang sebelum setiap tes
    jest.clearAllMocks();
    res = mockResponse();

    // Secara eksplisit definisikan implementasi mock untuk setiap metode
    DestinasiService.getAllDestinasi = jest.fn();
    DestinasiService.getDestinasiById = jest.fn();
    DestinasiService.createDestinasi = jest.fn();
    DestinasiService.updateDestinasi = jest.fn();
    DestinasiService.deleteDestinasi = jest.fn();

    KategoriDestinasiService.getAllKategoriDestinasi = jest.fn();
    KategoriDestinasiService.getKategoriDestinasiById = jest.fn();
    KategoriDestinasiService.createKategoriDestinasi = jest.fn();
    KategoriDestinasiService.updateKategoriDestinasi = jest.fn();
    KategoriDestinasiService.deleteKategoriDestinasi = jest.fn();
  });

  // --- Tes untuk KategoriDestinasiController ---
  describe("KategoriDestinasiController", () => {
    // Tes getAllKategoriDestinasi
    it("seharusnya mengembalikan semua kategori destinasi", async () => {
      req = {};
      const mockKategoris = [
        { id_kategori_destinasi: 1, nama_kategori: "Wisata Alam" },
      ];
      KategoriDestinasiService.getAllKategoriDestinasi.mockResolvedValue(
        mockKategoris
      );

      await KategoriDestinasiController.getAllKategoriDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockKategoris);
    });

    // Tes getKategoriDestinasiById
    it("seharusnya mengembalikan kategori destinasi berdasarkan ID", async () => {
      req = { params: { id: 1 } };
      const mockKategori = {
        id_kategori_destinasi: 1,
        nama_kategori: "Wisata Alam",
      };
      KategoriDestinasiService.getKategoriDestinasiById.mockResolvedValue(
        mockKategori
      );

      await KategoriDestinasiController.getKategoriDestinasiById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockKategori);
    });

    it("seharusnya mengembalikan 404 jika kategori destinasi tidak ditemukan", async () => {
      req = { params: { id: 999 } };
      KategoriDestinasiService.getKategoriDestinasiById.mockResolvedValue(null);

      await KategoriDestinasiController.getKategoriDestinasiById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Kategori Destinasi not found",
      });
    });

    // Tes createKategoriDestinasi
    it("seharusnya berhasil membuat kategori destinasi baru", async () => {
      req = {
        body: {
          nama_kategori: "Wisata Buatan",
          deskripsi_kategori: "Berita tentang wisata buatan",
        },
        user: { level_akses: "superadmin" },
      };
      const mockKategori = {
        id_kategori_destinasi: 2,
        nama_kategori: "Wisata Buatan",
      };
      KategoriDestinasiService.createKategoriDestinasi.mockResolvedValue(
        mockKategori
      );

      await KategoriDestinasiController.createKategoriDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Kategori Destinasi created successfully",
        kategori: mockKategori,
      });
      expect(
        KategoriDestinasiService.createKategoriDestinasi
      ).toHaveBeenCalledWith(req.body, "superadmin");
    });

    it("seharusnya mengembalikan 400 jika nama kategori sudah ada", async () => {
      req = {
        body: {
          nama_kategori: "Wisata Alam",
          deskripsi_kategori: "Berita alam",
        },
        user: { level_akses: "admin" },
      };
      KategoriDestinasiService.createKategoriDestinasi.mockRejectedValue(
        new UniqueConstraintError({ errors: [{ path: "nama_kategori" }] })
      );

      await KategoriDestinasiController.createKategoriDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Kategori 'Wisata Alam' already exists. Please choose another name.",
      });
    });

    // Tes updateKategoriDestinasi
    it("seharusnya berhasil memperbarui kategori destinasi", async () => {
      req = {
        params: { id: 1 },
        body: { nama_kategori: "Wisata Alam & Pegunungan" },
        user: { level_akses: "admin" },
      };
      const mockUpdatedKategori = {
        id_kategori_destinasi: 1,
        nama_kategori: "Wisata Alam & Pegunungan",
      };
      KategoriDestinasiService.updateKategoriDestinasi.mockResolvedValue(
        mockUpdatedKategori
      );

      await KategoriDestinasiController.updateKategoriDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Kategori Destinasi updated successfully",
        kategori: mockUpdatedKategori,
      });
    });

    it("seharusnya mengembalikan 404 jika kategori destinasi yang akan diperbarui tidak ditemukan", async () => {
      req = {
        params: { id: 999 },
        body: { nama_kategori: "Non-existent" },
        user: { level_akses: "admin" },
      };
      KategoriDestinasiService.updateKategoriDestinasi.mockRejectedValue(
        new Error("Kategori Destinasi not found")
      );

      await KategoriDestinasiController.updateKategoriDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Kategori Destinasi not found",
      });
    });

    // Tes deleteKategoriDestinasi
    it("seharusnya berhasil menghapus kategori destinasi", async () => {
      req = { params: { id: 1 }, user: { level_akses: "superadmin" } };
      KategoriDestinasiService.deleteKategoriDestinasi.mockResolvedValue();

      await KategoriDestinasiController.deleteKategoriDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Kategori Destinasi deleted successfully",
      });
    });

    it("seharusnya mengembalikan 400 jika kategori memiliki destinasi terkait", async () => {
      req = { params: { id: 1 }, user: { level_akses: "superadmin" } };
      // KOREKSI: Gunakan mock error dengan properti 'name' yang benar
      KategoriDestinasiService.deleteKategoriDestinasi.mockRejectedValue({
        name: "SequelizeForeignKeyConstraintError",
        message: "FOREIGN KEY constraint failed",
      });

      await KategoriDestinasiController.deleteKategoriDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Cannot delete category: There are still news articles associated with this category. Please reassign or delete them first.",
      });
    });
  });

  // --- Tes untuk DestinasiController ---
  describe("DestinasiController", () => {
    it("seharusnya mengembalikan semua destinasi", async () => {
      req = {};
      const mockDestinasis = [
        { id_destinasi: 1, nama_destinasi: "Telaga Sarangan" },
      ];
      DestinasiService.getAllDestinasi.mockResolvedValue(mockDestinasis);

      await DestinasiController.getAllDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDestinasis);
    });

    it("seharusnya mengembalikan destinasi berdasarkan ID", async () => {
      req = { params: { id: 1 } };
      const mockDestinasi = {
        id_destinasi: 1,
        nama_destinasi: "Telaga Sarangan",
      };
      DestinasiService.getDestinasiById.mockResolvedValue(mockDestinasi);

      await DestinasiController.getDestinasiById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDestinasi);
    });

    it("seharusnya mengembalikan 404 jika destinasi tidak ditemukan", async () => {
      req = { params: { id: 999 } };
      DestinasiService.getDestinasiById.mockResolvedValue(null);

      await DestinasiController.getDestinasiById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Destinasi not found" });
    });

    it("seharusnya berhasil membuat destinasi baru", async () => {
      req = {
        body: {
          nama_destinasi: "Telaga Sarangan",
          deskripsi_destinasi: "Danau indah",
          alamat: "Magetan",
          id_kategori_destinasi: 1,
        },
        user: { id: 1, level_akses: "admin" },
        files: {
          gambar_utama: [{ filename: "sarangan.jpg" }],
        },
      };
      const mockDestinasi = {
        id_destinasi: 1,
        nama_destinasi: "Telaga Sarangan",
      };
      DestinasiService.createDestinasi.mockResolvedValue(mockDestinasi);

      await DestinasiController.createDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Destinasi created successfully",
        destinasi: mockDestinasi,
      });
      // KOREKSI: Gunakan expect.objectContaining untuk mencocokkan sebagian objek
      expect(DestinasiService.createDestinasi).toHaveBeenCalledWith(
        expect.objectContaining({
          nama_destinasi: "Telaga Sarangan",
          gambar_utama: "/uploads/destinasi/gambar-utama/sarangan.jpg",
          id_admin: 1,
          id_kategori_destinasi: 1,
        }),
        "admin"
      );
    });

    it("seharusnya mengembalikan 400 jika validasi gagal", async () => {
      req = {
        body: {
          nama_destinasi: "Telaga",
          deskripsi_destinasi: "",
          alamat: "Magetan",
          id_kategori_destinasi: 1,
        },
        user: { id: 1, level_akses: "admin" },
      };
      DestinasiService.createDestinasi.mockRejectedValue(
        new ValidationError("Validation failed")
      );

      await DestinasiController.createDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Validation failed" });
    });

    it("seharusnya berhasil memperbarui destinasi", async () => {
      req = {
        params: { id: 1 },
        body: { nama_destinasi: "Telaga Sarangan Diperbarui" },
        user: { id: 1, level_akses: "admin" },
        files: {},
      };
      const mockUpdatedDestinasi = {
        id_destinasi: 1,
        nama_destinasi: "Telaga Sarangan Diperbarui",
      };
      DestinasiService.updateDestinasi.mockResolvedValue(mockUpdatedDestinasi);

      await DestinasiController.updateDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Destinasi updated successfully",
        destinasi: mockUpdatedDestinasi,
      });
    });

    it("seharusnya mengembalikan 404 jika destinasi yang akan diperbarui tidak ditemukan", async () => {
      req = {
        params: { id: 999 },
        body: { nama_destinasi: "Non-existent" },
        user: { id: 1, level_akses: "admin" },
      };
      DestinasiService.updateDestinasi.mockRejectedValue(
        new Error("Destinasi not found")
      );

      await DestinasiController.updateDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Destinasi not found" });
    });

    it("seharusnya berhasil menghapus destinasi", async () => {
      req = { params: { id: 1 }, user: { id: 1, level_akses: "superadmin" } };
      DestinasiService.deleteDestinasi.mockResolvedValue();

      await DestinasiController.deleteDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Destinasi deleted successfully",
      });
    });

    it("seharusnya mengembalikan 404 jika destinasi yang akan dihapus tidak ditemukan", async () => {
      req = { params: { id: 999 }, user: { id: 1, level_akses: "admin" } };
      DestinasiService.deleteDestinasi.mockRejectedValue(
        new Error("Destinasi not found")
      );

      await DestinasiController.deleteDestinasi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Destinasi not found" });
    });
  });
});
