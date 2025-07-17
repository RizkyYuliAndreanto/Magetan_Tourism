"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Logika untuk menambahkan kolom
    await queryInterface.addColumn("Admins", "resetPasswordToken", {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn("Admins", "resetPasswordExpires", {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    // Logika untuk menghapus kolom jika migrasi di-rollback
    await queryInterface.removeColumn("Admins", "resetPasswordToken");
    await queryInterface.removeColumn("Admins", "resetPasswordExpires");
  },
};
