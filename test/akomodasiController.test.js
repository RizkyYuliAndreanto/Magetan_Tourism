const { UniqueConstraintError, ValidationError } = require("sequelize");
const AkomodasiController = require("../src/controllers/akomodasiController");
const AkomodasiService = require("../src/services/akomodasiService");

jest.mock("../src/services/akomodasiService");

const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

describe("Akomodasi Controller", () => {
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

    AkomodasiService.getAllAkomodasi = jest.fn().mockResolvedValue([]);
    AkomodasiService.getAkomodasiById = jest.fn().mockResolvedValue(null);
    AkomodasiService.createAkomodasi = jest.fn().mockResolvedValue({});
    AkomodasiService.updateAkomodasi = jest.fn().mockResolvedValue({});
    AkomodasiService.deleteAkomodasi = jest.fn().mockResolvedValue();
  });

  describe("getAllAkomodasi", () => {
    it("should return all accommodations with status 200", async () => {
      const mockAkomodasi = [
        {
          id: 1,
          nama_hotel: "Hotel A",
        },
      ];
      AkomodasiService.getAllAkomodasi.mockResolvedValue(mockAkomodasi);

      await AkomodasiController.getAllAkomodasi(req, res);

      expect(AkomodasiService.getAllAkomodasi).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAkomodasi);
    });

    it("should return status 500 if an error occurs", async () => {
      AkomodasiService.getAllAkomodasi.mockRejectedValue(
        new Error("Database error")
      );

      await AkomodasiController.getAllAkomodasi(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Database error",
      });
    });
  });

  describe("getAkomodasiById", () => {
    it("should return an accommodation by ID with status 200", async () => {
      const mockAkomodasi = {
        id: 1,
        nama_hotel: "Hotel A",
      };
      req.params.id = 1;
      AkomodasiService.getAkomodasiById.mockResolvedValue(mockAkomodasi);

      await AkomodasiController.getAkomodasiById(req, res);

      expect(AkomodasiService.getAkomodasiById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAkomodasi);
    });

    it("should return status 404 if accommodation not found", async () => {
      req.params.id = 99;
      AkomodasiService.getAkomodasiById.mockResolvedValue(null);

      await AkomodasiController.getAkomodasiById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "Accommodation not found",
      });
    });

    it("should return status 500 if an error occurs", async () => {
      req.params.id = 1;
      AkomodasiService.getAkomodasiById.mockRejectedValue(
        new Error("Service error")
      );

      await AkomodasiController.getAkomodasiById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Service error",
      });
    });
  });

  describe("createAkomodasi", () => {
    it("should create a new accommodation with status 201", async () => {
      const akomodasiData = {
        nama_hotel: "Hotel Test",
        deskripsi_hotel: "Deskripsi Test",
        alamat_hotel: "Alamat Test",
      };
      const mockNewAkomodasi = {
        id: 1,
        ...akomodasiData,
      };
      req.body = akomodasiData;
      AkomodasiService.createAkomodasi.mockResolvedValue(mockNewAkomodasi);

      await AkomodasiController.createAkomodasi(req, res);

      expect(AkomodasiService.createAkomodasi).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Accommodation created successfully",
        akomodasi: mockNewAkomodasi,
      });
    });

    it("should return status 400 if required fields are missing", async () => {
      req.body = {
        nama_hotel: "Hotel Test",
      };

      await AkomodasiController.createAkomodasi(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Nama, deskripsi, and alamat hotel are required.",
      });
    });

    it("should return status 403 if user is not authorized", async () => {
      req.user.level_akses = "user";
      const akomodasiData = {
        nama_hotel: "Hotel Test",
        deskripsi_hotel: "Deskripsi Test",
        alamat_hotel: "Alamat Test",
      };
      req.body = akomodasiData;
      AkomodasiService.createAkomodasi.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can create accommodation."
        )
      );

      await AkomodasiController.createAkomodasi(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can create accommodation.",
      });
    });

    it("should handle SequelizeValidationError and return status 400", async () => {
      const akomodasiData = {
        nama_hotel: "Hotel Test",
        deskripsi_hotel: "Deskripsi Test",
        alamat_hotel: "Alamat Test",
      };
      req.body = akomodasiData;
      AkomodasiService.createAkomodasi.mockRejectedValue(
        new ValidationError("Validation Error")
      );

      await AkomodasiController.createAkomodasi(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Validation Error",
      });
    });

    it("should handle SequelizeUniqueConstraintError and return status 400", async () => {
      const akomodasiData = {
        nama_hotel: "Hotel Test",
        deskripsi_hotel: "Deskripsi Test",
        alamat_hotel: "Alamat Test",
      };
      req.body = akomodasiData;
      AkomodasiService.createAkomodasi.mockRejectedValue(
        new UniqueConstraintError({
          message: "Unique Constraint Error",
          errors: [],
        })
      );

      await AkomodasiController.createAkomodasi(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Unique Constraint Error",
      });
    });
  });

  describe("updateAkomodasi", () => {
    it("should update an existing accommodation with status 200", async () => {
      const updateData = {
        nama_hotel: "Hotel Test Updated",
      };
      const mockUpdatedAkomodasi = {
        id: 1,
        ...updateData,
      };
      req.params.id = 1;
      req.body = updateData;
      AkomodasiService.updateAkomodasi.mockResolvedValue(mockUpdatedAkomodasi);

      await AkomodasiController.updateAkomodasi(req, res);

      expect(AkomodasiService.updateAkomodasi).toHaveBeenCalledWith(
        1,
        updateData,
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Accommodation updated successfully",
        akomodasi: mockUpdatedAkomodasi,
      });
    });

    it("should return status 404 if accommodation not found", async () => {
      req.params.id = 99;
      req.body = {
        nama_hotel: "Hotel Non-existent",
      };
      AkomodasiService.updateAkomodasi.mockRejectedValue(
        new Error("Accommodation not found")
      );

      await AkomodasiController.updateAkomodasi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Accommodation not found",
      });
    });

    it("should return status 403 if user is not authorized", async () => {
      req.user.level_akses = "user";
      req.params.id = 1;
      req.body = {
        nama_hotel: "Hotel Test Updated",
      };
      AkomodasiService.updateAkomodasi.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can update accommodation."
        )
      );

      await AkomodasiController.updateAkomodasi(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can update accommodation.",
      });
    });
  });

  describe("deleteAkomodasi", () => {
    it("should delete an accommodation with status 200", async () => {
      req.params.id = 1;
      AkomodasiService.deleteAkomodasi.mockResolvedValue({
        message: "Accommodation deleted successfully",
      });

      await AkomodasiController.deleteAkomodasi(req, res);

      expect(AkomodasiService.deleteAkomodasi).toHaveBeenCalledWith(
        1,
        "superadmin"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Accommodation deleted successfully",
      });
    });

    it("should return status 404 if accommodation not found", async () => {
      req.params.id = 99;
      AkomodasiService.deleteAkomodasi.mockRejectedValue(
        new Error("Accommodation not found")
      );

      await AkomodasiController.deleteAkomodasi(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Accommodation not found",
      });
    });

    it("should return status 403 if user is not authorized", async () => {
      req.user.level_akses = "user";
      req.params.id = 1;
      AkomodasiService.deleteAkomodasi.mockRejectedValue(
        new Error(
          "Forbidden: Only Admin or Super Admin can delete accommodation."
        )
      );

      await AkomodasiController.deleteAkomodasi(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: Only Admin or Super Admin can delete accommodation.",
      });
    });
  });
});
