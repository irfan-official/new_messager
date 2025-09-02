import User from "../config/models/user.models.js";
import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  try {
    const jwtToken = req.cookies.jwtToken;

    if (!jwtToken) {
      return res.status(404).json({
        success: false,
        error: "Please login",
      });
    }

    const decodedJWT = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);

    const user = await User.findOne({ _id: decodedJWT.userID });

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "Please login",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(404).json({
      success: false,
      error: "Please login",
    });
  }
};

export default authMiddleware;
