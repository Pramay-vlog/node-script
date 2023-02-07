"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      /*****************************
       ** PLEASE CHANGE ALL '_id' **
       *****************************/
      "role",
      [
        {
          _id: "809be142-6208-4259-a7d3-ca9f12a0a35a",
          name: "superadmin",
          description: "this role is for superadmin",
          updatedBy: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "d7e940b8-d076-4637-a799-5b056dae3a37",
          name: "admin",
          description: "this role is for admin",
          updatedBy: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "b7a6df40-be7c-4321-87c6-dcb67249f627",
          name: "user",
          description: "this role is for user",
          updatedBy: null,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role", null, {});
  },
};



