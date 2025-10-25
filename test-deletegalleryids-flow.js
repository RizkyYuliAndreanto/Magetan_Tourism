// Test untuk memverifikasi flow deletedGalleryIds dari frontend ke backend

console.log("=== TESTING DELETE GALLERY IDS FLOW ===");

// Simulasi data yang dikirim dari NewsForm.vue ke NewsManagement.vue
const simulasiDataFromForm = {
  deletedGalleryIds: [123, 456, 789], // Contoh IDs yang akan dihapus
};

console.log("📤 Data dari NewsForm.vue:", simulasiDataFromForm);

// Simulasi pemrosesan di NewsManagement.vue
const processedData = {
  validDeletedIds: simulasiDataFromForm.deletedGalleryIds
    .filter((id) => id != null && id !== undefined && id !== "" && !isNaN(id))
    .map((id) => parseInt(id)),
};

console.log("🔄 Data diproses di NewsManagement.vue:", processedData);

// Simulasi media operations yang dibuat
const mediaOperations = {
  keep: [111, 222], // IDs yang akan dipertahankan
  update: [], // IDs yang akan diupdate
  delete: processedData.validDeletedIds, // IDs yang akan dihapus
};

console.log("📋 Media operations yang dibuat:", mediaOperations);

// Simulasi data yang dikirim ke backend
const backendData = {
  media_operations: JSON.stringify(mediaOperations),
  // ... data berita lainnya
};

console.log("🚀 Data dikirim ke backend:", backendData);

// Simulasi parsing di backend
try {
  const parsedOperations = JSON.parse(backendData.media_operations);
  console.log("✅ Backend berhasil parse media_operations:", parsedOperations);
  console.log("🗑️ IDs yang akan dihapus di backend:", parsedOperations.delete);
} catch (error) {
  console.error("❌ Backend gagal parse media_operations:", error);
}

console.log("=== TEST COMPLETE ===");
