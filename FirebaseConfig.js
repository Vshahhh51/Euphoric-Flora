// firebase.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBTBUr0101DBV950FZCLhNzhItfj5odEwI",
  authDomain: "react-auth-85339.firebaseapp.com",
  projectId: "react-auth-85339",
  storageBucket: "react-auth-85339.firebasestorage.app",
  messagingSenderId: "827053231900",
  appId: "1:827053231900:web:1805bc81a23504229674d9",
  measurementId: "G-W8QR2WDWNT"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export const loginWithGoogle = () =>
  signInWithPopup(auth, new GoogleAuthProvider());

export const loginWithGithub = () =>
  signInWithPopup(auth, new GithubAuthProvider());

export const firebaseSignOut = () => signOut(auth);
