const mongoose = require('mongoose');

// Define the category schema
const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    }
});

// Create and export the Category model
module.exports = mongoose.model('Category', CategorySchema);
