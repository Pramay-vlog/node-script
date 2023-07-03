const apiResponse = require("../utils/api.response");
const messages = require("../json/message.json");
const { MulterError } = require("multer");
const { JsonWebTokenError } = require("jsonwebtoken")
const {
    Error,
    ValidationError,
    ValidationErrorItem,
    DatabaseError,
    TimeoutError,
    UniqueConstraintError,
    ExclusionConstraintError,
    ForeignKeyConstraintError,
    ConnectionError,
    ConnectionRefusedError,
    AccessDeniedError,
    HostNotFoundError,
    HostNotReachableError,
    InvalidConnectionError,
    ConnectionTimedOutError,
    EmptyResultError,
} = require("sequelize")
const { logger } = require("../utils/logger");


module.exports = async (error, req, res, next) => {
    logger.warn(` ERROR AT PATH ${req.path}`);
    console.log(error)

    if (error instanceof MulterError) return apiResponse.BAD_REQUEST({ res, message: messages.INVALID_FILE, data: { context: error.code } });
    if (error instanceof JsonWebTokenError) return apiResponse.UNAUTHORIZED({ res, message: messages.INVALID_TOKEN, data: { context: error.message } });
    if (
        error instanceof Error ||
        error instanceof ValidationError ||
        error instanceof ValidationErrorItem ||
        error instanceof DatabaseError ||
        error instanceof TimeoutError ||
        error instanceof UniqueConstraintError ||
        error instanceof ExclusionConstraintError ||
        error instanceof ForeignKeyConstraintError ||
        error instanceof ConnectionError ||
        error instanceof ConnectionRefusedError ||
        error instanceof AccessDeniedError ||
        error instanceof HostNotFoundError ||
        error instanceof HostNotReachableError ||
        error instanceof InvalidConnectionError ||
        error instanceof ConnectionTimedOutError ||
        error instanceof EmptyResultError
    ) return apiResponse.BAD_REQUEST({ res, message: messages.FAILED, data: { context: error.message } });

    logger.error(`STACK_ERROR: ${error}`)

    return apiResponse.CATCH_ERROR({ res, message: messages.INTERNAL_SERVER_ERROR, data: { context: error.message } });
};