// Test untuk melihat struktur response data dari controller berita
const express = require("express");
const BeritaController = require("./src/controllers/beritaController");

async function testBeritaResponseStructure() {
  console.log("🔍 Testing Berita response structure for activity logging...\n");

  try {
    // Mock request untuk get berita
    const mockReq = {
      params: { id: 1 },
      user: { id: 1 },
    };

    let responseData = null;
    const mockRes = {
      status: (code) => mockRes,
      json: (data) => {
        responseData = data;
        return mockRes;
      },
    };

    console.log("📝 Testing BeritaController.getBeritaById...");

    try {
      await BeritaController.getBeritaById(mockReq, mockRes);

      if (responseData) {
        console.log("\n✅ Response structure:");
        console.log("Response keys:", Object.keys(responseData));

        if (responseData.data) {
          console.log("Data keys:", Object.keys(responseData.data));
          console.log("Sample data:", {
            id: responseData.data.id,
            judul: responseData.data.judul,
            nama: responseData.data.nama,
            title: responseData.data.title,
          });
        } else if (responseData.id) {
          console.log("Direct response:", {
            id: responseData.id,
            judul: responseData.judul,
            nama: responseData.nama,
            title: responseData.title,
          });
        }

        // Test entity name extraction logic
        const testEntityName = responseData.data
          ? responseData.data.judul ||
            responseData.data.nama ||
            responseData.data.title ||
            responseData.data.name
          : responseData.judul ||
            responseData.nama ||
            responseData.title ||
            responseData.name;

        console.log("\n🎯 Extracted entityName would be:", testEntityName);
      } else {
        console.log("❌ No response data received");
      }
    } catch (error) {
      console.log(
        "⚠️ Controller test failed (expected if no data):",
        error.message
      );
    }

    console.log("\n💡 Tips for entity name extraction:");
    console.log("   - For Berita: look for 'judul' field");
    console.log(
      "   - For Destinasi: look for 'nama' or 'nama_destinasi' field"
    );
    console.log("   - For Event: look for 'nama_event' field");
    console.log("   - For UMKM: look for 'nama_umkm' field");
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Run if called directly
if (require.main === module) {
  testBeritaResponseStructure().then(() => {
    console.log("\n🏁 Response structure test completed!");
    process.exit(0);
  });
}

module.exports = testBeritaResponseStructure;
