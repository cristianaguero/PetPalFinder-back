const jwt = require('jsonwebtoken');
const User = require('../models/UserModel');

const checkAuth = async (req, res, next) => {
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {

        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.user = await User.findById(decoded.userID).select('-password -confirmed -phone -token -__v -createdAt -updatedAt');

            return next();
            
        } catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }

    if(!token) {
        const error = new Error('Invalid token');
        return res.status(400).json({ error: error.message });
    }

    next();
}

module.exports = checkAuth;