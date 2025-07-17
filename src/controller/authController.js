// src/controllers/authController.js
const AuthService = require("../services/authService");

class AuthController {
  static async register(req, res) {
    const { username, password, nama_lengkap, email } = req.body;
    const level_akses = req.body.level_akses || "user";

    if (level_akses !== "user") {
      return res.status(403).json({
        error: "Forbidden: You cannot specify admin roles via this endpoint.",
      });
    }

    try {
      const admin = await AuthService.registerAdmin(
        username,
        password,
        nama_lengkap,
        email,
        level_akses,
        null
      );
      res.status(201).json({ message: "User registered successfully", admin });
    } catch (error) {
      // Tangani error validasi Sequelize secara spesifik
      if (error instanceof UniqueConstraintError) {
        // Jika username atau email duplikat
        const field = error.errors[0].path; // 'username' atau 'email'
        return res
          .status(400)
          .json({
            error: `${field} '${req.body[field]}' already exists. Please choose another.`,
          });
      } else if (error instanceof ValidationError) {
        // Error validasi lainnya
        return res.status(400).json({ error: error.errors[0].message });
      } else {
        // Error lain yang tidak terduga
        return res.status(400).json({ error: error.message });
      }
    }
  }

  static async registerAdminBySuperAdmin(req, res) {
    const { username, password, nama_lengkap, email, level_akses } = req.body;

    const requester_level_akses = req.user.level_akses;

    try {
      const admin = await AuthService.registerAdmin(
        username,
        password,
        nama_lengkap,
        email,
        level_akses,
        requester_level_akses
      );
      res.status(201).json({
        message: `Account with role ${level_akses} registered successfully`,
        admin,
      });
    } catch (error) {
      // Tangani error validasi Sequelize secara spesifik
      if (error instanceof UniqueConstraintError) {
        const field = error.errors[0].path;
        return res
          .status(400)
          .json({
            error: `${field} '${req.body[field]}' already exists. Please choose another.`,
          });
      } else if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.errors[0].message });
      } else {
        return res.status(400).json({ error: error.message });
      }
    }
  }

  static async login(req, res) {
    // Ambil identifier (bisa username atau email) dan password dari body request
    const { identifier, password } = req.body; // Ubah ini

    // Lakukan validasi sederhana jika identifier tidak ada
    if (!identifier || !password) {
      return res
        .status(400)
        .json({ error: "Identifier and password are required." });
    }

    try {
      const { admin, token } = await AuthService.loginAdmin(
        identifier,
        password
      ); // Teruskan identifier
      res.status(200).json({ message: "Login successful", admin, token });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  }

  static async getProfile(req, res) {
    try {
      const adminId = req.user.id;
      const admin = await AuthService.getAdminProfile(adminId);
      res.status(200).json({ admin });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }
  static async forgotPassword(req, res) {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: "Email is required." });
    }
    try {
      await AuthService.forgotPassword(email);
      // Selalu kembalikan pesan sukses yang umum untuk keamanan
      res.status(200).json({
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async resetPassword(req, res) {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      return res
        .status(400)
        .json({ error: "Token and new password are required." });
    }
    try {
      await AuthService.resetAdminPassword(token, newPassword);
      res
        .status(200)
        .json({ message: "Password has been reset successfully." });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
