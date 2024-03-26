const {Schema, model} = require("mongoose");

const UserSchema = Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    surname: String,
    dni: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "usuario",
    }
});
module.exports = model("User", UserSchema, "users");