const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");

// Get All Role
module.exports = exports = {
  handler: async (req, res) => {
    try {
      let criteria = {
        where: { isActive: true },
      };
      const { id, name, isAll } = req.query;
      if (id) {
        criteria.where._id = id;
      }
      if (name) {
        criteria.where.name = name;
      }
      if (isAll === "true") {
        delete criteria.where.isActive;
      }
      let roles = await global.models.GLOBAL.ROLE.findAll(criteria);
      let data4createResponseObject = {
        req: req,
        result: 0,
        message: roles.length > 0 ? messages.SUCCESS : messages.ITEM_NOT_FOUND,
        payload: roles.length > 0 ? { roles } : {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
      );
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
