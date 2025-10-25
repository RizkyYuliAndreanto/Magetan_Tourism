// Simple test untuk endpoint dashboard/activity (public)
const http = require("http");

function testDashboardEndpoint() {
  console.log("🔍 Testing /api/dashboard/activity endpoint...\n");

  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/dashboard/activity?limit=5",
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const response = JSON.parse(data);
        console.log(`📊 Status: ${res.statusCode}`);
        console.log(`✅ Success: ${response.success}`);
        console.log(`📋 Data count: ${response.data?.length || 0}`);

        if (response.data && response.data.length > 0) {
          console.log("\n📋 Sample activities:");
          response.data.slice(0, 3).forEach((activity, index) => {
            console.log(
              `${index + 1}. [${activity.action.toUpperCase()}] ${
                activity.entity
              }`
            );
            console.log(`   👤 Admin: ${activity.admin}`);
            console.log(
              `   📝 Description: ${activity.description || "No description"}`
            );
            console.log(
              `   🕒 Time: ${new Date(activity.createdAt).toLocaleString()}`
            );
            console.log("");
          });
        }

        console.log("✅ Dashboard endpoint is working!");
      } catch (error) {
        console.error("❌ Failed to parse response:", error);
        console.log("Raw response:", data);
      }
    });
  });

  req.on("error", (error) => {
    console.error("❌ Request error:", error.message);
    console.log("💡 Make sure backend server is running on port 5000");
  });

  req.setTimeout(5000, () => {
    console.error("❌ Request timeout");
    req.destroy();
  });

  req.end();
}

// Run if called directly
if (require.main === module) {
  testDashboardEndpoint();
}

module.exports = testDashboardEndpoint;
