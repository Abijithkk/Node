const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    console.log("inside middleware");

    // Access token from headers
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: "Authorization header missing! Please login" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token missing! Please login" });
    }

    // Verify token
    try {
        const JWTresponse = jwt.verify(token, process.env.JWT_SECRET);
        console.log(JWTresponse);
        req.payload = JWTresponse._id;
        next();
    } catch (err) {
        res.status(401).json({ message: "Authorization failed! Please login" });
    }
};

module.exports = jwtMiddleware;
