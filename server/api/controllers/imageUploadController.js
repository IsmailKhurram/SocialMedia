const upload = require('../utils/uploads'); // Adjust the path based on your folder structure

exports.uploadImage = (req, res, next) => {
    console.log("File in uploadImage controller:", req.file);

    if (req.file && req.file.location) {
        // If a file is uploaded, set the file URL
        req.fileUrl = req.file.location;
    } else {
        // If no file is uploaded, set the file URL to null or an empty string
        console.log('No file uploaded, proceeding without a file.');
        req.fileUrl = null; // or use an empty string if that suits your logic better
    }

    // Pass control to the next middleware/controller
    next();
};


