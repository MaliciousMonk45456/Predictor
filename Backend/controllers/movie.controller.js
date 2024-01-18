const { ErrorHandler } = require("../util/error");
const { validationResult } = require("express-validator");
const Movie = require("../models/movie.model");
const { custom_ml_api } = require("../api/custom.ml.api");
const fs = require("fs");
const mongoose = require("mongoose");

const movie_post = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(400, errors.array()[0].msg);
    }
    // console.log(req.file)
    const {
      // movieID,
      year,
      average_rating,
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
    } = req.body;
    const movie = await Movie.create({
      // movieID,
      image: req.file.id,
      year,
      average_rating,
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

    res
      .status(200)
      .json({ message: `Received movie genre data for ${movie._id}` });
  } catch (error) {
    next(error);
  }
};

const movie_post_existing = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(400, errors);
    }
    const mid = req.body.datasetID;
    const movie_mongodb = await Movie.findOne({ datasetID: mid });
    if (movie_mongodb) {
      throw new ErrorHandler(400, "Movie already exists");
    }
    const response = await custom_ml_api.get(`/movie/${mid}`);
    if (response.data.message) {
      throw new ErrorHandler(400, "Movie not found in the dataset");
    }
    const movie = await Movie.create({
      datasetID: response.data.datasetID,
      year: response.data.year,
      average_rating: response.data.average_rating,
      genre: response.data.genre,
    });
    // console.log(response.data.average_rating);
    res
      .status(200)
      .json({ message: `Received movie genre data for ${movie._id}` });
  } catch (error) {
    next(error);
  }
};

const movie_edit = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler(400, errors.array()[0].msg);
    }
    const movie = await Movie.findById(req.params.id);
    if (movie == -1 || movie.length == 0 || !movie) {
      throw new ErrorHandler(400, "Movie not found");
    }
    if (movie.datasetID != -1) {
      throw new ErrorHandler(400, "Movie cannot be edited");
    }
    if (req.file) {
      movie.image = req.file.id;
    }
    movie.year = req.body.year;
    movie.average_rating = req.body.average_rating;
    movie.genre = req.body.genre;
    await movie.save();
    res.status(200).json({
      message: `Edited movie genre data for ${req.params.id}`,
    });
  } catch (error) {
    next(error);
  }
};

const movie_get = async (req, res, next) => {
  try {
    const movies = await Movie.find();
    if (movies.length == 0 || !movies || movies == -1) {
      throw new ErrorHandler(400, "No movie exists");
    }
    res.status(200).json(movies);
  } catch (error) {
    next(error);
  }
};

const movie_suggestion = async (req, res, next) => {
  try {
    const mID = req.params.id;
    const limit = req.query.limit;
    const movie = await Movie.findById(mID);
    if (!movie || movie.length == 0) {
      throw new ErrorHandler(400, "Movie does not exist");
    }
    const response = await custom_ml_api.post(
      "/movie",
      {
        year: movie.year,
        average_rating: movie.average_rating,
        action: movie.genre.action,
        adventure: movie.genre.adventure,
        animation: movie.genre.animation,
        childrens: movie.genre.childrens,
        comedy: movie.genre.comedy,
        crime: movie.genre.crime,
        documentary: movie.genre.documentary,
        drama: movie.genre.drama,
        fantasy: movie.genre.fantasy,
        horror: movie.genre.horror,
        mystery: movie.genre.mystery,
        romance: movie.genre.romance,
        scifi: movie.genre.scifi,
        thriller: movie.genre.thriller,
      },
      {
        params: {
          limit,
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
};

const movie_suggestion_existing = async (req, res, next) => {
  try {
    const mID = req.params.id;
    const limit = req.query.limit;
    const movie = await Movie.findById(mID);
    if (!movie || movie.length == 0) {
      throw new ErrorHandler(400, "Movie does not exist");
    }
    const response = await custom_ml_api.get(
      `/movie/existing/${movie.datasetID}`,
      {
        params: {
          limit,
        },
      }
    );
    if (response.data.message) {
      throw new ErrorHandler(400, "Movie not found in the dataset");
    }
    res.status(200).json(response.data);
  } catch (error) {
    next(error);
  }
};

const movie_img = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.length == 0) {
      throw new ErrorHandler(400, "Movie does not exist");
    }
    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    const _id = movie.image;
    // console.log(_id);
    bucket.openDownloadStream(_id).pipe(res);
  } catch (error) {
    next(error);
  }
};

const movie_delete = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie || movie.length == 0) {
      throw new ErrorHandler(400, "Movie does not exist");
    }
    // fs.unlink(movie.image, (err) => {
    //   if (err) {
    //     throw new ErrorHandler(400, "Image not found");
    //   }
    // });

    const bucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
      bucketName: "uploads",
    });
    console.log(movie.image)
    bucket.delete(movie.image);
    const movies = await Movie.find();
    if (!movies || movies.length == 0 || movies == -1) {
      throw new ErrorHandler(400, "No movie exists");
    }
    res.status(200).json({
      message: `Deleted movie genre data for ${req.params.id}`,
      movies: movies,
    });
  } catch (error) {
    next(error);
  }
};

const movie_get_specific = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie || movie.length == 0) {
      throw new ErrorHandler(400, "Movie does not exist");
    }
    res.status(200).json(movie);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  movie_post,
  movie_suggestion,
  movie_get,
  movie_edit,
  movie_delete,
  movie_post_existing,
  movie_suggestion_existing,
  movie_get_specific,
  movie_img,
};
