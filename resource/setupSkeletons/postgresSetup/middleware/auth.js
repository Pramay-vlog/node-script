const { db } = require("../models");
const { USER_TYPE } = require("../json/enums.json");
const apiResponseponse = require("../utils/api.response");
const message = require("../json/message.json");
const jwt = require("jsonwebtoken");

module.exports = {
    auth: ({ isTokenRequired = true, usersAllowed = [] } = {}) => {
        return async (req, res, next) => {
            const token = req.header("x-auth-token");
            if (isTokenRequired && !token) return apiResponseponse.BAD_REQUEST({ res, message: message.TOKEN_REQUIRED });
            if (!isTokenRequired && !token) return next();

            let decoded = jwt.verify(token, process.env.JWT_SECRET);

            let user = await db.user.findOne({ where: { id: decoded.id, isActive: true }, include: [{ model: db.role, as: "role" }] }, { raw: true, nest: true });
            if (!user) return apiResponseponse.UNAUTHORIZED({ res, message: message.INVALID_TOKEN });

            req.user = user;
            if (usersAllowed.length) {
                if (req.user.role.name === USER_TYPE.ADMIN) return next();
                if (usersAllowed.includes("*")) return next();
                if (usersAllowed.includes(req.user.role.name)) return next();
                return apiResponseponse.UNAUTHORIZED({ res, message: message.UNAUTHORIZED });
            } else {
                if (req.user.role.name === USER_TYPE.ADMIN) return next();
                return apiResponseponse.UNAUTHORIZED({ res, message: message.UNAUTHORIZED });
            }
        };
    },
};
