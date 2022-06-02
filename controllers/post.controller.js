const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

const fs = require('fs');
const { promisify } = require('util');
const pipeline = promisify(require('stream').pipeline);
const { uploadErrors } = require('../utils/errors.utils');

module.exports.readPost = (req, res) => {
    PostModel.find((error, docs) => {
        if (!error) {
            res.send(docs);
        }
        else {
            console.log('Error to get data' + error);
        }
    }).sort({ createdAt: -1 });
}

module.exports.createPost = async (req, res) => {

    let fileName;

    const MIME_TYPES = {
        "image/jpg": "jpg",
        "image/jpeg": "jpg",
        "image/png": "png"
    };

    if (req.file !== null) {
        try {
            if (!MIME_TYPES)
                throw Error('Invalid file');

            if (req.file.size > 500000) throw Error('max size');
        }
        catch (error) {
            const errors = uploadErrors(error)
            return res.status(201).json({ errors });
        }
        fileName = req.body.posterId + Date.now() + '.jpg';

        await pipeline(
            req.file.stream,
            fs.createWriteStream(
                `${__dirname}/../client/public/uploads/posts/${fileName}`
            )
        );
    }

    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
        picture: req.file !== null ? './uploads/posts/' + fileName : "",
        video: req.body.video,
        likers: [],
        comment: [],
    });

    try {
        const post = await newPost.save();
        return res.status(201).json(post);
    }
    catch (error) {
        return res.status(400).send(error);
    }
}

module.exports.updatePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID Unknown :' + req.params.id)

    const updatedRecord = {
        message: req.body.message
    }

    PostModel.findByIdAndUpdate(
        req.params.id,
        { $set: updatedRecord },
        { new: true },
        (error, docs) => {
            if (!error) res.send(docs);
            else console.log("Update error :" + error);
        }
    )
}

module.exports.deletePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID Unknown :' + req.params.id);

    PostModel.findByIdAndRemove(
        req.params.id,
        (error, docs) => {
            if (!error) res.send(docs);
            else console.log('Delete error :' + error);
        }
    )

}

module.exports.likePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID Unknown :' + req.params.id);

    try {
        PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { likers: req.body.id }
            },
            { new: true },
            (error, docs) => {
                if (error) res.status(400).send(error);

            }
        )
        UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $addToSet: { likes: req.params.id }
            },
            { new: true },
            (error, docs) => {
                if (!error) res.send(docs);
                else return res.status(400).send(error);
            }
        )
    }
    catch (error) {
        return res.status(400).send(error);
    }

}

module.exports.unlikePost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID Unknown :' + req.params.id);

    try {
        PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { likers: req.body.id }
            },
            { new: true },
            (error, docs) => {
                if (error) res.status(400).send(error);

            }
        )
        UserModel.findByIdAndUpdate(
            req.body.id,
            {
                $pull: { likes: req.params.id }
            },
            { new: true },
            (error, docs) => {
                if (!error) res.send(docs);
                else return res.status(400).send(error);
            }
        )
    }
    catch (error) {

    }
}

module.exports.commentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID Unknown :' + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comment: {
                        commenterId: req.body.commenterId,
                        commenterPseudo: req.body.commenterPseudo,
                        text: req.body.text,
                        timestamps: new Date().getTime()
                    }
                }
            },
            { new: true },
            (error, docs) => {
                if (!error) res.send(docs);
                else return res.status(400).send(error);
            }
        )
    }
    catch (error) {
        return res.status(400).send(error);
    }
}

module.exports.editCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID Unknown :' + req.params.id);

    try {
        return PostModel.findById(
            req.params.id,
            (error, docs) => {
                const theComment = docs.comment.find((comment) =>
                    comment._id.equals(req.body.commentId)
                )

                if (!theComment) res.status(404).send('comment not found');
                theComment.text = req.body.text;

                return docs.save((error) => {
                    if (!error) return res.status(200).send(docs);
                    return res.status(500).send(error);
                })
            }
        )
    }
    catch (error) {
        return res.status(400).send(error);
    }

}

module.exports.deleteCommentPost = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID Unknown :' + req.params.id);

    try {
        return PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: {
                    comment: {
                        _id: req.body.commentId,

                    }
                }
            },
            { new: true },
            (error, docs) => {
                if (!error) return res.send(docs);
                else return res.status(400).send(error);
            }
        )
    }
    catch (error) {
        return res.status(400).send(error);
    }
}