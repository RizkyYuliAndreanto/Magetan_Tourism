// Test script untuk memverifikasi activity logging berfungsi
const { ActivityLog } = require("./src/models");

async function testActivityLogging() {
  console.log("🔍 Testing activity logging functionality...\n");

  try {
    // Get count before
    const countBefore = await ActivityLog.count();
    console.log(`📊 Activity logs before test: ${countBefore}`);

    // Manual create activity log (simulasi dari controller)
    const testActivity = await ActivityLog.create({
      adminId: 1, // Asumsi admin dengan id 1 ada
      action: "create",
      entity: "test",
      entityId: 999,
      entityName: "Test Activity",
      description: "Test activity logging from manual script",
      ipAddress: "127.0.0.1",
      userAgent: "Test Script",
    });

    console.log("✅ Test activity created:", {
      id: testActivity.id,
      adminId: testActivity.adminId,
      action: testActivity.action,
      entity: testActivity.entity,
      description: testActivity.description,
    });

    // Get count after
    const countAfter = await ActivityLog.count();
    console.log(`📊 Activity logs after test: ${countAfter}`);
    console.log(`📈 Difference: +${countAfter - countBefore}`);

    // Clean up test data
    await ActivityLog.destroy({
      where: { id: testActivity.id },
    });
    console.log("🧹 Test data cleaned up");

    console.log("\n✅ Activity logging is working correctly!");
  } catch (error) {
    console.error("❌ Activity logging test failed:", error);
  }
}

// Run if called directly
if (require.main === module) {
  testActivityLogging().then(() => {
    console.log("\n🏁 Test completed!");
    process.exit(0);
  });
}

module.exports = testActivityLogging;
