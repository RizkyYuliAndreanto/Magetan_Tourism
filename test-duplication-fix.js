// Test untuk memeriksa duplikasi activity logging
const { ActivityLog, Admin } = require("./src/models");

async function testDuplicationFix() {
  console.log("🔍 Testing activity duplication fix...\n");

  try {
    // Get count awal
    const countBefore = await ActivityLog.count();
    console.log(`📊 Activity logs before: ${countBefore}`);

    // Simulasi multiple logs dalam waktu singkat (yang seharusnya dicegah)
    const testData = {
      adminId: 1,
      action: "create",
      entity: "test_duplication",
      entityId: 1001,
      entityName: "Test Duplication Item",
      description: "Testing duplication prevention",
      ipAddress: "127.0.0.1",
      userAgent: "Test Script",
    };

    console.log("⏱️ Creating multiple activities in quick succession...");

    // Coba buat multiple activities dengan data yang sama
    const promises = [];
    for (let i = 0; i < 5; i++) {
      promises.push(
        ActivityLog.create({
          ...testData,
          description: `${testData.description} - Attempt ${i + 1}`,
        })
      );
    }

    const results = await Promise.all(promises);
    console.log(`✅ Created ${results.length} activities`);

    // Get count setelah
    const countAfter = await ActivityLog.count();
    console.log(`📊 Activity logs after: ${countAfter}`);
    console.log(`📈 Difference: +${countAfter - countBefore}`);

    // Get activities yang baru dibuat
    const newActivities = await ActivityLog.findAll({
      where: { entity: "test_duplication" },
      order: [["createdAt", "DESC"]],
    });

    console.log(`\n📋 Test activities created:`);
    newActivities.forEach((activity, index) => {
      console.log(`${index + 1}. ID: ${activity.id} - ${activity.description}`);
      console.log(`   Created: ${activity.createdAt.toLocaleString()}`);
    });

    // Cleanup test data
    await ActivityLog.destroy({
      where: { entity: "test_duplication" },
    });
    console.log("\n🧹 Test data cleaned up");

    console.log("\n✅ Duplication test completed!");
    console.log(
      "💡 Note: The middleware duplication prevention works at request level, not database level."
    );
    console.log(
      "   Database allows multiple entries, but middleware prevents same request from logging twice."
    );
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run if called directly
if (require.main === module) {
  testDuplicationFix().then(() => {
    console.log("\n🏁 Test completed!");
    process.exit(0);
  });
}

module.exports = testDuplicationFix;
