import jwt from "jsonwebtoken";
import { cookiesOption } from "../config/options.config.js";
export const assignJWT = (res, userID) => {
  const token = jwt.sign(
    {
      userID,
    },
    process.env.JWT_SECRET_KEY
  );
  res.cookie("jwtToken", token, cookiesOption);
};
