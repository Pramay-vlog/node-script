const express = require("express");
const router = express.Router();
const api4Role = require("../../api/role/index");
const { validate } = require("../../middlewares");
const passport = require("passport");

/* Get Method */
router.get(
  "/getRole",
  api4Role.allRole.handler
);

/* Post Methods */
router.post(
  "/addRole",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", api4Role.roleCreate.validation),
  api4Role.roleCreate.handler
);

/* Put Methods */
router.put(
  "/updateRole/roleId=:roleId",
  passport.authenticate(["jwt"], { session: false }),
  validate("body", api4Role.roleUpdate.validation),
  api4Role.roleUpdate.handler
);


module.exports = exports = router;
