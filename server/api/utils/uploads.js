const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Configure AWS
// aws.config.update({
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     region: process.env.AWS_REGION
// });



const s3 = new aws.S3({
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    region: process.env.AWS_REGION
});

// Set storage engine
// const storage = multerS3({
//     s3: s3,
//     bucket: 'skillsphere-pics', // Replace with your S3 bucket name
//     acl: 'public-read', // Adjust the ACL as per your requirements
//     metadata: function (req, file, cb) {
//         cb(null, {fieldName: file.fieldname});
//     },
//     key: function (req, file, cb) {
//         cb(null, Date.now().toString() + path.extname(file.originalname));
//     }
// });

const storage = multerS3({
    s3: s3,
    bucket: 'skillsphere-pics',
    key: function (req, file, cb) {
        cb(null, Date.now().toString() + path.extname(file.originalname));
    }
});

// Initialize upload
const upload = multer({
    storage: storage,
    limits: { fileSize: 10000000 }, 
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
});

// Check File Type
function checkFileType(file, cb) {
    console.log("File received in checkFileType:", file);
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Images Only!');
    }
}

module.exports = upload; // Export the configured Multer instance



// const multer = require('multer');
// const path = require('path');

// // Set storage engine
// const storage = multer.diskStorage({
//     destination: function(req, file, cb) {
//         cb(null, 'uploads/'); // The folder where files will be saved
//     },
//     filename: function(req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

// // Initialize upload
// const upload = multer({
//     storage: storage,
//     limits: { fileSize: 10000000 }, 
//     fileFilter: function(req, file, cb) {
//         checkFileType(file, cb);
//     }
// });

// // Check File Type
// function checkFileType(file, cb) {
//     // Allowed file extensions
//     const filetypes = /jpeg|jpg|png|gif/;
//     // Check extension
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
//     // Check mime type
//     const mimetype = filetypes.test(file.mimetype);

//     if(mimetype && extname) {
//         return cb(null, true);
//     } else {
//         cb('Error: Images Only!');
//     }
// }

// module.exports = upload; // Export the configured Multer instance
