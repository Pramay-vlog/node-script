const { Schema, model } = require("mongoose");

const xxxxxSchema = new Schema(
    {

        name: { type: String },
        isActive: { type: Boolean, default: true }

    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let xxxxxModel = model("xxxxx", xxxxxSchema, "xxxxx");

module.exports = xxxxxModel;

// XXXXX: require("./xxxxx.model"),