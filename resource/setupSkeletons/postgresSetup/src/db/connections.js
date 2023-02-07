const logger = require("../logger");

// postgres
module.exports = async () => {
  let db = require("../schema/index");
  let models = {
    GLOBAL: {},
  };

  try {
    /* To check if connection is made successfully */
    await db.sequelize.authenticate();

    /* To sync schema with latest definitions. --xx-- Uncomment line below to apply changes in schema.  */
    // await db.sequelize.sync({ alter: true });

    /* To create postgis extension for distance calculation */
    // try {
    // 	await db.sequelize.query("CREATE EXTENSION postgis;");
    // } catch (error) {
    // 	// console.log(error);
    // 	logger.info(
    // 		"Postgis extension already exists or error in creating extension."
    // 	);
    // }

    /* To make object of models so we can make it global */
    Object.keys(db).forEach(async (modelName) => {
      if (modelName === "sequelize" || modelName === "Sequelize") return;
      models.GLOBAL[modelName.toUpperCase()] = db[modelName];
    });
    return models;
  } catch (error) {
    logger.error(
      "Error encountered while trying to create database connections and models:\n" +
        error.message +
        "\n" +
        error.stack
    );
    return null;
  }
};
