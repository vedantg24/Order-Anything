const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    address: [{
        type: String,
        required: true
    }
    ]
});

module.exports = mongoose.model("items", ItemSchema);
