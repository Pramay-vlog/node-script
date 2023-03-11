'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class xxxxx extends Model {
        static associate(models) {
            // define association here
        }
    }
    xxxxx.init(
        {
            isActive: { type: DataTypes.BOOLEAN, defaultValue: 1 }
        },
        {
            sequelize,
            timestamps: true,
            freezeTableName: true,
            modelName: 'xxxxx',
        }
    );
    return xxxxx;
};