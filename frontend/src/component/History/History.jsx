// import React from 'react'
// import styles from './History.module.css'
// import skeleton from '@mui/material/Skeleton'
// import withAuthHOC from '../../utils/withAuthHOC'
// const History = () => {
  
//   return (
//     <div className={styles.history}>
//       <div className={styles.historyCardBlock}>

//         <div className={styles.historyCard}>
//           <div className={styles.historyCardHeader}>
//             <div className={styles.historyCardTitle}>Resume Match Score</div>
//             <div className={styles.historyCardDate}>Date: 2023-08-15</div>
//           </div>
//           <div className={styles.historyCardContent}>
//             <div className={styles.historyCardScore}>85%</div>
//             <div className={styles.historyCardFeedback}>
//               Feedback: Your resume is well-aligned with the job description. Consider highlighting your project experience more prominently.
//             </div>
//           </div>
//         </div>
//         <div className={styles.historyCard}>
//           <div className={styles.historyCardHeader}>
//             <div className={styles.historyCardTitle}>Resume Match Score</div>
//             <div className={styles.historyCardDate}>Date: 2023-08-15</div>
//           </div>
//           <div className={styles.historyCardContent}>
//             <div className={styles.historyCardScore}>85%</div>
//             <div className={styles.historyCardFeedback}>
//               Feedback: Your resume is well-aligned with the job description. Consider highlighting your project experience more prominently.
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default withAuthHOC(History)


import React, { useContext, useEffect, useState } from 'react';
import styles from './History.module.css';
import withAuthHOC from '../../utils/withAuthHOC';
import axios from '../../utils/axios';
import { AuthContext } from '../../utils/AuthContext';

const History = () => {
    const { userInfo } = useContext(AuthContext);

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async () => {
            // Wait until the user information is available.
            if (!userInfo?._id) {
                setLoading(false);
                setError('User information not found. Please sign in again.');
                return;
            }

            try {
                setLoading(true);
                setError('');

                const response = await axios.get(
                    `/api/resume/get/${userInfo._id}`
                );

                setHistory(response.data.resumes || []);
            } catch (err) {
                console.error(
                    'Error fetching resume history:',
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    'Unable to load your resume history. Please try again.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userInfo?._id]);

    if (loading) {
        return (
            <div className={styles.history}>
                <h2>Resume Analysis History</h2>
                <p>Loading your previous analyses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.history}>
                <h2>Resume Analysis History</h2>
                <p role="alert">{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={styles.history}>
            <div className={styles.historyHeader}>
                <h2>Resume Analysis History</h2>
                <p>
                    View all your previous resume analyses and match scores.
                </p>
                <div className={styles.historyCount}>
                    Total analyses: {history.length}
                </div>
            </div>

            {history.length === 0 ? (
                <div className={styles.emptyHistory}>
                    <h3>No analysis history yet</h3>
                    <p>
                        Upload your resume and analyze it against a job
                        description. Your results will appear here.
                    </p>
                </div>
            ) : (
                <div className={styles.historyCardBlock}>
                    {history.map((item) => (
                        <div
                            className={styles.historyCard}
                            key={item._id}
                        >
                            <div className={styles.historyCardHeader}>
                                <div className={styles.historyCardTitle}>
                                    Resume Match Score
                                </div>

                                <div className={styles.historyCardDate}>
                                    {item.createdAt
                                        ? new Date(item.createdAt)
                                            .toLocaleString()
                                        : 'Date unavailable'}
                                </div>
                            </div>

                            <div className={styles.historyCardContent}>
                                <div className={styles.historyCardScore}>
                                    {item.score ?? 'N/A'}
                                    {item.score != null ? '%' : ''}
                                </div>

                                <div className={styles.historyCardFeedback}>
                                    <strong>Resume:</strong>{' '}
                                    {item.resume_name ||
                                        item.resume_file ||
                                        'Resume'}

                                    <p>
                                        <strong>Job description:</strong>{' '}
                                        {item.job_desc || 'Not available'}
                                    </p>

                                    <p>
                                        <strong>Feedback:</strong>{' '}
                                        {item.reason ||
                                            item.feedback ||
                                            'No feedback available.'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default withAuthHOC(History);
