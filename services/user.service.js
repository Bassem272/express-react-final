import User from "../models/user.model.js";
import { ErrorBuilder } from "../errors/ErrorBuilder.js";
import RefreshToken from "../models/refreshToken.model.js";
const errorBuilder = new ErrorBuilder();

export const createUser = async function (data) {
  try {
    const user = new User(data);
    await user.save();
    console.log(user);
    return user;
  } catch (error) {
    throw error;
  }
};
export const comparePassword = async function (user, candidatePassword) {
  try {
    const match = await user.comparePassword(candidatePassword);
    return match;
  } catch (error) {
    throw error;
  }
};

export const generateToken = async function (user) {
  try {
    const { token, refreshToken } = await user.createJWTToken();
    return { token, refreshToken };
  } catch (error) {
    throw error;
  }
};
export const renewToken = async function (payload) {
  try {
    const user = await User.findUserByEmail(payload.email)
    if(!user){
      throw errorBuilder.createNotFound("The user with this email is not found")
    }
    const accessToken = user.renewJWTToken();
    return accessToken;
  } catch (error) {
    throw error;
  }
};

export const removeToken = async function (refreshToken) {
  try {

    const result = await RefreshToken.deleteOne({token:refreshToken});
    const message = "logout is a success"; 
    const againMessage = "You are already logout. Don't repeat logout again"; 

    return result.deletedCount === 0 ? againMessage: message ;
  } catch (error) {
    throw error;
  }
};

