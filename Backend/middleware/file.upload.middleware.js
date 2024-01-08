const multer = require('multer');
const {v1:uuid} = require('uuid'); // generate unique id

const MIME_TYPE_MAP = { // map of mime types
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
}

const fileUpload = multer({
    limits: 500000, // size 500kb
    storage: multer.diskStorage({ // diskStorage = store on disk
        destination: (req, file, cb) => {  // cb = callback
            cb(null, './uploads/images'); // set destination,relative path where want to save 
        },
        filename: (req, file, cb) => {
            const ext = MIME_TYPE_MAP[file.mimetype]; // get extension
            cb(null, uuid() + '.' + ext); // set filename
        }
    }),
    fileFilter: (req, file, cb) => { // filter file
        const isValid = !!MIME_TYPE_MAP[file.mimetype]; // !! = convert undefined, null to boolean
        let error = isValid ? null : new Error('Invalid mime type!');
        cb(error, isValid);
    }
})

module.exports = fileUpload;