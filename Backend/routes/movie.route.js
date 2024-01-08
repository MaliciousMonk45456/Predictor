const express = require("express");
const { check } = require("express-validator");
const fileUpload = require("../middleware/file.upload.middleware");
const converter = require("../middleware/converter.middleware");
const {
  movie_post,
  movie_suggestion,
  movie_get,
  movie_edit,
  movie_delete,
  movie_post_existing,
  movie_suggestion_existing,
  movie_get_specific
} = require("../controllers/movie.controller");

const router = express.Router();

customValidator1 = (value, fieldName) => {
  if (value < 0 || value > 1 || value % 1 != 0) {
    throw new Error(`${fieldName} field should be either 1 or 0`);
  }
  return true;
};

customValidator2 = (value, fieldName) => {
  if (value < 0 || value > 5) {
    throw new Error(`${fieldName} field should be between 0 and 5`);
  }
  return true;
};

customValidator3 = (value, fieldName) => {
  if (value < 0 || value % 1 != 0) {
    throw new Error(`${fieldName} field should be greater than 0 and integer`);
  }
  return true;
};

router.post(
  "/existing",
  [
    check("datasetID", "DatasetID is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator3(value, "DatasetID")),
  ],
  movie_post_existing
);

router.post(
  "/new",
  fileUpload.single("image"),
  converter,
  [
    // check("movieID", "MovieID is invalid")
    //   .not()
    //   .isEmpty()
    //   .isNumeric()
    //   .custom((value) => customValidator3(value, "MovieID")),
    check("year", "Year field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator3(value, "Year")),
    check("average_rating", "Average Rating field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator2(value, "Average Rating")),
    check("genre.action", "Action field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Action")),
    check("genre.adventure", "Adventure field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Adventure")),
    check("genre.animation", "Animation field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Animation")),
    check("genre.childrens", "Childrens field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Childrens")),
    check("genre.comedy", "Comedy field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Comedy")),
    check("genre.crime", "Crime field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Crime")),
    check("genre.documentary", "Documentary field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Documentary")),
    check("genre.drama", "Drama field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Drama")),
    check("genre.fantasy", "Fantasy field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Fantasy")),
    check("genre.horror", "Horror field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Horror")),
    check("genre.mystery", "Mystery field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Mystery")),
    check("genre.romance", "Romance field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Romance")),
    check("genre.scifi", "Scifi field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Scifi")),
    check("genre.thriller", "Thriller field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Thriller")),
  ],

  movie_post
);

router.put(
  "/edit/:id",
  fileUpload.single("image"),
  converter,
  [
    // check("movieID", "MovieID is invalid")
    //   .not()
    //   .isEmpty()
    //   .isNumeric()
    //   .custom((value) => customValidator3(value, "MovieID")),
    check("year", "Year field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator3(value, "Year")),
    check("average_rating", "Average Rating field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator2(value, "Average Rating")),
    check("genre.action", "Action field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Action")),
    check("genre.adventure", "Adventure field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Adventure")),
    check("genre.animation", "Animation field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Animation")),
    check("genre.childrens", "Childrens field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Childrens")),
    check("genre.comedy", "Comedy field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Comedy")),
    check("genre.crime", "Crime field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Crime")),
    check("genre.documentary", "Documentary field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Documentary")),
    check("genre.drama", "Drama field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Drama")),
    check("genre.fantasy", "Fantasy field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Fantasy")),
    check("genre.horror", "Horror field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Horror")),
    check("genre.mystery", "Mystery field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Mystery")),
    check("genre.romance", "Romance field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Romance")),
    check("genre.scifi", "Scifi field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Scifi")),
    check("genre.thriller", "Thriller field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator1(value, "Thriller")),
  ],

  movie_edit
);

router.get("/:id", movie_get_specific);

router.get("/", movie_get);

router.get("/suggest/:id", movie_suggestion);

router.get("/suggest/existing/:id", movie_suggestion_existing);

router.delete("/:id", movie_delete);

module.exports = router;
