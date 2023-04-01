const messages = require("../../json/message.json");
const apiResponse = require("../../utils/api.response");
const { db } = require("../../models");
const helper = require("../../utils/utils");
const EMAIL = require("../../service/mail.service")
const { USER_TYPE: { ADMIN, USER } } = require("../../json/enums.json");

module.exports = exports = {
  signIn: async (req, res) => {
    const user = await db.user.findOne({ where: { email: req.body.email }, include: [{ model: db.role, as: "role" }], raw: true, nest: true });
    console.log("user", user);
    if (!user) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    const isPasswordMatch = await helper.comparePassword({ password: req.body.password, hash: user.password });
    if (!isPasswordMatch) return apiResponse.BAD_REQUEST({ res, message: messages.INVALID_PASSWORD });

    return apiResponse.OK({
      res,
      message: messages.SUCCESS,
      data: {
        email: user.email,
        name: user.name,
        role: user.role.name,
        token: helper.generateToken({ data: { id: user.id, role: user.role.name } }),
      },
    });
  },

  signUp: async (req, res) => {
    if (await db.user.findOne({ where: { email: req.body.email } })) return apiResponse.BAD_REQUEST({ res, message: messages.EMAIL_ALREADY_EXISTS });

    const roleData = await db.role.findOne({ where: { id: req.body.roleId } });
    if (!roleData) return apiResponse.NOT_FOUND({ res, message: messages.INVALID_ROLE });
    req.body.roleId = roleData.id;

    await db.user.create(req.body);
    exports.signIn(req, res);
  },

  forgot: async (req, res) => {
    const isUserExists = await db.user.findOne({ where: { email: req.body.email, isActive: 1 }, include: [{ model: db.role, as: "role" }], raw: true, nest: true });
    if (!isUserExists) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    const otp = await EMAIL.sendEmail({ to: req.body.email, name: isUserExists.name });
    console.log("otp ------", otp);

    let otpExists = await db.otp.findOne({ where: { email: req.body.email }, raw: true, nest: true });
    if (otpExists) await db.otp.update({ otp: otp }, { where: { email: req.body.email } });
    else await db.otp.create({ email: req.body.email, otp: otp });

    return apiResponse.OK({ res, message: messages.SUCCESS });
  },

  verifyOtp: async (req, res) => {
    if (Date.now() > await db.otp.findOne({ where: { email: req.body.email, otp: req.body.otp }, raw: true, nest: true }).expireAt) return apiResponse.BAD_REQUEST({ res, message: messages.OTP_EXPIRED });

    const verify = await db.otp.destroy({ where: { email: req.body.email, otp: req.body.otp } });
    if (!verify) return apiResponse.BAD_REQUEST({ res, message: messages.INVALID_CREDS });

    const user = await db.user.findOne({ where: { email: req.body.email } })
    const token = helper.generateToken({ data: { id: user.id, role: user.role.name } })

    return apiResponse.OK({ res, message: messages.SUCCESS, data: token });
  },

  afterOtpVerify: async (req, res) => {
    const user = await db.user.findOne({ where: { id: req.user.id } }, { raw: true, new: true });
    if (!user) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    await db.user.update({ password: await helper.hashPassword({ password: req.body.password }) }, { where: { id: user.id } })
    return apiResponse.OK({ res, message: messages.SUCCESS });
  },

  changePassword: async (req, res) => {
    const user = await db.user.findOne({ where: { id: req.user.id }, raw: true, nest: true });
    if (!user) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    if (!await helper.comparePassword({ password: req.body.oldPassword, hash: user.password })) return apiResponse.BAD_REQUEST({ res, message: messages.INVALID_PASSWORD });

    await db.user.update({ password: await helper.hashPassword({ password: req.body.newPassword }) }, { where: { id: req.user.id } });
    return apiResponse.OK({ res, message: messages.SUCCESS });
  },

  update: async (req, res) => {
    const user = await db.user.findOne({ where: { id: req.params.id }, raw: true, nest: true });
    if (!user) return apiResponse.NOT_FOUND({ res, message: messages.NOT_FOUND });

    if (await db.user.findOne({ where: { id: { [Op.ne]: user.id }, email: req.body.email } })) return apiResponse.DUPLICATE_VALUE({ res, message: messages.EMAIL_ALREADY_EXISTS });
    let data = await db.user.update(req.body, { where: { id: req.params.id } });
    return apiResponse.OK({ res, message: messages.SUCCESS, data });
  },

  getUser: async (req, res) => {
    let { page, limit, sortBy, sortOrder, search, ...query } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    sortBy = sortBy || "createdAt";
    sortOrder = sortOrder || "DESC";

    query = req.user.role.name === ADMIN ? { ...query } : { id: req.user.id };
    search ? query.$or = [{ name: { $regex: search, $options: "i" } }] : "";

    const data = await db.user.findAll({
      where: { ...query },
      limit,
      offset: (page - 1) * limit,
      order: [[sortBy, sortOrder]],
      include: [{ model: db.role, as: "role", attributes: ["name"] }],
    }, { raw: true, nest: true });

    return apiResponse.OK({ res, message: messages.SUCCESS, data: { count: await db.user.count({ where: { ...query } }), data } });
  },

  dashboardCounts: async (req, res) => {
    const data = {
      userCount: await db.user.count(),
      roleCount: await db.role.count(),
    }
    return apiResponse.OK({ res, message: messages.SUCCESS, data });
  },
};
