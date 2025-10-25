// Test file untuk endpoint baru updateBeritaWithMedia
// File: test-update-berita-with-media.js

const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");

async function testUpdateBeritaWithMedia() {
  try {
    console.log("🧪 Testing Update Berita With Media Endpoint...");

    // Sample data for testing
    const beritaId = 1; // Ganti dengan ID berita yang valid
    const token = "test-token"; // Ganti dengan token yang valid

    const formData = new FormData();

    // 1. Data berita
    formData.append("judul", "Berita Test Update With Media");
    formData.append("isi_berita", "Content test untuk endpoint baru");

    // 2. Media operations
    const mediaOperations = {
      keep: [1, 3], // ID media yang dipertahankan
      update: [
        { id: 1, deskripsi_file: "Updated description", urutan_tampil: 1 },
      ],
      delete: [2], // ID media yang dihapus
    };
    formData.append("media_operations", JSON.stringify(mediaOperations));

    console.log(
      "📤 Sending request to:",
      `http://localhost:5000/api/berita/${beritaId}/with-media`
    );
    console.log("📋 Media operations:", mediaOperations);

    const response = await axios.put(
      `http://localhost:5000/api/berita/${beritaId}/with-media`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      }
    );

    console.log("✅ Response received:", {
      status: response.status,
      success: response.data.success,
      message: response.data.message,
      media_stats: response.data.media_stats,
    });

    return response.data;
  } catch (error) {
    console.log("❌ Test failed:");
    console.log("Status:", error.response?.status);
    console.log("Error:", error.response?.data || error.message);
    return null;
  }
}

// Jalankan test jika dipanggil langsung
if (require.main === module) {
  testUpdateBeritaWithMedia()
    .then((result) => {
      if (result) {
        console.log("🎉 Test completed successfully!");
      } else {
        console.log("💥 Test failed!");
      }
    })
    .catch(console.error);
}

module.exports = { testUpdateBeritaWithMedia };
