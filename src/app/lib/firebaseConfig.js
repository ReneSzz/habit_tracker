// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6xFkrbxhAgUH4Mq6F8dYDtt4FKztFqQA",
  authDomain: "habittracker-d7a6d.firebaseapp.com",
  projectId: "habittracker-d7a6d",
  storageBucket: "habittracker-d7a6d.firebasestorage.app",
  messagingSenderId: "185526683860",
  appId: "1:185526683860:web:5b0357df900b7de0e41341",
  measurementId: "G-J5FRZH4TH2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);