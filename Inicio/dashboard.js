if (!localStorage.getItem("isLoggedIn")) {
  window.location.href = "index.html";
}

document.getElementById("logoutButton").addEventListener("click", function() {
  if (confirm("Tem certeza que deseja sair?")) {
    localStorage.removeItem("isLoggedIn");
    window.location.href = "index.html";
  }
});

function aplicarTema(tema) {
  const root = document.documentElement;

  switch (tema) {
    case "default":
      root.style.setProperty('--bg-color', '#faf3f3');
      root.style.setProperty('--primary-color', '#a8d8ea');
      root.style.setProperty('--text-color', '#555');
      root.style.setProperty('--card-bg', '#ffffff');
      break;

    case "dark":
      root.style.setProperty('--bg-color', '#1e1e1e');
      root.style.setProperty('--primary-color', '#4e4e4eff');
      root.style.setProperty('--text-color', '#808080ff');
      root.style.setProperty('--card-bg', '#2b2b2b');
      break;

    case "pastel":
      root.style.setProperty('--bg-color', '#fef6e4');
      root.style.setProperty('--primary-color', '#f3d2c1');
      root.style.setProperty('--text-color', '#001a61ff');
      root.style.setProperty('--card-bg', '#ffffff');
      break;

    case "mint":
      root.style.setProperty('--bg-color', '#e0f7f4');
      root.style.setProperty('--primary-color', '#5ed1b3');
      root.style.setProperty('--text-color', '#333');
      root.style.setProperty('--card-bg', '#ffffff');
      break;

    case "lavender":
      root.style.setProperty('--bg-color', '#f3f0ff');
      root.style.setProperty('--primary-color', '#b39ddb');
      root.style.setProperty('--text-color', '#444');
      root.style.setProperty('--card-bg', '#ffffff');
      break;

    default:
      console.warn('Tema não encontrado.');
  }
}

document.getElementById("themeSelector").addEventListener("change", function() {
  const temaSelecionado = this.value;
  aplicarTema(temaSelecionado);
});

const temaSalvo = localStorage.getItem("temaSelecionado");
if (temaSalvo) {
  document.getElementById("themeSelector").value = temaSalvo;
  aplicarTema(temaSalvo);
}

document.getElementById("themeSelector").addEventListener("change", function() {
  const temaSelecionado = this.value;
  aplicarTema(temaSelecionado);
  localStorage.setItem("temaSelecionado", temaSelecionado);
});