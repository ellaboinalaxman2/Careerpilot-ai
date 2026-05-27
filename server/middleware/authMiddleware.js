const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");

const protect = asyncHandler(async (req, res, next) => {
  // Skip authentication for OPTIONS requests (CORS preflight)
  if (req.method === "OPTIONS") {
    return next();
  }

  let token;

  console.log("Auth Middleware - Method:", req.method);
  console.log("Auth Middleware - Headers:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("Token received");

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");

      console.log("User authenticated:", req.user?.email);
      next();
    } catch (error) {
      console.error("Token verification failed:", error.message);
      res.status(401);
      throw new Error("Not authorized");
    }
  }

  if (!token) {
    console.error("No token provided in request");
    res.status(401);
    throw new Error("No token provided");
  }
});

module.exports = { protect };
