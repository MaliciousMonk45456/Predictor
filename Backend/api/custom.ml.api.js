const axios = require("axios");

const token=process.env.TOKEN;

const custom_ml_api = axios.create({
  baseURL: "http://127.0.0.1:3001/",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
  },
  validateStatus: function (status) {
    return status >= 200 && status < 300; // default
  },
});

module.exports = { custom_ml_api };
