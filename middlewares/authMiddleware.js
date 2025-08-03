const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token, authorization denied" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

const isBuyer = (req, res, next) => {
  if (req.user && req.user.role === "buyer") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Buyers only" });
  }
};

const isSeller = (req, res, next) => {
  if (req.user && req.user.role === "seller") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Sellers only" });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `Access denied: Only ${roles.join(", ")} allowed` });
    }
    next();
  };
};

module.exports = {
  protect,
  isBuyer,
  isSeller,
  restrictTo,
};
