const { validationResult } = require("express-validator");
const { ErrorHandler } = require("../util/error");
const User = require("../models/user.model");
const Authuser = require("../models/authuser.model");
const { custom_ml_api } = require("../api/custom.ml.api");
const fs = require("fs");
const mongoose = require("mongoose");

const usergenre_post = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(400, errors.array()[0].msg);
    }
    // search in the ML DATABASE
    // const user=await User.findById(req.params.id);
    // if (user) {
    //   throw new ErrorHandler(400, "User already exists");
    // }

    const {
      action,
      adventure,
      animation,
      childrens,
      comedy,
      crime,
      documentary,
      drama,
      fantasy,
      horror,
      mystery,
      romance,
      scifi,
      thriller,
    } = req.body.genre;

    const user = new User({
      image: req.file.id,
      genre: {
        action,
        adventure,
        animation,
        childrens,
        comedy,
        crime,
        documentary,
        drama,
        fantasy,
        horror,
        mystery,
        romance,
        scifi,
        thriller,
      },
    });

    const authuser = await Authuser.findById(req.body.userId);
    if (!authuser || authuser.length == 0 || authuser == -1) {
      throw new ErrorHandler(400, "User does not exist");
    }

    if (authuser.user) {
      throw new ErrorHandler(400, "User has already created genre");
    }

    authuser.user = user._id;

    // console.log(authuser)
    // console.log(user)

    const session = await mongoose.startSession();
    session.startTransaction();
    await user.save({ session: session });
    await authuser.save({ session: session });
    await session.commitTransaction();
    session.endSession();

    // console.log(authuser);
    // console.log(user);

    res.status(200).json({
      message: `Received user genre data for ${user._id}`,
      _id: user._id,
    });
  } catch (error) {
    next(error);
  }
};

const usergenre_edit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(400, errors.array()[0].msg);
    }
    const user = await User.findById(req.params.id);
    if (!user || user.length == 0 || user == -1) {
      throw new ErrorHandler(400, "User does not exist");
    }
    const authuser = await Authuser.findById(req.userData.userId);
    if (authuser.user != req.params.id) {
      throw new ErrorHandler(400, "User id does not match");
    }
    user.genre = req.body.genre;
    if (req.file) {
      user.image = req.file.id;
    }
    await user.save();
    res.status(200).json({
      message: `Edited user genre data for ${req.params.id}`,
      _id: user._id,
    });
  } catch (error) {
    next(error);
  }
};

const user_img=async(req,res,next)=>{
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.length == 0 || user == -1) {
      throw new ErrorHandler(400, "User does not exist");
    }
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    const _id = user.image;
    bucket.openDownloadStream(_id).pipe(res);
  } catch (error) {
    next(error);
  }
}

const usergenre_get = async (req, res, next) => {
  try {
    let user = await Authuser.findById(req.params.id).populate("user");

    if (!user || user.length == 0 || user == -1) {
      throw new ErrorHandler(400, "User does not exist");
    }
    // console.log(user);
    if (!!user.user) {
      res.status(200).json(user.user);
    } else {
      res.status(200).json(null);
    }
  } catch (error) {
    next(error);
  }
};

const checkuser = async (req, res, next) => {
  try {
    let user = await Authuser.findById(req.params.id).populate("user");

    if (!user || user.length == 0 || user == -1) {
      throw new ErrorHandler(400, "User does not exist");
    }
    // console.log(user);
    if (!!user.user) {
      res.status(200).json({data:user.user._id,payment:user.payment});
      // res.status(200).json(user.user._id);

    } else {
      res.status(200).json({data:null,payment:user.payment});
    }
  } catch (error) {
    next(error);
  }
};

const predict_movie = async (req, res, next) => {
  try {
    const userid = req.params.id;
    const limit = req.query.limit;

    const user = await User.findById(userid);
    if (!user || user.length == 0 || user == -1) {
      throw new ErrorHandler(400, "User genre does not exist");
    }
    const response = await custom_ml_api.post("/user", user.genre, {
      params: {
        limit,
      },
    });
    // console.log(response.data);
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
};

const usergenre_delete = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || user.length == 0 || user == -1) {
      throw new ErrorHandler(400, "User genre does not exist");
    }

    const authuser = await Authuser.findById(req.userData.userId);
    if (!authuser || authuser.length == 0 || authuser == -1) {
      throw new ErrorHandler(400, "User does not exist");
    }

    if (authuser.user != req.params.id) {
      throw new ErrorHandler(400, "User id does not match");
    }
    authuser.user = null;

    const session = await mongoose.startSession();
    session.startTransaction();
    await User.findByIdAndDelete(req.params.id, { session: session });
    await authuser.save({ session: session });
    await session.commitTransaction();
    session.endSession();

    // fs.unlink(user.image, (err) => {
    //   if (err) {
    //     throw new ErrorHandler(400, "Image not found");
    //   }
    // });
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    bucket.delete(user.image);
    res.status(200).json({
      message: `Deleted user genre data for ${req.params.id}`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  usergenre_post,
  usergenre_get,
  predict_movie,
  usergenre_edit,
  usergenre_delete,
  checkuser,
  user_img,
};
