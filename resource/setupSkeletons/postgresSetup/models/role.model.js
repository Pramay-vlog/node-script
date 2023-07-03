'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {

    class role extends Model {
        static associate(models) {
            // define association here
            role.hasMany(models.user, { as: 'role', foreignKey: 'roleId' });
        }
    }

    role.init(
        {
            name: { type: DataTypes.STRING, allowNull: false, unique: true },
            description: DataTypes.STRING
        },
        {
            sequelize,
            timestamps: true,
            freezeTableName: true,
            modelName: 'role',
        }
    );
    return role;
};