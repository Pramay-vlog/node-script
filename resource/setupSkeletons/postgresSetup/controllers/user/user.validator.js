const Joi = require("joi");
const validator = require("../../middleware/validator");

module.exports = {

    signup: validator({
        body: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
            name: Joi.string(),
            roleId: Joi.string().required(),
        }),
    }),


    signIn: validator({
        body: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
        }),
    }),


    forgot: validator({
        body: Joi.object({
            email: Joi.string().required(),
        }),
    }),


    verifyOtp: validator({
        body: Joi.object({
            email: Joi.string().required(),
            otp: Joi.string().required(),
        }),
    }),


    afterOtpVerify: validator({
        body: Joi.object({
            password: Joi.string().required(),
        })
    }),


    changePassword: validator({
        body: Joi.object({
            oldPassword: Joi.string().required(),
            newPassword: Joi.string().required(),
        }),
    }),


    update: validator({
        body: Joi.object({
            email: Joi.string(),
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
            id: Joi.number(),
            search: Joi.string(),
            name: Joi.string(),
            email: Joi.string(),
        }),
    }),


};
