const { hash } = require("bcryptjs");
const { Schema, model } = require("mongoose");
const message = require("../json/message.json");
const { logger } = require("../utils/logger");


const userSchema = new Schema(
    {
        email: { type: String },
        name: { type: String, },
        password: { type: String, required: true, },
        roleId: { type: Schema.Types.ObjectId, ref: "role", required: true, },
        isActive: { type: Boolean, default: true, },
    },
    { timestamps: true, versionKey: false, }
);


userSchema.pre("save", async function (next) {
    try {

        const user = this;
        console.log("user.isModified(password)", user.isModified("password"), "user.isNew", user.isNew);

        if (user.isModified("password") || user.isNew) {

            this.password = await hash(user.password, 10);
            next();

        } else {
            next();
        }

    } catch (error) {

        logger.error(`PRE SAVE ERROR: ${error}`);
        return Promise.reject(message.INTERNAL_SERVER_ERROR);

    }
});


userSchema.set("toJSON", {
    transform: function (doc, ret, opt) {
        delete ret["password"];
        return ret;
    },
});


let userModel = model("user", userSchema, "user");
module.exports = userModel;
