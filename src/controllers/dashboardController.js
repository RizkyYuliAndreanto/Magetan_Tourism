const db = require("../models");
const {
  Berita,
  Destinasi,
  Event,
  Umkm,
  MediaGaleri,
  ActivityLog,
  Admin,
  Budaya,
  sequelize,
} = db;
const { Op } = require("sequelize");

class DashboardController {
  // Mendapatkan ringkasan statistik untuk dashboard
  static async getSummary(req, res) {
    try {
      console.log("📊 Getting dashboard summary...");

      // Definisi model dengan fallback ke 0 jika model tidak ada
      const modelMappings = [
        { name: "berita", model: "Berita" },
        { name: "destinasi", model: "Destinasi" },
        { name: "event", model: "Event" },
        { name: "umkm", model: "Umkm" },
        { name: "sejarah", model: "Budaya" },
        { name: "media", model: "MediaGaleri" },
      ];

      const totals = {};

      // Count each model with individual error handling
      for (const mapping of modelMappings) {
        try {
          const model = db[mapping.model];
          if (model && typeof model.count === "function") {
            totals[mapping.name] = await model.count();
            console.log(`✅ ${mapping.model}: ${totals[mapping.name]} records`);
          } else {
            console.warn(
              `⚠️ Model ${mapping.model} not found or doesn't have count method`
            );
            totals[mapping.name] = 0;
          }
        } catch (error) {
          console.error(`❌ Error counting ${mapping.model}:`, error.message);
          totals[mapping.name] = 0;
        }
      }

      console.log("✅ Final dashboard totals:", totals);

      // Ambil aktivitas terbaru
      let recentActivities = [];
      try {
        recentActivities = await ActivityLog.findAll({
          limit: 10,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Admin,
              as: "admin",
              attributes: [
                "id_admin",
                "username",
                "nama_lengkap",
                "level_akses",
              ],
            },
          ],
        });
      } catch (error) {
        console.warn("⚠️ Error loading recent activities:", error.message);
        recentActivities = [];
      }

      res.json({
        success: true,
        totals,
        recentActivities: recentActivities.map((activity) => ({
          id: activity.id,
          action: activity.action,
          entity: activity.entity,
          entityName: activity.entityName,
          admin: activity.admin?.nama_lengkap || "Admin",
          description: activity.description,
          createdAt: activity.createdAt,
        })),
      });
    } catch (error) {
      console.error("Error getting dashboard summary:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil ringkasan dashboard",
        error: error.message,
      });
    }
  }

  // Mendapatkan aktivitas terbaru admin
  static async getRecentActivity(req, res) {
    try {
      const { limit = 10, page = 1 } = req.query;
      const offset = (page - 1) * limit;

      const activities = await ActivityLog.findAndCountAll({
        include: [
          {
            model: Admin,
            as: "admin",
            attributes: ["id_admin", "nama_lengkap", "email"],
          },
        ],
        order: [["createdAt", "DESC"]],
        limit: parseInt(limit),
        offset: parseInt(offset),
      });

      // Format data untuk frontend
      const formattedActivities = activities.rows.map((activity) => ({
        id: activity.id,
        type: activity.action,
        action: activity.action,
        entity: activity.entity,
        entityId: activity.entityId,
        entityName: activity.entityName,
        actor: activity.admin?.nama_lengkap || "Admin",
        admin: activity.admin?.nama_lengkap || "Admin",
        user: activity.admin?.nama_lengkap || "Admin",
        title: activity.entityName,
        name: activity.entityName,
        target: activity.entity,
        module: activity.entity,
        description: activity.description,
        ipAddress: activity.ipAddress,
        userAgent: activity.userAgent,
        createdAt: activity.createdAt,
        timestamp: activity.createdAt,
      }));

      res.json({
        success: true,
        data: formattedActivities,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: activities.count,
          totalPages: Math.ceil(activities.count / limit),
        },
      });
    } catch (error) {
      console.error("Error getting recent activity:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil aktivitas terbaru",
        error: error.message,
      });
    }
  }

  // Mendapatkan statistik aktivitas berdasarkan periode
  static async getActivityStats(req, res) {
    try {
      const { period = "7d" } = req.query;
      let startDate;

      // Tentukan periode berdasarkan parameter
      switch (period) {
        case "1d":
          startDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      }

      const stats = await ActivityLog.findAll({
        attributes: [
          "action",
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: {
          createdAt: {
            [Op.gte]: startDate,
          },
        },
        group: ["action"],
        order: [[sequelize.literal("count"), "DESC"]],
      });

      const chartData = await ActivityLog.findAll({
        attributes: [
          [sequelize.fn("DATE", sequelize.col("createdAt")), "date"],
          [sequelize.fn("COUNT", sequelize.col("id")), "count"],
        ],
        where: {
          createdAt: {
            [Op.gte]: startDate,
          },
        },
        group: [sequelize.fn("DATE", sequelize.col("createdAt"))],
        order: [[sequelize.fn("DATE", sequelize.col("createdAt")), "ASC"]],
      });

      res.json({
        success: true,
        data: {
          stats: stats.map((item) => ({
            action: item.action,
            count: parseInt(item.dataValues.count),
          })),
          chartData: chartData.map((item) => ({
            date: item.dataValues.date,
            count: parseInt(item.dataValues.count),
          })),
        },
      });
    } catch (error) {
      console.error("Error getting activity stats:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil statistik aktivitas",
        error: error.message,
      });
    }
  }

  // Mendapatkan ringkasan aktivitas per admin
  static async getAdminActivitySummary(req, res) {
    try {
      const { period = "30d" } = req.query;
      let startDate;

      switch (period) {
        case "7d":
          startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      }

      const adminStats = await ActivityLog.findAll({
        attributes: [
          "adminId",
          [sequelize.fn("COUNT", sequelize.col("ActivityLog.id")), "count"],
        ],
        include: [
          {
            model: Admin,
            as: "admin",
            attributes: ["nama_lengkap", "email", "level_akses"],
          },
        ],
        where: {
          createdAt: {
            [Op.gte]: startDate,
          },
        },
        group: ["adminId", "admin.id_admin"],
        order: [[sequelize.literal("count"), "DESC"]],
      });

      res.json({
        success: true,
        data: adminStats.map((item) => ({
          adminId: item.adminId,
          admin: item.admin?.nama_lengkap || "Admin",
          email: item.admin?.email,
          level: item.admin?.level_akses,
          activityCount: parseInt(item.dataValues.count),
        })),
      });
    } catch (error) {
      console.error("Error getting admin activity summary:", error);
      res.status(500).json({
        success: false,
        message: "Gagal mengambil ringkasan aktivitas admin",
        error: error.message,
      });
    }
  }
}

module.exports = DashboardController;
