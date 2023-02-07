const { Schema, model } = require("mongoose");

const xxxxxSchema = new Schema(
    {
        isActive: {
            type: Boolean, default: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let xxxxxrModel = model("xxxxx", xxxxxSchema, "xxxxx");
module.exports = xxxxxrModel;
