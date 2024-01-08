const express = require("express");
const fileRouter = express.Router();
const multer = require("multer");
const {
  check_file,
  upload_file,
  download_file,
  delete_file,
} = require("../controllers/files.controller");
const { GridFsStorage } = require("multer-gridfs-storage");
const { v1: uuid } = require("uuid");
const { checkAuth } = require("../middleware/checkauth.middleware");

const URI = process.env.URI;

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads');
//     },
//     filename: function (req, file, cb) {
//         const hex = Buffer.from(Date.now().toString()).toString('hex');
//         cb(null, hex);
//     }
// });

// const upload = multer({ storage });

const storage = new GridFsStorage({
  url: URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = uuid() + "." + file.originalname.split(".").pop();
      const fileInfo = {
        filename: filename,
        bucketName: "newBucket",
      };
      resolve(fileInfo);
    });
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    let error = new Error("Wrong file type");
    cb(error, false);
  }
};

const upload = multer({
  storage,
  fileFilter,
});

fileRouter.use(checkAuth);

fileRouter.get("/check", check_file);

fileRouter.post("/upload", upload.single("file"), upload_file);

fileRouter.get("/download/:id", download_file);

fileRouter.delete("/delete", delete_file);

module.exports = fileRouter;
