"use strict";
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.createTable("role", {
			_id: {
				type: Sequelize.UUID,
				defaultValue: Sequelize.UUIDV4,
				primaryKey: true,
			},
			name: {
				type: Sequelize.STRING,
				allowNull: false,
				unique: true,
			},
			description: { type: Sequelize.STRING },
			updatedBy: { type: Sequelize.STRING },
			isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
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
		await queryInterface.dropTable("role", { force: true });
	},
};
