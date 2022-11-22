const jwt = require('jsonwebtoken');
require('dotenv').config();


function generateAccessToken(username) {
    return jwt.sign(username, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
}

function validateToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    if(!authHeader) return res.status(401).send('Access Denied');

    jwt.verify(authHeader, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(403).send('Invalid Token');
        req.user = user;
        next();
    }
    );
};

module.exports = {
    generateAccessToken,
    validateToken
};