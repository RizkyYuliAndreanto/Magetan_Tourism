const {
  UniqueConstraintError,
  ValidationError,
  SequelizeForeignKeyConstraintError,
} = require("sequelize");

const KategoriPpidController = require("../src/controllers/kategoriPpidController");
const KontenPpidController = require("../src/controllers/kontenPpidController");
const KategoriPpidService = require("../src/services/kategoriPpidService");
const KontenPpidService = require("../src/services/kontenPpidService");

jest.mock("../src/services/kategoriPpidService");
jest.mock("../src/services/kontenPpidService");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("PPID Controllers", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();

    KategoriPpidService.getAllKategoriPpid = jest.fn();
    KategoriPpidService.getKategoriPpidById = jest.fn();
    KategoriPpidService.createKategoriPpid = jest.fn();
    KategoriPpidService.updateKategoriPpid = jest.fn();
    KategoriPpidService.deleteKategoriPpid = jest.fn();

    KontenPpidService.getAllKontenPpid = jest.fn();
    KontenPpidService.getKontenPpidById = jest.fn();
    KontenPpidService.createKontenPpid = jest.fn();
    KontenPpidService.updateKontenPpid = jest.fn();
    KontenPpidService.deleteKontenPpid = jest.fn();
  });

  describe("KategoriPpidController", () => {
    it("seharusnya mengembalikan semua kategori PPID", async () => {
      req = { query: {} };
      const mockKategoris = [
        { id_kategori_ppid: 1, nama_kategori: "Informasi Berkala" },
      ];
      KategoriPpidService.getAllKategoriPpid.mockResolvedValue(mockKategoris);

      await KategoriPpidController.getAllKategoriPpid(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockKategoris);
    });

    it("seharusnya mengembalikan kategori PPID berdasarkan ID", async () => {
      req = { params: { id: "1" }, query: {} };
      const mockKategori = {
        id_kategori_ppid: 1,
        nama_kategori: "Informasi Berkala",
      };
      KategoriPpidService.getKategoriPpidById.mockResolvedValue(mockKategori);

      await KategoriPpidController.getKategoriPpidById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockKategori);
    });

    it("seharusnya mengembalikan 404 jika kategori PPID tidak ditemukan", async () => {
      req = { params: { id: "999" }, query: {} };
      KategoriPpidService.getKategoriPpidById.mockResolvedValue(null);

      await KategoriPpidController.getKategoriPpidById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "PPID category not found",
      });
    });

    it("seharusnya berhasil membuat kategori PPID baru", async () => {
      req = {
        body: { nama_kategori: "Informasi Serta-merta" },
        user: { level_akses: "superadmin" },
      };
      const mockKategori = {
        id_kategori_ppid: 2,
        nama_kategori: "Informasi Serta-merta",
      };
      KategoriPpidService.createKategoriPpid.mockResolvedValue(mockKategori);

      await KategoriPpidController.createKategoriPpid(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "PPID category created successfully",
        kategori: mockKategori,
      });
    });

    it("seharusnya mengembalikan 400 jika nama kategori sudah ada", async () => {
      req = {
        body: { nama_kategori: "Informasi Berkala" },
        user: { level_akses: "admin" },
      };
      KategoriPpidService.createKategoriPpid.mockRejectedValue(
        new UniqueConstraintError({ errors: [{ path: "nama_kategori" }] })
      );

      await KategoriPpidController.createKategoriPpid(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: `Kategori 'Informasi Berkala' already exists. Please choose another name.`,
      });
    });

    it("seharusnya berhasil memperbarui kategori PPID", async () => {
      req = {
        params: { id: "1" },
        body: { nama_kategori: "Informasi Berkala (Revisi)" },
        user: { level_akses: "admin" },
      };
      const mockUpdatedKategori = {
        id_kategori_ppid: 1,
        nama_kategori: "Informasi Berkala (Revisi)",
      };
      KategoriPpidService.updateKategoriPpid.mockResolvedValue(
        mockUpdatedKategori
      );

      await KategoriPpidController.updateKategoriPpid(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "PPID category updated successfully",
        kategori: mockUpdatedKategori,
      });
    });

    it("seharusnya mengembalikan 404 jika kategori yang akan diperbarui tidak ditemukan", async () => {
      req = {
        params: { id: "999" },
        body: { nama_kategori: "Non-existent" },
        user: { level_akses: "admin" },
      };
      KategoriPpidService.updateKategoriPpid.mockRejectedValue(
        new Error("PPID category not found")
      );

      await KategoriPpidController.updateKategoriPpid(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "PPID category not found",
      });
    });

    it("seharusnya berhasil menghapus kategori PPID", async () => {
      req = { params: { id: "1" }, user: { level_akses: "superadmin" } };
      KategoriPpidService.deleteKategoriPpid.mockResolvedValue();

      await KategoriPpidController.deleteKategoriPpid(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "PPID category deleted successfully",
      });
    });

    it("seharusnya mengembalikan 400 jika kategori memiliki konten terkait", async () => {
      req = { params: { id: "1" }, user: { level_akses: "superadmin" } };

      const error = new Error("Foreign key constraint error");
      error.name = "SequelizeForeignKeyConstraintError";

      KategoriPpidService.deleteKategoriPpid.mockRejectedValue(error);

      await KategoriPpidController.deleteKategoriPpid(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Cannot delete category: There are still news articles associated with this category. Please reassign or delete them first.",
      });
    });
  });

  // NOTE: Tes untuk KontenPpidController dapat ditambahkan di bawah ini
});
