// firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyCcYh6e97gOVvBFTg55tPKBuVWlXSwuSpU",
  authDomain: "nxt-gen-solutions.firebaseapp.com",
  projectId: "nxt-gen-solutions",
  storageBucket: "nxt-gen-solutions.appspot.com", // <-- fixed (.app → .appspot.com)
  messagingSenderId: "454300285871",
  appId: "1:454300285871:web:2d7ec67b484f64ec74cd5a",
  measurementId: "G-QLHTGRRJT1"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
