const enums = require("../../json/enums.json");
const messages = require("../../json/messages.json");
const fs = require("fs/promises");
module.exports = async (app, logger) => {
  /* For  */
  const routeDirs = await fs.readdir(__dirname + "/../routes");
  routeDirs.forEach(async (routeDir) => {
    app.use([`/api/v1/${routeDir}`], require(`../routes/${routeDir}/index`));
  });

  const { createResponseObject } = require("../utils");

  /* Catch all */
  app.all("*", function (req, res) {
    res.status(enums.HTTP_CODES.BAD_REQUEST).json(
      createResponseObject({
        req: req,
        result: -1,
        message: messages.ENDPOINT_NOT_FOUND,
        payload: {},
        logPayload: false,
      })
    );
  });

  // Async error handler
  app.use((error, req, res, next) => {
    logger.error(
      `${req.originalUrl} - Error caught by error-handler (router.js): ${error.message}\n${error.stack}`
    );
    const data4responseObject = {
      req: req,
      result: -999,
      message: messages.GENERAL,
      payload: {},
      logPayload: false,
    };

    return res
      .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
      .json(createResponseObject(data4responseObject));
  });
};
