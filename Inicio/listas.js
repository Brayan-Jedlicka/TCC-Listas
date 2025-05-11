function getListaKey(lista) {
  return `lista-${lista}`;
}

function salvarLista(lista) {
  const ul = document.getElementById(`${lista}-list`);
  const itens = [];
  ul.querySelectorAll('li').forEach(li => {
    const textoData = li.querySelector('span').innerText;
    itens.push(textoData);
  });
  localStorage.setItem(getListaKey(lista), JSON.stringify(itens));
}

function carregarLista(lista) {
  const ul = document.getElementById(`${lista}-list`);
  ul.innerHTML = "";
  const dadosSalvos = localStorage.getItem(getListaKey(lista));
  if (dadosSalvos) {
    const itens = JSON.parse(dadosSalvos);
    itens.forEach(item => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>${item}</span>
        <button onclick="removerItem(this, '${lista}')">Remover</button>
      `;
      ul.appendChild(li);
    });
  }
}

function adicionarItem(lista) {
  const inputTexto = document.getElementById('novoItem');
  const inputData = document.getElementById('dataSelecionada');

  const texto = inputTexto.value.trim();
  const data = inputData.value;

  if (texto && data) {
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${texto} - ${data}</span>
      <button onclick="removerItem(this, '${lista}')">Remover</button>
    `;
    document.getElementById(`${lista}-list`).appendChild(li);

    inputTexto.value = '';
    inputData.value = '';

    salvarLista(lista);
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}

function removerItem(button, lista) {
  const li = button.parentElement;
  li.remove();
  salvarLista(lista);
}

document.addEventListener("DOMContentLoaded", () => {
  const listaId = document.querySelector("section.lista").id;
  carregarLista(listaId);

  document.getElementById("adicionarItem").addEventListener("click", () => {
    adicionarItem(listaId);
  });

  const voltarBtn = document.getElementById("btnVoltar");
  if (voltarBtn) {
    voltarBtn.addEventListener("click", function () {
      window.location.href = "dashboard.html";
    });
  }
});
