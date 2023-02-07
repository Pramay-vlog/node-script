const Joi = require("joi");
const jwt = require("jsonwebtoken");
const moment = require("moment-timezone");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");

/* Verify code of password reset and generate token  */
module.exports = exports = {
  // route validation
  validation: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.string().length(6).required(),
  }),

  // route handler
  handler: async (req, res) => {
    try {
      const { code, email } = req.body;

      const verificationEntry =
        await global.models.GLOBAL.CODEVERIFICATION.findOne({
          where: { email: email },
          raw: true,
        });
      const adminExists = await global.models.GLOBAL.ADMIN.findOne({
        where: { email: email },
        attributes: ["_id", "email", "phone", "firstName", "lastName"],
        include: [
          {
            model: global.models.GLOBAL.ROLE,
            as: "role",
            attributes: ["name"],
          },
        ],
        raw: true,
      });
      if (!verificationEntry || !adminExists) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ITEM_NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.NOT_ACCEPTABLE)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      if (moment().isAfter(moment(verificationEntry.expirationDate))) {
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

      if (verificationEntry.code !== code) {
        await global.models.GLOBAL.CODEVERIFICATION.update(
          { failedAttempts: verificationEntry.failedAttempts + 1 },
          { where: { email: email } }
        );
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.INVALID_OTP,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      const data4token = {
        id: adminExists._id,
        date: new Date(),
        environment: process.env.APP_ENVIRONMENT,
        email: adminExists.email,
        scope: "codeVerification",
        expirationDate: new Date(new Date().getTime() + 5 * 60 * 1000),
        type: adminExists["role.name"],
      };
      const payload = {
        admin: adminExists,
        verified: true,
        token: jwt.sign(data4token, jwtOptions.secretOrKey),
        token_type: "Bearer",
      };
      let data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: payload,
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    } catch (error) {
      logger.error(
        `/verify-code - Error encountered while verifying code: ${error.message}\n${error.stack}`
      );
      let data4createResponseObject = {
        req: req,
        result: -1,
        message: messages.GENERAL,
        payload: { error: error },
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
