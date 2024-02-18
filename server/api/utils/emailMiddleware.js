const nodemailer = require('nodemailer');
require('dotenv').config();

const emailMiddleware = (req, res, next) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: process.env.MAIL_ENCRYPTION === 'ssl', // true for 465, false for other ports
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD
        }
    });

    req.transporter = transporter;
    next();
};

module.exports = emailMiddleware;