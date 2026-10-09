import React,{useContext} from 'react'
import styles from './Login.module.css'
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import GoogleIcon from '@mui/icons-material/Google';
import {auth,provider} from '../../utils/firebase'
import { signInWithPopup } from 'firebase/auth';
import {useNavigate} from 'react-router-dom'
import { AuthContext } from '../../utils/AuthContext';
import axios from '../../utils/axios';

const Login = () => {
  const {isLogin, setLogin, userInfo, setUserInfo} = React.useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth,provider)
      console.log(result)
      const user = result.user;
      const userData = {
        name: user.displayName,
        email: user.email,
        photoUrl: user.photoURL
      }
      // Save user data to the backend
      await axios.post('/api/user',userData).then((response) => {  // Send a POST request to the backend API to save user data
        setUserInfo(response.data.user); // Update the userInfo state with the response data from the backend
        localStorage.setItem('userInfo', JSON.stringify(response.data.user)); // Store the user data in localStorage for persistence
      }).catch((error) => {              
        console.error('Error saving user data:', error);
      });


      setLogin(true);// Update the login state to true
        
      localStorage.setItem('isLogin', true);   // Store the login state in localStorage
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error signing in with Google:', error)
    }
  }
  return (
    <div className={styles.login}>
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h2>Login</h2>
          <VpnKeyIcon sx={{fontSize:50, color:"gray"}}/>
          {/* <input type="text" placeholder='Username' />
          <input type="email" placeholder='Email' />
          <input type="password" placeholder='Password' /> */}
          <div className={styles.googleBtn} onClick = {handleLogin}><GoogleIcon sx={{fontSize:20, color:"red"}}/>Sign in with Google</div>
        </div>
      </div>
    </div>
  )
}

export default Login
