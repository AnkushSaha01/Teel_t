const mongoose = require("mongoose")


const picklistSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    item: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum: ['Outfit', 'Makeup', 'Hair', 'Shoes', 'Accessories', 'Other'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    icon: {
        type: String,
        required: true
    }
}, { timestamps: true })

const PickList = mongoose.model("pickList", picklistSchema)
module.exports = PickList