const { UniqueConstraintError, ValidationError } = require("sequelize");

const SejarahController = require("../src/controllers/sejarahController");
const SejarahService = require("../src/services/sejarahService");

jest.mock("../src/services/sejarahService");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("Sejarah Controller", () => {
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

    SejarahService.getAllSejarah = jest.fn().mockResolvedValue([]);
    SejarahService.getSejarahById = jest.fn().mockResolvedValue(null);
    SejarahService.createSejarah = jest.fn().mockResolvedValue({});
    SejarahService.updateSejarah = jest.fn().mockResolvedValue({});
    SejarahService.deleteSejarah = jest.fn().mockResolvedValue();
  });

  describe("getAllSejarah", () => {
    it("seharusnya mengembalikan semua sejarah dengan status 200", async () => {
      const mockSejarah = [
        {
          id: 1,
          judul: "Peristiwa A",
        },
      ];
      SejarahService.getAllSejarah.mockResolvedValue(mockSejarah);

      await SejarahController.getAllSejarah(req, res);

      expect(SejarahService.getAllSejarah).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSejarah);
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      SejarahService.getAllSejarah.mockRejectedValue(
        new Error("Database error")
      );

      await SejarahController.getAllSejarah(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("getSejarahById", () => {
    it("seharusnya mengembalikan sejarah berdasarkan ID dengan status 200", async () => {
      const mockSejarah = {
        id: 1,
        judul: "Peristiwa A",
      };
      req.params.id = 1;
      SejarahService.getSejarahById.mockResolvedValue(mockSejarah);

      await SejarahController.getSejarahById(req, res);

      expect(SejarahService.getSejarahById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSejarah);
    });

    it("seharusnya mengembalikan status 404 jika sejarah tidak ditemukan", async () => {
      req.params.id = 99;
      SejarahService.getSejarahById.mockResolvedValue(null);

      await SejarahController.getSejarahById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Sejarah not found",
      });
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      req.params.id = 1;
      SejarahService.getSejarahById.mockRejectedValue(
        new Error("Service error")
      );

      await SejarahController.getSejarahById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Service error",
      });
    });
  });

  describe("createSejarah", () => {
    it("seharusnya membuat sejarah baru dengan status 201", async () => {
      const sejarahData = {
        judul: "Peristiwa Baru",
        deskripsi: "Deskripsi peristiwa",
        tanggal_kejadian: "2023-01-01",
      };
      const mockNewSejarah = {
        id: 1,
        ...sejarahData,
        gambar_sejarah: "/uploads/sejarah/gambar/test.jpg",
      };

      req.body = sejarahData;
      req.files = {
        gambar_sejarah: [
          {
            filename: "test.jpg",
          },
        ],
      };
      SejarahService.createSejarah.mockResolvedValue(mockNewSejarah);

      await SejarahController.createSejarah(req, res);

      expect(SejarahService.createSejarah).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Sejarah created successfully",
        sejarah: mockNewSejarah,
      });
    });

    it("seharusnya mengembalikan status 400 jika ada error validasi Sequelize", async () => {
      const sejarahData = {
        judul: "", // Invalid input
        deskripsi: "Deskripsi peristiwa",
      };
      req.body = sejarahData;
      req.files = {
        gambar_sejarah: [
          {
            filename: "test.jpg",
          },
        ],
      };
      SejarahService.createSejarah.mockRejectedValue(
        new ValidationError("Validation error")
      );

      await SejarahController.createSejarah(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation error",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      const sejarahData = {
        judul: "Peristiwa Baru",
        deskripsi: "Deskripsi peristiwa",
        tanggal_kejadian: "2023-01-01",
      };
      req.body = sejarahData;
      req.files = {
        gambar_sejarah: [
          {
            filename: "test.jpg",
          },
        ],
      };
      SejarahService.createSejarah.mockRejectedValue(
        new Error("Forbidden: Only Admin or Super Admin can create history.")
      );

      await SejarahController.createSejarah(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can create history.",
      });
    });
  });

  describe("updateSejarah", () => {
    it("seharusnya memperbarui sejarah dengan status 200", async () => {
      const updateData = {
        judul: "Peristiwa Diperbarui",
      };
      const mockUpdatedSejarah = {
        id: 1,
        ...updateData,
      };
      req.params.id = 1;
      req.body = updateData;
      SejarahService.updateSejarah.mockResolvedValue(mockUpdatedSejarah);

      await SejarahController.updateSejarah(req, res);

      expect(SejarahService.updateSejarah).toHaveBeenCalledWith(
        1, // ubah dari "1" menjadi 1
        updateData,
        1,
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Sejarah updated successfully",
        sejarah: mockUpdatedSejarah,
      });
    });

    it("seharusnya mengembalikan status 404 jika sejarah tidak ditemukan", async () => {
      req.params.id = 99;
      req.body = {
        judul: "Peristiwa Non-existent",
      };
      SejarahService.updateSejarah.mockRejectedValue(
        new Error("Sejarah not found")
      );

      await SejarahController.updateSejarah(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Sejarah not found",
      });
    });
  });

  describe("deleteSejarah", () => {
    it("seharusnya menghapus sejarah dengan status 200", async () => {
      req.params.id = 1;
      SejarahService.deleteSejarah.mockResolvedValue({
        message: "Sejarah deleted successfully",
      });

      await SejarahController.deleteSejarah(req, res);

      expect(SejarahService.deleteSejarah).toHaveBeenCalledWith(
        1, // ubah dari "1" menjadi 1
        1,
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Sejarah deleted successfully",
      });
    });

    it("seharusnya mengembalikan status 404 jika sejarah tidak ditemukan", async () => {
      req.params.id = 99;
      SejarahService.deleteSejarah.mockRejectedValue(
        new Error("Sejarah not found")
      );

      await SejarahController.deleteSejarah(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Sejarah not found",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      req.params.id = 1;
      SejarahService.deleteSejarah.mockRejectedValue(
        new Error("Forbidden: Only Admin or Super Admin can delete history.")
      );

      await SejarahController.deleteSejarah(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can delete history.",
      });
    });
  });
});
