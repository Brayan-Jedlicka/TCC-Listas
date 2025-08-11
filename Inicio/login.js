import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDtmKoHh11sMKbbCCR9qxjAQn-Uj8Cw0Sk",
  authDomain: "login-do-tcc-listas.firebaseapp.com",
  projectId: "login-do-tcc-listas",
  storageBucket: "login-do-tcc-listas.firebasestorage.app",
  messagingSenderId: "132085348546",
  appId: "1:132085348546:web:6e9012d7a8977e19f0a35b",
  measurementId: "G-6GBYZDP2PQ"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const loginForm = document.getElementById('loginForm');
const errorMessage = document.getElementById('error-message');
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');

function showAlert(message, type = 'info') {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
  errorMessage.style.color = type === 'error' ? '#d32f2f' : '#388e3c';
  setTimeout(() => {
    errorMessage.style.display = 'none';
  }, 4000);
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);s
    if (!userCredential.user.emailVerified) {
      showAlert('Por favor, verifique seu e-mail antes de entrar.', 'error');
      return;
    }
    showAlert('Login realizado com sucesso!', 'success');
    
  } catch (error) {
    showAlert('Erro ao fazer login: ' + error.message, 'error');
  }
});

registerBtn.addEventListener('click', async (e) => {
  e.preventDefault(); // Adicione esta linha
  const email = loginForm.email.value;
  const password = loginForm.password.value;

  if (!email || !password) {
    showAlert('Preencha e-mail e senha para cadastrar.', 'error');
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(userCredential.user);
    showAlert('Conta criada! Verifique seu e-mail para ativar a conta.', 'success');
  } catch (error) {
    showAlert('Erro ao cadastrar: ' + error.message, 'error');
  }
});
