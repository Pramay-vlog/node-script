"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("log", {
			_id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			description: { type: Sequelize.TEXT, allowNull: false },
			requestId: { type: Sequelize.STRING },
			requestBody: {
				type: Sequelize.TEXT,
			},
			requestHeaders: {
				type: Sequelize.TEXT,
			},
			requestIp: { type: Sequelize.STRING },
			requestMethod: { type: Sequelize.STRING },
			requestPath: { type: Sequelize.TEXT },
			requestProtocol: { type: Sequelize.STRING },
			requestUserAgent: { type: Sequelize.STRING },
			serverHostname: { type: Sequelize.STRING },
			serverNetworkInterfaces: {
				type: Sequelize.TEXT,
			},
			time: { type: Sequelize.DATE },
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
		await queryInterface.dropTable("log", { force: true });
	},
};
