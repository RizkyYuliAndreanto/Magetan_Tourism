const { UniqueConstraintError, ValidationError } = require("sequelize");

const MediaGaleriController = require("../src/controllers/mediaGaleriController");
const MediaGaleriService = require("../src/services/mediaGaleriService");

jest.mock("../src/services/mediaGaleriService");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("MediaGaleri Controller", () => {
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
      file: undefined, // Untuk .single()
      files: undefined, // Untuk .array() atau .fields()
    };

    MediaGaleriService.getAllMediaGaleri = jest.fn().mockResolvedValue([]);
    MediaGaleriService.getMediaGaleriById = jest.fn().mockResolvedValue(null);
    MediaGaleriService.createMediaGaleri = jest.fn().mockResolvedValue({});
    MediaGaleriService.updateMediaGaleri = jest.fn().mockResolvedValue({});
    MediaGaleriService.deleteMediaGaleri = jest.fn().mockResolvedValue();
  });

  describe("getAllMediaGaleri", () => {
    it("seharusnya mengembalikan semua media galeri dengan status 200", async () => {
      const mockMedia = [
        {
          id: 1,
          path_file: "/uploads/galeri/gambar1.jpg",
        },
      ];
      MediaGaleriService.getAllMediaGaleri.mockResolvedValue(mockMedia);

      await MediaGaleriController.getAllMediaGaleri(req, res);

      expect(MediaGaleriService.getAllMediaGaleri).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMedia);
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      MediaGaleriService.getAllMediaGaleri.mockRejectedValue(
        new Error("Database error")
      );

      await MediaGaleriController.getAllMediaGaleri(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("getMediaGaleriById", () => {
    it("seharusnya mengembalikan media berdasarkan ID dengan status 200", async () => {
      const mockMedia = {
        id: 1,
        path_file: "/uploads/galeri/gambar1.jpg",
      };
      req.params.id = 1;
      MediaGaleriService.getMediaGaleriById.mockResolvedValue(mockMedia);

      await MediaGaleriController.getMediaGaleriById(req, res);

      expect(MediaGaleriService.getMediaGaleriById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockMedia);
    });

    it("seharusnya mengembalikan status 404 jika media tidak ditemukan", async () => {
      req.params.id = 99;
      MediaGaleriService.getMediaGaleriById.mockResolvedValue(null);

      await MediaGaleriController.getMediaGaleriById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Media not found",
      });
    });

    it("seharusnya mengembalikan status 500 jika terjadi kesalahan", async () => {
      req.params.id = 1;
      MediaGaleriService.getMediaGaleriById.mockRejectedValue(
        new Error("Service error")
      );

      await MediaGaleriController.getMediaGaleriById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Service error",
      });
    });
  });

  describe("createMediaGaleri", () => {
    it("seharusnya membuat media baru dengan status 201 jika file ada", async () => {
      const mediaData = {
        id_konten: 1,
        tipe_konten: "akomodasi",
        deskripsi_file: "Gambar hotel",
      };
      const mockNewMedia = {
        id: 1,
        ...mediaData,
        path_file: "/uploads/galeri/test.jpg",
      };

      req.body = mediaData;
      req.file = {
        filename: "test.jpg",
      };
      MediaGaleriService.createMediaGaleri.mockResolvedValue(mockNewMedia);

      await MediaGaleriController.createMediaGaleri(req, res);

      expect(MediaGaleriService.createMediaGaleri).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Media uploaded successfully",
        media: mockNewMedia,
      });
    });

    it("seharusnya mengembalikan status 400 jika file tidak ada", async () => {
      req.body = {};
      req.file = undefined;

      await MediaGaleriController.createMediaGaleri(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "File media is required.",
      });
    });

    it("seharusnya mengembalikan status 403 jika pengguna tidak diotorisasi", async () => {
      req.user.level_akses = "user";
      const mediaData = {
        id_konten: 1,
        tipe_konten: "akomodasi",
        deskripsi_file: "Gambar hotel",
      };
      req.body = mediaData;
      req.file = {
        filename: "test.jpg",
      };
      MediaGaleriService.createMediaGaleri.mockRejectedValue(
        new Error("Forbidden: Only Admin or Super Admin can create media.")
      );

      await MediaGaleriController.createMediaGaleri(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can create media.",
      });
    });

    it("seharusnya menangani SequelizeValidationError dan mengembalikan status 400", async () => {
      req.body = {
        id_konten: "abc", // Invalid input
        tipe_konten: "akomodasi",
        deskripsi_file: "Gambar hotel",
      };
      req.file = {
        filename: "test.jpg",
      };
      MediaGaleriService.createMediaGaleri.mockRejectedValue(
        new ValidationError("Validation Error")
      );

      await MediaGaleriController.createMediaGaleri(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation Error",
      });
    });
  });

  describe("updateMediaGaleri", () => {
    it("seharusnya memperbarui media dengan status 200", async () => {
      const updateData = {
        deskripsi_file: "Gambar hotel diperbarui",
      };
      const mockUpdatedMedia = {
        id: 1,
        ...updateData,
      };
      req.params.id = 1;
      req.body = updateData;
      MediaGaleriService.updateMediaGaleri.mockResolvedValue(mockUpdatedMedia);

      await MediaGaleriController.updateMediaGaleri(req, res);

      expect(MediaGaleriService.updateMediaGaleri).toHaveBeenCalledWith(
        1,
        updateData,
        1,
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Media updated successfully",
        media: mockUpdatedMedia,
      });
    });

    it("seharusnya mengembalikan status 404 jika media tidak ditemukan", async () => {
      req.params.id = 99;
      req.body = {
        deskripsi_file: "Deskripsi baru",
      };
      MediaGaleriService.updateMediaGaleri.mockRejectedValue(
        new Error("Media not found")
      );

      await MediaGaleriController.updateMediaGaleri(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Media not found",
      });
    });
  });

  describe("deleteMediaGaleri", () => {
    it("seharusnya menghapus media dengan status 200", async () => {
      req.params.id = 1;
      MediaGaleriService.deleteMediaGaleri.mockResolvedValue({
        message: "Media deleted successfully",
      });

      await MediaGaleriController.deleteMediaGaleri(req, res);

      expect(MediaGaleriService.deleteMediaGaleri).toHaveBeenCalledWith(
        1,
        1,
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Media deleted successfully",
      });
    });

    it("seharusnya mengembalikan status 404 jika media tidak ditemukan", async () => {
      req.params.id = 99;
      MediaGaleriService.deleteMediaGaleri.mockRejectedValue(
        new Error("Media not found")
      );

      await MediaGaleriController.deleteMediaGaleri(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Media not found",
      });
    });
  });
});
