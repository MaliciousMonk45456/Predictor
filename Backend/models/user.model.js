const mongoose = require("mongoose");

const validator = (VALUE) => {
  if (VALUE < 0 || VALUE > 5 || VALUE % 0.5 != 0) {
    return false;
  }
  return true;
};

const userSchema = new mongoose.Schema({
  // uid: {
  //     type: Number,
  //     required: true,
  //     unique: true
  // },
  image: {
    type: String,
    required: [true,"Please enter image url"],
  },
  genre: {
    action: {
      type: Number,
      required: [true, "Please enter action rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    adventure: {
      type: Number,
      required: [true, "Please enter adventure rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    animation: {
      type: Number,
      required: [true, "Please enter animation rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    childrens: {
      type: Number,
      required: [true, "Please enter childrens rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    comedy: {
      type: Number,
      required: [true, "Please enter comedy rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    crime: {
      type: Number,
      required: [true, "Please enter crime rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    documentary: {
      type: Number,
      required: [true, "Please enter documentary rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    drama: {
      type: Number,
      required: [true, "Please enter drama rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    fantasy: {
      type: Number,
      required: [true, "Please enter fantasy rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    horror: {
      type: Number,
      required: [true, "Please enter horror rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    mystery: {
      type: Number,
      required: [true, "Please enter mystery rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    romance: {
      type: Number,
      required: [true, "Please enter romance rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    scifi: {
      type: Number,
      required: [true, "Please enter scifi rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
    thriller: {
      type: Number,
      required: [true, "Please enter thriller rating"],
      validate: {
        validator: validator,
        message: `{PATH} should be between 0 and 5 in steps of 0.5`,
      },
    },
  },
});

module.exports = mongoose.model("User", userSchema);
