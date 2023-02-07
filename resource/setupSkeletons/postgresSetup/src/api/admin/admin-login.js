const Joi = require("joi");
const jwt = require("jsonwebtoken");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const jwtOptions = require("../../auth/jwt-options");
const logger = require("../../logger");
const utils = require("../../utils");
const { Op } = require("sequelize");

/* Check if credentials provided is correct and if so generate and return token. */
module.exports = exports = {
  validation: Joi.alternatives().try(
    Joi.object({
      email: Joi.string().email(),
      phone: Joi.number().required(),
      password: Joi.string().required(),
    }),
    Joi.object({
      email: Joi.string().email().required(),
      phone: Joi.number(),
      password: Joi.string().required(),
    })
  ),

  handler: async (req, res) => {
    let { email, password, phone } = req.body;
    try {
      const criteria = {
        where: {},
        raw: true,
      };
      if (email) criteria.where.email = email;
      if (phone) criteria.where.phone = phone;
      const adminExists = await global.models.GLOBAL.ADMIN.findOne(criteria);
      if (!adminExists) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ITEM_NOT_FOUND,
          payload: {},
          logPayload: false,
        };

        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .json(utils.createResponseObject(data4createResponseObject));
      } else if (
        adminExists.status === enums.USER_STATUS.BLOCKED ||
        adminExists.status === enums.USER_STATUS.DISABLED ||
        adminExists.status === enums.USER_STATUS.INACTIVE
      ) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.BLOCKED_BY_ADMIN,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.UNAUTHORIZED)
          .json(utils.createResponseObject(data4createResponseObject));
      } else if (adminExists.password !== password) {
        const data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.INVALID_PASSWORD,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.UNAUTHORIZED)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      const roleExists = await global.models.GLOBAL.ROLE.findOne({
        where: { _id: adminExists.roleId },
        raw: true,
      });

      const data4token = {
        id: adminExists._id,
        date: new Date(),
        environment: process.env.APP_ENVIRONMENT,
        email: adminExists.email,
        scope: "login",
        type: roleExists.name,
      };

      const payload = {
        admin: {
          id: adminExists._id,
          email: adminExists.email,
          name: adminExists.name,
          email: adminExists.email,
          fname: adminExists.firstName,
          lname: adminExists.lastName,
          status: adminExists.status,
          pid: adminExists.pid,
          role: roleExists.name,
          isTenete: adminExists.isTenete,
        },
        token: jwt.sign(data4token, jwtOptions.secretOrKey),
        token_type: "Bearer",
      };

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: "Log in successful!",
        payload: payload,
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
