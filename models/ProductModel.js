const mongoose = require('mongoose');

// Define variant schema for product variants (e.g., size, color)
const variantSchema = new mongoose.Schema({
    size: { type: String, required: false },
    color: { type: String, required: false },
    price: { type: Number, required: true, default: 0 },
    stockQuantity: { type: Number, required: true, default: 0 },
});

// Define the main product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the Category model
        ref: 'Category',
        required: true,
    },
    stockQuantity: {
        type: Number,
        required: true,
    },
    imageUrl: {
        type: String,
        required: false, 
    },
    tags: {
        type: [String], 
        index: true, 
    },
    discountPrice: {
        type: Number,
        required: false, 
    },
    offerStartDate: {
        type: Date,
        required: false, 
    },
    offerEndDate: {
        type: Date,
        required: false, 
    },
    variants: [variantSchema], 
    weight: {
        type: Number,
        required: false, 
    },
    weightUnit: { 
        type: String, 
        enum: ['kg', 'g', 'lb', 'oz'], 
        default: 'kg' 
    }, 
    dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
        unit: { 
            type: String, 
            enum: ['cm', 'in'], 
            default: 'cm' 
        } 
    },
    averageRating: {
        type: Number,
        default: 0, 
    },
    status: {
        type: String,
        enum: ['in stock', 'out of stock', 'discontinued'],
        default: 'in stock',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create and export the Product model
module.exports = mongoose.model('Product', productSchema);
