// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcYh6e97gOVvBFTg55tPKBuVWlXSwuSpU",
  authDomain: "nxt-gen-solutions.firebaseapp.com",
  projectId: "nxt-gen-solutions",
  storageBucket: "nxt-gen-solutions.firebasestorage.app",
  messagingSenderId: "454300285871",
  appId: "1:454300285871:web:2d7ec67b484f64ec74cd5a",
  measurementId: "G-QLHTGRRJT1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);