const express = require('express');
const app= express();
const controller =require('../Controllers/profileController')
 
const router=express.Router();
router.post('/createProfile',controller.createProfile);
router.get('/getProfileAll',controller.getProfileAll);
router.get('/getProfileById/:userId',controller.getProfileById);
router.put('/updateProfileById/:userId',controller.updateProfile);
router.delete('/deleteProfileById/:userId',controller.deleteProfile);

module.exports = router;
