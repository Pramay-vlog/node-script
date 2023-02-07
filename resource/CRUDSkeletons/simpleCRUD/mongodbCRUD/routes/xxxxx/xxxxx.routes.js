const express = require("express");
const router = express.Router();
const validate = require("../../service/validation/joi.validate")

const {
  createXxxxx,
  getXxxxx,
  updateXxxxx,
  deleteXxxxx,
  validation4create,
  validation4update
} = require("../../controllers/xxxxx/xxxxx.controller");
const { auth } = require("../../middleware/auth");

router.get("/get-xxxxx", getXxxxx);
router.post("/create-xxxxx", validate("body", validation4create), auth, createXxxxx);
router.put("/update-xxxxx", validate("body", validation4update), auth, updateXxxxx);
router.put("/delete-xxxxx", auth, deleteXxxxx);

module.exports = router;
