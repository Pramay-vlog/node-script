"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("codeVerification", {
			_id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			email: { type: Sequelize.STRING, allowNull: false },
			code: { type: Sequelize.STRING, allowNull: false },
			date: { type: Sequelize.DATE },
			expirationDate: { type: Sequelize.DATE },
			failedAttempts: { type: Sequelize.INTEGER },
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
		await queryInterface.dropTable("codeVerification", { force: true });
	},
};
