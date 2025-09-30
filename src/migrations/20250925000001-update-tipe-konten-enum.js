"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Update ENUM for tipe_konten in Komentars table
    await queryInterface.changeColumn("Komentars", "tipe_konten", {
      type: Sequelize.ENUM(
        "berita",
        "event",
        "sejarah",
        "destinasi",
        "umkm",
        "budaya",
        "akomodasi"
      ),
      allowNull: true,
    });

    // Update ENUM for tipe_konten in Likes table
    await queryInterface.changeColumn("Likes", "tipe_konten", {
      type: Sequelize.ENUM(
        "berita",
        "event",
        "sejarah",
        "destinasi",
        "umkm",
        "budaya",
        "akomodasi"
      ),
      allowNull: true,
    });

    // Update ENUM for tipe_konten in Share_Logs table
    await queryInterface.changeColumn("Share_Logs", "tipe_konten", {
      type: Sequelize.ENUM(
        "berita",
        "event",
        "sejarah",
        "destinasi",
        "umkm",
        "budaya",
        "akomodasi"
      ),
      allowNull: true,
    });

    // Update ENUM for tipe_konten in Media_Galeris table (if exists)
    await queryInterface.changeColumn("Media_Galeris", "tipe_konten", {
      type: Sequelize.ENUM(
        "berita",
        "event",
        "sejarah",
        "destinasi",
        "umkm",
        "budaya",
        "akomodasi"
      ),
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Revert ENUM for tipe_konten in Komentars table
    await queryInterface.changeColumn("Komentars", "tipe_konten", {
      type: Sequelize.ENUM("berita", "event", "sejarah", "destinasi", "umkm"),
      allowNull: true,
    });

    // Revert ENUM for tipe_konten in Likes table
    await queryInterface.changeColumn("Likes", "tipe_konten", {
      type: Sequelize.ENUM("berita", "event", "sejarah", "destinasi", "umkm"),
      allowNull: true,
    });

    // Revert ENUM for tipe_konten in Share_Logs table
    await queryInterface.changeColumn("Share_Logs", "tipe_konten", {
      type: Sequelize.ENUM("berita", "event", "sejarah", "destinasi", "umkm"),
      allowNull: true,
    });

    // Revert ENUM for tipe_konten in Media_Galeris table
    await queryInterface.changeColumn("Media_Galeris", "tipe_konten", {
      type: Sequelize.ENUM("berita", "event", "sejarah", "destinasi", "umkm"),
      allowNull: true,
    });
  },
};
