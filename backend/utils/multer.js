const multer = require("multer");
const path = require("path"); //automatically adds the correct file separator for the current operating system

const uploadPath = path.join(__dirname, "..", "uploads");
// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadPath); // specify the destination directory for uploaded files
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // specify the filename for uploaded files
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
        cb(null, true); // accept the file
    } else {
        cb(new Error("Only PDF files are allowed"), false); // reject the file
    }
};
const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;
