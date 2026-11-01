
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Please login to continue"
    });
  }

  const token = authorization.slice("Bearer ".length);
  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"]
    });
  } catch {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }

  if (
    typeof decoded !== "object" ||
    decoded === null ||
    typeof decoded.userId !== "string"
  ) {
    return res.status(401).json({
      message: "Invalid or expired token"
    });
  }

  try {
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        message: "User not found"
      });
    }

    req.user = user;
    return next();
  } catch (error) {
    console.error(
      "Authentication lookup failed:",
      error instanceof Error ? error.name : "UnknownError"
    );
    return res.status(500).json({
      message: "Unable to authenticate right now"
    });
  }
};

export default authMiddleware;
