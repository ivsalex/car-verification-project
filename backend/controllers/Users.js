const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const User = require('../models/User');

exports.getAllUsers = async (req, res, next) => {
    try {
        const docs = await User.find()
            .select('_id email name password role');

        const users = docs.map(doc => ({
            _id: doc._id,
            email: doc.email,
            name: doc.name,
            password: doc.password,
            role: doc.role
        }));

        res.status(200).json({
            count: users.length,
            users: users
        });
    } catch (err) {
        res.status(500).json({
            error: err
        });
    }
};

exports.createUser = async (req, res, next) => {
    try {
        const checkedUsers = await User.find({ email: req.body.email });
        if (checkedUsers.length >= 1) {
            return res.status(500).json({
                message: 'This email is already in use!'
            })
        }

        const hash = await bcrypt.hash(req.body.password, 10);

        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            email: req.body.email,
            name: req.body.name,
            password: hash,
            role: req.body.role
        });

        const result = await user.save();

        console.log(result);
        res.status(201).json({
            message: 'User created!',
            user: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};

exports.login = async (req, res, next) => {
    try {
        const checkedUsers = await User.find({ email: req.body.email });
        if (checkedUsers.length === 0) {
            return res.status(401).json({
                message: 'Auth failed!'
            })
        }
        const passwordsMatch = await bcrypt.compare(req.body.password, checkedUsers[0].password);

        if (passwordsMatch) {
            const token = jwt.sign({
                email: checkedUsers[0].email,
                userId: checkedUsers[0]._id,
                name: checkedUsers[0].name,
                role: checkedUsers[0].role
            }, process.env.SECRET_KEY,
                {
                    expiresIn: '1h'
                });

            res.cookie('token', token, {
                domain: '.ivaiondan.ro',
                httpOnly: true,
                sameSite: 'Strict',
                path: '/'
            });

            return res.status(200).json({
                message: 'Auth successful!',
                email: checkedUsers[0].email,
                token: token,
            })
        } else {
            return res.status(401).json({
                message: 'Auth failed!'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
};