const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.headers["authorization"];
  // Check if the Authorization header is present
  if (!authHeader) return res.status(401).json({ message: "Unauthorized request" });

  const token = authHeader.split(" ")[1];
  // Token should be in the format "Bearer <token>"
  if (!token) return res.status(401).json({ message: "Unauthorized request" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};
