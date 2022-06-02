const UserModel = require('../models/user.model');
const fs = require('fs');

const { promisify } = require('util');
const { dirname } = require('path');
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);
// const ObjectID = require('mongoose').Types.ObjectId;




module.exports.uploadProfil = async (req, res) => {

    const MIME_TYPES = {
        "image/jpg": "jpg",
        "image/jpeg": "jpg",
        "image/png": "png"
    };

    try {
        if (!MIME_TYPES)
            throw Error('Invalid file');

        if (req.file.size > 500000) throw Error('max size');
    }
    catch (error) {
        const errors = uploadErrors(error)
        return res.status(201).json({ errors });
    }
    const fileName = req.body.name + '.jpg';

    await pipeline(
        req.file.stream,
        fs.createWriteStream(
            `${__dirname}/../client/public/uploads/profil/${fileName}`
        )
    );

    // const tempPath = req.file.path;
    // fileName = req.body.posterId + Date.now() + ".jpg";
    // const targetPath = path.join({ __dirname }, "../client/public/uploads/profil/" + fileName);

    // fs.rename(tempPath, targetPath, error => {
    //     if (error) return handleError(error, res);
    // });

    // const storage = require('multer').diskStorage({

    //     destination: (req, file, callback) => {
    //         callback(null, { __dirname } + '../client/public/uploads/profil/' + req.body.name + '.jpg');
    //         console.log(__dirname);
    //     },
    //     filename: (req, file, callback) => {
    //         // remove whitespaces
    //         const name = file.originalname.split(' ').join('_');
    //         const extension = MIME_TYPES[file.mimetype];

    //         callback(null, name + '_' + Date.now() + extension);
    //     }
    // });


    try {
        UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set: { picture: './uploads/profil/' + fileName } },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (error, docs) => {
                if (!error) res.send(docs);
                else return res.status(500).send({ message: error });
            }
        )
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }

}