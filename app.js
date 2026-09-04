let tasks = [];
// елементи DOM
const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");

loadTasks(); // завантажуємо завдання з localStorage
// рендер завдань у список
function render(task) {
  taskList.innerHTML = ""; // очищаємо список перед рендером
  tasks.forEach((task) => {
    const li = document.createElement("li"); // створюємо елемент списку

    const span = document.createElement("span"); // створюємо елемент для кнопки видалення
    span.textContent = task.text; // додаємо текст кнопки видалення
    if (task.completed) {
      span.style.textDecoration = "line-through";
    } // якщо завдання виконане, додаємо лінію через текст

    const doneBtn = document.createElement("button"); // створюємо кнопку "Виконано"
    doneBtn.textContent = "✔";
    doneBtn.addEventListener("click", () => toggleCompleted(task.id)); // додаємо обробник події для кнопки "Виконано"

    const deleteBtn = document.createElement("button"); // створюємо кнопку "Видалити"
    deleteBtn.textContent = "❌";
    deleteBtn.addEventListener("click", () => deleteTask(task.id)); // додаємо обробник події для кнопки "Видалити"

    li.appendChild(span);
    li.appendChild(doneBtn); // додаємо кнопку "Виконано" до елемента списку
    li.appendChild(deleteBtn); // додаємо кнопку "Видалити" до елемента списку

    taskList.appendChild(li); // додаємо елемент у список
  });
}

function toggleCompleted(id) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, completed: !task.completed }; // змінюємо стан виконання завдання
    }
    return task;
  });
  render(); // рендеримо оновлений список завдань
  saveTasks(); // зберігаємо оновлений масив завдань у localStorage
}

function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id); // видаляємо завдання з масиву
  render(); // рендеримо оновлений список завдань
  saveTasks(); // зберігаємо оновлений масив завдань у localStorage
}
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); // зберігаємо масив завдань у localStorage
}
function loadTasks() {
  const saved = localStorage.getItem("tasks"); // отримуємо масив завдань з localStorage
  if (saved) {
    tasks = JSON.parse(saved); // якщо є збережені завдання, парсимо їх у масив
  }
}
render();

// обробка форми
form.addEventListener("submit", function (event) {
  event.preventDefault(); // запобігаємо перезавантаженню сторінки
  const text = input.value.trim(); // отримуємо текст завдання з інпуту, прибираємо зайві пробіли
  if (text === "") return; // якщо текст порожній, нічого не робимо
  const newTask = { id: Date.now(), text: text, completed: false }; // створюємо нове завдання
  tasks.push(newTask); // додаємо його до масиву завдань
  saveTasks(); // зберігаємо оновлений масив завдань у localStorage
  input.value = ""; // очищаємо інпут
  render(); // рендеримо оновлений список завдань
});
