"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      /***************************************
       ** PLEASE CHANGE ALL '_id', 'roleId' **
       ***************************************/
      "admin",
      [
        {
          _id: "cea4cfc1-79f1-4b7f-8295-9b48ad5c9ace",
          roleId: "809be142-6208-4259-a7d3-ca9f12a0a35a",
          email: "superadmin@gmail.com",
          password:
            "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
          firstName: "super",
          lastName: "admin",
          phone: 1111111111,
          city: "surat",
          state: "gujarat",
          postalCode: 332012,
          address: "09, silver street",
          photo: "url1",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "a5b9eb60-523f-49e9-86f0-121e020ba463",
          roleId: "d7e940b8-d076-4637-a799-5b056dae3a37",
          email: "admin@gmail.com",
          password:
            "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
          firstName: "admin",
          lastName: "admin",
          phone: 2222222222,
          city: "surat",
          state: "gujarat",
          postalCode: 332012,
          address: "10, silver street",
          photo: "url1",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          _id: "47aca8d1-11eb-4b3b-a2d7-a7033825bc01",
          roleId: "b7a6df40-be7c-4321-87c6-dcb67249f627",
          email: "user@gmail.com",
          password:
            "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
          firstName: "user",
          lastName: "user",
          phone: 3333333333,
          city: "surat",
          state: "gujarat",
          postalCode: 332012,
          address: "11, silver street",
          photo: "url1",
          status: "active",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("admin", null, {});
  },
};





