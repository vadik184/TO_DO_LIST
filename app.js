let tasks = [];
// елементи DOM
const taskList = document.getElementById("task-list");
const form = document.getElementById("task-form");
const input = document.getElementById("task-input");

loadTasks(); // завантажуємо завдання з localStorage
// функція для рендерингу списку завдань
function render(task) {
  taskList.innerHTML = ""; // очищаємо список перед рендером
  tasks.forEach((task) => {
    const li = document.createElement("li"); // створюємо елемент списку

    const span = document.createElement("span"); // створюємо елемент для кнопки видалення
    span.textContent = task.text; // додаємо текст кнопки видалення
    if (task.completed) {
      span.style.textDecoration = "line-through";
    } // якщо завдання виконане, додаємо лінію через текст
    span.addEventListener("click", () => {
      startEdit(task.id, span);
    }); // додаємо обробник події для кнопки видалення
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
// функція для редагування завдання
function startEdit(id, spanElement) {
  const task = tasks.find((t) => t.id === id); // знаходимо завдання за id
  const editInput = document.createElement("input"); // створюємо інпут для редагування
  editInput.type = "text"; // встановлюємо тип інпуту
  editInput.value = task.text; // встановлюємо значення інпуту рівним тексту завдання
  spanElement.replaceWith(editInput); // замінюємо span на інпут
  editInput.focus(); // встановлюємо фокус на інпут

  function finishEdit() {
    const newText = editInput.value.trim(); // отримуємо новий текст завдання з інпуту, прибираємо зайві пробіли
    if (newText !== "") {
      updateTask(id, newText); // оновлюємо текст завдання
    } else {
      render();
    }
  } // якщо текст порожній, нічого не робимо
  editInput.addEventListener("blur", finishEdit); // додаємо обробник події для інпуту
  editInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      editInput.blur(); // викликаємо подію blur, щоб завершити редагування
    }
  });
}
// функція для оновлення тексту завдання
function updateTask(id, newText) {
  tasks = tasks.map((task) => {
    if (task.id === id) {
      return { ...task, text: newText }; // оновлюємо текст завдання
    }
    return task;
  });
  saveTasks();
  render();
}
// функція для зміни стану виконання завдання
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
// функція для видалення завдання
function deleteTask(id) {
  tasks = tasks.filter((task) => task.id !== id); // видаляємо завдання з масиву
  render(); // рендеримо оновлений список завдань
  saveTasks(); // зберігаємо оновлений масив завдань у localStorage
}
// функція для збереження завдань у localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); // зберігаємо масив завдань у localStorage
}
// функція для завантаження завдань з localStorage
function loadTasks() {
  const saved = localStorage.getItem("tasks"); // отримуємо масив завдань з localStorage
  if (saved) {
    tasks = JSON.parse(saved); // якщо є збережені завдання, парсимо їх у масив
  }
}
render();

// обробник події для форми
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
