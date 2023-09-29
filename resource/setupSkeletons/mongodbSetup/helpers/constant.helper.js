module.exports = {
    ENUM: {
        HTTP_CODES: {
            BAD_REQUEST: 400,
            DUPLICATE_VALUE: 409,
            FORBIDDEN: 403,
            INTERNAL_SERVER_ERROR: 500,
            METHOD_NOT_ALLOWED: 405,
            MOVED_PERMANENTLY: 301,
            NOT_ACCEPTABLE: 406,
            NOT_FOUND: 404,
            NO_CONTENT_FOUND: 204,
            OK: 200,
            PERMANENT_REDIRECT: 308,
            UNAUTHORIZED: 401,
            UPGRADE_REQUIRED: 426,
            VALIDATION_ERROR: 422,
        },
        ROLE: {
            USER: 'user',
            ADMIN: 'admin',
        },
    },
    MESSAGE: {
        TOKEN_REQUIRED: 'Token required.',
        INVALID_TOKEN: 'Invalid token.',
        UNAUTHORIZED: 'Unauthorized.',
        INTERNAL_SERVER_ERROR: 'Internal server error.',
        DUPLICATE_KEY: 'Duplicate key.',
        TOKEN_ALREADY_USED: 'Token already used.',
        INVALID_ROUTE: "Oops! Looks like you're lost.",
        SUCCESS: 'Success.',
        FAILED: 'Failed.',
        NOT_FOUND: 'Not found.',
        INVALID_PASSWORD: 'Invalid password.',
        INVALID_ROLE: 'Invalid role.',
        EMAIL_NOT_FOUND: 'Email not found.',
        OTP_EXPIRED: 'OTP expired.',
        INVALID_OTP: 'Invalid OTP.',
        ALREADY_EXISTS: 'Already exists.',
        DUPLICATE_ENTRY: 'Duplicate entry.',
        CART_EMPTY: 'Cart is empty.',
        NOT_ACTIVE: 'Not active.',
        ACCOUNT_DISABLED: 'Account disabled.',
        PAYMENT_FAILED: 'Payment failed.',
        PAYMENT_ID_USED: 'Payment id already used.',
        INVALID_IMAGE_TYPE: 'Invalid image type.',
        FILE_UPLOAD_FAILED: 'File upload failed.',
        MAX_FILE_UPLOAD_LIMIT: 'Max file upload limit exceeded.',
        FILE_UPLOAD_SUCCESS: 'File uploaded successfully.',
        INVALID_FILE_TYPE: 'Invalid file type.',
        MULTER_ERROR: 'Multer error.',
    },
};