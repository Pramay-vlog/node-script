const { HTTP_CODES } = require("../../json/enums.json");
const message = require("../../json/message.json");
const roleModel = require("../../models/roles/roles.model");
const { validateEmptyFields } = require("../../utils/utils");
const apiRes = require("../../utils/apiResponse");
const Joi = require("joi");


module.exports = {
  // Create Role validation
  validation4createRole: Joi.object().keys({
    roleName: Joi.string().required(),
    description: Joi.string().required(),
  }),

  createRole: async (req, res) => {
    try {
      let validateMsg = validateEmptyFields(req.body, ["roleName", "description",]);
      if (validateMsg) {
        return apiRes.BAD_REQUEST(res, validateMsg);
      }

      let data = await roleModel.create(req.body)
      return apiRes.OK(res, message.ROLE_CREATED, data);

    } catch (error) {
      console.log("createRole error", error.message);
      switch (error.code) {
        case 11000:
          return apiRes.DUPLICATE_VALUE(res, message.ROLE_ALREADY_EXIST);

        default:
          return apiRes.CATCH_ERROR(res, error.message);
      }
    }
  },
};
