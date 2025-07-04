import User from "../models/user.model.js";
import { ErrorBuilder } from "../errors/ErrorBuilder.js";
import { createUser } from "../services/user.service.js";
import jwt from "jsonwebtoken"; 
import { comparePassword, generateToken , renewToken , removeToken , editUser } from "../services/user.service.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const errorBuilder = new ErrorBuilder();

// export async function register(req, res, next) {
//   try {
//     const data = req.body;
//     console.log("we are inside register func");
//     const user = await createUser(data);
//     return res
//       .status(201)
//       .json({ message: "User added to the database successfully", user: user });
//   } catch (error) {
//     next(error);
//   }
// }
// export async function login(req, res, next) {
//   try {
//      console.log("we are inside login func");
//     const user = req.user;
//     const { password } = req.body;
//     const match = comparePassword(user, password);
//     if (!match) {
//       throw errorBuilder.createBadRequest("Password does not match");
//     }

//     const { token, refreshToken } = await generateToken(user);
//     if (!token) {
//       throw errorBuilder.createInternalServerError(
//         "Internal server error so we are not able to create the token"
//       );
//     }
//     return res.status(200).json({
//       message: "User logged in with complete success",user,
//       token,
//       refreshToken,
//     });
//   } catch (error) {
//     next(error);
//   }
// }
// 2. For email/password registration
export const register = async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const user = new User({
      email,
      name,
      password,
      providers: ['email'] // Mark as email user
    });

    await user.save();
    const tokens = await generateTokens(user);
    
    res.status(201).json({ user, ...tokens });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// 3. For email/password login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');

    const validPass = await user.comparePassword(password);
    if (!validPass) throw new Error('Invalid password');

    user.lastLogin = new Date();
    await user.save();
    
    const tokens = await generateTokens(user);
    res.json({ user, ...tokens });

  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Shared token generator
const generateTokens = async (user) => {
  const token = jwt.sign(
    { id: user._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: '1h' }
  );
  
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  await RefreshToken.create({
    token: refreshToken,
    userId: user._id,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return { token, refreshToken };
};
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

// edit user 

export async function updateUser(req, res, next) {
  try {
    const id = req.params.id;
    if (!req.body) throw new Error("No data was provided to be edited");
    const data = req.body;
    if (!data) throw new Error("No data was provided to be edit user");
    const newUser = {
      ...data,
    };
  
    console.log("Updated User payload:", newUser , "for ID:", id);
    console.log("body of the request'", data, id);
    const updatedUser = await editUser(id, newUser);

    return res.status(201).json (updatedUser);
  } catch (err) {
    next(err);
  }
}


import { OAuth2Client } from 'google-auth-library';
// import User from '../models/user.model.js';
import RefreshToken from '../models/refreshToken.model.js';
// import jwt from 'jsonwebtoken';


export const syncUser = async (req, res) => {
  const { email, name, provider, accessToken } = req.body;

  try {
    // Verify OAuth token (Google example)
    if (provider === 'google') {
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      await client.verifyIdToken({
        idToken: accessToken,
        audience: process.env.GOOGLE_CLIENT_ID
      });
    }

    // Find or create user
    const user = await User.findOneAndUpdate(
      { email },
      { 
        name,
        $addToSet: { providers: provider }, // Add provider if new
        lastLogin: new Date(),
        $setOnInsert: { 
          role: 'user',
          createdAt: new Date() 
        }
      },
      { upsert: true, new: true }
    );

    // Generate tokens (shared with email login)
    const tokens = await generateTokens(user);
    
    res.json({ user, ...tokens });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};