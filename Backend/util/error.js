const fs = require("fs");

class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, req, res, next) => {
  if (req.file) {
    if (req.file.path) {
      fs.unlink(req.file.path, (err) => {
        console.log(err);
      });
    }
  }

  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  return res.status(err.statusCode).json({
    message: err.message,
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
