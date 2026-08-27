const storageKey = "daymark-tasks";
const today = new Date().toISOString().slice(0, 10);
const starterTasks = [
  { id: 1, title: "Review weekly analytics dashboard", priority: "high", due: today, done: false },
  { id: 2, title: "Outline ideas for next newsletter", priority: "normal", due: today, done: false },
  { id: 3, title: "Book a focus block for Friday", priority: "low", due: "", done: true }
];
let tasks = JSON.parse(localStorage.getItem(storageKey)) || starterTasks;
let currentFilter = "all";

const elements = {
  list: document.querySelector("#task-list"), empty: document.querySelector("#empty-state"), form: document.querySelector("#task-form"), input: document.querySelector("#task-input"), priority: document.querySelector("#priority-input"), due: document.querySelector("#date-input"), search: document.querySelector("#search-input")
};

function save() { localStorage.setItem(storageKey, JSON.stringify(tasks)); }
function formatDate(value) { if (!value) return "No due date"; if (value === today) return "Today"; return new Date(`${value}T12:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric" }); }
function visibleTasks() {
  const query = elements.search.value.trim().toLowerCase();
  return tasks.filter(task => {
    const matchesFilter = currentFilter === "all" || (currentFilter === "today" && task.due === today && !task.done) || (currentFilter === "upcoming" && task.due > today && !task.done) || (currentFilter === "completed" && task.done);
    return matchesFilter && task.title.toLowerCase().includes(query);
  });
}
function render() {
  const visible = visibleTasks();
  elements.list.innerHTML = visible.map((task, index) => `<article class="task ${task.done ? "done" : ""}" style="animation-delay:${index * 35}ms"><input class="check" type="checkbox" ${task.done ? "checked" : ""} data-action="toggle" data-id="${task.id}" aria-label="Mark ${task.title} complete"><div class="task-copy"><p class="task-title">${escapeHtml(task.title)}</p><div class="task-meta"><span class="priority priority-${task.priority}">${task.priority}</span><span>${formatDate(task.due)}</span></div></div><button class="delete-button" type="button" data-action="delete" data-id="${task.id}" aria-label="Delete ${escapeHtml(task.title)}">×</button></article>`).join("");
  elements.empty.hidden = visible.length !== 0;
  updateSummary();
}
function updateSummary() {
  const open = tasks.filter(task => !task.done).length;
  const completed = tasks.filter(task => task.done).length;
  const dueToday = tasks.filter(task => task.due === today && !task.done).length;
  const completion = tasks.length ? Math.round(completed / tasks.length * 100) : 0;
  document.querySelector("#open-total").textContent = open;
  document.querySelector("#due-total").textContent = dueToday;
  document.querySelector("#completion-total").textContent = `${completion}%`;
  document.querySelector("#all-count").textContent = open;
  document.querySelector("#today-count").textContent = dueToday;
  document.querySelector("#upcoming-count").textContent = tasks.filter(task => task.due > today && !task.done).length;
  document.querySelector("#completed-count").textContent = completed;
  document.querySelector("#progress-copy").textContent = `${completion}% complete`;
  document.querySelector("#progress-bar").style.width = `${completion}%`;
}
function escapeHtml(text) { const div = document.createElement("div"); div.textContent = text; return div.innerHTML; }

elements.form.addEventListener("submit", event => { event.preventDefault(); const title = elements.input.value.trim(); if (!title) return; tasks.unshift({ id: Date.now(), title, priority: elements.priority.value, due: elements.due.value, done: false }); save(); elements.form.reset(); render(); elements.input.focus(); });
elements.list.addEventListener("click", event => { const target = event.target.closest("[data-action]"); if (!target) return; const id = Number(target.dataset.id); if (target.dataset.action === "delete") tasks = tasks.filter(task => task.id !== id); if (target.dataset.action === "toggle") { const task = tasks.find(item => item.id === id); task.done = !task.done; } save(); render(); });
elements.search.addEventListener("input", render);
document.querySelectorAll(".nav-item, .top-nav-link").forEach(button => button.addEventListener("click", () => { currentFilter = button.dataset.filter; document.querySelectorAll(".nav-item, .top-nav-link").forEach(item => item.classList.toggle("active", item.dataset.filter === currentFilter)); document.querySelector("#view-title").textContent = currentFilter === "all" ? "All tasks" : button.textContent.replace(/\d+$/, "").trim(); render(); }));
document.querySelector("#clear-completed").addEventListener("click", () => { tasks = tasks.filter(task => !task.done); save(); render(); });
document.querySelector("#nav-new-task").addEventListener("click", () => { elements.input.focus(); elements.input.scrollIntoView({ behavior: "smooth", block: "center" }); });
document.querySelector("#date-label").textContent = new Date().toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });
render();