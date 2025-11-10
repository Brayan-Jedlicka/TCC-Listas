import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { setupThemeSelector } from './theme.js';

const firebaseConfig = {
  apiKey: "AIzaSyD8OQuwipCvBS2-sJhaq_p49-TeTOLl1Fs",
  authDomain: "tcc-sobre-listas.firebaseapp.com",
  projectId: "tcc-sobre-listas",
  storageBucket: "tcc-sobre-listas.appspot.com",
  messagingSenderId: "620870328306",
  appId: "1:620870328306:web:9aa782e719265dd917556b",
  measurementId: "G-5P0Z9N8CTY"
};

if (!getApps().length) initializeApp(firebaseConfig);
const auth = getAuth();
const db = getFirestore();

const loginForm = document.getElementById('loginForm');
const registerBtn = document.getElementById('registerBtn');
const logoutBtn = document.getElementById('logoutBtn');
const errorMessage = document.getElementById('error-message');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = document.getElementById('loginBtnText');
const loginSpinner = document.getElementById('loginSpinner');

function showError(msg){ if (!errorMessage) return; errorMessage.textContent = msg; setTimeout(()=>{ if (errorMessage) errorMessage.textContent=''; },3500); }
function clearError(){ if (errorMessage) errorMessage.textContent = ''; }

async function ensureUserDoc(uid, email){
  const ref = doc(db, 'users', uid);
  try {
    await setDoc(ref, { email: email || null, lists: [] }, { merge: true });
  } catch(e){
  }
  return ref;
}

if (registerBtn) {
  registerBtn.addEventListener('click', async () => {
    clearError();
    const emailEl = document.querySelector('#loginForm input[name="email"]');
    const pwdEl = document.querySelector('#loginForm input[name="password"]');
    const email = emailEl ? emailEl.value.trim().toLowerCase() : '';
    const password = pwdEl ? pwdEl.value : '';
    if (!email || !password) { showError('Informe e‑mail e senha'); return; }
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await ensureUserDoc(cred.user.uid, email);
      showError('Conta criada com sucesso. Faça login.');
    } catch (err) {
      console.error(err);
      showError(err.code || err.message || 'Erro ao cadastrar');
    }
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearError();
    if (loginBtn) loginBtn.disabled = true;
    if (loginBtnText) loginBtnText.textContent = 'Entrando...';
    if (loginSpinner) loginSpinner.classList.remove('visually-hidden');
    const email = (loginForm.email.value || '').trim().toLowerCase();
    const password = (loginForm.password.value || '');
    if (!email || !password) { showError('Informe e‑mail e senha'); }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const p = location.pathname || '';
      if (p.endsWith('/index.html') || p.endsWith('/') || p.endsWith('\\')) {
        location.href = './dashboard.html';
      }
    } catch (err) {
      console.error(err);
      showError('E-mail ou senha incorretos');
    } finally {
      if (loginBtn) loginBtn.disabled = false;
      if (loginBtnText) loginBtnText.textContent = 'Entrar';
      if (loginSpinner) loginSpinner.classList.add('visually-hidden');
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', async (e) => {
    try { await signOut(auth); } catch(e){}
  });
}

onAuthStateChanged(auth, async (user) => {
  try { setupThemeSelector(); } catch(e){}
  if (user) {
    const p = location.pathname || '';
    if (p.endsWith('/index.html') || p.endsWith('/') || p.endsWith('\\')) {
      location.href = './dashboard.html';
    }
  }
});
