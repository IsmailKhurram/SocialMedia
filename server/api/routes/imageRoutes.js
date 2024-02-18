const express = require('express');
const router = express.Router();
const imageUploadController = require('../controllers/imageUploadController'); // Adjust the path
const upload = require('../utils/uploads'); // Import the Multer configuration

router.post('/upload', upload.single('image'), imageUploadController.uploadImage);

module.exports = router;
