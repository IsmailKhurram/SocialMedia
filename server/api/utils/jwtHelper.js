const jwt = require('jsonwebtoken');

exports.generateToken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            name: user.name,
            email: user.email
        },
        process.env.SECRET,
        { expiresIn: '1h' }  // Expires in one hour
    );
};


exports.verifyToken = (req, res, next) => {
    const bearerHeader = req.header('Authorization');
    // console.log(bearerHeader)
    if (!bearerHeader) {
    return res.status(401).json({ status: 'error', error: 'Token missing' });
    }

// Extract the token from the Bearer string.
    const token = bearerHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ status: 'error', error: 'Token missing' });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET);
        // console.log("Decoded Token:", decoded); // Debugging line
        req.user = decoded;
        next();
    } catch (err) { // Using (err) instead of (e)
        return res.status(403).json({ status: 'error', error: 'Invalid token' });
    }
};
