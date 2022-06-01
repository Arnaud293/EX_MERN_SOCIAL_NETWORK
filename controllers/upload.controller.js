const UserModel = require('../models/user.model');
const fs = require('fs');

const { promisify } = require('util');
const { dirname } = require('path');
const { uploadErrors } = require('../utils/errors.utils');
const pipeline = promisify(require('stream').pipeline);




module.exports.uploadProfil = async (req, res) => {
    try {
        if (file.mimetype !== 'image/jpg'
            && file.mimetype !== 'image/png'
            && file.mimetype !== 'image/jpeg')
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
    // const targetPath = path.join(__dirname, "../client/public/uploads/profil/" + fileName);

    // fs.rename(tempPath, targetPath, error => {
    //     if (error) return handleError(error, res);
    // });
    try {
        await UserModel.findByIdAndUpdate(
            req.body.userId,
            { $set: { picture: './uploads/profil' + fileName } },
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