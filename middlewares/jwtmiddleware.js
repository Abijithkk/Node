const jwt = require('jsonwebtoken');

const jwtMiddleware = (req, res, next) => {
    console.log("Inside JWT middleware");

    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        console.log("Authorization header missing");
        return res.status(401).json({ message: "Authorization header missing! Please login" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
        console.log("Token missing");
        return res.status(401).json({ message: "Token missing! Please login" });
    }

    try {
        const JWTresponse = jwt.verify(token, process.env.JWT_SECRET);
        console.log("JWT verified:", JWTresponse);
        req.payload = JWTresponse._id;
        next();
    } catch (err) {
        console.log("JWT verification failed:", err);
        res.status(401).json({ message: "Authorization failed! Please login" });
    }
};

module.exports = jwtMiddleware;
