"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ubah kolom action dari ENUM ke VARCHAR(50)
    await queryInterface.changeColumn("activity_logs", "action", {
      type: Sequelize.STRING(50),
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    // Kembalikan ke ENUM jika rollback
    await queryInterface.changeColumn("activity_logs", "action", {
      type: Sequelize.ENUM("create", "update", "delete", "login", "logout"),
      allowNull: false,
    });
  },
};
