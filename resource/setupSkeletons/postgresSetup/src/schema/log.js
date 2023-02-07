"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class log extends Model {
		static associate(models) {
			// define association here
		}
	}
	log.init(
		{
			_id: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			description: { type: DataTypes.TEXT, allowNull: false },
			requestId: { type: DataTypes.STRING },
			requestBody: {
				type: DataTypes.TEXT,
			},
			requestHeaders: {
				type: DataTypes.TEXT,
			},
			requestIp: { type: DataTypes.STRING },
			requestMethod: { type: DataTypes.STRING },
			requestPath: { type: DataTypes.TEXT },
			requestProtocol: { type: DataTypes.STRING },
			requestUserAgent: { type: DataTypes.STRING },
			serverHostname: { type: DataTypes.STRING },
			serverNetworkInterfaces: {
				type: DataTypes.TEXT,
			},
			time: { type: DataTypes.DATE },
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
			modelName: "log",
			freezeTableName: true,
		}
	);
	return log;
};
