document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const errorMessage = document.getElementById("error-message");

  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirm-password").value.trim();

    const validUsername = "admin";
    const validPassword = "12345";
    const validEmail = "admin@gmail.com";

    if (!validateEmail(email)) {
      errorMessage.textContent = "E-mail inválido.";
      return;
    }

    if (password !== confirmPassword) {
      errorMessage.textContent = "As senhas não coincidem.";
      return;
    }

    if (username === validUsername && password === validPassword && email === validEmail) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", username);
      localStorage.setItem("email", email);
      window.location.href = "dashboard.html";
    } else {
      errorMessage.textContent = "Usuário, senha ou e-mail inválidos.";
    }
  });

  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }
});
