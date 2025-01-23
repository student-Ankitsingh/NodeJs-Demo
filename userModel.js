const mongoose = require('mongoose');
const { sendVerificationEmail } = require('../utils/mailer');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true 
        },
    lastName: { 
        type: String, 
        required: true },
    email: { 
        type: String, 
        required: true, 
        unique: true },
    password: { 
        type: String, 
        required: true },
    verificationToken: { 
        type: String },
    isVerify: { 
        type: Boolean, 
        default: false },
    address: { 
        type: String },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'] },
    mobileNo: { 
        type: String },
    City: { 
        type: String },
    jobTitle: { 
        type: String },
    qualification: { 
        type: String },
    role: {
            type: String, 
            enum: ['user', 'admin'], 
            default: 'user' 
           }
}, 
{ timestamps: true });

module.exports = mongoose.model('User', userSchema);
