const _ = require("lodash");
const Joi = require("joi");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const jwt = require("jsonwebtoken");
const logger = require("../../logger");
const utils = require("../../utils");
const jwtOptions = require("../../auth/jwt-options");

module.exports = exports = {
  validation: Joi.object({
    roleId: Joi.string().uuid().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.string().required(),
    address: Joi.string().required(),
    postalCode: Joi.string().required(),
    state: Joi.string().required(),
    city: Joi.string().required(),
    about: Joi.string(),
    status: Joi.string().valid(
      enums.USER_STATUS.ACTIVE,
      enums.USER_STATUS.BLOCKED,
      enums.USER_STATUS.DISABLED,
      enums.USER_STATUS.INACTIVE,
      enums.USER_STATUS.INVITED
    ),
  }),

  // route handler
  handler: async (req, res) => {
    try {
      let {
        roleId,
        email,
        password,
        firstName,
        lastName,
        phone,
        address,
        postalCode,
        state,
        city,
        about,
        status,
      } = req.body;
      password = utils.passwordHash(req.body.password);

      const emailExist = await global.models.GLOBAL.ADMIN.findOne({
        where: { email: email },
      });
      if (emailExist) {
        const data4createResponseObject = {
          req: req,
          result: -400,
          message: messages.EXISTS_EMAIL,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.DUPLICATE_VALUE)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      const phoneExist = await global.models.GLOBAL.ADMIN.findOne({
        where: { phone: phone },
      });
      if (phoneExist) {
        const data4createResponseObject = {
          req: req,
          result: -400,
          message: messages.EXISTS_PHONE,
          payload: {},
          logPayload: false,
        };
        return res
          .status(enums.HTTP_CODES.DUPLICATE_VALUE)
          .json(utils.createResponseObject(data4createResponseObject));
      }

      const isRoleExists = await global.models.GLOBAL.ROLE.findOne({
        where: { _id: roleId },
        raw: true,
      });
      if (!isRoleExists) {
        let data4createResponseObject = {
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

      const adminObject = {
        roleId: roleId,
        email: email,
        password: password,
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        address: address,
        postalCode: postalCode,
        state: state,
        city: city,
        about: about,
        status: status,
        status: enums.USER_STATUS.ACTIVE,
        statusModificationDate: Date.now(),
      };
      /* User has provided profile image */
      if (req.file?.location) {
        adminObject.photo = req.file?.location;
      }

      let newAdmin = await global.models.GLOBAL.ADMIN.create(adminObject);

      const data4token = {
        email: email,
        date: new Date(),
        scope: "verification",
      };

      const payload = {
        admin: {
          _id: newAdmin._id,
          email: adminObject.email,
          phone: adminObject.phone,
          firstName: adminObject.firstName,
          lastName: adminObject.lastName,
          address: adminObject.address,
          about: adminObject.about,
          pinCode: adminObject.pinCode,
          city: adminObject.city,
          state: adminObject.state,
          status: adminObject.status,
          role: isRoleExists.name,
        },
        token: jwt.sign(data4token, jwtOptions.secretOrKey),
        token_type: "Bearer",
      };

      const data4createResponseObject = {
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
        "/admin - Error encountered while trying to add admin:\n" + error
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
