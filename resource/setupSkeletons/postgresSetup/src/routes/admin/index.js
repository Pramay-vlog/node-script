const express = require("express");
const router = express.Router();
const adminApi = require("../../api/admin");
const { validate } = require("../../middlewares");
const passport = require("passport");
const { profileUploadS3 } = require("../../S3FileUpload");

/* Get Methods */
router.get(
  "/getAdmins",
  passport.authenticate(["jwt"], { session: false }),
  adminApi.getAdmins.handler
);

/* Post Methods */
router.post(
  "/login",
  validate("body", adminApi.adminLogin.validation),
  adminApi.adminLogin.handler
);

router.post("/sendEmail", adminApi.sendEmail.handler);

router.post(
  "/verifyCode",
  validate("body", adminApi.verifyCode.validation),
  adminApi.verifyCode.handler
);

router.post(
  "/resetPassword",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", adminApi.resetPassword.validation),
  adminApi.resetPassword.handler
);

router.post(
  "/afterForget",
  validate("body", adminApi.afterForgot.validation),
  adminApi.afterForgot.handler
);

router.post(
  "/signup",
  profileUploadS3.single("profileImage"),
  validate("body", adminApi.adminSignup.validation),
  adminApi.adminSignup.handler
);

/* Put Methods */
router.put(
  "/updateStatus",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", adminApi.updateAdminStatus.validation),
  adminApi.updateAdminStatus.handler
);

router.put(
  "/update/adminId=:adminId",
  passport.authenticate(["jwt"], { session: false }),
  profileUploadS3.single("profileImage"),
  validate("body", adminApi.updateAdmin.validation),
  adminApi.updateAdmin.handler
);

module.exports = exports = router;
