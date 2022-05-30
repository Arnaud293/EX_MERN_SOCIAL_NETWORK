const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.yuineu7.mongodb.net/MERN',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
        // useCreateIndex: true,
        // useFindAndModify: true
    })
    .then(() => console.log('connected to MongoDB'))
    .catch((error) => console.log("Failed to connect to MongoDB", error));