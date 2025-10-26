"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Admins", "is_blocked", {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      after: "resetPasswordExpires",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("Admins", "is_blocked");
  },
};
