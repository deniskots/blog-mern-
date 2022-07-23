const {Schema, model} = require('mongoose');
const mongoose = require("mongoose");

const PostSchema = new Schema({
        title: {type: String, required: true},
        text: {type: String, required: true, unique: true},
        tags: {type: Array, default: []},
        imageUrl: {type: String},
        viewCount: {type: Number, default: 0},
        user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}
    },
    {
        timestamps: true
    }
)

module.exports = model('Post', PostSchema)
