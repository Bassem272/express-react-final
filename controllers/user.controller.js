import User from "../models/user.model.js";
import { ErrorBuilder } from "../errors/ErrorBuilder.js";
import { createUser } from "../services/user.service.js";
import jwt from "jsonwebtoken"; 
import { comparePassword, generateToken , renewToken , removeToken} from "../services/user.service.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const errorBuilder = new ErrorBuilder();

export async function register(req, res, next) {
  try {
    const data = req.body;
    console.log("we are inside register func");
    const user = await createUser(data);
    return res
      .status(201)
      .json({ message: "User added to the database successfully", user: user });
  } catch (error) {
    next(error);
  }
}
export async function login(req, res, next) {
  try {
     console.log("we are inside login func");
    const user = req.user;
    const { password } = req.body;
    const match = comparePassword(user, password);
    if (!match) {
      throw errorBuilder.createBadRequest("Password does not match");
    }

    const { token, refreshToken } = await generateToken(user);
    if (!token) {
      throw errorBuilder.createInternalServerError(
        "Internal server error so we are not able to create the token"
      );
    }
    return res.status(200).json({
      message: "User logged in with complete success",user,
      token,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
}

export async function renewTokenController(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw errorBuilder.createBadRequest("No token was provided try again");
    }
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    if (!payload) {
      throw errorBuilder.createBadRequest("Refresh token invalid or revoked");
    }
    const accessToken = await renewToken(payload);

    return res
      .status(201)
      .json({ message: "Access refresh is a success", accessToken : accessToken});
  } catch (error) {
    next(error);
  }
}
export async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw errorBuilder.createBadRequest("No token was provided try again");
    }
    const payload = jwt.verify(refreshToken, JWT_SECRET);
    if (!payload) {
      throw errorBuilder.createBadRequest("Refresh token invalid or revoked");
    }
    const result = await removeToken(refreshToken);

    return res
      .status(200)
      .json({ message:  result});
  } catch (error) {
    next(error);
  }
}
