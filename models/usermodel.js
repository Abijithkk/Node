const mongoose = require('mongoose');

// Schema
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

// Model
const user = mongoose.model("user", userSchema);

module.exports = user;
