// Test untuk simulasi request duplikasi dalam middleware
const express = require("express");
const { activityLogger } = require("./src/middleware/activityLoggerMiddleware");
const { ActivityLog } = require("./src/models");

async function testMiddlewareDuplication() {
  console.log("🔍 Testing middleware duplication prevention...\n");

  try {
    // Count sebelum test
    const countBefore = await ActivityLog.count();
    console.log(`📊 Activity logs before: ${countBefore}`);

    // Mock request dan response objects
    const mockReq = {
      method: "POST",
      originalUrl: "/api/berita",
      admin: { id_admin: 1, level_akses: "admin" },
      ip: "127.0.0.1",
      get: (header) => "Test User Agent",
      params: { id: 123 },
    };

    const mockRes = {
      statusCode: 200,
      send: null,
      json: null,
    };

    console.log("⏱️ Testing multiple response calls on same request...");

    // Setup middleware
    const middleware = activityLogger("create", "berita");

    // Simulasi middleware setup
    let logCount = 0;
    const originalLogActivity = require("./src/middleware/activityLoggerMiddleware");

    // Mock response methods untuk menghitung berapa kali dipanggil
    let sendCallCount = 0;
    let jsonCallCount = 0;

    const mockResponseData = {
      success: true,
      data: { id: 123, judul: "Test Berita", nama: "Test Berita" },
    };

    // Apply middleware
    await new Promise((resolve) => {
      middleware(mockReq, mockRes, () => {
        console.log("✅ Middleware applied");

        // Setup mock response methods
        const originalSend = mockRes.send;
        const originalJson = mockRes.json;

        mockRes.send = function (data) {
          sendCallCount++;
          console.log(`📤 res.send called (${sendCallCount} times)`);
          return this;
        };

        mockRes.json = function (data) {
          jsonCallCount++;
          console.log(`📤 res.json called (${jsonCallCount} times)`);
          return this;
        };

        resolve();
      });
    });

    // Simulasi multiple response calls (yang biasanya menyebabkan duplikasi)
    console.log("\n🔄 Simulating multiple response calls...");
    mockRes.send(mockResponseData);
    mockRes.json(mockResponseData);
    mockRes.send(mockResponseData); // Duplikat
    mockRes.json(mockResponseData); // Duplikat

    console.log(`\n📊 Response method calls:`);
    console.log(`   res.send: ${sendCallCount} times`);
    console.log(`   res.json: ${jsonCallCount} times`);

    // Wait untuk async operations
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Count setelah test
    const countAfter = await ActivityLog.count();
    console.log(`\n📊 Activity logs after: ${countAfter}`);
    console.log(`📈 Difference: +${countAfter - countBefore}`);

    if (countAfter - countBefore <= 1) {
      console.log("✅ Duplication prevention is working!");
    } else {
      console.log(
        `⚠️ Possible duplication detected: ${countAfter - countBefore} new logs`
      );
    }

    // Cleanup - hapus test activities dari database
    await ActivityLog.destroy({
      where: {
        adminId: 1,
        entity: "berita",
        entityId: 123,
        createdAt: {
          [require("sequelize").Op.gte]: new Date(Date.now() - 60000), // 1 menit terakhir
        },
      },
    });

    console.log("🧹 Test data cleaned up");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run if called directly
if (require.main === module) {
  testMiddlewareDuplication().then(() => {
    console.log("\n🏁 Middleware duplication test completed!");
    process.exit(0);
  });
}

module.exports = testMiddlewareDuplication;
