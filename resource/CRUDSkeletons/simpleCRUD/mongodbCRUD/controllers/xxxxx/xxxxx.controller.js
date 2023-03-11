const messages = require("../../json/message.json");
const DB = require("../../models");
const apiResponse = require("../../utils/api.response");
const { USER_TYPE: { ADMIN } } = require("../../json/enums.json");

/* APIS For Xxxxx */
module.exports = exports = {

  /* Create Xxxxx API */
  createXxxxx: async (req, res) => {
    const xxxxx = await DB.XXXXX.create(req.body);
    return apiResponse.OK({ res, message: messages.SUCCESS, data: xxxxx });
  },

  /* Get Xxxxx API */
  getXxxxx: async (req, res) => {
    let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 100;

    query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
    search ? query = {
      $or: [{ name: { $regex: search, $options: "i" } },]
    } : ""

    const xxxxxs = await DB.XXXXX
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ [sortBy]: sortOrder })
      .lean();

    return apiResponse.OK({ res, message: messages.SUCCESS, data: { count: await DB.XXXXX.countDocuments(query), data: xxxxxs } });
  },

  /* Update Xxxxx API*/
  updateXxxxx: async (req, res) => {
    let xxxxxExists = await DB.XXXXX.findOne({ _id: req.params._id, isActive: true });
    if (!xxxxxExists) return apiResponse.NOT_FOUND(res, messages.NOT_FOUND);

    await DB.XXXXX.findByIdAndUpdate(req.params._id, req.body, { new: true, });
    return apiResponse.OK({ res, message: messages.SUCCESS });
  },

  /* Delete Xxxxx API*/
  deleteXxxxx: async (req, res) => {
    let xxxxxExists = await DB.XXXXX.findOne({ _id: req.params._id })
    if (!xxxxxExists) return apiResponse.NOT_FOUND(res, messages.NOT_FOUND);

    if (xxxxxExists.isActive === true) {
      await DB.XXXXX.findByIdAndUpdate(req.params._id, { isActive: false, });
    } else {
      await DB.XXXXX.findByIdAndUpdate(req.params._id, { isActive: true, });
    }
    return apiResponse.OK({ res, message: messages.SUCCESS });
  },
};

module.exports = {
  XXXXX: {
    APIS: require("./xxxxx/xxxxx.controller"),
    VALIDATOR: require("./xxxxx/xxxxx.validator"),
  }
};