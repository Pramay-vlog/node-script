const { Schema, model } = require("mongoose");

const { USER_TYPE } = require("../json/enums.json");

let otpSchema = new Schema(
  {
    email: String,
    otp: String,
    expireAt: {
      type: Number,
      default: () => Date.now() + 1000 * 60 * 60 * 1,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

let roleModel = model("otp", otpSchema, "otp");

module.exports = roleModel;
