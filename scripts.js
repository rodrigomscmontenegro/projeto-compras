const form = document.getElementById('add-item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('shopping-list');
const alertBox = document.getElementById('alert-message');
const closeAlert = document.getElementById('close-alert');

function createItem(text) {
    const li = document.createElement('li');
    li.className = 'item';

    li.innerHTML = `
        <div class="item-left">
            <input type="checkbox" class="checkbox">
            <span>${text}</span>
        </div>
        <button class="btn-delete">
            <img src="./assets/Frame.png" alt="Excluir">
        </button>
    `;

    // Evento de marcar como concluído
    li.querySelector('.checkbox').onclick = (e) => {
        li.style.opacity = e.target.checked ? "0.5" : "1";
        li.querySelector('span').style.textDecoration = e.target.checked ? "line-through" : "none";
    };

    // Evento de deletar (Aqui ativa o alerta)
    li.querySelector('.btn-delete').onclick = () => {
        li.remove();
        showAlert();
    };

    list.appendChild(li);
}

function showAlert() {
    alertBox.classList.remove('hidden');
    // Esconde o alerta após 3 segundos
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 3000);
}

// Fechar alerta no botão X
closeAlert.onclick = () => {
    alertBox.classList.add('hidden');
};

// Captura tanto o clique no botão quanto o Enter no teclado
form.addEventListener('submit', (e) => {
    e.preventDefault(); // Impede o recarregamento da página

    const value = input.value.trim();

    if (value !== "") {
        createItem(value);
        input.value = ""; // Limpa o campo
        input.focus();    // Mantém o cursor no campo
    }
});

// Itens sugeridos para iniciar
["Pão de forma", "Café preto", "Suco de laranja", "Bolacha"].forEach(createItem);