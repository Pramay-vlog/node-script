const express = require("express");
const router = express.Router();

const { auth } = require("../middleware/auth");
const { USER_TYPE: { ADMIN, USER } } = require("../json/enums.json");

const {
  USER: { VALIDATOR, APIS },
} = require("../controllers");

/* Post Apis */
router.post("/signup", VALIDATOR.signup, APIS.signUp);
router.post("/signin", VALIDATOR.signIn, APIS.signIn);
router.post("/forgot", VALIDATOR.forgot, APIS.forgot);
router.post("/verifyOtp", VALIDATOR.verifyOtp, APIS.verifyOtp);
router.post("/verifyOtp/changePassword", auth({ usersAllowed: ["*"] }), VALIDATOR.afterOtpVerify, APIS.afterOtpVerify)
router.post("/changePassword", auth({ usersAllowed: ["*"] }), VALIDATOR.changePassword, APIS.changePassword);

/* Put Apis */
router.put("/update/:id", auth({ usersAllowed: ["*"] }), VALIDATOR.update, APIS.update);
router.put("/toggleActive/:id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.delete)

/* Get Apis */
router.get("/get", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getUser);
router.get("/dashboard", auth({ usersAllowed: [ADMIN] }), APIS.dashboardCounts);

module.exports = router;
