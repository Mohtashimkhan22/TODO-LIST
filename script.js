const input = document.querySelector(".todo-input");
const addButton = document.querySelector(".add-button");
const todosHtml = document.querySelector(".todos");
const emptyImage = document.querySelector(".empty-image");
const filters = document.querySelectorAll(".filter");
const deleteAllButton = document.querySelector(".delete-all-button");

let todosJson = JSON.parse(localStorage.getItem("todos")) || [];
let filter = 'all'; // To store the current filter

showTodos();

function getTodoHtml(todo, index) {
    let checked = todo.status === "completed" ? "checked" : "";

    return `
        <li class="todo">
            <label for="${index}">
                <input id="${index}" onclick="updateStatus(this)" type="checkbox" ${checked}>
                <span class="${checked}">${todo.name}</span>
            </label>
            <button class="delete-btn" data-index="${index}" onclick="remove(this)"><i class="fa fa-times"></i></button>
        </li>`;
}

function showTodos() {
    let filteredTodos = todosJson;
    if (filter === 'completed') {
        filteredTodos = todosJson.filter(todo => todo.status === 'completed');
    } else if (filter === 'pending') {
        filteredTodos = todosJson.filter(todo => todo.status === 'pending');
    }

    if (filteredTodos.length === 0) {
        todosHtml.innerHTML = '';
        emptyImage.style.display = 'block';
    } else {
        todosHtml.innerHTML = filteredTodos.map(getTodoHtml).join('');
        emptyImage.style.display = 'none';
    }
}

function addTodo(todo) {
    input.value = "";
    todosJson.push({ name: todo, status: "pending" });
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
}

addButton.addEventListener("click", () => {
    let todo = input.value.trim();
    if (!todo) {
        return;
    }
    addTodo(todo);
});

input.addEventListener("keyup", (e) => {
    let todo = input.value.trim();
    if (!todo || e.key !== "Enter") {
        return;
    }
    addTodo(todo);
});

function updateStatus(todo) {
    let todoName = todo.parentElement.querySelector("span");
    if (todo.checked) {
        todoName.classList.add("checked");
        todosJson[todo.id].status = "completed";
    } else {
        todoName.classList.remove("checked");
        todosJson[todo.id].status = "pending";
    }
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
}

function remove(todo) {
    const index = todo.dataset.index;
    todosJson.splice(index, 1);
    showTodos();
    localStorage.setItem("todos", JSON.stringify(todosJson));
}

filters.forEach(function (el) {
    el.addEventListener("click", (e) => {
        filters.forEach(tag => tag.classList.remove('active'));
        el.classList.add('active');
        filter = e.target.dataset.filter;
        showTodos();
    });
});

deleteAllButton.addEventListener("click", () => {
    todosJson = [];
    localStorage.setItem("todos", JSON.stringify(todosJson));
    showTodos();
});
