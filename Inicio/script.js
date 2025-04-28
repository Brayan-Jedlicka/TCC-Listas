document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault();


  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  const validUsername = "admin";
  const validPassword = "12345";

  const errorMessage = document.getElementById("error-message");

  if (username === validUsername && password === validPassword) {
    
    localStorage.setItem("isLoggedIn", "true");

    window.location.href = "dashboard.html";
  } else {
    errorMessage.textContent = "Usuário ou senha inválidos.";
  }
});
