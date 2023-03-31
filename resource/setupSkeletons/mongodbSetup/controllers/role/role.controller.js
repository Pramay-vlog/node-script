const DB = require("../../models");
const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");

module.exports = {
  createRole: async (req, res) => {
    return apiResponse.OK({ res, message: messages.SUCCESS, data: await DB.ROLE.create(req.body) });
  },
};
