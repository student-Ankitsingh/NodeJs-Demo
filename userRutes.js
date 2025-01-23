const express = require('express');
const app= express();
const controller =require('../Controllers/userController');
const { verifyToken, isAdmin } = require('../Controllers/authController');
 
const router=express.Router();
router.post('/register',controller.createUser);
router.get('/getUsers', verifyToken, controller.getUserAll);
router.get('/admin/users', verifyToken, isAdmin, controller.getUserAll);
router.get('/user/:userId',controller.getUserById);
router.get('/verify/:token',controller.verifyEmail);
router.put('/user/:userId', verifyToken, controller.updateUser);
router.delete('/user/:userId', verifyToken, isAdmin, controller.deleteUser);

module.exports = router;