const bcrypt = require('bcryptjs');  
const User = require('../Models/userModel'); 
const crypto = require('crypto');
const { sendVerificationEmail } =require('../utils/mailer');

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const createUser = async (req, res) => {
    try {
 
        const { firstName, lastName, email, password, confirmPassword, address, gender, mobileNo, City, jobTitle, qualification, role} = req.body;
        console.log(req.body);
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // // Check if email format is valid
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

         // Check if user with the email already exists
         const existingUser = await User.findOne({ email });
         if (existingUser) {
             return res.status(400).json({ message: 'User already exists.' });
         }

            
        const hashedPassword = await bcrypt.hash(password, 10); 

         // Create a verification token
        const verifyToken = crypto.randomBytes(20).toString('hex');
        const verificationUrl = `http://localhost:4000/api/users/verify/${verifyToken}`;


        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            verificationToken : verifyToken,
            address,
            gender,
            mobileNo,
            City,
            jobTitle,
            qualification,
            role: role || 'user'
        });
            // console.log(newUser);
        // Save the user to the database
        await newUser.save();

        // Send verification email
        await sendVerificationEmail(email, verifyToken);

        // Respond with success message
        res.status(201).json({ message: "User created successfully!", user: newUser });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const {token} = req.params;

        const user = await User.findOne({ verificationToken: token });
           
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification token.' });
        }

        user.isVerify = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: 'Account verified successfully. You can now log in.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verifying account.' });
    }
};


const getUserAll = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).send({
            status: true,
            message: "Get all users successfully!",
            data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};

const getUserById = async (req, res) => {
    const userId=req.params.userId
    try {
        const users = await User.findById(userId);
        res.status(200).send({
            status: true,
            message: "Get all users successfully!",
           data: users
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: false,
            message: "Error fetching users",
            error: error.message
        });
    }
};
const updateUser = async (req, res) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, address, gender, mobileNo, city, jobTitle, qualification } = req.body;
        const userId = req.params.userId;
        if (!firstName || !lastName || !email || !password || !confirmPassword) {
            return res.status(400).send({ message: "All fields are required" });
        }
        if (password !== confirmPassword) {
            return res.status(400).send({ message: "Passwords do not match" });
        }
        const hashedPassword = await bcrypt.hash(password, 10); 

        const updatedUser = await User.findByIdAndUpdate(
            userId, 
            { firstName, lastName, email, password: hashedPassword, address, gender, mobileNo, city, jobTitle, qualification }, 
            { new: true }
        );
        if (!updatedUser) {
            return res.status(404).send({ message: "User not found" });
        }
        res.status(200).send({
            status: true,
            message: "User updated successfully.",
            data: updatedUser
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: false,
            message: "Error updating user",
            error: error.message
        });
    }
};
const deleteUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).send({
            status: true,
            message: "User deleted successfully.",
            data: User
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: false,
            message: "Error deleting user",
            error: error.message
        });
    }
};

module.exports = {
    verifyEmail,
    createUser,
    getUserAll,
    getUserById,
    updateUser,
    deleteUser,
};
