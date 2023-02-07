const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");
// Role registration
module.exports = exports = {
  // route validation
  validation: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
  }),

  handler: async (req, res) => {
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

    const { name, description } = req.body;
    try {
      let roleCreate = {
        name: name,
        description: description,
      };
      let findRole = await global.models.GLOBAL.ROLE.findOne({
        where: { name: roleCreate.name },
        raw: true,
      });
      if (findRole) {
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
        const newRole = await global.models.GLOBAL.ROLE.create(roleCreate);
        let data4createResponseObject = {
          req: req,
          result: 0,
          message: messages.SUCCESS,
          payload: { role: newRole },
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
      res
        .status(enums.HTTP_CODES.INTERNAL_SERVER_ERROR)
        .json(utils.createResponseObject(data4createResponseObject));
    }
  },
};
