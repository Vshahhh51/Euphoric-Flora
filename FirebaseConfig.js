// src/firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  ,
  authDomain: "react-auth-85339.firebaseapp.com",
  projectId: "react-auth-85339",
  storageBucket: "react-auth-85339.firebasestorage.app",
  messagingSenderId: "827053231900",
  appId: "1:827053231900:web:1805bc81a23504229674d9",
  measurementId: "G-W8QR2WDWNT",
};

const app = initializeApp(firebaseConfig);

// Analytics only works in browser environments
let analytics;
if (typeof window !== "undefined") {
  analytics = getAnalytics(app);
}

const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const loginWithGoogle = () => signInWithPopup(auth, googleProvider);
const loginWithGithub = () => signInWithPopup(auth, githubProvider);

export {
  app,
  analytics,
  auth,
  loginWithGoogle,
  loginWithGithub,
  onAuthStateChanged,
  signOut,
};
