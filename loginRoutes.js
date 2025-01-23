const express = require('express');
const router = express.Router();
const {
    login, 
    authenticate, 
    profile, 
    forgotPassword, 
    resetPassword, 
    changePassword 
} = require('../Controllers/authController');

router.post('/login', login);
router.get('/profile', authenticate,profile);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/', resetPassword);
router.post('/change-password', authenticate, changePassword);

module.exports = router;
