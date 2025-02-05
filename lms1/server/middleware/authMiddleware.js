const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
    try {
        // Extract token from multiple sources
        let token =
            req.cookies?.token ||
            req.body?.token ||
            req.headers?.authorization?.split("Bearer ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Token is missing" });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded; // Attach user data to request
            next();
        } catch (err) {
            return res.status(401).json({ success: false, message: "Token is invalid" });
        }
    } catch (error) {
        return res.status(500).json({ success: false, message: "Authentication error" });
    }
};

module.exports = { authenticate };
