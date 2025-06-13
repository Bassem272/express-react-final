import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

export const checkLogin = function (req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    // decoded.role = 'admin'; 
    req.auth = decoded;
    console.log("decoded user", decoded)
    if (!decoded) {
      res
        .status(400)
        .json({ message: "User has logged out already, Login again ~" });
    }
    next();
  } catch (error) {
    next(error);
  }
};
