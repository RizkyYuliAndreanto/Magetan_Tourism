// Simple test untuk memverifikasi endpoints dashboard
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

async function testEndpoints() {
  console.log("🔍 Testing Dashboard Endpoints...\n");

  try {
    // Test 1: Dashboard Summary
    console.log("1. Testing /api/dashboard/summary");
    const summaryResponse = await axios.get(`${BASE_URL}/dashboard/summary`);
    console.log("✅ Summary Response:", summaryResponse.data);
    console.log("");

    // Test 2: Admin Activity
    console.log("2. Testing /api/admin/activity");
    const activityResponse = await axios.get(
      `${BASE_URL}/admin/activity?limit=5`
    );
    console.log("✅ Activity Response:", activityResponse.data);
    console.log("");

    console.log("🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

// Run only if this file is executed directly
if (require.main === module) {
  console.log("Starting tests in 3 seconds...");
  setTimeout(testEndpoints, 3000);
}

module.exports = testEndpoints;
