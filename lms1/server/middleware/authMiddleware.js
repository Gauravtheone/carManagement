const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  try {
    const token = req.cookies?.token; // Ensure req.cookies exists
    console.log("ye Lo" + token)
    if (!token) return res.status(401).json({ message: "Unauthorized" });
console.log(token)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { authenticate };
