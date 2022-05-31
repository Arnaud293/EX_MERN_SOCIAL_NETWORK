const { json } = require('express');
const express = require('express');
const userRoutes = require('./routes/user.routes');
require('dotenv').config({ path: './config/.env' });
require('./config/db');
const app = express();



app.use(express.json());
// app.use(express.urlencoded({ extended: false }));





// roads
app.use('/api/user', userRoutes);

// Server
app.listen(process.env.PORT, () => {
    console.log(`listening on port ${process.env.PORT}`);
})