import mongoose from "mongoose";
import bcrypt from "bcrypt";
import RefreshToken from "./refreshToken.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    // unique: true,
    minlength: 3,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "Invalid email"],
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    // required: true,
    enum: ["admin", "user"],
    default: "admin",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
   provider: {
    type: String,
    enum: ['google', 'github', 'credentials'],
    default: 'credentials'
  },
  lastLogin: Date
});

// block password changes for OAuth users
userSchema.pre('save', function(next) {
  if (this.isModified('password') && this.isOAuthUser()) {
    return next(new Error("Password changes not allowed for OAuth users"));
  }
  next();
});
// before saving the doc
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    let salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    return next(error);
  }
});

// doc level methods 
userSchema.methods.comparePassword = async function (candidatePassword) {
  const match = await bcrypt.compare(candidatePassword, this.password);
  return match;
};

userSchema.methods.createJWTToken = async function () {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    JWT_SECRET,
    {
      expiresIn: "24h",
    }
  );
  const refreshToken = jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await RefreshToken.create({
    token: refreshToken,
    userId: this._id,
    expiresAt,
  });
  return { token, refreshToken };
};
userSchema.methods.renewJWTToken =  function () {
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  const token = jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  return  token;
};

// In your User model (user.model.js)
userSchema.methods.isOAuthUser = function() {
  return this.provider && this.provider !== 'credentials';
};

// static method on the collection level
userSchema.statics.findUserByEmail = async function (email) {
  const user = await this.findOne({ email });
  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
