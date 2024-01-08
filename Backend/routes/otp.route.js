const express = require("express");
const { check } = require("express-validator");
const { sendOtp, verifyOtp } = require("../services/otp.service");

const router = express.Router();

router.post(
  "/sendotp",
  [check("email", "Email field is invalid").normalizeEmail().isEmail()],
  sendOtp
);

router.post(
  "/verifyotp",
  [
    check("email", "Email field is invalid").normalizeEmail().isEmail(),
    check("otp", "OTP should be of 6 digits").isLength({ min: 6, max: 6 }),
    check(
      "password",
      "Password should have one lowercase, one uppercase, one number, one special character and should be minimum 8 characters long"
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  ],
  verifyOtp
);

module.exports = router;
