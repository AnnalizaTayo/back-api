const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    productName: { 
        type: String, 
        required: true 
    },
    productImg: { 
        
        filename: String,
        data: Buffer,
        thumbnail: Buffer,
        contentType: String,
    },
    description: { 
        type: String, 
        required: true 
    },
    color: { 
        type: String, 
        required: true 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },

});

const Product = mongoose.model('Product', productSchema, 'product_list');

module.exports = Product;
