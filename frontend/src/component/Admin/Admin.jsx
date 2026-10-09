import React, { useEffect, useState } from 'react';
import styles from './Admin.module.css';
import withAuthHOC from '../../utils/withAuthHOC';
import axios from '../../utils/axios';

const Admin = () => {
    const [resumes, setResumes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAllResumes = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await axios.get('/api/resume/get');

                setResumes(response.data.resumes || []);
            } catch (err) {
                console.error(
                    'Error fetching admin data:',
                    err.response?.data || err.message
                );

                setError(
                    err.response?.data?.message ||
                    'Unable to load resume analyses.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchAllResumes();
    }, []);

    const averageScore = resumes.length
        ? Math.round(
            resumes.reduce(
                (total, item) => total + (Number(item.score) || 0),
                0
            ) / resumes.length
        )
        : 0;

    if (loading) {
        return (
            <div className={styles.admin}>
                <h2>Admin Dashboard</h2>
                <p>Loading all resume analyses...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.admin}>
                <h2>Admin Dashboard</h2>
                <p role="alert">{error}</p>
                <button onClick={() => window.location.reload()}>
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className={styles.admin}>
            <div className={styles.adminContainer}>
                <div className={styles.adminHeader}>
                    <h2>Admin Dashboard</h2>
                    <p>Overview of all resume screening analyses</p>
                </div>

                <div className={styles.adminStats}>
                    <div className={styles.adminStatCard}>
                        <h3>Total Analyses</h3>
                        <p>{resumes.length}</p>
                    </div>

                    <div className={styles.adminStatCard}>
                        <h3>Average Match Score</h3>
                        <p>{averageScore}%</p>
                    </div>

                    <div className={styles.adminStatCard}>
                        <h3>High Match Scores</h3>
                        <p>
                            {resumes.filter(
                                item => Number(item.score) >= 80
                            ).length}
                        </p>
                    </div>
                </div>

                <h3 className={styles.sectionTitle}>
                    All Resume Analyses
                </h3>

                {resumes.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h3>No analyses found</h3>
                        <p>
                            Resume analyses will appear here after users
                            submit resumes.
                        </p>
                    </div>
                ) : (
                    <div className={styles.adminCardBlock}>
                        {resumes.map(item => (
                            <div
                                className={styles.adminCard}
                                key={item._id}
                            >
                                <div className={styles.cardHeader}>
                                    <h3>
                                        {item.resume_name ||
                                            item.resume_file ||
                                            'Resume'}
                                    </h3>

                                    <span className={styles.scoreBadge}>
                                        {item.score != null
                                            ? `${item.score}%`
                                            : 'N/A'}
                                    </span>
                                </div>

                                <p>
                                    <strong>User ID:</strong>{' '}
                                    {item.user || 'Not available'}
                                </p>

                                <p>
                                    <strong>Date:</strong>{' '}
                                    {item.createdAt
                                        ? new Date(
                                            item.createdAt
                                        ).toLocaleString()
                                        : 'Not available'}
                                </p>

                                <p>
                                    <strong>Job Description:</strong>{' '}
                                    {item.job_desc || 'Not available'}
                                </p>

                                <p>
                                    <strong>Feedback:</strong>{' '}
                                    {item.reason ||
                                        item.feedback ||
                                        'No feedback available'}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default withAuthHOC(Admin);
