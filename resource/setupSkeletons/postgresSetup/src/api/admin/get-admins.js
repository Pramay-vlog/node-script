const { Op } = require("sequelize");
const enums = require("../../../json/enums.json");
const messages = require("../../../json/messages.json");
const logger = require("../../logger");
const utils = require("../../utils");

// Retrieve and return all Users from the database.
module.exports = exports = {
  // route handler
  handler: async (req, res) => {
    const { user } = req;
    if (
      user.type !== enums.USER_TYPE.SUPERADMIN &&
      user._id !== req?.query?.id
    ) {
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
    if (
      user.type === enums.USER_TYPE.SUPERADMIN &&
      req.query.isGetCount === "true"
    ) {
      let countObj = {};
      const userTypes = Object.values(enums.USER_TYPE);
      for (let i = 0; i < userTypes.length; i++) {
        const userType = userTypes[i];
        let count = await global.models.GLOBAL.ADMIN.count({
          include: [
            {
              model: global.models.GLOBAL.ROLE,
              as: "role",
              where: { name: userType },
            },
          ],
        });
        countObj[userType + "Count"] = count;
      }
      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: countObj,
        logPayload: false,
      };
      return res
        .status(enums.HTTP_CODES.OK)
        .json(utils.createResponseObject(data4createResponseObject));
    }

    try {
      req.query.page = req.query.page ? req.query.page : 1;
      let page = parseInt(req.query.page);
      req.query.limit = req.query.limit ? req.query.limit : 10000;
      let limit = parseInt(req.query.limit);
      let skip = (parseInt(page) - 1) * limit;
      let role = await global.models.GLOBAL.ROLE.findOne({
        where: { name: enums.USER_TYPE.SUPERADMIN },
        raw: true,
      });
      let search = req.query.search
        ? {
            where: {
              [Op.or]: {
                firstName: {
                  [Op.iRegexp]: req.query.search,
                },
                lastName: {
                  [Op.iRegexp]: req.query.search,
                },
                email: {
                  [Op.iRegexp]: req.query.search,
                },
              },
            },
          }
        : { where: {} };
      search.where.roleId = {
        [Op.ne]: role._id,
      };
      let roleType = req.query.roleType;
      if (
        roleType &&
        (roleType === enums.USER_TYPE.ADMIN ||
          roleType === enums.USER_TYPE.USER)
      ) {
        let roleExists = await global.models.GLOBAL.ROLE.findOne({
          where: { name: roleType },
        });
        search.where.roleId = roleExists._id;
      }
      if (req.query.id) {
        search.where._id = req.query.id;
      }

      const count = await global.models.GLOBAL.ADMIN.count(search);
      let admin = await global.models.GLOBAL.ADMIN.findAll({
        ...search,
        attributes: { exclude: ["address", "password", "token"] },
        include: [{ model: global.models.GLOBAL.ROLE, as: "role" }],
        order: [["createdAt", "DESC"]],
        offset: skip,
        limit: limit,
      });

      const data4createResponseObject = {
        req: req,
        result: 0,
        message: messages.SUCCESS,
        payload: { admin: admin, count: count },
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
