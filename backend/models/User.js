const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    },
    name: { type: String },
    password: { type: String, required: true },
    role: { type: String, enum: ['User', 'Admin'], default: "User" }
});

const User = mongoose.model('User', userSchema);

module.exports = User;