const { db } = require("../../models");
const { USER_TYPE: { ADMIN } } = require("../../json/enums.json");
const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");

/* APIS For Xxxxx */
module.exports = exports = {

  /* Create Xxxxx API */
  createXxxxx: async (req, res) => {
    const xxxxx = await db.xxxxx.create(req.body);
    return apiResponse.OK({ res, message: messages.SUCCESS, data: xxxxx });
  },

  /* Get Xxxxx API */
  getXxxxx: async (req, res) => {
    let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 100;
    sortBy = sortBy || "createdAt";
    sortOrder = sortOrder || "DESC";

    query = req.user?.role.name === ADMIN ? { ...query } : { isActive: 1, ...query };
    search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : ""

    const xxxxxs = await db.xxxxx.findAll({
      where: { ...query },
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, sortOrder]],
    }, { raw: true, nest: true })

    return apiResponse.OK({ res, message: messages.SUCCESS, data: { count: await db.xxxxx.count({ where: { ...query } }), data: xxxxxs } });
  },

  /* Update Xxxxx API*/
  updateXxxxx: async (req, res) => {
    let xxxxxExists = await db.xxxxx.findOne({ where: { id: req.params.id, isActive: 1 } }, { raw: true, nest: true });
    if (!xxxxxExists) return apiResponse.NOT_FOUND(res, messages.NOT_FOUND);

    await db.xxxxx.update(req.body, { where: { id: req.params.id } });
    return apiResponse.OK({ res, message: messages.SUCCESS });
  },

  /* Delete Xxxxx API*/
  deleteXxxxx: async (req, res) => {
    let xxxxxExists = await db.xxxxx.findOne({ where: { id: req.params.id } }, { raw: true, nest: true });
    if (!xxxxxExists) return apiResponse.NOT_FOUND(res, messages.NOT_FOUND);

    await db.xxxxx.update({ isActive: 0 }, { where: { id: req.params.id } });
    return apiResponse.OK({ res, message: messages.SUCCESS });
  },
};

/* Move this object to controller index file */
module.exports = {
  XXXXX: {
    APIS: require("./xxxxx/xxxxx.controller"),
    VALIDATOR: require("./xxxxx/xxxxx.validator"),
  },
};