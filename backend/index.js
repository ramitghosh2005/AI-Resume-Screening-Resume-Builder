const express = require('express');
const connectDB = require('./conn');
const cors = require('cors');
require('dotenv').config();
const app = express();

const PORT = process.env.PORT || 4000;

require('./conn');


const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(express.json()); //whatever data we are sending from frontend to backend, it will be in json format, so we need to parse it into json format

app.use(cors({
  origin: allowedOrigins, // Replace with your frontend URL
  credentials: true   // Allow credentials (cookies) to be sent
}));

const userRoutes = require('./Routes/user'); 
const resumeRoutes = require('./Routes/resume');
app.use('/api/resume', resumeRoutes); // Use the resume routes for handling resume-related requests
app.use('/api/user', userRoutes); // Use the user routes for handling user-related requests
// app.get('/', (req, res) => {
//     res.send({
//         message : "Hii !, Welcome to our backend"
//     })
// })
connectDB();
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});