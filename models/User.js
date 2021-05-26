const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: Number,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: 'customer'
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    cart: [],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("user", UserSchema);
