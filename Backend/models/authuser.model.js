const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const findOrCreate = require("mongoose-findorcreate");

const authuserSchema = new mongoose.Schema({
  name: {
    type: String,
    // required: [true, "Please enter name"],
  },
  password: {
    type: String,
    // required: [true, "Please enter password"],
    match: [
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/,
      "Password should have one lowercase, one uppercase, one number, one special character and should be minimum 8 characters long",
    ],
  },
  email: {
    type: String,
    required: [true, "Please enter email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  file: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "File",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  payment: {
    type: String,
    default: null,
  },
  googleId: {
    type: String,
    default: null,
  },
  paymentReciept: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "File",
  },
});

authuserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
})

authuserSchema.plugin(findOrCreate);

module.exports = mongoose.model("Authuser", authuserSchema);
