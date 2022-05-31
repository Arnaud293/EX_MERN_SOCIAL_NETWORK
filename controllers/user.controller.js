const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllUsers = async (req, res) => {
    const users = await UserModel.find().select('-password');
    res.status(200).json(users);
}

module.exports.userInfo = async (req, res) => {
    console.log(req.params);
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID Unknown :' + req.params.id)
    UserModel.findById(req.params.id, (error, docs) => {
        if (!error) {
            res.send(docs);
        }
        else {
            console.log('Id Unknown :' + error);
        }
    }).select('-password');
}

module.exports.updateUser = (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID Unknown :' + req.params.id)
    try {
        UserModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    bio: req.body.bio
                }
            },
            {
                new: true, upsert: true, setDefaultsOnInsert: true
            },
            (error, docs) => {
                if (!error) return res.send(docs);
                if (error) return res.status(500).send({ message: error });
            }
        )
    }
    catch (error) {
        return res.status(500).json({ message: error });
    }

}

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID Unknown :' + req.params.id)
    try {
        await UserModel.deleteOne({ _id: req.params.id });
        res.status(200).json({ message: "Successfully deleted." });
    }
    catch (error) { return res.status(500).json({ message: error }) };
}

module.exports.follow = (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToFollow))
        return res.status(400).send('ID Unknown :' + req.params.id)
    try {
        // Add to the follower list = add ID to the list of following
        UserModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { following: req.body.idToFollow } },
            { new: true, upsert: true },
            (error, docs) => {
                if (!error) {
                    res.status(201).json(docs);
                }
                else {
                    return res.status(400).json({ error })
                }
            }
        );
        // Add to following list = add the ID to the follower list too
        UserModel.findByIdAndUpdate(
            req.body.idToFollow,
            { $addToSet: { followers: req.params.id } },
            { new: true, upsert: true },
            (error, docs) => {
                if (error) return res.status(400).json({ error })
            }
        )

    }
    catch (error) {
        return res.status(500).json({ message: error })
    }
}

module.exports.unfollow = (req, res) => {
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnfollow))
        return res.status(400).send('ID Unknown :' + req.params.id)
    try {
        // Add to the follower list = add ID to the list of following
        UserModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { following: req.body.idToUnfollow } },
            { new: true, upsert: true },
            (error, docs) => {
                if (!error) {
                    res.status(201).json(docs);
                }
                else {
                    return res.status(400).json({ error })
                }
            }
        );
        // Add to following list = add the ID to the follower list too
        UserModel.findByIdAndUpdate(
            req.body.idToUnfollow,
            { $pull: { followers: req.params.id } },
            { new: true, upsert: true },
            (error, docs) => {
                if (error) return res.status(400).json({ error })
            }
        )
    }
    catch (error) {
        return res.status(500).json({ message: error })
    }
}