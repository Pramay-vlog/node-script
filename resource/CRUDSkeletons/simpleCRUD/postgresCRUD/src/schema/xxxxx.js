"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class xxxxx extends Model {
    static associate(models) {
      // ---- DEFINE ASSOCIATION HERE ----
    }
  }
  xxxxx.init(
    {
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      /* DEFINE YOUR SCHEMA HERE AND PAST THE SAME IN MIGRATIONS FOLDER*/
      isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
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
      modelName: "xxxxx",
      freezeTableName: true,
    }
  );
  return xxxxx;
};
