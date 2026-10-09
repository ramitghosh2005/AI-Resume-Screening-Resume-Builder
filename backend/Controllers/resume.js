const ResumeModel = require('../Models/resume');
const pdfParse = require("pdf-parse"); // for parsing PDF files
const path = require("path"); //automatically adds the correct file separator for the current operating system
const { CohereClient } = require("cohere-ai"); // Import the Cohere client
const upload = require("../utils/multer"); // Import the upload middleware
require('dotenv').config();

const cohere = new CohereClient({
    token: process.env.COHERE_API_KEY 
});

// Function to handle resume upload and analysis
exports.addResume = async (req, res) => {
    try {
        console.error("========== ADD RESUME ==========");
        console.log("BODY:", req.body);
        console.log("FILE:", req.file);

        // Get data sent from frontend
        const { jobDescription, userId } = req.body;

        // Check whether file exists
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required"
            });
        }

        // Check whether job description exists
        if (!jobDescription) {
            return res.status(400).json({
                message: "Job description is required"
            });
        }

        const fs = require("fs");

        // Multer diskStorage gives us the path
        const pdfPath = req.file.path;

        // Read PDF
        const dataBuffer = fs.readFileSync(pdfPath);

        // Extract text
        const pdfData = await pdfParse(dataBuffer);

        console.log("PDF text extracted successfully");
        console.log(pdfData.text.substring(0, 500));

        // Create prompt
        const prompt = `
You are a resume screening assistant.

Compare the following resume with the provided Job Description.

Resume:
${pdfData.text}

Job Description:
${jobDescription}

Return the result exactly in this format:

Score: XX
Reason: brief explanation
`;

        // Call Cohere
        const response = await cohere.chat({
            model: "command-r-08-2024",
            message: prompt,
            temperature: 0.7
        });

        console.log("Cohere response:", response);

        // Extract generated text
        const result = response.text;

        console.log("Result:", result);

        // Extract score
        const scoreMatch = result.match(/Score:\s*(\d+)/i);

        const score = scoreMatch
            ? parseInt(scoreMatch[1], 10)
            : null;

        console.log("Score:", score);

        // Extract reason
        const reasonMatch = result.match(/Reason:\s*([\s\S]*)/i);

        const reason = reasonMatch
            ? reasonMatch[1].trim()
            : "No feedback provided";

        console.log("Reason:", reason);

        // Save result to MongoDB
        const newResume = new ResumeModel({
            user: userId,
            resume_name: req.file.originalname,
            resume_file: req.file.filename,
            job_desc: jobDescription,
            resume_text: pdfData.text,
            score: score,
            reason: reason
        });

        await newResume.save();

        // Delete uploaded temporary file
        fs.unlinkSync(pdfPath);

        return res.status(200).json({
            message: "Your analysis is ready",
            data: newResume
        });

    } catch (err) {
        console.error("========== ADD RESUME ERROR ==========");
        console.error(err);
        console.error("MESSAGE:", err.message);
        console.error("STACK:", err.stack);

        return res.status(500).json({
            error: "Server error",
            message: err.message
        });
}
};



// Get all resume analyses for a specific user
exports.getAllResumesForUser = async (req, res) => {
    try {
        const { user } = req.params;

        // Sort in MongoDB before executing the query
        const resumes = await ResumeModel.find({ user: user })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Resume history fetched successfully',
            resumes: resumes
        });

    } catch (err) {
        console.error('Error fetching resume history:', err);

        return res.status(500).json({
            error: 'Server error',
            message: err.message
        });
    }
};


exports.getResumeForAdmin = async (req, res) => {
    try {
        const resumes = await ResumeModel.find({})
            .sort({ createdAt: -1 });

        return res.status(200).json({
            message: 'Fetched all resume history',
            resumes
        });
    } catch (err) {
        console.error('Admin history error:', err);

        return res.status(500).json({
            message: 'Failed to fetch resume history',
            error: err.message
        });
    }
};