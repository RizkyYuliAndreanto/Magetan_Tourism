// Test script untuk memeriksa data di tabel activity_logs
const { ActivityLog, Admin } = require("./src/models");

async function checkActivityData() {
  try {
    console.log("🔍 Checking activity_logs table...\n");

    // Check total count
    const totalCount = await ActivityLog.count();
    console.log(`📊 Total activity logs: ${totalCount}`);

    if (totalCount === 0) {
      console.log("❌ No activity logs found in database!");
      console.log("💡 This could mean:");
      console.log("   - No CRUD operations have been performed yet");
      console.log("   - Activity logging middleware is not working");
      console.log("   - Database connection issues");
      return;
    }

    // Get recent activities with admin info
    const recentActivities = await ActivityLog.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Admin,
          as: "admin",
          attributes: ["id_admin", "username", "nama_lengkap"],
        },
      ],
    });

    console.log("\n📋 Recent Activities:");
    console.log("=".repeat(60));

    recentActivities.forEach((activity, index) => {
      console.log(
        `${index + 1}. [${activity.action.toUpperCase()}] ${activity.entity}`
      );
      console.log(`   📝 ${activity.description || "No description"}`);
      console.log(`   👤 Admin: ${activity.admin?.nama_lengkap || "Unknown"}`);
      console.log(`   🕒 Time: ${activity.createdAt}`);
      console.log(`   🆔 Entity ID: ${activity.entityId || "N/A"}`);
      console.log(`   📛 Entity Name: ${activity.entityName || "N/A"}`);
      console.log("-".repeat(40));
    });

    // Check activity types distribution
    const activityStats = await ActivityLog.findAll({
      attributes: [
        "action",
        [
          require("sequelize").fn("COUNT", require("sequelize").col("id")),
          "count",
        ],
      ],
      group: ["action"],
      order: [[require("sequelize").literal("count"), "DESC"]],
    });

    console.log("\n📈 Activity Types Distribution:");
    activityStats.forEach((stat) => {
      console.log(`   ${stat.action}: ${stat.dataValues.count} times`);
    });
  } catch (error) {
    console.error("❌ Error checking activity data:", error);
  }
}

// Check if this is run directly
if (require.main === module) {
  checkActivityData().then(() => {
    console.log("\n✅ Check completed!");
    process.exit(0);
  });
}

module.exports = checkActivityData;
