const { UniqueConstraintError, ValidationError } = require("sequelize");

const StrukturAnggotaController = require("../src/controllers/strukturAnggotaController");
const StrukturAnggotaService = require("../src/services/strukturAnggotaService");

jest.mock("../src/services/strukturAnggotaService");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("StrukturAnggota Controller", () => {
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

    StrukturAnggotaService.getAllStrukturAnggota = jest
      .fn()
      .mockResolvedValue([]);
    StrukturAnggotaService.getStrukturAnggotaById = jest
      .fn()
      .mockResolvedValue(null);
    StrukturAnggotaService.createStrukturAnggota = jest
      .fn()
      .mockResolvedValue({});
    StrukturAnggotaService.updateStrukturAnggota = jest
      .fn()
      .mockResolvedValue({});
    StrukturAnggotaService.deleteStrukturAnggota = jest
      .fn()
      .mockResolvedValue();
  });

  describe("getAllStrukturAnggota", () => {
    it("seharusnya mengembalikan semua anggota struktur dengan status 200", async () => {
      const mockAnggota = [
        {
          id: 1,
          nama_anggota: "Anggota A",
        },
      ];
      StrukturAnggotaService.getAllStrukturAnggota.mockResolvedValue(
        mockAnggota
      );

      await StrukturAnggotaController.getAllStrukturAnggota(req, res);

      expect(StrukturAnggotaService.getAllStrukturAnggota).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAnggota);
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      StrukturAnggotaService.getAllStrukturAnggota.mockRejectedValue(
        new Error("Database error")
      );

      await StrukturAnggotaController.getAllStrukturAnggota(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("getStrukturAnggotaById", () => {
    it("seharusnya mengembalikan anggota struktur berdasarkan ID dengan status 200", async () => {
      const mockAnggota = {
        id: 1,
        nama_anggota: "Anggota A",
      };
      req.params.id = 1;
      StrukturAnggotaService.getStrukturAnggotaById.mockResolvedValue(
        mockAnggota
      );

      await StrukturAnggotaController.getStrukturAnggotaById(req, res);

      expect(
        StrukturAnggotaService.getStrukturAnggotaById
      ).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAnggota);
    });

    it("seharusnya mengembalikan status 404 jika anggota tidak ditemukan", async () => {
      req.params.id = 99;
      StrukturAnggotaService.getStrukturAnggotaById.mockResolvedValue(null);

      await StrukturAnggotaController.getStrukturAnggotaById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Structure member not found",
      });
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      req.params.id = 1;
      StrukturAnggotaService.getStrukturAnggotaById.mockRejectedValue(
        new Error("Service error")
      );

      await StrukturAnggotaController.getStrukturAnggotaById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Service error",
      });
    });
  });

  describe("createStrukturAnggota", () => {
    it("seharusnya membuat anggota baru dengan status 201", async () => {
      const anggotaData = {
        nama_anggota: "Anggota Baru",
        jabatan: "Jabatan Baru",
        deskripsi_tugas: "Deskripsi tugas baru",
      };
      const mockNewAnggota = {
        id: 1,
        ...anggotaData,
        foto_anggota: "/uploads/struktur-anggota/foto/test.jpg",
      };

      req.body = anggotaData;
      req.files = {
        foto_anggota: [
          {
            filename: "test.jpg",
          },
        ],
      };
      StrukturAnggotaService.createStrukturAnggota.mockResolvedValue(
        mockNewAnggota
      );

      await StrukturAnggotaController.createStrukturAnggota(req, res);

      expect(StrukturAnggotaService.createStrukturAnggota).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Structure member created successfully",
        anggota: mockNewAnggota,
      });
    });

    it("seharusnya mengembalikan status 400 jika ada error validasi Sequelize", async () => {
      const anggotaData = {
        nama_anggota: "", // Invalid input
        jabatan: "Jabatan Baru",
      };
      req.body = anggotaData;
      req.files = {
        foto_anggota: [
          {
            filename: "test.jpg",
          },
        ],
      };
      StrukturAnggotaService.createStrukturAnggota.mockRejectedValue(
        new ValidationError("Validation error")
      );

      await StrukturAnggotaController.createStrukturAnggota(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation error",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      const anggotaData = {
        nama_anggota: "Anggota Baru",
        jabatan: "Jabatan Baru",
      };
      req.body = anggotaData;
      req.files = {
        foto_anggota: [
          {
            filename: "test.jpg",
          },
        ],
      };
      StrukturAnggotaService.createStrukturAnggota.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can create structure members."
        )
      );

      await StrukturAnggotaController.createStrukturAnggota(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Forbidden: Only Admin or Super Admin can create structure members.",
      });
    });
  });

  describe("updateStrukturAnggota", () => {
    it("seharusnya memperbarui anggota struktur dengan status 200", async () => {
      const updateData = {
        jabatan: "Jabatan Diperbarui",
      };
      const mockUpdatedAnggota = {
        id: 1,
        ...updateData,
      };
      req.params.id = 1;
      req.body = updateData;
      StrukturAnggotaService.updateStrukturAnggota.mockResolvedValue(
        mockUpdatedAnggota
      );

      await StrukturAnggotaController.updateStrukturAnggota(req, res);

      // Perbaiki ekspektasi agar sesuai dengan tipe data string dari req.params.id
      expect(StrukturAnggotaService.updateStrukturAnggota).toHaveBeenCalledWith(
        1, // ubah dari "1" menjadi 1
        updateData,
        1,
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Structure member updated successfully",
        anggota: mockUpdatedAnggota,
      });
    });

    it("seharusnya mengembalikan status 404 jika anggota tidak ditemukan", async () => {
      req.params.id = 99;
      req.body = {
        jabatan: "Jabatan Non-existent",
      };
      StrukturAnggotaService.updateStrukturAnggota.mockRejectedValue(
        new Error("Structure member not found")
      );

      await StrukturAnggotaController.updateStrukturAnggota(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Structure member not found",
      });
    });
  });

  describe("deleteStrukturAnggota", () => {
    it("seharusnya menghapus anggota struktur dengan status 200", async () => {
      req.params.id = 1;
      StrukturAnggotaService.deleteStrukturAnggota.mockResolvedValue({
        message: "Structure member deleted successfully",
      });

      await StrukturAnggotaController.deleteStrukturAnggota(req, res);

      // Perbaiki ekspektasi agar sesuai dengan tipe data string dari req.params.id
      expect(StrukturAnggotaService.deleteStrukturAnggota).toHaveBeenCalledWith(
        1, // ubah dari "1" menjadi 1
        1,
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Structure member deleted successfully",
      });
    });

    it("seharusnya mengembalikan status 404 jika anggota tidak ditemukan", async () => {
      req.params.id = 99;
      StrukturAnggotaService.deleteStrukturAnggota.mockRejectedValue(
        new Error("Structure member not found")
      );

      await StrukturAnggotaController.deleteStrukturAnggota(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Structure member not found",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      req.params.id = 1;
      StrukturAnggotaService.deleteStrukturAnggota.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can delete structure members."
        )
      );

      await StrukturAnggotaController.deleteStrukturAnggota(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Forbidden: Only Admin or Super Admin can delete structure members.",
      });
    });
  });
});
