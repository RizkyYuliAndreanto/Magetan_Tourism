const { UniqueConstraintError, ValidationError } = require("sequelize");

const UMKMController = require("../src/controllers/umkmController");
const UMKMService = require("../src/services/umkmService");

jest.mock("../src/services/umkmService");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("UMKM Controller", () => {
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

    UMKMService.getAllUMKM = jest.fn().mockResolvedValue([]);
    UMKMService.getUMKMById = jest.fn().mockResolvedValue(null);
    UMKMService.createUMKM = jest.fn().mockResolvedValue({});
    UMKMService.updateUMKM = jest.fn().mockResolvedValue({});
    UMKMService.deleteUMKM = jest.fn().mockResolvedValue();
  });

  describe("getAllUMKM", () => {
    it("seharusnya mengembalikan semua UMKM dengan status 200", async () => {
      const mockUMKM = [
        {
          id: 1,
          nama_umkm: "UMKM A",
        },
      ];
      UMKMService.getAllUMKM.mockResolvedValue(mockUMKM);

      await UMKMController.getAllUMKM(req, res);

      expect(UMKMService.getAllUMKM).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUMKM);
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      UMKMService.getAllUMKM.mockRejectedValue(new Error("Database error"));

      await UMKMController.getAllUMKM(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("getUMKMById", () => {
    it("seharusnya mengembalikan UMKM berdasarkan ID dengan status 200", async () => {
      const mockUMKM = {
        id: 1,
        nama_umkm: "UMKM A",
      };
      req.params.id = 1;
      UMKMService.getUMKMById.mockResolvedValue(mockUMKM);

      await UMKMController.getUMKMById(req, res);

      expect(UMKMService.getUMKMById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUMKM);
    });

    it("seharusnya mengembalikan status 404 jika UMKM tidak ditemukan", async () => {
      req.params.id = 99;
      UMKMService.getUMKMById.mockResolvedValue(null);

      await UMKMController.getUMKMById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "UMKM not found",
      });
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      req.params.id = 1;
      UMKMService.getUMKMById.mockRejectedValue(new Error("Service error"));

      await UMKMController.getUMKMById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Service error",
      });
    });
  });

  describe("createUMKM", () => {
    it("seharusnya membuat UMKM baru dengan status 201", async () => {
      const umkmData = {
        nama_umkm: "UMKM Baru",
        deskripsi_umkm: "Deskripsi UMKM",
      };
      const mockNewUMKM = {
        id: 1,
        ...umkmData,
        gambar_produk_utama: "/uploads/umkm/gambar-produk/test.jpg",
      };

      req.body = umkmData;
      req.files = {
        gambar_produk_utama: [
          {
            filename: "test.jpg",
          },
        ],
      };
      UMKMService.createUMKM.mockResolvedValue(mockNewUMKM);

      await UMKMController.createUMKM(req, res);

      expect(UMKMService.createUMKM).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "UMKM created successfully",
        umkm: mockNewUMKM,
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      const umkmData = {
        nama_umkm: "UMKM Baru",
        deskripsi_umkm: "Deskripsi UMKM",
      };
      req.body = umkmData;
      req.files = {
        gambar_produk_utama: [
          {
            filename: "test.jpg",
          },
        ],
      };
      UMKMService.createUMKM.mockRejectedValue(
        new Error("Forbidden: Only Admin or Super Admin can create UMKM.")
      );

      await UMKMController.createUMKM(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can create UMKM.",
      });
    });

    it("seharusnya menangani SequelizeValidationError dan mengembalikan status 400", async () => {
      const umkmData = {
        nama_umkm: "", // Invalid input
        deskripsi_umkm: "Deskripsi UMKM",
      };
      req.body = umkmData;
      req.files = {
        gambar_produk_utama: [
          {
            filename: "test.jpg",
          },
        ],
      };
      UMKMService.createUMKM.mockRejectedValue(
        new ValidationError("Validation error")
      );

      await UMKMController.createUMKM(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation error",
      });
    });
  });

  describe("updateUMKM", () => {
    it("seharusnya memperbarui UMKM dengan status 200", async () => {
      const updateData = {
        nama_umkm: "UMKM Diperbarui",
      };
      const mockUpdatedUMKM = {
        id: 1,
        ...updateData,
      };
      req.params.id = 1;
      req.body = updateData;
      UMKMService.updateUMKM.mockResolvedValue(mockUpdatedUMKM);

      await UMKMController.updateUMKM(req, res);

      expect(UMKMService.updateUMKM).toHaveBeenCalledWith(
        1, // ubah dari "1" menjadi 1
        updateData,
        1,
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "UMKM updated successfully",
        umkm: mockUpdatedUMKM,
      });
    });

    it("seharusnya mengembalikan status 404 jika UMKM tidak ditemukan", async () => {
      req.params.id = 99;
      req.body = {
        nama_umkm: "UMKM Non-existent",
      };
      UMKMService.updateUMKM.mockRejectedValue(new Error("UMKM not found"));

      await UMKMController.updateUMKM(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "UMKM not found",
      });
    });
  });

  describe("deleteUMKM", () => {
    it("seharusnya menghapus UMKM dengan status 200", async () => {
      req.params.id = 1;
      UMKMService.deleteUMKM.mockResolvedValue({
        message: "UMKM deleted successfully",
      });

      await UMKMController.deleteUMKM(req, res);

      expect(UMKMService.deleteUMKM).toHaveBeenCalledWith(
        1, // ubah dari "1" menjadi 1
        1,
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "UMKM deleted successfully",
      });
    });

    it("seharusnya mengembalikan status 404 jika UMKM tidak ditemukan", async () => {
      req.params.id = 99;
      UMKMService.deleteUMKM.mockRejectedValue(new Error("UMKM not found"));

      await UMKMController.deleteUMKM(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "UMKM not found",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      req.params.id = 1;
      UMKMService.deleteUMKM.mockRejectedValue(
        new Error("Forbidden: Only Admin or Super Admin can delete UMKM.")
      );

      await UMKMController.deleteUMKM(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can delete UMKM.",
      });
    });
  });
});
