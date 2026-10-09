const express = require("express");
const router = express.Router();
const ResumeController = require('../Controllers/resume');
const upload = require('../utils/multer');

router.post('/addResume',upload.single("resume"),ResumeController.addResume) // Use the upload middleware to handle file upload
router.get('/get/:user',ResumeController.getAllResumesForUser); // Use the upload middleware to handle file upload
router.get('/get',ResumeController.getResumeForAdmin); // Use the upload middleware to handle file upload
module.exports = router;