// src/seeders/eventSeeder.js
"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.bulkInsert(
        "Events", // Perbaikan: Menggunakan nama tabel plural "Events" sesuai konvensi Sequelize
        [
          {
            nama_event: "Magetan Expo 2025",
            deskripsi_event: "Pameran produk unggulan dan UMKM Magetan.",
            tanggal_mulai: "2025-09-10", // Perbaikan: Langsung menggunakan string tanggal
            tanggal_selesai: "2025-09-12",
            lokasi_event: "Gor Ki Mageti",
            koordinat_lokasi: "-7.6412,111.3387",
            jumlah_dilihat: 1200,
            jumlah_share: 150,
            gambar_event:
              "/uploads/event/gambar-event/gambar_event-1756788895592.JPG",
            brosur_event:
              "/uploads/event/brosur/brosur_event-1756788895418.JPG",
            id_admin: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            nama_event: "Festival Kuliner Magetan",
            deskripsi_event:
              "Festival makanan khas Magetan dan lomba masak tradisional.",
            tanggal_mulai: "2025-10-05",
            tanggal_selesai: "2025-10-07",
            lokasi_event: "Alun-alun Magetan",
            koordinat_lokasi: "-7.6521,111.3361",
            jumlah_dilihat: 900,
            jumlah_share: 80,
            gambar_event:
              "/uploads/event/gambar-event/gambar_event-1756792764361.jpg",
            brosur_event:
              "/uploads/event/brosur/brosur_event-1756792764357.jpg",
            id_admin: 2,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            nama_event: "Lomba Foto Wisata",
            deskripsi_event:
              "Kompetisi foto destinasi wisata Magetan untuk umum.",
            tanggal_mulai: "2025-11-01",
            tanggal_selesai: "2025-11-03",
            lokasi_event: "Taman Wisata Telaga Sarangan",
            koordinat_lokasi: "-7.6750,111.3330",
            jumlah_dilihat: 500,
            jumlah_share: 40,
            gambar_event:
              "/uploads/event/gambar-event/gambar_event-1756792845502.JPG",
            brosur_event:
              "/uploads/event/brosur/brosur_event-1756792845156.JPG",
            id_admin: 1,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        {}
      );
      console.log("✅ Seeder Event berhasil dijalankan.");
    } catch (err) {
      console.error("❌ Seeder Event gagal:", err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Events", null, {}); // Perbaikan: Menggunakan nama tabel plural "Events"
  },
};
