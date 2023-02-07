const express = require("express");
const router = express.Router();
const { auth, authPermissions } = require("../../middleware/auth");
const validate = require("../../service/validation/joi.validate")

const {
  USER_TYPE: { ADMIN },
} = require("../../json/enums.json");
const { createRole, validation4createRole } = require("../../controllers/roles/roles.controller");

router.post("/create", auth, authPermissions(ADMIN), validate("body", validation4createRole), createRole);

module.exports = router;
