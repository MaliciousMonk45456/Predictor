const { ErrorHandler } = require("../util/error");
const { validationResult } = require("express-validator");
const Otp = require("../models/otp.model");
const Authuser = require("../models/authuser.model");
const otpgenerator = require("otp-generator");
const nodemailer = require("nodemailer");

const sendOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(400, errors.array()[0].msg);
    }
    const { email } = req.body;
    // const user = await Authuser.findOne({ email });
    // if (!user || user == null || user == -1) {
    //   throw new ErrorHandler(400, "User does not exist");
    // }

    const otp = otpgenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    const otpuser = await Otp.findOne({ email });
    if (otpuser) {
      await Otp.findOneAndUpdate({ email }, { otp });
    } else {
      await Otp.create({ email, otp });
    }
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "OTP for login",
      text: `Your OTP for login is ${otp}`,
    };
    transporter.sendMail(mailOptions);
    return res.status(200).json({ message: "OTP sent" });
  } catch (error) {
    next(error);
  }
};

const verifyOtp = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(400, errors.array()[0].msg);
    }
    const { email, otp,password } = req.body;
    const user = await Authuser.findOne({ email });
    if (!user || user == null || user == -1) {
      throw new ErrorHandler(400, "User does not exist");
    }
    const otpuser = await Otp.findOne({ email });
    if (!otpuser) {
      throw new ErrorHandler(400, "OTP not sent");
    }
    if (otpuser.otp != otp) {
      throw new ErrorHandler(400, "Invalid OTP");
    }
    await Otp.deleteOne({ email});
    user.password=password;
    await user.save();    
    res.status(200).json({ message: "OTP verified" });
  } catch (error) {
    next(error);
  }
};

module.exports = { sendOtp, verifyOtp };
