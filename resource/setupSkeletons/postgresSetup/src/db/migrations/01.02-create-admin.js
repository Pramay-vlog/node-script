"use strict";
const enums = require("../../../json/enums.json");
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("admin", {
      _id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      roleId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "role",
          key: "_id",
        },
      },
      email: { type: Sequelize.STRING, unique: true },
      password: { type: Sequelize.STRING },
      firstName: { type: Sequelize.STRING },
      lastName: { type: Sequelize.STRING },
      phone: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true,
      },
      address: { type: Sequelize.STRING },
      postalCode: { type: Sequelize.STRING },
      state: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING },
      photo: { type: Sequelize.TEXT },
      about: { type: Sequelize.STRING },
      status: {
        type: Sequelize.STRING,
        validate: {
          isIn: [
            [
              enums.USER_STATUS.ACTIVE,
              enums.USER_STATUS.BLOCKED,
              enums.USER_STATUS.DISABLED,
              enums.USER_STATUS.INACTIVE,
              enums.USER_STATUS.INVITED,
            ],
          ],
        },
      },
      statusModificationDate: {
        type: Sequelize.DATE,
      },
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
    await queryInterface.dropTable("admin", { force: true });
  },
};
