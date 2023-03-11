'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class otp extends Model {
    static associate(models) {
      // define association here
    }
  }
  otp.init(
    {
      email: { type: DataTypes.STRING, allowNull: false },
      otp: { type: DataTypes.STRING, allowNull: false },
      expireAt: { type: DataTypes.DATE, defaultValue: () => Date.now() + 1000 * 60 * 60 * 1 }
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      modelName: 'otp',
    }
  );
  return otp;
};