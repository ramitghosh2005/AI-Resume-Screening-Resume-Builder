
import { initializeApp } from "firebase/app";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCyTVmuLinrBYRJ_hv76nxgtb2mRLM2bWg",
  authDomain: "mernai-d66ac.firebaseapp.com",
  projectId: "mernai-d66ac",
  storageBucket: "mernai-d66ac.firebasestorage.app",
  messagingSenderId: "228462030118",
  appId: "1:228462030118:web:1bbc9517af523ed1bf25e7",
  measurementId: "G-QYS234TPJ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };