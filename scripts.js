const form = document.getElementById('add-item-form');
const input = document.getElementById('item-input');
const list = document.getElementById('shopping-list');
const alertBox = document.getElementById('alert-message');
const closeAlert = document.getElementById('close-alert');
const stats = document.getElementById('stats');

function saveItems() {
    const items = [];
    list.querySelectorAll('.item').forEach(li => {
        const text = li.querySelector('span').textContent;
        const checked = li.querySelector('.checkbox').checked;
        items.push({text, checked});
    });
    localStorage.setItem('quicklist', JSON.stringify(items));
}

function loadItems() {
    const saved = localStorage.getItem('quicklist');
    if (saved) {
        JSON.parse(saved).forEach(item => {
            createItem(item.text);
            const li = list.lastElementChild;
            const checkbox = li.querySelector('.checkbox');
            if (item.checked) {
                checkbox.checked = true;
                li.classList.add('completed');
            }
        });
    } else {
        ["Pão de forma", "Café preto", "Suco de laranja"].forEach(createItem);
    }
    updateStats();
}

function updateStats() {
    const pending = list.querySelectorAll('.item:not(.completed)').length;
    stats.textContent = `Pendentes: ${pending}`;
}

function createItem(text) {
    const li = document.createElement('li');
    li.className = 'item sortable';
    li.draggable = true;
    li.role = 'listitem';

    li.innerHTML = `
        <div class="item-left">
            <input type="checkbox" class="checkbox" aria-label="Marcar como comprado">
            <span>${text}</span>
        </div>
        <button class="btn-delete" aria-label="Remover item">
            <img src="./assets/Frame.png" alt="Excluir">
        </button>
    `;

    // Checkbox
    const checkbox = li.querySelector('.checkbox');
    checkbox.onclick = (e) => {
        if (e.target.checked) {
            li.classList.add('completed');
        } else {
            li.classList.remove('completed');
        }
        saveItems();
        updateStats();
    };

    // Delete
    li.querySelector('.btn-delete').onclick = () => {
        li.remove();
        saveItems();
        updateStats();
        showAlert();
    };

    list.appendChild(li);
    saveItems();
    updateStats();
}

function showAlert() {
    alertBox.classList.remove('hidden');
    setTimeout(() => {
        alertBox.classList.add('hidden');
    }, 3000);
}

closeAlert.onclick = () => {
    alertBox.classList.add('hidden');
};

// Drag & Drop
list.addEventListener('dragstart', e => {
    e.target.classList.add('dragging');
});
list.addEventListener('dragend', e => {
    e.target.classList.remove('dragging');
    saveItems();
});
list.addEventListener('dragover', e => e.preventDefault());
list.addEventListener('drop', e => {
    e.preventDefault();
    const dragging = list.querySelector('.dragging');
    const afterElement = getDragAfterElement(list, e.clientY);
    if (afterElement == null) {
        list.appendChild(dragging);
    } else {
        list.insertBefore(dragging, afterElement);
    }
    saveItems();
});

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.sortable:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

// Form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();
    if (value !== "") {
        createItem(value);
        input.value = "";
        input.focus();
    }
});

// Inicializar
loadItems();