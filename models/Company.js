const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true,
    },
    companyLogo: {
        filename: String,
        png: Buffer,
        favicon: Buffer,
        contentType: String,
    },
    contact: {
        email: {
            type: String,
            required: true,
        },
        landLineNumber: {
            type: String,
            required: true,
        },
        mobileNumber: {
            type: String,
            required: true,
        },
        website: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    about: {
        type: String,
        required: true,
    },
    mission: {
        type: String,
        required: true,
    },
    vision: {
        type: String,
        required: true,
    },
    highlightCollection: {
        filename: String,
        data: Buffer,
        contentType: String,
    }
});

const Company = mongoose.model('Company', companySchema, 'company_info');
module.exports = Company;
