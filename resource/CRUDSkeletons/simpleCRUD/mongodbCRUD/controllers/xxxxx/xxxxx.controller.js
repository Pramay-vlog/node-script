const { HTTP_CODES } = require("../../json/enums.json");
const message = require("../../json/message.json");
const xxxxxModel = require("../../models/xxxxx/xxxxx.model");
const apiRes = require("../../utils/apiResponse");
const { validateEmptyFields } = require("../../utils/utils");
const { USER_TYPE } = require("../../json/enums.json");
const Joi = require("joi");

/* APIS For Xxxxx */
module.exports = exports = {

  validation4create: Joi.object().keys({
    name: Joi.string().required(),
  }),

  validation4update: Joi.object().keys({
    name: Joi.string(),
  }),

  /* Create Xxxxx API */
  createXxxxx: async (req, res) => {
    try {

      const xxxxx = await xxxxxModel.create(req.body);

      return apiRes.OK(res, message.XXXXX_CREATED, xxxxx);
    } catch (error) {
      console.log("Error in createXxxxx: ", error);
      return apiRes.CATCH_ERROR(res, error.message);
    }
  },

  /* Get Xxxxx API */
  getXxxxx: async (req, res) => {
    try {
      let { page, limit, skip, sortBy, sortOrder, search } = req.query;
      let criteria = {};
      let searchCriteria = {};

      // get filters
      req.userData?.role.roleName === USER_TYPE.ADMIN ? criteria = { ...criteria } : criteria = { isActive: true, ...criteria };
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 100;
      skip = (page - 1) * limit;
      sortBy = sortBy || "createdAt";
      sortOrder = sortOrder || "desc";
      search ? searchCriteria = {
        $or: [{ name: { $regex: search, $options: "i" } },]
      } : ""

      criteria = { ...criteria, ...searchCriteria };

      const xxxxxs = await xxxxxModel
        .find(criteria)
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder });

      return apiRes.OK(res, message.XXXXX_FETCHED, {
        xxxxxs,
        count: await xxxxxModel.countDocuments(criteria),
      });
    } catch (error) {
      console.log("Error in getXxxxx: ", error);
      return apiRes.CATCH_ERROR(res, error.message);
    }
  },

  /* Update Xxxxx API*/
  updateXxxxx: async (req, res) => {
    try {
      let xxxxxExists = await xxxxxModel.findOne({ _id: req.query.xxxxxId, isActive: true });
      if (!xxxxxExists) {
        return apiRes.NOT_FOUND(res, message.XXXXX_NOT_FOUND);
      }

      await xxxxxModel.findByIdAndUpdate(req.query.xxxxxId, req.body, { new: true, });

      return apiRes.OK(res, message.XXXXX_UPDATED, {});
    } catch (error) {
      console.log("Error in updateXxxxx: ", error);
      return apiRes.CATCH_ERROR(res, error.message);
    }
  },

  /* Delete Xxxxx API*/
  deleteXxxxx: async (req, res) => {
    try {

      let xxxxxExists = await xxxxxModel.findOne({ _id: req.query.xxxxxId })
      if (!xxxxxExists) {
        return apiRes.NOT_FOUND(res, message.XXXXX_NOT_FOUND);
      }

      if (xxxxxExists.isActive === true) {
        await xxxxxModel.findByIdAndUpdate(req.query.xxxxxId, { isActive: false, });

      } else {
        await xxxxxModel.findByIdAndUpdate(req.query.xxxxxId, { isActive: true, });

      }

      return apiRes.OK(res, message.XXXXX_UPDATED, {});
    } catch (error) {
      console.log("Error in deleteXxxxx: ", error);
      return apiRes.CATCH_ERROR(res, error.message);
    }
  },

  message: {
    "XXXXX_CREATED": "Xxxxx created successfully.",
    "XXXXX_FETCHED": "Xxxxx fetched successfully.",
    "XXXXX_NOT_FOUND": "Xxxxx not found.",
    "XXXXX_UPDATED": "Xxxxx updated successfully."
  }
};
