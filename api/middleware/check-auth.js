const jwt = require('jsonwebtoken');
const user = require('../models/users')

module.exports = async (req, res, next) => {
    try {

        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_KEY);
        req.userData = decoded;
        const userEnabled = await user.findOne({ userName: decoded.email })

        if (userEnabled.status !== true)
            return res.status(400).json({
                message: 'No user found'
            });

        next();
    } catch (error) {
        return res.status(401).json({
            message: 'Auth failed'
        });
    }
};