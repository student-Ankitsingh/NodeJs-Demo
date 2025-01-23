const mongoose = require('mongoose');
const { createRequire } = require('module');
//  const { type } = require('os');

const profileSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    address: {
       type: String
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    mobileNo: {
       type: String
    },
    City: {
        type: String
    },
    jobTitle: {
        type: String
    },
    qualification: {
        type: String
    }
},
    { timestamps: true });

    module.exports =mongoose.model('Profile', profileSchema);


