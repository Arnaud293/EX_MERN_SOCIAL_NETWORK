const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.readPost = (req, res) => {
    PostModel.find((error, docs) => {
        if (!error) {
            res.send(docs);
        }
        else {
            console.log('Error to get data' + error);
        }
    })
}

module.exports.createPost = async (req, res) => {
    const newPost = new PostModel({
        posterId: req.body.posterId,
        message: req.body.message,
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