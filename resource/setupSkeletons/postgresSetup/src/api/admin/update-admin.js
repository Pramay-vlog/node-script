const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");

const { mediaDeleteS3 } = require("../../S3FileUpload");

module.exports = exports = {
  validation: Joi.object({
    email: Joi.string().email(),
    firstName: Joi.string(),
    lastName: Joi.string(),
    phone: Joi.string(),
    address: Joi.string(),
    postalCode: Joi.string(),
    state: Joi.string(),
    city: Joi.string(),
    about: Joi.string(),
  }),

  // route handler
  handler: async (req, res) => {
    try {
      const { user } = req;
      const { adminId } = req.params;
      console.log("adminId != user._id", adminId, user._id);
      if (user.type != enums.USER_TYPE.SUPERADMIN && adminId != user._id) {
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
      let adminExists = await global.models.GLOBAL.ADMIN.findOne({
        where: { _id: adminId },
      });
      if (!adminExists) {
        let data4createResponseObject = {
          req: req,
          result: -400,
          message: messages.ITEM_NOT_FOUND,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.NOT_FOUND)
          .json(utils.createResponseObject(data4createResponseObject));
      }
      if (adminExists.photo && req.file?.location) {
        const photoPath = adminExists.photo
          ? adminExists.photo.split(".com/").slice(-1)[0]
          : null;
        mediaDeleteS3(photoPath, function (err) {
          if (err) {
            return console.log(err);
          }
        });
        req.body.photo = req.file.location;
      }
      await global.models.GLOBAL.ADMIN.update(req.body, {
        where: { _id: adminId },
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
