import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const auth = getAuth();

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("error-message");
  const loginBtn = document.getElementById("loginBtn");
  const registerBtn = document.getElementById("registerBtn");

  // Login
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        localStorage.setItem("isLoggedIn", "true");
        window.location.href = "dashboard.html";
      })
      .catch((error) => {
        errorMessage.textContent = "Erro ao logar: " + error.message;
      });
  });

  // Cadastro
  registerBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        errorMessage.textContent = "Cadastro realizado com sucesso! Faça login.";
      })
      .catch((error) => {
        errorMessage.textContent = "Erro ao cadastrar: " + error.message;
      });
  });
});
