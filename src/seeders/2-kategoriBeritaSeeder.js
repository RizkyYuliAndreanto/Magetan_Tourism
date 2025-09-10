// src/seeders/kategoriBeritaSeeder.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Kategori_Berita",
      [
        {
          nama_kategori: "Pemerintahan",
          deskripsi_kategori: "Berita seputar pemerintahan daerah",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama_kategori: "Pariwisata",
          deskripsi_kategori: "Berita destinasi wisata dan event",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama_kategori: "Ekonomi",
          deskripsi_kategori: "Berita UMKM dan ekonomi lokal",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama_kategori: "Budaya",
          deskripsi_kategori: "Berita budaya dan tradisi",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          nama_kategori: "Pengumuman",
          deskripsi_kategori: "Pengumuman resmi dari pemerintah",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Kategori_Berita", null, {});
  },
};
