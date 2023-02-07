const { Schema, model } = require("mongoose");

const { USER_TYPE } = require('../../json/enums.json');

let roleSchema = new Schema({
    roleName: {
        type: String,
        enum: { values: [...Object.values(USER_TYPE)], message: "Invalid role" },
        unique: true,
        message: "please enter valid role name or role already exist"
    },
    isActive: {
        type: Boolean,
        default: true
    },
    description: {
        type: String
    }
}, {
    timestamps: true,
    versionKey: false
})


let roleModel = model("roles", roleSchema, "roles");

module.exports = roleModel;