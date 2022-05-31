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