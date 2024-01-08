const Authuser = require("../models/authuser.model");
const mongoose = require("mongoose");
const { ErrorHandler } = require("../util/error");

const check_file = async (req, res, next) => {
  try {
    const authuser = await Authuser.findById(req.userData.userId);
    if (!authuser) {
      throw new ErrorHandler(400, "User not found");
    }
    if (authuser.file) {
      res.status(200).json({ file: authuser.file });
    } else {
      res.status(200).json({ file: null });
    }
  } catch (error) {
    next(error);
  }
};

const upload_file = async (req, res, next) => {
  try {
    const authuser = await Authuser.findById(req.userData.userId);
    if (!authuser) {
      throw new ErrorHandler(400, "User not found");
    }
    // console.log(req.file);
    if (req.file == undefined) {
      throw new ErrorHandler(400, "No file uploaded");
    }
    authuser.file = req.file.id;
    await authuser.save();
    
    res
      .status(200)
      .json({ Message: "File uploaded successfully", file: req.file });
  } catch (error) {
    next(error);
  }
};

const download_file = async (req, res, next) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "newBucket",
    });
    const authuser = await Authuser.findById(req.userData.userId);
    if (!authuser) {
      throw new ErrorHandler(400, "User not found");
    }
    const _id = authuser.file;
    bucket.openDownloadStream(_id).pipe(res);
  } catch (error) {
    next(error);
  }
};

const delete_file = async (req, res, next) => {
  try {
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "newBucket",
    });
    const authuser = await Authuser.findById(req.userData.userId);
    if (!authuser) {
      throw new ErrorHandler(400, "User not found");
    }
    bucket.delete(authuser.file);
    authuser.file = null;
    await authuser.save();
    res.status(200).json({ Message: "File deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  check_file,
  upload_file,
  download_file,
  delete_file,
};
