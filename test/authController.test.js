const AuthController = require("../src/controllers/authController");
const AuthService = require("../src/services/authService");
const { UniqueConstraintError, ValidationError } = require("sequelize");

// Mock seluruh modul AuthService
jest.mock("../src/services/authService");

// Siapkan objek req dan res tiruan
const mockResponse = () => {
  const res = {};
  res.status = jest.fn(() => res);
  res.json = jest.fn(() => res);
  return res;
};

// Grupkan tes untuk AuthController
describe("AuthController", () => {
  let req;
  let res;

  beforeEach(() => {
    // Atur ulang mock dan buat objek tiruan baru sebelum setiap tes
    jest.clearAllMocks();
    res = mockResponse();
  });

  // --- Tes untuk metode register ---
  describe("register", () => {
    it("seharusnya mendaftarkan pengguna baru dengan berhasil", async () => {
      // Skenario: permintaan registrasi yang valid
      req = {
        body: {
          username: "testuser",
          password: "password123",
          nama_lengkap: "Test User",
          email: "test@example.com",
        },
      };

      const mockAdmin = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
      };

      // Mock AuthService agar berhasil
      AuthService.registerAdmin.mockResolvedValue(mockAdmin);

      await AuthController.register(req, res);

      // Pastikan status 201 dan respons JSON yang benar
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        admin: mockAdmin,
      });
      // PERBAIKAN: Hapus spasi dari " user" menjadi "user"
      expect(AuthService.registerAdmin).toHaveBeenCalledWith(
        "testuser",
        "password123",
        "Test User",
        "test@example.com",
        "user", // <-- Perbaikan di sini
        null
      );
    });

    it("seharusnya mengembalikan 403 jika level_akses adalah 'admin'", async () => {
      // Skenario: mencoba mendaftar sebagai admin
      req = {
        body: {
          username: "adminuser",
          password: "password123",
          email: "admin@example.com",
          level_akses: "admin",
        },
      };

      await AuthController.register(req, res);

      // Pastikan status 403 dan pesan kesalahan yang sesuai
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: "Forbidden: You cannot specify admin roles via this endpoint.",
      });
      // Pastikan AuthService tidak dipanggil
      expect(AuthService.registerAdmin).not.toHaveBeenCalled();
    });

    it("seharusnya mengembalikan 400 jika username sudah ada", async () => {
      // Skenario: username duplikat
      req = {
        body: {
          username: "existinguser",
          password: "password123",
          email: "new@example.com",
        },
      };

      const mockError = new UniqueConstraintError({
        errors: [
          {
            path: "username",
          },
        ],
      });

      // Mock AuthService agar gagal dengan UniqueConstraintError
      AuthService.registerAdmin.mockRejectedValue(mockError);

      await AuthController.register(req, res);

      // Pastikan status 400 dan pesan kesalahan yang sesuai
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: `username 'existinguser' already exists. Please choose another.`,
      });
    });
  });

  // --- Tes untuk metode login ---
  describe("login", () => {
    it("seharusnya login dengan sukses dan mengembalikan token", async () => {
      // Skenario: login yang valid
      req = {
        body: {
          identifier: "testuser",
          password: "password123",
        },
      };

      const mockAdmin = {
        id: 1,
        username: "testuser",
      };
      const mockToken = "mock_jwt_token";

      // Mock AuthService agar berhasil
      AuthService.loginAdmin.mockResolvedValue({
        admin: mockAdmin,
        token: mockToken,
      });

      await AuthController.login(req, res);

      // Pastikan status 200 dan respons yang benar
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        admin: mockAdmin,
        token: mockToken,
      });
      expect(AuthService.loginAdmin).toHaveBeenCalledWith(
        "testuser",
        "password123"
      );
    });

    it("seharusnya mengembalikan 401 jika login gagal", async () => {
      // Skenario: login gagal karena kredensial salah
      req = {
        body: {
          identifier: "wronguser",
          password: "wrongpassword",
        },
      };

      // Mock AuthService agar gagal dengan error
      AuthService.loginAdmin.mockRejectedValue(
        new Error("Invalid credentials")
      );

      await AuthController.login(req, res);

      // Pastikan status 401 dan pesan kesalahan
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
    });
  });

  // --- Tes untuk metode getProfile ---
  describe("getProfile", () => {
    it("seharusnya mengembalikan profil pengguna", async () => {
      // Skenario: user berhasil mengambil profilnya
      const mockUser = {
        id: 1,
        username: "testuser",
      };
      req = {
        user: {
          id: 1,
        },
      };

      AuthService.getAdminProfile.mockResolvedValue(mockUser);

      await AuthController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        admin: mockUser,
      });
      expect(AuthService.getAdminProfile).toHaveBeenCalledWith(1);
    });

    it("seharusnya mengembalikan 404 jika profil tidak ditemukan", async () => {
      // Skenario: profil tidak ditemukan
      req = {
        user: {
          id: 999,
        },
      };

      AuthService.getAdminProfile.mockRejectedValue(
        new Error("Admin not found")
      );

      await AuthController.getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Admin not found",
      });
    });
  });
});
