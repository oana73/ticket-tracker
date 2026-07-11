const API = "http://localhost:8082/api/tasks";

async function loadTasks() {
    const response = await fetch(API);
    const tasks = await response.json();

    const list = document.getElementById("taskList");
    list.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.textContent = task.title + " — " + task.status + " — user: " + task.assignedUserId;
        list.appendChild(li);
    });
}

async function createTask() {
    const task = {
        title: document.getElementById("title").value,
        assignedUserId: document.getElementById("assignedUserId").value
    };

    const response = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task)
    });

    if (!response.ok) {
        alert("Eroare: userul nu există.");
        return;
    }

    loadTasks();
}

loadTasks();