const mongoose = require("mongoose");
module.exports = (connection) => {
  const xxxxxSchema = new mongoose.Schema(
    {
      isActive: { type: Boolean, default: true },
    },
    {
      autoCreate: true,
      timestamps: true,
    }
  );
  return connection.model("xxxxx", xxxxxSchema, "xxxxx");
};
