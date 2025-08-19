const { UniqueConstraintError, ValidationError } = require("sequelize");

const StrukturOrganisasiController = require("../src/controllers/strukturOrganisasiController");
const StrukturOrganisasiService = require("../src/services/strukturOrganisasiService");

jest.mock("../src/services/strukturOrganisasiService");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("StrukturOrganisasi Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    jest.clearAllMocks();
    res = mockResponse();
    req = {
      body: {},
      params: {},
      user: {
        id: 1,
        level_akses: "superadmin",
      },
      files: {},
    };

    StrukturOrganisasiService.getStrukturOrganisasi = jest
      .fn()
      .mockResolvedValue(null);
    StrukturOrganisasiService.createStrukturOrganisasi = jest
      .fn()
      .mockResolvedValue({});
    StrukturOrganisasiService.updateStrukturOrganisasi = jest
      .fn()
      .mockResolvedValue({});
    StrukturOrganisasiService.deleteStrukturOrganisasi = jest
      .fn()
      .mockResolvedValue();
  });

  describe("getStrukturOrganisasi", () => {
    it("seharusnya mengembalikan struktur organisasi dengan status 200", async () => {
      const mockStruktur = {
        id: 1,
        judul_struktur: "Struktur Organisasi",
      };
      StrukturOrganisasiService.getStrukturOrganisasi.mockResolvedValue(
        mockStruktur
      );

      await StrukturOrganisasiController.getStrukturOrganisasi(req, res);

      expect(
        StrukturOrganisasiService.getStrukturOrganisasi
      ).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockStruktur);
    });

    it("seharusnya mengembalikan status 404 jika struktur tidak ditemukan", async () => {
      StrukturOrganisasiService.getStrukturOrganisasi.mockResolvedValue(null);

      await StrukturOrganisasiController.getStrukturOrganisasi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Organizational structure not found",
      });
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      StrukturOrganisasiService.getStrukturOrganisasi.mockRejectedValue(
        new Error("Database error")
      );

      await StrukturOrganisasiController.getStrukturOrganisasi(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("createStrukturOrganisasi", () => {
    it("seharusnya membuat struktur baru dengan status 201", async () => {
      const strukturData = {
        judul_struktur: "Struktur Organisasi Baru",
        deskripsi_struktur: "Deskripsi struktur baru",
      };
      const mockNewStruktur = {
        id: 1,
        ...strukturData,
        gambar_struktur_path: "/uploads/struktur-organisasi/test.jpg",
      };

      req.body = strukturData;
      req.files = {
        gambar_struktur_organisasi: [
          {
            filename: "test.jpg",
          },
        ],
      };
      StrukturOrganisasiService.createStrukturOrganisasi.mockResolvedValue(
        mockNewStruktur
      );

      await StrukturOrganisasiController.createStrukturOrganisasi(req, res);

      expect(
        StrukturOrganisasiService.createStrukturOrganisasi
      ).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Organizational structure created successfully",
        struktur: mockNewStruktur,
      });
    });

    it("seharusnya mengembalikan status 400 jika file gambar tidak ada", async () => {
      req.body = {
        judul_struktur: "Struktur Organisasi Baru",
      };
      req.files = {};

      await StrukturOrganisasiController.createStrukturOrganisasi(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Image file for organizational structure is required.",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      const strukturData = {
        judul_struktur: "Struktur Organisasi Baru",
      };
      req.body = strukturData;
      req.files = {
        gambar_struktur_organisasi: [
          {
            filename: "test.jpg",
          },
        ],
      };
      StrukturOrganisasiService.createStrukturOrganisasi.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can create organizational structure."
        )
      );

      await StrukturOrganisasiController.createStrukturOrganisasi(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Forbidden: Only Admin or Super Admin can create organizational structure.",
      });
    });

    it("seharusnya menangani SequelizeValidationError dan mengembalikan status 400", async () => {
      const strukturData = {
        judul_struktur: "", // Invalid input
      };
      req.body = strukturData;
      req.files = {
        gambar_struktur_organisasi: [
          {
            filename: "test.jpg",
          },
        ],
      };
      StrukturOrganisasiService.createStrukturOrganisasi.mockRejectedValue(
        new ValidationError("Validation error")
      );

      await StrukturOrganisasiController.createStrukturOrganisasi(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation error",
      });
    });
  });

  describe("updateStrukturOrganisasi", () => {
    it("seharusnya memperbarui struktur organisasi dengan status 200", async () => {
      const updateData = {
        judul_struktur: "Struktur Organisasi Diperbarui",
      };
      const mockUpdatedStruktur = {
        id: 1,
        ...updateData,
      };
      req.params.id = 1;
      req.body = updateData;
      StrukturOrganisasiService.updateStrukturOrganisasi.mockResolvedValue(
        mockUpdatedStruktur
      );

      await StrukturOrganisasiController.updateStrukturOrganisasi(req, res);

      expect(
        StrukturOrganisasiService.updateStrukturOrganisasi
      ).toHaveBeenCalledWith(1, expect.any(Object), "superadmin");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Organizational structure updated successfully",
        struktur: mockUpdatedStruktur,
      });
    });

    it("seharusnya mengembalikan status 404 jika struktur tidak ditemukan", async () => {
      req.params.id = 99;
      req.body = {
        judul_struktur: "Struktur Non-existent",
      };
      StrukturOrganisasiService.updateStrukturOrganisasi.mockRejectedValue(
        new Error("Organizational structure not found")
      );

      await StrukturOrganisasiController.updateStrukturOrganisasi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Organizational structure not found",
      });
    });
  });

  describe("deleteStrukturOrganisasi", () => {
    it("seharusnya menghapus struktur organisasi dengan status 200", async () => {
      req.params.id = 1;
      StrukturOrganisasiService.deleteStrukturOrganisasi.mockResolvedValue({
        message: "Organizational structure deleted successfully",
      });

      await StrukturOrganisasiController.deleteStrukturOrganisasi(req, res);

      expect(
        StrukturOrganisasiService.deleteStrukturOrganisasi
      ).toHaveBeenCalledWith(1, "superadmin");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Organizational structure deleted successfully",
      });
    });

    it("seharusnya mengembalikan status 404 jika struktur tidak ditemukan", async () => {
      req.params.id = 99;
      StrukturOrganisasiService.deleteStrukturOrganisasi.mockRejectedValue(
        new Error("Organizational structure not found")
      );

      await StrukturOrganisasiController.deleteStrukturOrganisasi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Organizational structure not found",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      req.params.id = 1;
      StrukturOrganisasiService.deleteStrukturOrganisasi.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can delete organizational structure."
        )
      );

      await StrukturOrganisasiController.deleteStrukturOrganisasi(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Forbidden: Only Admin or Super Admin can delete organizational structure.",
      });
    });
  });
});
