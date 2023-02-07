const app = require("express")();

const userRoutes = require("./user/user.routes");
const roleRoutes = require("./roles/roles.routes");

app.get("/v1", (req, res) => {
  res.send("Welcome to xxxxx-backend APIs!");
});

app.use("/v1/user", userRoutes);
app.use("/v1/role", roleRoutes);

module.exports = app;
