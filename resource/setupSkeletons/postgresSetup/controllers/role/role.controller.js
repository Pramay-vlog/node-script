const { db } = require("../../models");
const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");

module.exports = {

    createRole: async (req, res) => {
        if (await db.role.findOne({ where: { name: req.body.name }, raw: true, nest: true })) return apiResponse.DUPLICATE_VALUE({ res, message: messages.DUPLICATE_KEY })

        return apiResponse.OK({ res, message: messages.SUCCESS, data: await db.role.create(req.body) });
    },

};
