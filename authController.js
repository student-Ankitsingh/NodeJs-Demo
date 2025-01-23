const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
const crypto = require('crypto');
const { sendPasswordResetEmail } = require('../utils/mailer'); 
const dotenv = require('dotenv')

const JWT_SECRET = process.env.JWT_SECRET;


require('dotenv').config(); 

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        
        
        if (!email || !password) {
            return res.status(400).json({ 
                message: 'Email and password are required.' 
            });
            const verifyToken = (req, res, next) => {
                const token = req.headers['authorization'];
                if (!token) return res.status(403).json({ message: "Token is required" });
            
                jwt.verify(token, 'yourSecretKey', (error, decoded) => {
                    if (error) return res.status(401).json({ message: "Invalid token" });
                    req.user = decoded;
                    next();
                });
            };
            
            const isAdmin = (req, res, next) => {
                if (req.user.role !== 'admin') return res.status(403).json({ message: "Access restricted to admins only" });
                next();
            };
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid username or password.'
            });
        }

        if(!user.isVerify){
            return res.status(403).json({message:"Please verify your email before login"});
        }

       
        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid username or password.'
            });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: { id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Error logging in. Please try again later or contact support.',
            error: error.message 
        });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiration = Date.now() + 3600000;

        user.resetToken = resetToken;
        user.resetTokenExpiration = resetTokenExpiration;
        await user.save();
        await sendPasswordResetEmail(email, resetToken);
        res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending password reset email' });
    }
};

// Reset Password Functionality
const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const user = await User.findOne({
            resetToken: token,
            resetTokenExpiration: { $gt: Date.now() }
        });
            
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = undefined;  
        user.resetTokenExpiration = undefined; 
        await user.save();

        res.status(200).json({ message: 'Password successfully reset' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error resetting password' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New passwords do not match' });
        }

        const user = await User.findById(req.userId); // Assuming req.userId comes from authentication middleware
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error changing password', error: error.message });
    }
};

// Authentication Middleware
const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Authorization token is required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

// Protected Profile Route
const profile = async (req, res) => {
    res.status(200).json({ message: 'Access granted to protected profile route' });
};

module.exports = { 
    login,
    verifyToken,
    isAdmin,
    authenticate, 
    profile, 
    changePassword,
    resetPassword,
    forgotPassword,
};
