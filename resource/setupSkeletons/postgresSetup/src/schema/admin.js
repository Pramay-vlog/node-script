"use strict";
const { Model } = require("sequelize");
const enums = require("../../json/enums.json");
module.exports = (sequelize, DataTypes) => {
  class admin extends Model {
    static associate(models) {
      admin.belongsTo(models.role, {
        as: "role",
        foreignKey: "roleId",
        onDelete: "cascade",
      });
    }
  }
  admin.init(
    {
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      roleId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "role",
          key: "_id",
        },
      },
      email: { type: DataTypes.STRING, unique: true },
      password: { type: DataTypes.STRING },
      firstName: { type: DataTypes.STRING },
      lastName: { type: DataTypes.STRING },
      phone: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: true,
      },
      address: { type: DataTypes.STRING },
      postalCode: { type: DataTypes.STRING },
      state: { type: DataTypes.STRING },
      city: { type: DataTypes.STRING },
      photo: { type: DataTypes.TEXT },
      about: { type: DataTypes.STRING },
      status: {
        type: DataTypes.STRING,
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
        type: DataTypes.DATE,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    },
    {
      sequelize,
      modelName: "admin",
      freezeTableName: true,
    }
  );
  return admin;
};
