'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Share_Logs", {
      id_share_log: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      id_pengunjung: {
        type: Sequelize.INTEGER,
      },
      tipe_konten: {
        type: Sequelize.ENUM("berita", "event", "sejarah", "umkm", "destinasi"),
      },
      id_konten: {
        type: Sequelize.INTEGER,
      },
      platform_share: {
        type: Sequelize.ENUM(
          "Facebook",
          "Wa",
          "Twitter",
          "Copy_link",
          "Email",
          "Telegram",
          "TikTok",
          "LinkedIn",
          "Instagram"
        ),
      },
      tanggal_share: {
        type: Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Share_Logs');
  }
};