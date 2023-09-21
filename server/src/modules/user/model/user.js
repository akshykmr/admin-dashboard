import mongoose from 'mongoose';
require("dotenv").config();
const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const { Schema } = mongoose;

const UserModel = new Schema({
  Name: {
    type: String,
    required: true, // Require email field
  },
  Email: {
    type: String,
    unique: true, // Make email unique
    required: true, // Require email field
  },
  MobileNo: {
    type: Number,
    unique: true, // Make MobileNo unique
    required: true, // Require MobileNo field
  },
  Password: {
    type: String,
    required: true, // Require password field
  },
  Role: {
    type: String,
    enum: ['admin', 'subadmin', 'user'],
    required: true, // Require role field
  },
  Permissions: {
    Parking: {
      type: Boolean,
      default: false,
    },
    Event: {
      type: Boolean,
      default: false,
    },
  },
  UserStatus: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
    required: true, // Require UserStatus field
  },
});

UserModel.methods["generateAuthToken"] = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, JWT_SECRET_KEY);
    return token;
  } catch (error) {
    res.send("error", error);
    console.log("error in token", error);
  }
};


export default mongoose.model('User', UserModel);
