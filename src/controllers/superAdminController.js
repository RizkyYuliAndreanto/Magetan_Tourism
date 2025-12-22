// src/controllers/superAdminController.js
const { Admin } = require("../models");
const { Op } = require("sequelize");
const AuthService = require("../services/authService");
const bcrypt = require("bcryptjs");
const { UniqueConstraintError, ValidationError } = require("sequelize");
const { logManualActivity } = require("../middleware/activityLoggerMiddleware");

class SuperAdminController {
  // Mendapatkan semua users/admins dengan pagination dan filter
  static async getAllUsers(req, res) {
    try {
      const {
        page = 1,
        limit = 10,
        search = "",
        level_akses = "",
        sort = "created_at",
        order = "DESC",
      } = req.query;

      const offset = (page - 1) * limit;

      const whereClause = {};

      // Filter berdasarkan pencarian
      if (search) {
        whereClause[Op.or] = [
          { username: { [Op.iLike]: `%${search}%` } },
          { nama_lengkap: { [Op.iLike]: `%${search}%` } },
          { email: { [Op.iLike]: `%${search}%` } },
        ];
      }

      // Filter berdasarkan level akses
      if (level_akses) {
        whereClause.level_akses = level_akses;
      }

      const users = await Admin.findAndCountAll({
        where: whereClause,
        attributes: {
          exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
        },
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [[sort, order.toUpperCase()]],
      });

      // Log aktivitas
      await logManualActivity(req.user.id, "view_users", "Admin", {
        description: `Super admin ${req.user.username} viewed users list`,
        entityName: "Users Management",
      });

      res.status(200).json({
        message: "Users retrieved successfully",
        data: users.rows,
        pagination: {
          total: users.count,
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages: Math.ceil(users.count / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Mendapatkan detail user berdasarkan ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await Admin.findByPk(id, {
        attributes: {
          exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
        },
      });

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Log aktivitas
      await logManualActivity(req.user.id, "view_detail", "Admin", {
        description: `Super admin ${req.user.username} viewed details of user ${user.username}`,
        entityName: user.nama_lengkap || user.username,
      });

      res.status(200).json({
        message: "User details retrieved successfully",
        data: user,
      });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Membuat admin atau super admin baru (hanya super admin)
  static async createAdmin(req, res) {
    try {
      const { username, password, nama_lengkap, email, level_akses } = req.body;

      // Validasi input
      if (!username || !password || !email || !level_akses) {
        return res.status(400).json({
          error: "Username, password, email, and level_akses are required",
        });
      }

      // Validasi level akses
      if (!["admin", "superadmin"].includes(level_akses)) {
        return res.status(400).json({
          error: "level_akses must be either 'admin' or 'superadmin'",
        });
      }

      // Hanya superadmin yang bisa membuat superadmin lain
      if (
        level_akses === "superadmin" &&
        req.user.level_akses !== "superadmin"
      ) {
        return res.status(403).json({
          error: "Only superadmin can create another superadmin",
        });
      }

      const admin = await AuthService.registerAdmin(
        username,
        password,
        nama_lengkap,
        email,
        level_akses,
        req.user.level_akses
      );

      // Log aktivitas
      await logManualActivity(req.user.id, "create_admin", "Admin", {
        description: `Super admin ${req.user.username} created new ${level_akses} account: ${username}`,
        entityName: nama_lengkap || username,
      });

      res.status(201).json({
        message: `${level_akses} account created successfully`,
        data: {
          id_admin: admin.id_admin,
          username: admin.username,
          nama_lengkap: admin.nama_lengkap,
          email: admin.email,
          level_akses: admin.level_akses,
          created_at: admin.created_at,
        },
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const field = error.errors[0].path;
        return res.status(400).json({
          error: `${field} '${req.body[field]}' already exists. Please choose another.`,
        });
      } else if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.errors[0].message });
      } else {
        console.error("Error creating admin:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  // Update user/admin (profil, level akses)
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { username, nama_lengkap, email, level_akses, password } = req.body;

      const user = await Admin.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Cegah super admin mengubah level aksesnya sendiri
      if (
        user.id_admin === req.user.id &&
        level_akses &&
        level_akses !== user.level_akses
      ) {
        return res.status(403).json({
          error: "You cannot change your own access level",
        });
      }

      // Hanya superadmin yang bisa mengubah level akses
      if (level_akses && level_akses !== user.level_akses) {
        if (req.user.level_akses !== "superadmin") {
          return res.status(403).json({
            error: "Only superadmin can change user access level",
          });
        }

        // Validasi level akses baru
        if (!["user", "admin", "superadmin"].includes(level_akses)) {
          return res.status(400).json({
            error: "Invalid level_akses value",
          });
        }
      }

      const updateData = {};
      if (username && username !== user.username)
        updateData.username = username;
      if (nama_lengkap !== undefined) updateData.nama_lengkap = nama_lengkap;
      if (email && email !== user.email) updateData.email = email;
      if (level_akses && level_akses !== user.level_akses)
        updateData.level_akses = level_akses;

      // Update password jika diberikan
      if (password) {
        const saltRounds = 12;
        updateData.password = await bcrypt.hash(password, saltRounds);
      }

      await user.update(updateData);

      // Log aktivitas
      const changes = Object.keys(updateData).join(", ");
      await logManualActivity(req.user.id, "update_user", "Admin", {
        description: `Super admin ${req.user.username} updated user ${user.username} (${changes})`,
        entityName: user.nama_lengkap || user.username,
      });

      const updatedUser = await Admin.findByPk(id, {
        attributes: {
          exclude: ["password", "resetPasswordToken", "resetPasswordExpires"],
        },
      });

      res.status(200).json({
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      if (error instanceof UniqueConstraintError) {
        const field = error.errors[0].path;
        return res.status(400).json({
          error: `${field} already exists. Please choose another.`,
        });
      } else if (error instanceof ValidationError) {
        return res.status(400).json({ error: error.errors[0].message });
      } else {
        console.error("Error updating user:", error);
        return res.status(500).json({ error: "Internal server error" });
      }
    }
  }

  // Blokir/Aktifkan akun user
  static async toggleUserStatus(req, res) {
    try {
      const { id } = req.params;
      const { is_blocked } = req.body;

      const user = await Admin.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Cegah super admin memblokir dirinya sendiri
      if (user.id_admin === req.user.id) {
        return res.status(403).json({
          error: "You cannot block/unblock your own account",
        });
      }

      await user.update({ is_blocked: is_blocked });

      const action = is_blocked ? "blocked" : "unblocked";
      const actionCode = is_blocked ? "block" : "unblock";

      // Log aktivitas
      await logManualActivity(req.user.id, actionCode, "Admin", {
        description: `Super admin ${req.user.username} ${action} user ${user.username}`,
        entityName: user.nama_lengkap || user.username,
      });

      res.status(200).json({
        message: `User ${action} successfully`,
        data: {
          id_admin: user.id_admin,
          username: user.username,
          is_blocked: user.is_blocked,
        },
      });
    } catch (error) {
      console.error("Error toggling user status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Hapus akun user/admin
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await Admin.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Cegah super admin menghapus dirinya sendiri
      if (user.id_admin === req.user.id) {
        return res.status(403).json({
          error: "You cannot delete your own account",
        });
      }

      // Simpan data user untuk logging sebelum dihapus
      const userData = {
        username: user.username,
        nama_lengkap: user.nama_lengkap,
        email: user.email,
        level_akses: user.level_akses,
      };

      await user.destroy();

      // Log aktivitas
      await logManualActivity(req.user.id, "delete_user", "Admin", {
        description: `Super admin ${req.user.username} deleted user ${userData.username} (${userData.level_akses})`,
        entityName: userData.nama_lengkap || userData.username,
      });

      res.status(200).json({
        message: "User deleted successfully",
        deleted_user: userData,
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Reset password user
  static async resetUserPassword(req, res) {
    try {
      const { id } = req.params;
      const { new_password } = req.body;

      if (!new_password) {
        return res.status(400).json({ error: "new_password is required" });
      }

      const user = await Admin.findByPk(id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(new_password, saltRounds);

      await user.update({
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      });

      // Log aktivitas
      await logManualActivity(req.user.id, "reset_pass", "Admin", {
        description: `Super admin ${req.user.username} reset password for user ${user.username}`,
        entityName: user.nama_lengkap || user.username,
      });

      res.status(200).json({
        message: "Password reset successfully",
        user: {
          id_admin: user.id_admin,
          username: user.username,
          email: user.email,
        },
      });
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  // Mendapatkan statistik users
  static async getUsersStats(req, res) {
    try {
      const totalUsers = await Admin.count();
      const totalSuperAdmins = await Admin.count({
        where: { level_akses: "superadmin" },
      });
      const totalAdmins = await Admin.count({
        where: { level_akses: "admin" },
      });
      const totalRegularUsers = await Admin.count({
        where: { level_akses: "user" },
      });
      const totalBlockedUsers = await Admin.count({
        where: { is_blocked: true },
      });
      const recentUsers = await Admin.count({
        where: {
          created_at: {
            [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 hari terakhir
          },
        },
      });

      // Log aktivitas
      await logManualActivity(req.user.id, "view_stats", "Admin", {
        description: `Super admin ${req.user.username} viewed users statistics`,
        entityName: "Users Statistics",
      });

      res.status(200).json({
        message: "User statistics retrieved successfully",
        data: {
          total_users: totalUsers,
          super_admins: totalSuperAdmins,
          admins: totalAdmins,
          regular_users: totalRegularUsers,
          blocked_users: totalBlockedUsers,
          recent_users_7_days: recentUsers,
        },
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = SuperAdminController;
