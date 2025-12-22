// Test sederhana untuk endpoint atomic
const http = require("http");
const https = require("https");

function testEndpoint() {
  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/berita/1/with-media",
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  };

  console.log("🔍 Testing atomic endpoint availability...");

  const req = http.request(options, (res) => {
    console.log("✅ Atomic endpoint found!");
    console.log("Status Code:", res.statusCode);
    console.log("Headers:", res.headers);
  });

  req.on("error", (error) => {
    if (error.code === "ECONNREFUSED") {
      console.log("❌ Server is not running on port 5000");
    } else {
      console.log("❌ Connection error:", error.message);
    }
  });

  req.end();
}

// Test basic endpoint dulu
function testBasic() {
  const options = {
    hostname: "localhost",
    port: 5000,
    path: "/api/berita",
    method: "GET",
  };

  const req = http.request(options, (res) => {
    console.log("✅ Server running on port 5000");
    console.log("Basic endpoint status:", res.statusCode);

    // Test atomic endpoint
    setTimeout(testEndpoint, 1000);
  });

  req.on("error", (error) => {
    console.log("❌ Server not running:", error.message);
  });

  req.end();
}

console.log("=== TESTING ENDPOINTS ===");
testBasic();
