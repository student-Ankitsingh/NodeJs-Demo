const bcrypt = require('bcryptjs');
const Profile = require('../Models/profileModel');

const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

const createProfile = async (req, res) => {
    try{

        const { firstName, lastName, email, address, gender, mobileNo, City, jobTitle, qualification } = req.body;
        console.log(req.body);
        if ( !firstName || !lastName || !email) {
            return res.status(400).json({ message: "all field are required" });
        }
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

         // Check if user with the email already exists
         const existinProfile = await Profile.findOne({ email });
         if (existinProfile) {
             return res.status(400).json({ message: 'Profile already exists.' });
         }


        const newProfile = new Profile({
            firstName,
            lastName,
            email,
            address,
            gender,
            mobileNo,
            City,
            jobTitle,
            qualification
        });
            console.log(newProfile);
        // Save the user to the database
        await newProfile.save();


        // Respond with success message
        res.status(201).json({ message: "Profile created successfully!", user: newProfile });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating user", error: error.message });
    }
};

const getProfileAll = async (req, res) => {
    try {
        const users = await Profile.find();
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

const getProfileById = async (req, res) => {
    const userId=req.params.userId
    try {
        const users = await Profile.findById(userId);
        res.status(200).send({
            status: true,
            message: "Get all profile successfully!",
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
const updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, email, address, gender, mobileNo, City, jobTitle, qualification } = req.body;
        const userId = req.params.userId;
        if (!firstName || !lastName || !email) {
            return res.status(400).send({ message: "All fields are required" });
        }

        const updatedProfile = await User.findByIdAndUpdate(
            userId, 
            { firstName, lastName, email, address, gender, mobileNo, City, jobTitle, qualification }, 
            { new: true }
        );
        if (!updatedProfile) {
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
const deleteProfile = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await Profile.findById(userId);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        await Profile.findByIdAndDelete(userId);
        res.status(200).send({
            status: true,
            message: "Profile deleted successfully.",
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
    createProfile,
    getProfileAll,
    getProfileById,
    updateProfile,
    deleteProfile
};

