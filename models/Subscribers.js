const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscribersSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
        validator: function (value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        },
        message: 'Invalid email format',
        },
    },
    subscriptionDate: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Subscribers', SubscribersSchema, 'subscribers');
