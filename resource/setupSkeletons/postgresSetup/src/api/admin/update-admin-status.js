const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");

// Update user status
module.exports = exports = {
  // route validation
  validation: Joi.object({
    adminId: Joi.string().uuid().required(),
    status: Joi.string()
      .valid(
        enums.USER_STATUS.ACTIVE,
        enums.USER_STATUS.BLOCKED,
        enums.USER_STATUS.DISABLED,
        enums.USER_STATUS.INACTIVE,
        enums.USER_STATUS.INVITED
      )
      .required(),
  }),
  handler: async (req, res) => {
    const { adminId, status } = req.body;
    const { user } = req;
    if (user.type !== enums.USER_TYPE.SUPERADMIN) {
      const data4createResponseObject = {
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

    try {
      const userExist = await global.models.GLOBAL.ADMIN.findOne({
        where: {
          _id: adminId,
        },
      });
      if (!userExist) {
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
      }
      await global.models.GLOBAL.ADMIN.update(
        {
          status: status,
          statusModificationDate: Date.now(),
        },
        { where: { _id: adminId } }
      );
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
