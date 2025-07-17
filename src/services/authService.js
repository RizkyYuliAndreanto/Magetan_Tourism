// src/services/authService.js
const { Admin } = require("../models"); // Adjust path as needed
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto"); 

class AuthService {
  static async registerAdmin(
    username,
    password,
    nama_lengkap,
    email,
    level_akses,
    requester_level_akses
  ) {
    try {
      if (
        requester_level_akses !== "super_admin" &&
        (level_akses === "admin" || level_akses === "super_admin")
      ) {
        throw new Error(
          "Unauthorized: Only Super Admin can create Admin or Super Admin accounts."
        );
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await Admin.create({
        username,
        password: hashedPassword,
        nama_lengkap,
        email,
        level_akses,
      });
      return admin;
    } catch (error) {
      throw new Error("Could not register admin: " + error.message);
    }
  }

  static async loginAdmin(identifier, password) {
    // Ubah 'username' menjadi 'identifier'
    try {
      // Cari admin berdasarkan username atau email
      const admin = await Admin.findOne({
        where: {
          [require("sequelize").Op.or]: [
            // Gunakan Op.or dari Sequelize
            { username: identifier },
            { email: identifier },
          ],
        },
      });

      if (!admin) {
        throw new Error("Admin not found or invalid credentials"); // Pesan error yang lebih umum
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { id: admin.id_admin, level_akses: admin.level_akses },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || "1h" }
      );

      return { admin, token };
    } catch (error) {
      throw new Error("Could not login admin: " + error.message);
    }
  }

  static async getAdminProfile(id_admin) {
    try {
      const admin = await Admin.findByPk(id_admin, {
        attributes: { exclude: ["password"] },
      });
      if (!admin) {
        throw new Error("Admin not found");
      }
      return admin;
    } catch (error) {
      throw new Error("Could not retrieve admin profile: " + error.message);
    }
  }
  static async forgotPassword(email) {
    try {
      const admin = await Admin.findOne({ where: { email } });

      if (!admin) {
        // Penting: Jangan beritahu pengguna apakah email ada atau tidak untuk keamanan
        throw new Error(
          "If an account with that email exists, a password reset link has been sent."
        );
      }

      // Generate reset token (misal, menggunakan crypto untuk string acak)
      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetExpires =
        Date.now() + (process.env.RESET_TOKEN_EXPIRE_MINUTES || 30) * 60 * 1000; // Kadaluwarsa dalam X menit

      admin.resetPasswordToken = resetToken;
      admin.resetPasswordExpires = new Date(resetExpires);
      await admin.save();

      // Kirim email
      await this.sendPasswordResetEmail(admin.email, resetToken);

      return { message: "Password reset link sent to your email." };
    } catch (error) {
      throw new Error(
        "Could not process forgot password request: " + error.message
      );
    }
  }

  static async sendPasswordResetEmail(recipientEmail, token) {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // Contoh untuk Gmail, sesuaikan dengan penyedia email Anda
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`; // URL frontend Anda

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: "Password Reset Request for Your Account",
      html: `
        <p>You are receiving this because you (or someone else) has requested the reset of the password for your account.</p>
        <p>Please click on the following link, or paste this into your browser to complete the process:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in ${
          process.env.RESET_TOKEN_EXPIRE_MINUTES || 30
        } minutes.</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${recipientEmail}`);
    } catch (error) {
      console.error(`Error sending email to ${recipientEmail}:`, error);
      throw new Error("Failed to send password reset email.");
    }
  }

  static async resetAdminPassword(token, newPassword) {
    try {
      const admin = await Admin.findOne({
        where: {
          resetPasswordToken: token,
          resetPasswordExpires: {
            [require("sequelize").Op.gt]: Date.now(), // Token belum kadaluwarsa
          },
        },
      });

      if (!admin) {
        throw new Error("Password reset token is invalid or has expired.");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      admin.password = hashedPassword;
      admin.resetPasswordToken = null; // Invalidate token
      admin.resetPasswordExpires = null; // Invalidate expiration
      await admin.save();

      return { message: "Password has been reset successfully." };
    } catch (error) {
      throw new Error("Could not reset password: " + error.message);
    }
  }
}

module.exports = AuthService;
