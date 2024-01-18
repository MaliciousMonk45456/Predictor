const express = require("express");
const { check } = require("express-validator");
const {
  usergenre_post,
  usergenre_get,
  usergenre_edit,
  predict_movie,
  usergenre_delete,
  checkuser,
  user_img
} = require("../controllers/genre.controller");
const fileUpload = require("../middleware/file.upload.middleware");
const converter = require("../middleware/converter.middleware");
const {checkAuth} = require("../middleware/checkauth.middleware");

const router = express.Router();

customValidator = (value, fieldName) => {
  if (value < 0 || value > 5 || value % 0.5 != 0) {
    throw new Error(
      `${fieldName} field should be between 0 and 5 in steps of 0.5`
    );
  }
  return true;
};

router.get("/check/:id",checkuser)

router.get("/image/:id", user_img);

router.use(checkAuth)

router.post(
  "/",
  fileUpload.single("image"),
  converter,
  [
    // check("name", "Name should not be empty").not().isEmpty(),
    // check("image", "Image field is invalid").not().isEmpty(),
    check("genre.action", "Action field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Action")),
    check("genre.adventure", "Adventure field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Adventure")),
    check("genre.animation", "Animation field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Animation")),
    check("genre.childrens", "Childrens field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Childrens")),
    check("genre.comedy", "Comedy field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Comedy")),
    check("genre.crime", "Crime field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Documentary")),
    check("genre.documentary", "Documentary field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Documentary")),
    check("genre.drama", "Drama field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Documentary")),
    check("genre.fantasy", "Fantasy field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Fantasy")),
    check("genre.horror", "Horror field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Horror")),
    check("genre.mystery", "Mystery field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Mystery")),
    check("genre.romance", "Romance field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Romance")),
    check("genre.scifi", "Scifi field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Scifi")),
    check("genre.thriller", "Thriller field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Thriller")),
  ],

  usergenre_post
);

router.get("/:id", usergenre_get);

router.delete("/:id", usergenre_delete);

router.put(
  "/edit/:id",
  fileUpload.single("image"),
  converter,
  [
    // check("name", "Name should not be empty").not().isEmpty(),
    // check("image", "Image field is invalid").not().isEmpty(),
    check("genre.action", "Action field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Action")),
    check("genre.adventure", "Adventure field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Adventure")),
    check("genre.animation", "Animation field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Animation")),
    check("genre.childrens", "Childrens field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Childrens")),
    check("genre.comedy", "Comedy field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Comedy")),
    check("genre.crime", "Crime field is invalid").not().isEmpty().isNumeric(),
    check("genre.documentary", "Documentary field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Documentary")),
    check("genre.drama", "Drama field is invalid").not().isEmpty().isNumeric(),
    check("genre.fantasy", "Fantasy field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Fantasy")),
    check("genre.horror", "Horror field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Horror")),
    check("genre.mystery", "Mystery field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Mystery")),
    check("genre.romance", "Romance field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Romance")),
    check("genre.scifi", "Scifi field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Scifi")),
    check("genre.thriller", "Thriller field is invalid")
      .not()
      .isEmpty()
      .isNumeric()
      .custom((value) => customValidator(value, "Thriller")),
  ],
  usergenre_edit
);

router.get("/predict/:id", predict_movie);

module.exports = router;
