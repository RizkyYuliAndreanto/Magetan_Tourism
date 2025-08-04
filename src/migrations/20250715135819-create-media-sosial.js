'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Media_Sosials", {
      id_media_sosial: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      nama_platform: {
        type: Sequelize.ENUM(
          "Facebook",
          "Instagram",
          "Twitter",
          "YouTube",
          "LinkedIn",
          "TikTok"
        ),
      },
      url_link: {
        type: Sequelize.STRING,
      },
      icon_path: {
        type: Sequelize.STRING,
      },
      urutan_tampil: {
        type: Sequelize.INTEGER,
      },
      id_admin: {
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('Media_Sosials');
  }
};