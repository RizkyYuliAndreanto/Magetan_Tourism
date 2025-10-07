// Test script untuk API activity logging
const axios = require("axios");

const BASE_URL = "http://localhost:5000/api";

// Test function untuk dashboard summary
async function testDashboardSummary() {
  try {
    console.log("🔍 Testing Dashboard Summary...");
    const response = await axios.get(`${BASE_URL}/dashboard/summary`);
    console.log("✅ Dashboard Summary Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Dashboard Summary Error:",
      error.response?.data || error.message
    );
  }
}

// Test function untuk recent activity
async function testRecentActivity() {
  try {
    console.log("🔍 Testing Recent Activity...");
    const response = await axios.get(`${BASE_URL}/admin/activity?limit=5`);
    console.log("✅ Recent Activity Response:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Recent Activity Error:",
      error.response?.data || error.message
    );
  }
}

// Main test function
async function runTests() {
  console.log("🚀 Starting API Tests...\n");

  await testDashboardSummary();
  console.log("\n");
  await testRecentActivity();

  console.log("\n✨ Tests completed!");
}

// Run tests jika dipanggil langsung
if (require.main === module) {
  runTests();
}

module.exports = { testDashboardSummary, testRecentActivity };
