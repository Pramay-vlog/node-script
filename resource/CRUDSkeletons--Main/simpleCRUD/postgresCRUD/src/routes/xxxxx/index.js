const express = require("express");
const router = express.Router();
const api4Xxxxx = require("../../api/xxxxx/index");
const { validate } = require("../../middlewares");
const passport = require("passport");

/* Get Method */
router.get(
  "/get-xxxxx",
  // passport.authenticate(["jwt"], { session: false }),
  api4Xxxxx.getXxxxx.handler
);

/* Post Methods */
router.post(
  "/add-xxxxx",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", api4Xxxxx.createXxxxx.validation),
  api4Xxxxx.createXxxxx.handler
);

/* Put Methods */
router.put(
  "/update-xxxxx/:xxxxxId",
  // passport.authenticate(["jwt"], { session: false }),
  validate("body", api4Xxxxx.updateXxxxx.validation),
  api4Xxxxx.updateXxxxx.handler
);

module.exports = exports = router;
