"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class codeVerification extends Model {
		static associate(models) {
			// define association here
		}
	}
	codeVerification.init(
		{
			_id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			email: { type: DataTypes.STRING, allowNull: false },
			code: { type: DataTypes.STRING, allowNull: false },
			date: { type: DataTypes.DATE },
			expirationDate: { type: DataTypes.DATE },
			failedAttempts: { type: DataTypes.INTEGER },
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
			modelName: "codeVerification",
			freezeTableName: true,
		}
	);
	return codeVerification;
};
