const getAdmins = require("./get-admins");
const updateAdmin = require("./update-admin");
const adminSignup = require("./admin-signup");
const updateAdminStatus = require("./update-admin-status");
const sendEmail = require("./send-email");
const verifyCode = require("./verify-code");
const afterForgot = require("./after-forgot");
const resetPassword = require("./reset-password");
const adminLogin = require("./admin-login");

module.exports = exports = {
  resetPassword,
  adminLogin,
  getAdmins,
  updateAdmin,
  adminSignup,
  updateAdminStatus,
  afterForgot,
  sendEmail,
  verifyCode,
};
