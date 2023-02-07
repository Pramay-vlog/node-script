const otpModel = require("../../models/otp/otp.model");
const userModel = require("../../models/user/user.model");
const roleModel = require("../../models/roles/roles.model");
const apiRes = require("../../utils/apiResponse");
const { compareString, generateToken, hashString, } = require("../../utils/utils");
const message = require("../../json/message.json");
const { sendEmail } = require("../../service/mail.service");
const { USER_TYPE: { USER, ADMIN }, } = require("../../json/enums.json");
const Joi = require("joi");

module.exports = exports = {
  /* Sign Up validation */
  validation4signUp: Joi.object().keys({
    email: Joi.string().email().required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    password: Joi.string().required(),
    role: Joi.string().required(),
  }),

  /* Login validation */
  validation4login: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  /*updateUser validation*/
  validation4updateUser: Joi.object().keys({
    username: Joi.string(),
    phone: Joi.string(),
    firstName: Joi.string(),
    lastName: Joi.string(),
  }),

  /* Forgot Password validation */
  validation4forgotPassword: Joi.object().keys({
    email: Joi.string().email().required(),
  }),

  /* Forgot Password Verify validation */
  validation4forgotPasswordVerify: Joi.object().keys({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    password: Joi.string().required(),
  }),

  signUp: async (req, res) => {
    try {
      let { email, role } = req.body;

      let isExistUser = await userModel.findOne({ email: email, });
      if (isExistUser) {
        return apiRes.BAD_REQUEST(res, message.USER_ALREADY_EXIST);
      }

      let roleData = await roleModel.findOne({ _id: role });
      if (roleData.roleName == ADMIN || !roleData) {
        return apiRes.BAD_REQUEST(res, message.INVALID_ROLE);
      }

      let data = await userModel.create(req.body)

      return apiRes.OK(res, message.SIGNUP_SUCCESS, data);
    } catch (error) {
      console.log("signUp error", error);
      apiRes.CATCH_ERROR(res, error.message);
    }
  },

  login: async (req, res) => {
    try {
      let { email, password } = req.body;

      let userData = await userModel
        .findOne({ email: email })
        .populate({ path: "role", select: "roleName", })
        .select("-isVerified -isActive -updatedAt -createdAt");

      if (!userData) {
        return apiRes.BAD_REQUEST(res, message.USER_NOT_EXIST);
      }

      if (await compareString(password, userData.password)) {
        userData._doc.accessToken = generateToken({
          userId: userData._id,
          role: userData.role.roleName,
        });
        return apiRes.OK(res, message.LOGIN_SUCCESS, userData);
      } else {
        return apiRes.BAD_REQUEST(res, message.INVALID_CREDS);
      }

    } catch (error) {
      console.log("login error", error);
      apiRes.CATCH_ERROR(res, error.message);
    }
  },

  forgotPassword: async (req, res) => {
    try {
      let { email } = req.body;

      let isExistUser = await userModel
        .findOne({ email: email, })
        .populate({ path: "role", select: "roleName" });

      if (!isExistUser || !isExistUser.isActive || isExistUser.role.roleName == ADMIN) {
        return apiRes.BAD_REQUEST(res, message.USER_NOT_EXIST);
      }

      let otp = await sendEmail(
        isExistUser.email,
        `${isExistUser.firstName} ${isExistUser.lastName}`
      );

      await otpModel.findOneAndUpdate(
        { email: email, },
        { otp: otp, },
        { upsert: true }
      );

      return apiRes.OK(res, message.OTP_SEND);
    } catch (error) {
      console.log("signUp error", error);
      apiRes.CATCH_ERROR(res, error.message);
    }
  },

  forgotPasswordVerify: async (req, res) => {
    try {
      let { email, password, otp } = req.body;

      let verifyOtp = await otpModel.findOneAndDelete({ email, otp });
      if (!verifyOtp) {
        return apiRes.BAD_REQUEST(res, message.OTP_NOT_MATCH);
      }

      if (Date.now() > verifyOtp.expireAt) {
        return apiRes.BAD_REQUEST(res, message.OTP_EXPIRED);
      }

      await userModel.findOneAndUpdate(
        { email: verifyOtp.email },
        { password: await hashString(password) }
      );

      return apiRes.OK(res, message.PASSWORD_CHANGED);
    } catch (error) {
      console.log("forgotPasswordVerify error", error);
      apiRes.CATCH_ERROR(res, error.message);
    }
  },

  getDashboardCounts: async (req, res) => {
    try {
      return apiRes.OK(res, message.SUCCESS, {
        userCount: await userModel.countDocuments({
          role: await roleModel.findOne({ roleName: USER })
        })
      });
    } catch (error) {
      console.log("getDashboardCounts error", error);
      apiRes.CATCH_ERROR(res, error.message);
    }
  },

  getUsers: async (req, res) => {
    try {
      let { page, limit, skip, sortBy, sortOrder, search } = req.query;
      let criteria = {};
      let searchCriteria = {};

      // get filters
      req.userData?.role.roleName === ADMIN ? criteria = { ...criteria } : criteria = { isActive: true, ...criteria };
      page = parseInt(page) || 1;
      limit = parseInt(limit) || 100;
      skip = (page - 1) * limit;
      sortBy = sortBy || "createdAt";
      sortOrder = sortOrder || "desc";
      search ? searchCriteria = {
        $or: [{ name: { $regex: search, $options: "i" } },]
      } : ""

      criteria = { ...criteria, ...searchCriteria };

      const users = await userModel
        .find(criteria)
        .populate({ path: "role", select: "roleName" })
        .skip(skip)
        .limit(limit)
        .sort({ [sortBy]: sortOrder });

      return apiRes.OK(res, message.SUCCESS, {
        count: await userModel.countDocuments(criteria),
        users,
      });
    } catch (error) {
      console.log("getUsers error", error);
      return apiRes.CATCH_ERROR(res, error.message);
    }
  },

  updateUser: async (req, res) => {
    try {
      let { userId } = req.query;

      let isUserExists = await userModel.findOne({ _id: userId });
      if (!isUserExists) return apiRes.BAD_REQUEST(res, message.USER_NOT_FOUND);

      if (req.body.isActive !== undefined && req.userData.role.roleName !== ADMIN) {
        return apiRes.BAD_REQUEST(res, message.UNAUTHORIZED);
      }

      let data = {
        ...req.body,
        profileImage: req.file?.location
      }

      await userModel.findOneAndUpdate({ _id: userId }, { $set: data }, { new: true });
      return apiRes.OK(res, message.USER_UPDATED);
    } catch (error) {
      console.log("updateUser error", error);
      return apiRes.CATCH_ERROR(res, error.message);
    }
  },

  getProfileDetails: async (req, res) => {
    try {
      return apiRes.OK(res, message.SUCCESS, req.userData);
    } catch (error) {
      console.log("getProfileDetails error", error);
      return apiRes.CATCH_ERROR(res, error.message);
    }
  },
};
