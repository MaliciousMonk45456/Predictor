const { ErrorHandler } = require("../util/error");
const { validationResult } = require("express-validator");
const Authuser = require("../models/authuser.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const verifyToken = require("../util/verifyToken");
// const { jwtDecode } = require("jwt-decode");
dotenv.config();

JWT_KEY = process.env.KEY;

URI = process.env.URI;

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    // console.log(email,password)
    const user = await Authuser.findOne({ email });
    if (user.password == null) {
      throw new ErrorHandler(400, "Login with google");
    }
    // let isValidPassword = await bcrypt.compare(password, user.password);
    // if (!user || !isValidPassword) {
    //   throw new ErrorHandler(400, "Invalid credentials");
    // }
    // let token;
    // token = jwt.sign({ userId: user._id, email: user.email }, JWT_KEY, {
    //   expiresIn: "1h",
    // });
    // // res.status(200).cookie("token", token, {
    // //   httpOnly: true,
    // //   maxAge: 3600000,
    // //   secure: true,
    // // });
    // res
    //   .status(200)
    //   .json({ Authuser: user._id, token: token, payment: user.payment });
    // // res.status(200).json({ Authuser: user._id});
    res.status(200).json({email: "email", password: "password"})
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(400, errors.array()[0].msg);
    }
    const { name, email, password } = req.body;
    const user = await Authuser.findOne({ email: email });
    if (user) {
      throw new ErrorHandler(400, "User already exists");
    }
    // const hashedPassword = await bcrypt.hash(password, 12);
    hashedPassword = password;
    const authuser = await Authuser.create({
      name,
      email,
      password: hashedPassword,
    });
    let token;
    token = jwt.sign({ userId: authuser._id, email: authuser.email }, JWT_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ Authuser: authuser._id, token: token });
    // res.status(200).json({ Authuser: authuser._id });
  } catch (error) {
    next(error);
  }
};

const useGoogle = async (req, res, next) => {
  try {
    let token = req.body.tokenId;
    // const response = jwtDecode(token);
    if (!!!token) {
      throw new ErrorHandler(400, "Invalid credentials");
    }
    // console.log(response.email);
    const response = await verifyToken(token);
    let authuser = await Authuser.findOne({
      email: response.email,
    });
    if (authuser) {
      authuser.googleId = response.sub;
      await authuser.save();
    } else {
      authuser = await Authuser.create({
        name: response.name,
        email: response.email,
        googleId: response.sub,
      });
    }
    token = jwt.sign({ userId: authuser._id, email: authuser.email }, JWT_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({
      Authuser: authuser._id,
      token: token,
      payment: authuser.payment,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login, signup, useGoogle };
