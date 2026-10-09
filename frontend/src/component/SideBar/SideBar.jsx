import React from 'react';

import styles from './SideBar.module.css';

import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/History';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../../utils/firebase';

const SideBar = () => {

    const location = useLocation(); // Get the current location from react-router-dom
    console.log("Current location:", location.pathname); // Log the current path for debugging

    const navigate = useNavigate(); // Get the navigate function from react-router-dom


    const { isLogin, setLogin, userInfo, setUserInfo } = useContext(AuthContext); // Accessing the userInfo from AuthContext
    const handleLogout = async () => {
        try {
            await signOut(auth);

            localStorage.removeItem('isLogin');
            localStorage.removeItem('userInfo');

            setLogin(false);
            setUserInfo(null);

            navigate('/');

        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    return (
        <div className={styles.sideBar}>

            <div className={styles.sideBarIcon}>
                <ArticleIcon sx={{ fontSize: 54, marginBottom: 2 }} />
                <div className={styles.sideBarTop}>
                    Resume Screener
                </div>
            </div>

            <div className={styles.sideBarOptionsBlock}>

                <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                        isActive
                            ? `${styles.sideBarOptions} ${styles.selectedOption}`
                            : styles.sideBarOptions
                    }
                >
                    <DashboardIcon />
                    <div>Dashboard</div>
                </NavLink>

                <NavLink
                    to="/history"
                    className={({ isActive }) =>
                        isActive
                            ? `${styles.sideBarOptions} ${styles.selectedOption}`
                            : styles.sideBarOptions
                    }
                >
                    <HistoryIcon />
                    <div>History</div>
                </NavLink>

                {userInfo?.role === 'admin' && <NavLink to="/admin"
                    className={({ isActive }) =>
                        isActive
                            ? `${styles.sideBarOptions} ${styles.selectedOption}`
                            : styles.sideBarOptions
                    }>
                    <AdminPanelSettingsIcon />
                    <div>Admin</div>
                </NavLink>
                }

                <div onClick={handleLogout} className={styles.sideBarOptions}>
                    <LogoutIcon />
                    <div>Logout</div>
                </div>

            </div>
        </div>
    );
};

export default SideBar;