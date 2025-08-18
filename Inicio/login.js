import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8OQuwipCvBS2-sJhaq_p49-TeTOLl1Fs",
  authDomain: "tcc-sobre-listas.firebaseapp.com",
  projectId: "tcc-sobre-listas",
  storageBucket: "tcc-sobre-listas.appspot.com",
  messagingSenderId: "620870328306",
  appId: "1:620870328306:web:9aa782e719265dd917556b",
  measurementId: "G-5P0Z9N8CTY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');
const registerBtn = document.getElementById('registerBtn');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
    errorMessage.textContent = "Login realizado com sucesso!";
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "dashboard.html";
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

registerBtn.addEventListener('click', async () => {
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    errorMessage.textContent = "Cadastro realizado com sucesso!";
  } catch (error) {
    errorMessage.textContent = error.message;
  }
});

const themes = {
  default: {
    '--bg-color': '#faf3f3',
    '--primary-color': '#a8d8ea',
    '--primary-hover': '#6ec6e6',
    '--card-bg': '#fff',
    '--text-color': '#555',
    '--text-light': '#fff'
  },
  dark: {
    '--bg-color': '#23272f',
    '--primary-color': '#222e3c',
    '--primary-hover': '#3a4a5a',
    '--card-bg': '#2c3440',
    '--text-color': '#eee',
    '--text-light': '#fff'
  },
  pastel: {
    '--bg-color': '#fdf6f0',
    '--primary-color': '#f7cac9',
    '--primary-hover': '#f5b7b1',
    '--card-bg': '#fff',
    '--text-color': '#6d6875',
    '--text-light': '#fff'
  },
  mint: {
    '--bg-color': '#e6fff7',
    '--primary-color': '#98ff98',
    '--primary-hover': '#6ee7b7',
    '--card-bg': '#fff',
    '--text-color': '#227c70',
    '--text-light': '#fff'
  },
  lavender: {
    '--bg-color': '#f3f0ff',
    '--primary-color': '#b8b5ff',
    '--primary-hover': '#9381ff',
    '--card-bg': '#fff',
    '--text-color': '#5e548e',
    '--text-light': '#fff'
  }
};

function applyTheme(themeName) {
  const theme = themes[themeName] || themes.default;
  Object.entries(theme).forEach(([key, value]) => {
    document.documentElement.style.setProperty(key, value);
  });
  localStorage.setItem('selectedTheme', themeName);
}

applyTheme(localStorage.getItem('selectedTheme') || 'default');

const themeSelector = document.getElementById('themeSelector');
if (themeSelector) {
  themeSelector.value = localStorage.getItem('selectedTheme') || 'default';
  themeSelector.addEventListener('change', (e) => {
    applyTheme(e.target.value);
  });
}
