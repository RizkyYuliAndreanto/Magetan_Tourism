// Test endpoint /api/admin/activity dengan dan tanpa token
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testAdminActivityEndpoint() {
  console.log("🔍 Testing /api/admin/activity endpoint...\n");

  try {
    // Test 1: Tanpa token (should fail)
    console.log("1. Testing WITHOUT token:");
    try {
      const response = await axios.get(`${BASE_URL}/admin/activity`);
      console.log("❌ Unexpected success without token:", response.data);
    } catch (error) {
      if (error.response) {
        console.log(
          `✅ Expected auth error: ${error.response.status} - ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else {
        console.log("❌ Network error:", error.message);
      }
    }

    console.log("\n" + "=".repeat(50) + "\n");

    // Test 2: Test dashboard endpoint (public)
    console.log("2. Testing /api/dashboard/activity (public):");
    try {
      const response = await axios.get(`${BASE_URL}/dashboard/activity`);
      console.log("✅ Dashboard activity response:");
      console.log(`   Success: ${response.data.success}`);
      console.log(`   Data count: ${response.data.data?.length || 0}`);
      if (response.data.data && response.data.data.length > 0) {
        console.log("   Sample activity:", {
          id: response.data.data[0].id,
          action: response.data.data[0].action,
          entity: response.data.data[0].entity,
          admin: response.data.data[0].admin,
          description: response.data.data[0].description,
        });
      }
    } catch (error) {
      console.log(
        "❌ Dashboard activity error:",
        error.response?.data || error.message
      );
    }

    console.log("\n" + "=".repeat(50) + "\n");

    // Test 3: Test with mock token (untuk simulasi)
    console.log("3. Testing WITH mock token:");
    console.log("   (Note: This will likely fail without valid token)");
    try {
      const response = await axios.get(`${BASE_URL}/admin/activity`, {
        headers: {
          Authorization: "Bearer mock-token-for-testing",
        },
      });
      console.log("✅ Admin activity response:", response.data);
    } catch (error) {
      if (error.response) {
        console.log(
          `⚠️ Auth error with mock token: ${error.response.status} - ${
            error.response.data.message || error.response.statusText
          }`
        );
      } else {
        console.log("❌ Network error:", error.message);
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

// Run test
if (require.main === module) {
  testAdminActivityEndpoint().then(() => {
    console.log("\n✅ Endpoint tests completed!");
  });
}

module.exports = testAdminActivityEndpoint;
