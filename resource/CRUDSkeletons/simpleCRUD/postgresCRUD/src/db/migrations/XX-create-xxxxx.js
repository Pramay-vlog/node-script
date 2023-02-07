"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("xxxxx", {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      /* PASTE HERE YOUR SCHEMA AND REPLACE '''DataTypes''' with '''Sequelize''' */
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("xxxxx", { force: true });
  },
};
