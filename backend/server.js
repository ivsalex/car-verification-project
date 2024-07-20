const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

//Routes
const carsRoutes = require('./routes/Cars');
const usersRoutes = require('./routes/Users');

//MongoDB Connection
require('dotenv').config();
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('MongoDB connection error:', error);
    });

app.use((req, res, next) => {
    if (req.method !== 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Origin', 'https://www.ivaiondan.ro');
        res.header('Access-Control-Allow-Credentials', true)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
        return res.status(200).json({});
    };
    res.header('Access-Control-Allow-Origin', 'https://www.ivaiondan.ro');
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
})

app.use(cors({
    origin: ["https://www.ivaiondan.ro"],
    credentials: true,
}));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(ClerkExpressWithAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
}));

app.use('/cars', carsRoutes);
app.use('/users', usersRoutes);

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
