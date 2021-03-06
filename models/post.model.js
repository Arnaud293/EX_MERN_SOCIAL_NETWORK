const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
    {
        posterId: { type: String, required: true },
        message: { type: String, trim: true, maxlength: 500 },
        piture: { type: String },
        video: { type: String },
        likers: { type: [String], required: true },
        comment: {
            type: [
                {
                    commenterId: String,
                    commenterPseudo: String,
                    text: String,
                    timestamps: Number
                }
            ], required: true

        }


    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('post', PostSchema);