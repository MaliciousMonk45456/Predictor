const multer = require("multer");
const { v1: uuid } = require("uuid"); // generate unique id
const { GridFsStorage } = require("multer-gridfs-storage");

const URI = process.env.URI;

// const fileUpload = multer({
//     limits: 500000, // size 500kb
//     storage: multer.diskStorage({ // diskStorage = store on disk
//         destination: (req, file, cb) => {  // cb = callback
//             cb(null, './uploads/images'); // set destination,relative path where want to save
//         },
//         filename: (req, file, cb) => {
//             const ext = MIME_TYPE_MAP[file.mimetype]; // get extension
//             cb(null, uuid() + '.' + ext); // set filename
//         }
//     }),
//     fileFilter: (req, file, cb) => { // filter file
//         const isValid = !!MIME_TYPE_MAP[file.mimetype]; // !! = convert undefined, null to boolean
//         let error = isValid ? null : new Error('Invalid mime type!');
//         cb(error, isValid);
//     }
// })

const storage = new GridFsStorage({
  url: URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = uuid() + "." + file.originalname.split(".").pop();
      const fileInfo = {
        filename: filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    let error = new Error("Wrong file type");
    cb(error, false);
  }
};

const fileUpload = multer({
  limits: 500000, // size 500kb
  storage,
  fileFilter,
});

module.exports = fileUpload;
