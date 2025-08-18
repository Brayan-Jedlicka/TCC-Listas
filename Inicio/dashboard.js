import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "index.html";
}

document.getElementById("logoutButton").onclick = async () => {
  await signOut(auth);
  localStorage.removeItem("isLoggedIn");
  window.location.href = "index.html";
};

const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (taskInput.value.trim() === "") return;
  await addDoc(collection(db, "tarefas"), {
    texto: taskInput.value,
    data: new Date()
  });
  taskInput.value = "";
});

const taskList = document.getElementById("taskList");
const tarefasQuery = query(collection(db, "tarefas"), orderBy("data", "desc"));
onSnapshot(tarefasQuery, (snapshot) => {
  taskList.innerHTML = "";
  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.textContent = doc.data().texto;
    taskList.appendChild(li);
  });
});

const themes = {
  default: {
    '--bg-color': '#f7f7f7ff',
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
    '--primary-color': '#bcffbcff',
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

document.getElementById('themeSelector').addEventListener('change', (e) => {
  applyTheme(e.target.value);
});

document.querySelectorAll('.card .button').forEach(btn => {
  btn.addEventListener('click', () => {
    const themeName = localStorage.getItem('selectedTheme') || 'default';
    applyTheme(themeName);
  });
});