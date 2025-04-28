function adicionarItem(lista) {
  let inputTexto;
  let inputData;

  switch (lista) {
    case 'tarefas':
      inputTexto = document.getElementById('nova-tarefa');
      inputData = document.getElementById('data-tarefa');
      break;
    case 'compras':
      inputTexto = document.getElementById('novo-item');
      inputData = document.getElementById('data-compra');
      break;
    case 'metas':
      inputTexto = document.getElementById('nova-meta');
      inputData = document.getElementById('data-meta');
      break;
    case 'ideias':
      inputTexto = document.getElementById('nova-ideia');
      inputData = document.getElementById('data-ideia');
      break;
  }

  const texto = inputTexto.value;
  const data = inputData.value;

  if (texto && data) {
   
    const li = document.createElement('li');
    li.innerHTML = `
      <span>${texto} - ${data}</span>
      <button onclick="removerItem(this)">Remover</button>
    `;

    const ul = document.getElementById(`${lista}-list`);
    ul.appendChild(li);

    
    inputTexto.value = '';
    inputData.value = '';
  } else {
    alert('Por favor, preencha todos os campos.');
  }
}

function removerItem(button) {
  const li = button.parentElement;
  li.remove();
}

document.getElementById("btnVoltar").addEventListener("click", function() {
  window.location.href = "dashboard.html";
});
