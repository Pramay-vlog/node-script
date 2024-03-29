const messages = require("../../json/message.json");
const DB = require("../../models");
const apiResponse = require("../../utils/api.response");
const { USER_TYPE: { ADMIN } } = require("../../json/enums.json");
const { constants: { ENUM: { ROLE }, MESSAGE }, response } = require("../../helpers");


/* APIS For Xxxxx */
module.exports = exports = {

    /* Create Xxxxx API */
    createXxxxx: async (req, res) => {

        const xxxxx = await DB.XXXXX.create(req.body);
        return response.OK({ res, payload: xxxxx });

    },


    /* Get Xxxxx API */
    getXxxxx: async (req, res) => {

        let { page, limit, skip, sortBy, sortOrder, search, ...query } = req.query;

        page = parseInt(page) || 1;
        limit = parseInt(limit) || 100;
        sortBy = sortBy || "createdAt";
        sortOrder = sortOrder || -1;

        query = req.user?.roleId.name === ADMIN ? { ...query } : { isActive: true, ...query };
        search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : ""

        const xxxxxs = await DB.XXXXX
            .find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .lean();

        return response.OK({ res, payload: { count: await DB.XXXXX.countDocuments(query), data: xxxxxs } });

    },


    /* Update Xxxxx API*/
    updateXxxxx: async (req, res) => {

        let xxxxxExists = await DB.XXXXX.findOne({ _id: req.params._id, isActive: true }).lean();
        if (!xxxxxExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.XXXXX.findByIdAndUpdate(req.params._id, req.body, { new: true, });
        return response.OK({ res });

    },


    /* Delete Xxxxx API*/
    deleteXxxxx: async (req, res) => {

        let xxxxxExists = await DB.XXXXX.findOne({ _id: req.params._id }).lean();
        if (!xxxxxExists) return response.NOT_FOUND({ res, message: MESSAGE.NOT_FOUND });

        await DB.XXXXX.findByIdAndUpdate(req.params._id, { isActive: false, });
        return response.OK({ res });

    },

};

module.exports = {
    XXXXX: {
        APIS: require("./xxxxx/xxxxx.controller"),
        VALIDATOR: require("./xxxxx/xxxxx.validator"),
    }
};
