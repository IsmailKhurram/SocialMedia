const express = require('express');
const challengeController = require('../controllers/challengeContoller'); 
const { verifyToken } = require('../utils/jwtHelper'); 
const imageUploadController = require('../controllers/imageUploadController'); // Adjust the path
const upload = require('../utils/uploads'); // Import the Multer configuration


const router = express.Router();

// Existing routes...

// Route for creating a new challenge
router.post('/create', upload.single('picture'), verifyToken, challengeController.createChallenge, imageUploadController.uploadImage);


// Route for adding a comment to a challenge
router.post('/:challengeId/comments/create', verifyToken, challengeController.addCommentToChallenge);

router.post('/:challengeId/like', verifyToken, challengeController.likeChallenge);
router.post('/:challengeId/unlike', verifyToken, challengeController.unlikeChallenge);
router.post('/challenges/:id/toggleLike', verifyToken, challengeController.toggleLikeChallenge);


// The rest of your routes...
router.get('/list', verifyToken, challengeController.listChallenges);
router.post('/challengesByFriends', verifyToken, challengeController.getChallengesByFriends);

router.get('/:id', verifyToken, challengeController.getChallengeById);
router.put('/update/:id', verifyToken, challengeController.updateChallenge);
router.delete('/delete/:id', verifyToken, challengeController.deleteChallenge);

router.get('/byTag/:tag', verifyToken, challengeController.getChallengesByTag);
router.get('/byAuthor/:authorId', verifyToken, challengeController.getChallengesByAuthor);
router.get('/byComplexity/:complexity', verifyToken, challengeController.getChallengesByComplexity);

module.exports = router;
