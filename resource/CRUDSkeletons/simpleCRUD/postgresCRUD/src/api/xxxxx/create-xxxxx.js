const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");

module.exports = exports = {
  // route validation
  validation: Joi.object({
    /* XXX--REMINDER--COPY SCHEMA ABOVE THEN COMMENT IT OUT TO LET COPILOT GIVE SUGGESTIONS--XXX */
    isActive: Joi.boolean().default(true),
  }),

  handler: async (req, res) => {
    // const { user } = req;
    try {
      let findXxxxx = await global.models.GLOBAL.XXXXX.findOne({
        where: req.body,
        raw: true,
      });
      if (findXxxxx) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ITEM_ALREADY_EXISTS,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.NOT_ACCEPTABLE)
          .json(utils.createResponseObject(data4createResponseObject));
      } else {
        const newXxxxx = await global.models.GLOBAL.XXXXX.create(req.body);
        let data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.SUCCESS,
          payload: { xxxxx: newXxxxx },
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.OK)
          .json(utils.createResponseObject(data4createResponseObject));
      }
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
