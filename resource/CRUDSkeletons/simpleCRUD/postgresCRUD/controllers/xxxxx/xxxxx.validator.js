const Joi = require("joi");
const validator = require("../../middleware/validator");


module.exports = {

    create: validator({
        body: Joi.object({
            name: Joi.string().required(),
        }),
    }),


    update: validator({
        body: Joi.object({
            name: Joi.string(),
        }),
        params: Joi.object({
            id: Joi.number().required(),
        }),
    }),


    toggleActive: validator({
        params: Joi.object({
            id: Joi.number().required(),
        }),
    }),


    fetch: validator({
        query: Joi.object({
            page: Joi.number().default(1),
            limit: Joi.number().default(100),
            sortBy: Joi.string(),
            sortOrder: Joi.string(),
            search: Joi.string(),
            id: Joi.number(),
            name: Joi.string(),
        }),
    }),

};
