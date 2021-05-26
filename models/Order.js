const mongoose = require("mongoose");
const User = require("./User");

const OrderSchema = mongoose.Schema({
    order_item: [
        //     {
        //     type: String,
        // }
    ],
    delPerson_id: {
        type: String,
    },
    order_stage: {
        type: String
    },
    cust_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    },
    pickup_loc: [
        // {
        //     type: String,
        // }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

module.exports = mongoose.model("order", OrderSchema);
