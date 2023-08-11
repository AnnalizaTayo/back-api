const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FaqsSchema = new Schema({
    question: {
        type: String,
        required: true,
        unique: true,
    },
    answer: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model('Faqs', FaqsSchema, 'faqs');
