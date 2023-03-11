'use strict';
const { Model } = require('sequelize');
const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      // define association here
      user.belongsTo(models.role, { as: 'role', foreignKey: 'roleId' });
    }
  }
  user.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: { type: DataTypes.STRING, allowNull: false },
      roleId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'role', key: 'id' } },
      isActive: { type: DataTypes.BOOLEAN, defaultValue: 1 }
    },
    {
      sequelize,
      timestamps: true,
      freezeTableName: true,
      modelName: 'user',
    }
  );

  user.beforeCreate(async (user, options) => {
    user.password = await bcrypt.hash(user.password, 10);
  });

  return user;
};