import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8OQuwipCvBS2-sJhaq_p49-TeTOLl1Fs",
  authDomain: "tcc-sobre-listas.firebaseapp.com",
  projectId: "tcc-sobre-listas",
  storageBucket: "tcc-sobre-listas.firebasestorage.app",
  messagingSenderId: "620870328306",
  appId: "1:620870328306:web:9aa782e719265dd917556b",
  measurementId: "G-5P0Z9N8CTY"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, analytics, auth, firebaseConfig };