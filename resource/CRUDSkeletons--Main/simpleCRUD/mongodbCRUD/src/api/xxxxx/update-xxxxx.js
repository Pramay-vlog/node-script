const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");

module.exports = exports = {
  validation: Joi.object({
    /* XXXXX--REMINDER--COPY FROM CREATE API AND REMOVE REQUIRED FIELDS--XXXXX */
    isActive: Joi.boolean(),
    isPermanentDelete: Joi.boolean(),
  }),

  handler: async (req, res) => {
    try {
      const xxxxxExists = await global.models.GLOBAL.XXXXX.findOne({
        _id: req.params.xxxxxId,
      });
      if (!xxxxxExists) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ITEM_NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        return res.status(enums.HTTP_CODES.BAD_REQUEST).json(utils.createResponseObject(data4createResponseObject));
      }
      if (req.body.isAll === true && req.body.isPermanentDelete === true) {
        await global.models.GLOBAL.XXXXX.deleteOne({ _id: req.params.xxxxxId });
      } else {
        await global.models.GLOBAL.XXXXX.update(
          {
            _id: req.params.xxxxxId,
          },
          req.body
        );
      }

      let data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: {},
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
