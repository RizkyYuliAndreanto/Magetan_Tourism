const { UniqueConstraintError, ValidationError } = require("sequelize");

const PengumumanController = require("../src/controllers/pengumumanController");
const PengumumanService = require("../src/services/pengumumanService");

jest.mock("../src/services/pengumumanService");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("Pengumuman Controller", () => {
  let req;
  let res;

  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

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

    PengumumanService.getAllPengumuman = jest.fn().mockResolvedValue([]);
    PengumumanService.getPengumumanById = jest.fn().mockResolvedValue(null);
    PengumumanService.createPengumuman = jest.fn().mockResolvedValue({});
    PengumumanService.updatePengumuman = jest.fn().mockResolvedValue({});
    PengumumanService.deletePengumuman = jest.fn().mockResolvedValue();
  });

  describe("getAllPengumuman", () => {
    it("seharusnya mengembalikan semua pengumuman dengan status 200", async () => {
      const mockPengumuman = [
        {
          id: 1,
          judul_pengumuman: "Pengumuman 1",
        },
      ];
      PengumumanService.getAllPengumuman.mockResolvedValue(mockPengumuman);

      await PengumumanController.getAllPengumuman(req, res);

      expect(PengumumanService.getAllPengumuman).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPengumuman);
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      PengumumanService.getAllPengumuman.mockRejectedValue(
        new Error("Database error")
      );

      await PengumumanController.getAllPengumuman(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("getPengumumanById", () => {
    it("seharusnya mengembalikan pengumuman berdasarkan ID dengan status 200", async () => {
      const mockPengumuman = {
        id: 1,
        judul_pengumuman: "Pengumuman 1",
      };
      req.params.id = 1;
      PengumumanService.getPengumumanById.mockResolvedValue(mockPengumuman);

      await PengumumanController.getPengumumanById(req, res);

      expect(PengumumanService.getPengumumanById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockPengumuman);
    });

    it("seharusnya mengembalikan status 404 jika pengumuman tidak ditemukan", async () => {
      req.params.id = 99;
      PengumumanService.getPengumumanById.mockResolvedValue(null);

      await PengumumanController.getPengumumanById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Announcement not found",
      });
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      req.params.id = 1;
      PengumumanService.getPengumumanById.mockRejectedValue(
        new Error("Service error")
      );

      await PengumumanController.getPengumumanById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Service error",
      });
    });
  });

  describe("createPengumuman", () => {
    it("seharusnya membuat pengumuman baru dengan status 201", async () => {
      const pengumumanData = {
        judul_pengumuman: "Pengumuman Baru",
        isi_pengumuman: "Isi pengumuman",
      };
      const mockNewPengumuman = {
        id: 1,
        ...pengumumanData,
        file_pdf_path: "/uploads/pengumuman/pdf/test.pdf",
      };

      req.body = pengumumanData;
      req.files = {
        file_pdf_pengumuman: [
          {
            filename: "test.pdf",
          },
        ],
      };
      PengumumanService.createPengumuman.mockResolvedValue(mockNewPengumuman);

      await PengumumanController.createPengumuman(req, res);

      expect(PengumumanService.createPengumuman).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Announcement created successfully",
        pengumuman: mockNewPengumuman,
      });
    });

    it("seharusnya mengembalikan status 400 jika file PDF tidak ada", async () => {
      req.body = {
        judul_pengumuman: "Pengumuman Baru",
      };
      req.files = {};

      await PengumumanController.createPengumuman(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "PDF file for announcement is required.",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      const pengumumanData = {
        judul_pengumuman: "Pengumuman Baru",
        isi_pengumuman: "Isi pengumuman",
      };
      req.body = pengumumanData;
      req.files = {
        file_pdf_pengumuman: [
          {
            filename: "test.pdf",
          },
        ],
      };
      PengumumanService.createPengumuman.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can create announcement."
        )
      );

      await PengumumanController.createPengumuman(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can create announcement.",
      });
    });

    it("seharusnya menangani SequelizeValidationError dan mengembalikan status 400", async () => {
      const pengumumanData = {
        judul_pengumuman: "", // Invalid input
        isi_pengumuman: "Isi pengumuman",
      };
      req.body = pengumumanData;
      req.files = {
        file_pdf_pengumuman: [
          {
            filename: "test.pdf",
          },
        ],
      };
      PengumumanService.createPengumuman.mockRejectedValue(
        new ValidationError("Validation error")
      );

      await PengumumanController.createPengumuman(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation error",
      });
    });
  });

  describe("updatePengumuman", () => {
    it("seharusnya memperbarui pengumuman dengan status 200", async () => {
      const updateData = {
        judul_pengumuman: "Pengumuman Diperbarui",
      };
      const mockUpdatedPengumuman = {
        id: 1,
        ...updateData,
      };
      req.params.id = 1;
      req.body = updateData;
      PengumumanService.updatePengumuman.mockResolvedValue(
        mockUpdatedPengumuman
      );

      await PengumumanController.updatePengumuman(req, res);

      expect(PengumumanService.updatePengumuman).toHaveBeenCalledWith(
        1, // ubah dari "1" menjadi 1
        expect.any(Object),
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Announcement updated successfully",
        pengumuman: mockUpdatedPengumuman,
      });
    });

    it("seharusnya mengembalikan status 404 jika pengumuman tidak ditemukan", async () => {
      req.params.id = 99;
      req.body = {
        judul_pengumuman: "Pengumuman Non-existent",
      };
      PengumumanService.updatePengumuman.mockRejectedValue(
        new Error("Announcement not found")
      );

      await PengumumanController.updatePengumuman(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Announcement not found",
      });
    });
  });

  describe("deletePengumuman", () => {
    it("seharusnya menghapus pengumuman dengan status 200", async () => {
      req.params.id = 1;
      PengumumanService.deletePengumuman.mockResolvedValue({
        message: "Announcement deleted successfully",
      });

      await PengumumanController.deletePengumuman(req, res);

      expect(PengumumanService.deletePengumuman).toHaveBeenCalledWith(
        1, // ubah dari "1" menjadi 1
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Announcement deleted successfully",
      });
    });

    it("seharusnya mengembalikan status 404 jika pengumuman tidak ditemukan", async () => {
      req.params.id = 99;
      PengumumanService.deletePengumuman.mockRejectedValue(
        new Error("Announcement not found")
      );

      await PengumumanController.deletePengumuman(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Announcement not found",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      req.params.id = 1;
      PengumumanService.deletePengumuman.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can delete announcement."
        )
      );

      await PengumumanController.deletePengumuman(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can delete announcement.",
      });
    });
  });
});
