const API_URL = "/api/tasks";

let currentEditId = null;
let currentFilter = "all";
let currentSort = "";

const taskForm = document.querySelector("#taskForm");
const taskTitle = document.querySelector("#taskTitle");
const taskDescription = document.querySelector("#taskDescription");
const taskPriority = document.querySelector("#taskPriority");
const taskDate = document.querySelector("#taskDate");
const taskList = document.querySelector("#tasksList");
const emptyState = document.querySelector("#emptyState");
const submitBtnText = document.querySelector("#submitBtnText");
const cancelEditBtn = document.querySelector("#cancelEditBtn");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortSelctionButton = document.querySelector(".sortSelctionButton");

//ініціалізація

document.addEventListener("DOMContentLoaded", () => {
    setDefaultDate();
    loadTasks();
    setupEventListeners();
});

function setDefaultDate() {
    const today = new Date().toISOString().split("T")[0];
    taskDate.value = today;
}

function setupEventListeners() {
    taskForm.addEventListener("submit", handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();

    const taskData = {
        title: taskTitle.value,
        description: taskDescription.value.trim(),
        priority: taskPriority.value,
        data: taskDate.value,
    };

    if (currentEditId) {
        await updatedTask(currentEditId, taskData);
    } else {
        await createTask(taskData);
    }

    // добавити перевірку чи таска редагується
    await createTask(taskData);
}

async function createTask(taskData) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });

        const result = await response.json();

        if (result.success) {
            showToaps();
            showToaps(result.message, "success");
            resetForm();
            loadTasks();
        } else {
        }
    } catch (err) {
        console.error("Помилка створення", err);
        showToaps("Помилка з сервером", "error");
    }
}

sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    loadTasks();
});

async function loadTasks() {
    try {
        let url = API_URL;
        const params = new URLSearchParams();
        if (currentFilter !== "all") {
            params.append("priority", currentFilter);
        }
        if (currentSort) {
            params.append("sortBy", currentSort);
        }
        if (params.toString()) {
            url = `?${params.toString()}`;
        }

        const response = await fetch(url);
        const result = await response.json();
        console.log(result);

        if (result.success) {
            displayTasks(result.tasks);
        } else {
            showToaps("Помила завантаження ", "error");
        }
    } catch (err) {
        console.log("Помилка завантаження завдань", err);
        showToaps("Помилка зєднання з сервером", "error");
    }
}

function displayTasks(tasks) {
    taskList.innerHTML = "";

    if (taskDate.length === 0) {
        emptyState.style.display = "block";
        taskList.appendChild(emptyState);
        return;
    }

    emptyState.style.display = "none";

    tasks.forEach((task) => {
        const taskCard = createTaskCard(task);
        taskList.appendChild(taskCard);
    });
}

function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = `task-card priority-${task.priority}`;
    card.innerHTML = `
                            
                    <div class="task-header">
                        <div>
                            <h3 class="task-title">${task.title}</h3>
                            <span class="task-priority priority-${task.priority}">${task.priority}</span>
                        </div>
                    </div>
                    <p class="task-description">${task.description}</p>
                    <div class="task-meta">
                        <div class="task-data">
                            <span>Дата: ${task.data}</span>
                        </div>
                        <div class="task-data">
                            <span>Створено: ${task.createdAt}</span>
                        </div>
                    </div>
                    <div class="task-actions">
                        <button class="btn-edit" onclick = "editTask('${task._id}')">Редагувати</button>
                        <button class="btn-delete" onclick = "deleteTask('${task._id}')">Видалити</button>
                    </div>

    `;

    return card;
}

async function editTask(id) {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();

        if (result.success) {
            const task = result.tasks.find((t) => t._id === id);
            if (task) {
                currentEditId = id;
                taskTitle.value = task.title;
                taskDescription.value = task.description || " ";
                taskPriority.value = task.priority;
                taskDate.value = task.data;

                submitBtnText.textContent = "Зберегти зміни";
                cancelEditBtn.style.display = "inline-block";

                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        }
    } catch (err) {
        console.log("Помилка редагування ", err);
    }
}

async function updatedTask(id, taskData) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(taskData),
        });

        const result = await response.json();

        if (result.success) {
            showToaps(result.message, "success");
            loadTasks();
            //resetForm()
        } else {
            showToaps(result.message || "Помилка оновлення", "error");
        }
    } catch (err) {}
}

async function deleteTask(id) {
    if (!confirm("Ви впевнені що хочете видалити завдання?")) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });

        const result = await response.json();

        if (result.success) {
            showToaps(result.message, "success");
            loadTasks();
        } else {
            showToaps(result.message || "Помилка видалення", "error");
        }
    } catch (e) {
        console.error("Помилка видалення завдання", err);
        showToaps("Помилка з'єднання з сервером", "error");
    }
}

window.editTask = editTask;
window.deleteTask = deleteTask;

function resetForm() {
    currentEditId = null;
    taskForm.reset();
    setDefaultDate();
    submitBtnText.textContent = "Додати завдання";
    cancelEditBtn.style.display = "none";
}

function showToaps(message, type = "success") {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b, classList.remove("active"));

        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        loadTasks();
    });
});
