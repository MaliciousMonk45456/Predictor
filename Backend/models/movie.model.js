const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  datasetID: {
      type: Number,
      default: -1,
  },
  image: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "uploads.files",
  },
  year: {
    type: Number,
    required: [true, "Please enter year of release"],
  },
  average_rating: {
    type: Number,
    required: [true, "Please enter average rating of movie"],
    min: [0, `{PATH} should be greater than 0`],
    max: [5, `{PATH} should be less than 5`],
  },
  genre: {
    action: {
      type: Number,
      required: [true, "Please enter action rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    adventure: {
      type: Number,
      required: [true, "Please enter adventure rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    animation: {
      type: Number,
      required: [true, "Please enter animation rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    childrens: {
      type: Number,
      required: [true, "Please enter childrens rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    comedy: {
      type: Number,
      required: [true, "Please enter comedy rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    crime: {
      type: Number,
      required: [true, "Please enter crime rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    documentary: {
      type: Number,
      required: [true, "Please enter documentary rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    drama: {
      type: Number,
      required: [true, "Please enter drama rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    fantasy: {
      type: Number,
      required: [true, "Please enter fantasy rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    horror: {
      type: Number,
      required: [true, "Please enter horror rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    mystery: {
      type: Number,
      required: [true, "Please enter mystery rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    romance: {
      type: Number,
      required: [true, "Please enter romance rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    scifi: {
      type: Number,
      required: [true, "Please enter scifi rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
    thriller: {
      type: Number,
      required: [true, "Please enter thriller rating"],
      enum: { values: [0, 1], message: `{PATH} should be either 0 or 1` },
    },
  },
});

module.exports = mongoose.model("Movie", movieSchema);
