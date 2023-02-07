const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");
const moment = require("moment");

module.exports = exports = {
  validation: Joi.object({
    email: Joi.string().email().required(),
    newPassword: Joi.string().required(),
    token: Joi.string().required(),
  }),
  handler: async (req, res) => {
    try {
      const { email, newPassword, token } = req.body;
      const user = await utils.getHeaderFromToken(token);
      if (
        !user ||
        !user.id ||
        user.scope !== "codeVerification" ||
        !user.expirationDate
      ) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.INVALID_TOKEN_VERIFICATION,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      if (moment().isAfter(moment(user.expirationDate))) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.EXPIRED_VERIFICATION,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }
      const userFromToken = await global.models.GLOBAL.ADMIN.findOne({
        where: { _id: user.id },
        raw: true,
      });
      if (!userFromToken || email !== userFromToken?.email) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.INVALID_PARAMETERS,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }
      await global.models.GLOBAL.ADMIN.update(
        { password: newPassword },
        { where: { _id: userFromToken._id } }
      );
      /* Delete verification code from db */
      await global.models.GLOBAL.CODEVERIFICATION.destroy({
        where: { email: email },
      });
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: {},
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    } catch (error) {
      logger.error(
        `${req.originalUrl} - Error encountered: ${error.message}\n${error.stack}`
      );
      const data4createResponseObject = {
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
