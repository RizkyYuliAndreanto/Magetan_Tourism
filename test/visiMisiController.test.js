const { UniqueConstraintError, ValidationError } = require("sequelize");

const VisiMisiController = require("../src/controllers/visiMisiController");
const VisiMisiService = require("../src/services/visiMisiService");

jest.mock("../src/services/visiMisiService");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("VisiMisi Controller", () => {
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

    VisiMisiService.getVisiMisi = jest.fn().mockResolvedValue(null);
    VisiMisiService.createVisiMisi = jest.fn().mockResolvedValue({});
    VisiMisiService.updateVisiMisi = jest.fn().mockResolvedValue({});
    VisiMisiService.deleteVisiMisi = jest.fn().mockResolvedValue();
  });

  describe("getVisiMisi", () => {
    it("seharusnya mengembalikan Visi Misi dengan status 200", async () => {
      const mockVisiMisi = {
        id: 1,
        deskripsi: "Ini adalah Visi Misi",
      };
      VisiMisiService.getVisiMisi.mockResolvedValue(mockVisiMisi);

      await VisiMisiController.getVisiMisi(req, res);

      expect(VisiMisiService.getVisiMisi).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockVisiMisi);
    });

    it("seharusnya mengembalikan status 404 jika Visi Misi tidak ditemukan", async () => {
      VisiMisiService.getVisiMisi.mockResolvedValue(null);

      await VisiMisiController.getVisiMisi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Vision and Mission not found",
      });
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      VisiMisiService.getVisiMisi.mockRejectedValue(
        new Error("Database error")
      );

      await VisiMisiController.getVisiMisi(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("createVisiMisi", () => {
    it("seharusnya membuat Visi Misi baru dengan status 201", async () => {
      const visiMisiData = {
        deskripsi: "Visi Misi Baru",
      };
      const mockNewVisiMisi = {
        id: 1,
        ...visiMisiData,
        visi_misi_file_path: "/uploads/visi-misi/test.pdf",
      };

      req.body = visiMisiData;
      req.files = {
        visi_misi_file: [
          {
            filename: "test.pdf",
            mimetype: "application/pdf",
          },
        ],
      };
      VisiMisiService.createVisiMisi.mockResolvedValue(mockNewVisiMisi);

      await VisiMisiController.createVisiMisi(req, res);

      expect(VisiMisiService.createVisiMisi).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Vision and Mission created successfully",
        visiMisi: mockNewVisiMisi,
      });
    });

    it("seharusnya mengembalikan status 400 jika tidak ada file dan deskripsi", async () => {
      req.body = {};
      req.files = {};

      await VisiMisiController.createVisiMisi(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Either a file or a description for Vision and Mission is required.",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      const visiMisiData = {
        deskripsi: "Visi Misi Baru",
      };
      req.body = visiMisiData;
      req.files = {
        visi_misi_file: [
          {
            filename: "test.pdf",
            mimetype: "application/pdf",
          },
        ],
      };
      VisiMisiService.createVisiMisi.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can create Vision and Mission."
        )
      );

      await VisiMisiController.createVisiMisi(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Forbidden: Only Admin or Super Admin can create Vision and Mission.",
      });
    });
  });

  describe("updateVisiMisi", () => {
    it("seharusnya memperbarui Visi Misi dengan status 200", async () => {
      const updateData = {
        deskripsi: "Visi Misi Diperbarui",
      };
      const mockUpdatedVisiMisi = {
        id: 1,
        ...updateData,
      };
      req.params.id = 1;
      req.body = updateData;
      VisiMisiService.updateVisiMisi.mockResolvedValue(mockUpdatedVisiMisi);

      await VisiMisiController.updateVisiMisi(req, res);

      expect(VisiMisiService.updateVisiMisi).toHaveBeenCalledWith(
        1, // ubah dari "1" menjadi 1
        expect.any(Object),
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Vision and Mission updated successfully",
        visiMisi: mockUpdatedVisiMisi,
      });
    });

    it("seharusnya mengembalikan status 404 jika Visi Misi tidak ditemukan", async () => {
      req.params.id = 99;
      req.body = {
        deskripsi: "Visi Misi Non-existent",
      };
      VisiMisiService.updateVisiMisi.mockRejectedValue(
        new Error("Vision and Mission not found")
      );

      await VisiMisiController.updateVisiMisi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Vision and Mission not found",
      });
    });
  });

  describe("deleteVisiMisi", () => {
    it("seharusnya menghapus Visi Misi dengan status 200", async () => {
      req.params.id = 1;
      VisiMisiService.deleteVisiMisi.mockResolvedValue({
        message: "Vision and Mission deleted successfully",
      });

      await VisiMisiController.deleteVisiMisi(req, res);

      expect(VisiMisiService.deleteVisiMisi).toHaveBeenCalledWith(
        1, // ubah dari "1" menjadi 1
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Vision and Mission deleted successfully",
      });
    });

    it("seharusnya mengembalikan status 404 jika Visi Misi tidak ditemukan", async () => {
      req.params.id = 99;
      VisiMisiService.deleteVisiMisi.mockRejectedValue(
        new Error("Vision and Mission not found")
      );

      await VisiMisiController.deleteVisiMisi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Vision and Mission not found",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      req.params.id = 1;
      VisiMisiService.deleteVisiMisi.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can delete Vision and Mission."
        )
      );

      await VisiMisiController.deleteVisiMisi(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error:
          "Forbidden: Only Admin or Super Admin can delete Vision and Mission.",
      });
    });
  });
});
