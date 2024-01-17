const express = require("express");
const { check } = require("express-validator");
const { login, signup, useGoogle } = require("../controllers/auth.controller");

const router = express.Router();

router.post("/login", login);

router.post("/googlelogin", useGoogle);

router.post(
  "/register",
  [
    check("name", "Name should not be empty").not().isEmpty(),
    check("email", "Email field is invalid").normalizeEmail().isEmail(),
  ],
  [
    check(
      "password",
      "Password should have one lowercase, one uppercase, one number, one special character and should be minimum 8 characters long"
    )
      .isLength({ min: 8 })
      .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/, "i"),
  ],
  signup
);

module.exports = router;
