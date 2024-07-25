const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const authMiddleware = (req, res, next) => {
    const full_token = req.headers['authorization'];

    if (!full_token || !full_token.startsWith('Bearer ')) {
        console.log('No token provided or incorrect format');
        return res.status(403).json({
            message: 'Access denied. No token provided.'
        });
    }

    const token = full_token.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        //console.log('Decoded token:', decoded);
        if (decoded.userId) {
            req.userId = decoded.userId;
            return next();
        } else {
            console.log('Invalid token structure');
            return res.status(403).json({
                message: 'Access denied. Invalid token.'
            });
        }
    } catch (err) {
        console.log('Token verification failed:', err);
        return res.status(403).json({
            message: 'Access denied. Invalid token.'
        });
    }
};

module.exports = {
    authMiddleware
};
