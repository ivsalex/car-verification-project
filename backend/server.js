const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');
const cron = require('node-cron');

//Routes
const carsRoutes = require('./routes/Cars');

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
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Origin', 'https://www.ivaiondan.ro');
    res.header('Access-Control-Allow-Credentials', true)
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-Authorization, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Allow', 'GET, PUT, POST, DELETE, PATCH, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, X-Authorization, Authorization');
        return res.status(200).json({});
    };
    next();
});

const fetchRandomData = async () => {
    try {
        await fetch('https://api.ivaiondan.ro/test');
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        console.log(`Server restarted at: ${hours}:${minutes}:${seconds}`);
    } catch (error) {
        console.error('Error restarting server: ', error);
    }
};

cron.schedule('*/10 * * * *', fetchRandomData);

app.use(cors({
    origin: ["https://www.ivaiondan.ro"],
    credentials: true,
}));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/cars', ClerkExpressWithAuth(), carsRoutes);

const smsController = require('./controllers/SendSms');
app.post('/send-sms', smsController.sendSms);

app.get('/', (req, res) => {
    res.json('There is nothing here :)');
});

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
