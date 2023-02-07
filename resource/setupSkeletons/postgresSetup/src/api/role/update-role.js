const Joi = require("joi");
const { Op } = require("sequelize");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");

// Role update
module.exports = exports = {
  validation: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
    isActive: Joi.boolean(),
  }),

  handler: async (req, res) => {
    try {
      const { user } = req;
      if (user.type !== enums.USER_TYPE.SUPERADMIN) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.UNAUTHORIZED,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.UNAUTHORIZED)
          .json(utils.createResponseObject(data4createResponseObject));
      }
      const { roleId } = req.params;
      const roleExists = await global.models.GLOBAL.ROLE.findOne({
        where: {
          _id: roleId,
        },
        raw: true,
      });
      if (!roleExists) {
        let data4createResponseObject = {
          req: req,
          result: -1,
          message: messages.ITEM_NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.BAD_REQUEST)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      if (req.body.name) {
        const roleExists = await global.models.GLOBAL.ROLE.findOne({
          where: {
            [Op.and]: {
              name: req.body.name,
              _id: { [Op.ne]: roleId },
            },
          },
        });
        if (roleExists) {
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
        }
      }
      req.body.updatedBy = user.phone;
      req.body.updatedAt = new Date();
      await global.models.GLOBAL.ROLE.update(req.body, {
        where: { _id: roleId },
      });

      let data4createResponseObject = {
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
