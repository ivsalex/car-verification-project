const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');

//Routes
const carsRoutes = require('./routes/Cars');
const usersRoutes = require('./routes/Users');

//MongoDB Connection
require('dotenv').config();
// mongoose.connect(process.env.MONGODB_URI);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://itp-rca.onrender.com');
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }
    ;
    next();
})

app.use('/cars', cors({ origin: 'https://itp-rca.onrender.com', credentials: true }));
app.use('/users', cors({ origin: 'https://itp-rca.onrender.com', credentials: true }));

app.use('/cars', carsRoutes);
app.use('/users', usersRoutes);

// app.use(cors({
//     origin: 'https://itp-rca.onrender.com/',
//     credentials: true,
// }));

app.use((req, res, next) => {
    const error = new Error('Not found!');
    error.status = 404;
    next(error);
})

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    })
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
