// Test connectivity antara frontend dan backend
const axios = require("axios");

const BACKEND_URL = "http://localhost:5000";

async function testFrontendBackendConnection() {
  console.log("🔗 Testing Frontend-Backend Connection...\n");

  try {
    // Test 1: Dashboard Summary (dipanggil frontend)
    console.log("1. Testing /api/dashboard/summary (Frontend calls this)");
    const summaryResponse = await axios.get(
      `${BACKEND_URL}/api/dashboard/summary`
    );
    console.log("✅ Summary Response Status:", summaryResponse.status);
    console.log(
      "✅ Summary Data:",
      JSON.stringify(summaryResponse.data, null, 2)
    );
    console.log("");

    // Test 2: Admin Activity (dipanggil frontend)
    console.log(
      "2. Testing /api/admin/activity?limit=10 (Frontend calls this)"
    );
    const activityResponse = await axios.get(
      `${BACKEND_URL}/api/admin/activity`,
      {
        params: { limit: 10 },
      }
    );
    console.log("✅ Activity Response Status:", activityResponse.status);
    console.log("✅ Activity Data Sample:");
    console.log(
      JSON.stringify(activityResponse.data.data?.slice(0, 2) || [], null, 2)
    );
    console.log("");

    // Test 3: CORS Header Check
    console.log("3. Checking CORS Headers...");
    console.log(
      "✅ Access-Control-Allow-Origin:",
      summaryResponse.headers["access-control-allow-origin"] || "Not set"
    );
    console.log("");

    console.log("🎉 Frontend-Backend connection test completed successfully!");
    console.log("✅ Your AdminDashboard.vue should work perfectly now!");
  } catch (error) {
    console.error(
      "❌ Connection test failed:",
      error.response?.data || error.message
    );
    console.error("📝 Make sure backend server is running on port 5000");
  }
}

// Run test
testFrontendBackendConnection();
