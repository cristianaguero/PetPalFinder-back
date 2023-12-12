console.log("Starting server building...")

const express = require('express');
const userRouter = require('./routes/userRoutes.js');
const petRouter = require('./routes/petRoutes.js');
const cors = require('cors');

const dbConnection = require('./config/db.js');
require('dotenv').config();

const app = express();
app.use(express.json());


const whitelist = [process.env.FRONTEND_URL];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS - from index.js'));
        }
    }
}
app.use(cors(corsOptions));


app.use('/api/users', userRouter);
app.use('/api/pets', petRouter);


const PORT = process.env.PORT || 3000;

dbConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT} and Mongo is connected`);
    });
}).catch(err => {
    console.log(err);
}
);

