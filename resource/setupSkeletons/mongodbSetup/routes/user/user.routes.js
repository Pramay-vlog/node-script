const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const { USER_TYPE: { ADMIN } } = require("../../json/enums.json");
const { upload, uploadError } = require("../../service/aws/s3bucket")
const validate = require("../../service/validation/joi.validate")

const {
    signUp,
    login,
    forgotPassword,
    forgotPasswordVerify,
    getDashboardCounts,
    getUsers,
    getProfileDetails,
    updateUser,
    validation4signUp,
    validation4login,
    validation4forgotPassword,
    validation4forgotPasswordVerify,
    validation4updateUser } = require("../../controllers/user/user.controller");

// get methods
router.get("/get", auth, getUsers);
router.get("/dashboard-counts", auth, authPermissions(ADMIN), getDashboardCounts);
router.get("/profile-details", auth, getProfileDetails);

// post methods
router.post("/signup", validate("body", validation4signUp), signUp);
router.post("/login", validate("body", validation4login), login);
router.post("/update-profile-details", validate("body", validation4updateUser), auth, upload.single("profile_image"), uploadError, updateUser);
router.post("/forgot-password", validate("body", validation4forgotPassword), forgotPassword);
router.post("/forgot-password/verify", validate("body", validation4forgotPasswordVerify), forgotPasswordVerify);

module.exports = router;
