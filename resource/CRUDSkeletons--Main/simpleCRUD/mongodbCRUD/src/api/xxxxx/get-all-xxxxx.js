const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");

module.exports = exports = {
  handler: async (req, res) => {
    try {
      let criteria = { isActive: true };
      if (req.query.id) criteria._id = req.query.id;
      if (req.query.isAll === "true") delete criteria.isActive;
      let xxxxx = await global.models.GLOBAL.XXXXX.find(criteria).sort({
        createdAt: -1,
      });
      let data4createResponseObject = {
        req: req,
        result: 0,
        message: xxxxx.length > 0 ? messages.SUCCESS : messages.ITEM_NOT_FOUND,
        payload: xxxxx.length > 0 ? { xxxxx, count: xxxxx.length } : {},
        logPayload: false,
      };
      return res.status(enums.HTTP_CODES.OK).json(utils.createResponseObject(data4createResponseObject));
    } catch (error) {
      logger.error(`${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`);
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      return res.status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR).json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
