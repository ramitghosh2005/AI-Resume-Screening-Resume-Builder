import React from 'react'
import styles from './Dashboard.module.css'
import skeleton from '@mui/material/Skeleton'
import withAuthHOC from '../../utils/withAuthHOC'
import { useState } from 'react'
import { AuthContext } from '../../utils/AuthContext';
import { useContext } from 'react';
import axios from '../../utils/axios';
const Dashboard = () => {
  const [uploadFileText, setUploadFileText] = useState('Upload Resume (PDF)'); // State to track the text of the upload button
  const [loading, setLoading] = useState(false); // State to track loading status
  const [resumeFile, setResumeFile] = useState(null); // State to store the uploaded resume file
  const [jobDescription, setJobDescription] = useState(''); // State to store the job description
  const [result, setResult] = useState(null); // State to store the analysis result
  const { userInfo } = useContext(AuthContext); // Accessing the userInfo from AuthContext

  const handleOnchangeFile = (e) => {
    console.log('File uploaded:', e.target.files[0]);
    setResumeFile(e.target.files[0]); // Store the uploaded file in state
    setUploadFileText(e.target.files[0].name); // Update the button text to the uploaded file name

  };
  const handleUpload = async () => {
    setResult(null); // Reset the result state before uploading
    if (!resumeFile || !jobDescription) {
      alert('Please upload a resume file and paste a job description before proceeding.');
      return;
    }
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('jobDescription', jobDescription);
    formData.append('userId', userInfo._id); // Append the user ID to the form data
    // if (!userInfo?._id) {
    // alert("User information not found. Please login again.");
    // return;
    // } 
    setLoading(true); // Set loading state to true while uploading
    try {
      const result = await axios.post('/api/resume/addResume', formData);
      console.log('Resume uploaded successfully:', result.data.data);
      setResult(result.data.data); // Update the result state with the response data
    } catch (error) {
      console.error('Error uploading resume:', error);
    } finally {
      setLoading(false); // Set loading state to false after the upload is complete
    }

  }
  return (
    <div className={styles.dashboard}>
      <div className={styles.dashboardLeft}>
        <div className={styles.dashboardHeader}>
          <div className={styles.dashboardHeaderTitle}>Smart Resume Screening</div>
          <div className={styles.dashboardHeaderSubTitle}>Resume Match Score</div>
        </div>
        <div className={styles.alertInfo}>
          <div>Important Instructions</div>
          <div className={styles.dashboardInstructions}>
            <div>1. Please paste the job description in the "Job Description" field below</div>
            <div>2. Please upload the resume in PDF format.</div>
            <div>3. Ensure that the resume is well-formatted and contains relevant information.</div>
            <div>4. The system will analyze the resume and provide a match score based on the job description.</div>
          </div>
        </div>


        <div className={styles.uploadSection}>
          <div className={styles.uploadJobDescription}>
            <label htmlFor="jobDescription">Job Description:</label>
            <textarea value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} id="jobDescription" name="jobDescription" rows="7" cols="50" placeholder="Paste the job description here..."></textarea>
            <div className={styles.analyzeButton}>
              <button onClick={handleUpload}>Analyze Resume</button>
            </div>
          </div>
          <div className={styles.uploadResume}>
            <label htmlFor="resumeUpload">{uploadFileText}:</label>
            <input type="file" id="resumeUpload" name="resumeUpload" accept=".pdf" onChange={handleOnchangeFile} />
          </div>

        </div>
      </div>
      <div className={styles.dashboardRight}>

        <div className={styles.dashboardRightHeader}>
          Analyze your Resume with AI
        </div>
        {
          result && <><div className={styles.matchScoreSection}>
            <div className={styles.matchScoreTitle}>Match Score:</div>
            <div className={styles.matchScoreValue}>{result?.score}%</div>
          </div><div className={styles.jobFeedbackSection}>
              <div className={styles.jobFeedbackTitle}>
                Feedback on your Resume:
              </div>

              <div className={styles.jobFeedbackContent}>
                <p>{result?.reason || "No feedback available"}</p>
              </div>
            </div></>

        }

        {!result && <><></><div className={styles.matchScoreSection}>
          <div className={styles.matchScoreTitle}>Match Score:</div>
          <div className={styles.matchScoreValue}>0%</div>
        </div><div className={styles.jobFeedbackSection}>
            <div className={styles.jobFeedbackTitle}>
              Feedback on your Resume:
            </div>

            <div className={styles.jobFeedbackContent}>
              <p>Your resume has not been analyzed yet. Please upload your resume and paste the job description to get feedback.</p>
            </div>
          </div></>
        }
        {/* THIS WILL GO TO THE BOTTOM
        <div className={styles.atsSection}>

          <div className={styles.atsTitle}>
            What is an ATS resume score?
          </div>

          <div className={styles.atsCard}>
            <div className={styles.atsCardTop}>
              <span className={styles.scoreGreen}>80%</span>
              <span className={styles.scoreText}>Or above</span>
            </div>

            <div className={styles.progressGreen}></div>

            <div className={styles.atsDescription}>
              Nice job! You're headed for an interview. Get 90% and your chances double...
            </div>
          </div>

          <div className={styles.atsCard}>
            <div className={styles.atsCardTop}>
              <span className={styles.scoreOrange}>60%</span>
              <span className={styles.scoreText}>Or below</span>
            </div>

            <div className={styles.progressOrange}></div>

            <div className={styles.atsDescription}>
              Your chances of passing the ATS are 50/50. Use our tips to improve your resume.
            </div>
          </div>

          <div className={styles.atsCard}>
            <div className={styles.atsCardTop}>
              <span className={styles.scoreRed}>40%</span>
              <span className={styles.scoreText}>Or below</span>
            </div>

            <div className={styles.progressRed}></div>

            <div className={styles.atsDescription}>
              Your resume may not pass the ATS, but no worries. Use our tips to improve it.
            </div>
          </div>

        </div> */}

      </div>
    </div>
  )
}

export default withAuthHOC(Dashboard)
// export default Dashboard