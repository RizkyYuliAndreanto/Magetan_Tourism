// Test endpoint atomic untuk memastikan tersedia dan berfungsi
const axios = require("axios");
const FormData = require("form-data");

async function testAtomicEndpoint() {
  console.log("=== TESTING ATOMIC ENDPOINT ===");

  try {
    // Test apakah endpoint /api/berita/:id/with-media tersedia
    const testFormData = new FormData();
    testFormData.append("judul", "Test Atomic Update");
    testFormData.append(
      "media_operations",
      JSON.stringify({
        keep: [],
        update: [],
        delete: [999], // Test dengan ID yang tidak ada
      })
    );

    const response = await axios.put(
      "http://localhost:5000/api/berita/1/with-media",
      testFormData,
      {
        headers: {
          ...testFormData.getHeaders(),
          Authorization: "Bearer test_token_placeholder",
        },
      }
    );

    console.log("✅ Atomic endpoint tersedia dan merespons");
    console.log("Response status:", response.status);
  } catch (error) {
    console.log("❌ Atomic endpoint error:");
    console.log("Status:", error.response?.status);
    console.log("Error:", error.response?.data || error.message);

    // Cek apakah ini error 404 (endpoint tidak ditemukan)
    if (error.response?.status === 404) {
      console.log("🔍 Endpoint /api/berita/:id/with-media TIDAK DITEMUKAN");
      console.log("Frontend akan fallback ke method lama");
    }
  }
}

// Test endpoint list untuk memastikan server berjalan
async function testBasicEndpoint() {
  try {
    const response = await axios.get("http://localhost:5000/api/berita");
    console.log("✅ Basic endpoint working, server is running");
  } catch (error) {
    console.log(
      "❌ Server not running or basic endpoint error:",
      error.message
    );
  }
}

async function runTests() {
  await testBasicEndpoint();
  await testAtomicEndpoint();
}

runTests();
