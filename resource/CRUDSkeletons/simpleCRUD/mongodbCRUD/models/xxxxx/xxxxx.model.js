const { Schema, model } = require("mongoose");

const xxxxxSchema = new Schema(
    {
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

let xxxxxrModel = model("xxxxx", xxxxxSchema, "xxxxx");

module.exports = xxxxxrModel;

/* Move this object to models index file */
module.exports = {
    XXXXX: require("./xxxxx.model"),
};