const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../utils/jwtHelper');
const { updateProfile, getProfile, deleteAccount } = require('../controllers/userController');
const imageUploadController = require('../controllers/imageUploadController'); // Adjust the path
const upload = require('../utils/uploads'); // Import the Multer configuration
const emailMiddleware = require('../utils/emailMiddleware'); // Import the email middleware



router.post('/register', emailMiddleware, (req, res, next) => {
    console.log("Incoming request body:", req.body);
    console.log("Incoming files:", req.files); // This might be undefined at this point
    next();
}, upload.single('image'), imageUploadController.uploadImage, userController.register);
router.post('/login', userController.login);
router.get('/profile/:userId', getProfile);
router.get('/profile', verifyToken, getProfile);
router.put('/updateProfile', verifyToken, upload.single('profilePicture'), userController.updateProfile);
router.delete('/deleteAccount', verifyToken, deleteAccount);


router.post('/sendfriendrequest', verifyToken, userController.sendFriendRequest);
router.post('/acceptfriendrequest', verifyToken, userController.acceptFriendRequest);
router.post('/rejectfriendrequest', verifyToken, userController.rejectFriendRequest);
router.get('/listfriends', verifyToken, userController.listFriends);
router.post('/listfriendspost', verifyToken, userController.listFriends2);
router.get('/listfriendrequests', verifyToken, userController.listFriendRequests);
router.get('/searchFriends', verifyToken, userController.searchFriends);


module.exports = router;
