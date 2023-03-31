const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const { USER_TYPE: { ADMIN, USER } } = require("../json/enums.json");

const {
  XXXXX: { VALIDATOR, APIS }
} = require("../controllers");

/* Post Apis */
router.post("/", auth({ usersAllowed: [USER, ADMIN] }), VALIDATOR.create, APIS.createXxxxx);

/* Get Apis */
router.get("/", auth({ usersAllowed: ["*"] }), VALIDATOR.fetch, APIS.getXxxxx);

/* Put Apis */
router.put("/update/:id", auth({ usersAllowed: ["*"] }), VALIDATOR.update, APIS.updateXxxxx);
router.put("/delete/:id", auth({ usersAllowed: [ADMIN] }), VALIDATOR.toggleActive, APIS.deleteXxxxx);

module.exports = router;

/* Move this into routes index.js file */
app.use("/xxxxx", require("./xxxxx.routes"));
