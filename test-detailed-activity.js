// Test untuk melihat output deskripsi activity yang baru
const { ActivityLog, Admin } = require("./src/models");

async function testNewActivityDescription() {
  console.log("🔍 Testing new detailed activity descriptions...\n");

  try {
    // Pastikan ada admin di database
    const admin = await Admin.findOne();
    if (!admin) {
      console.log("❌ No admin found in database");
      return;
    }

    console.log(
      `👤 Using admin: ${admin.nama_lengkap} (ID: ${admin.id_admin})`
    );

    // Create test activities dengan berbagai skenario
    const testActivities = [
      {
        adminId: admin.id_admin,
        action: "create",
        entity: "berita",
        entityId: 9999,
        entityName: "Telaga Sarangan Destinasi Favorit",
        description: `${admin.nama_lengkap} menambahkan berita baru "Telaga Sarangan Destinasi Favorit"`,
        ipAddress: "127.0.0.1",
        userAgent: "Test Script",
      },
      {
        adminId: admin.id_admin,
        action: "update",
        entity: "destinasi",
        entityId: 9998,
        entityName: "Wisata Air Terjun Pitu",
        description: `${admin.nama_lengkap} mengupdate/edit destinasi wisata "Wisata Air Terjun Pitu"`,
        ipAddress: "127.0.0.1",
        userAgent: "Test Script",
      },
      {
        adminId: admin.id_admin,
        action: "delete",
        entity: "event",
        entityId: 9997,
        entityName: "Festival Budaya Magetan 2025",
        description: `${admin.nama_lengkap} menghapus event "Festival Budaya Magetan 2025"`,
        ipAddress: "127.0.0.1",
        userAgent: "Test Script",
      },
      {
        adminId: admin.id_admin,
        action: "create",
        entity: "media",
        entityId: 9996,
        entityName: "Galeri Wisata Magetan",
        description: `${admin.nama_lengkap} menambahkan media galeri baru "Galeri Wisata Magetan"`,
        ipAddress: "127.0.0.1",
        userAgent: "Test Script",
      },
      {
        adminId: admin.id_admin,
        action: "login",
        entity: "system",
        entityName: admin.nama_lengkap,
        description: `${admin.nama_lengkap} login ke sistem`,
        ipAddress: "127.0.0.1",
        userAgent: "Test Script",
      },
    ];

    console.log("📝 Creating test activities with detailed descriptions...\n");

    for (const [index, activityData] of testActivities.entries()) {
      const activity = await ActivityLog.create(activityData);
      console.log(
        `${index + 1}. ✅ [${activity.action.toUpperCase()}] ${
          activity.description
        }`
      );
    }

    console.log("\n📋 Recent activities from database:");
    const recentActivities = await ActivityLog.findAll({
      limit: 10,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: Admin,
          as: "admin",
          attributes: ["nama_lengkap", "username"],
        },
      ],
    });

    recentActivities.forEach((activity, index) => {
      console.log(`${index + 1}. ${activity.description}`);
      console.log(`   🕒 ${activity.createdAt.toLocaleString()}`);
      console.log("");
    });

    // Cleanup test data
    console.log("🧹 Cleaning up test data...");
    await ActivityLog.destroy({
      where: {
        entityId: {
          [require("sequelize").Op.in]: [9999, 9998, 9997, 9996],
        },
      },
    });

    // Remove the test login activity too
    await ActivityLog.destroy({
      where: {
        action: "login",
        entityName: admin.nama_lengkap,
        userAgent: "Test Script",
      },
      limit: 1,
    });

    console.log("✅ Test completed!");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run if called directly
if (require.main === module) {
  testNewActivityDescription().then(() => {
    console.log("\n🏁 Activity description test completed!");
    process.exit(0);
  });
}

module.exports = testNewActivityDescription;
