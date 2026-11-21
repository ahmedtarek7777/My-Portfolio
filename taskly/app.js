const KEY = "taskly-tasks",
  THEME = "taskly-theme";
let tasks = JSON.parse(localStorage.getItem(KEY) || "[]");
let filter = "all";

const $ = (s) => document.querySelector(s);
const list = $("#list"),
  empty = $("#empty");

function save() {
  localStorage.setItem(KEY, JSON.stringify(tasks));
}

function applyTheme() {
  const dark = localStorage.getItem(THEME) === "dark";
  document.body.classList.toggle("dark", dark);
  $("#theme").textContent = dark ? "☀️" : "🌙";
}
$("#theme").onclick = () => {
  localStorage.setItem(
    THEME,
    document.body.classList.contains("dark") ? "light" : "dark",
  );
  applyTheme();
};

function visible() {
  if (filter === "active") return tasks.filter((t) => !t.done);
  if (filter === "done") return tasks.filter((t) => t.done);
  return tasks;
}

function render() {
  const vis = visible();
  list.innerHTML = "";
  empty.style.display = vis.length ? "none" : "block";
  $("#leftCount").textContent = `${tasks.filter((t) => !t.done).length} left`;

  vis.forEach((t) => {
    const li = document.createElement("li");
    li.className = "item" + (t.done ? " done" : "");
    li.draggable = true;
    li.dataset.id = t.id;
    li.innerHTML = `
      <span class="check">${t.done ? "✓" : ""}</span>
      <span class="txt"></span>
      <span class="tag ${t.tag}">${t.tag}</span>
      <button class="del" aria-label="Delete">✕</button>`;
    li.querySelector(".txt").textContent = t.text;
    li.querySelector(".check").onclick = () => {
      t.done = !t.done;
      save();
      render();
    };
    li.querySelector(".del").onclick = () => {
      tasks = tasks.filter((x) => x.id !== t.id);
      save();
      render();
    };
    li.querySelector(".txt").ondblclick = () => {
      const next = prompt("Edit task", t.text);
      if (next && next.trim()) {
        t.text = next.trim();
        save();
        render();
      }
    };
    li.ondragstart = (e) => {
      li.classList.add("dragging");
      e.dataTransfer.setData("text/plain", t.id);
    };
    li.ondragend = () => li.classList.remove("dragging");
    li.ondragover = (e) => e.preventDefault();
    li.ondrop = (e) => {
      e.preventDefault();
      const draggedId = e.dataTransfer.getData("text/plain");
      const from = tasks.findIndex((x) => x.id === draggedId);
      const to = tasks.findIndex((x) => x.id === t.id);
      if (from < 0 || to < 0 || from === to) return;
      const [moved] = tasks.splice(from, 1);
      tasks.splice(to, 0, moved);
      save();
      render();
    };
    list.appendChild(li);
  });
}

$("#addForm").onsubmit = (e) => {
  e.preventDefault();
  const text = $("#newTask").value.trim();
  if (!text) return;
  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    tag: $("#newTag").value,
    done: false,
  });
  $("#newTask").value = "";
  save();
  render();
};

document.querySelectorAll(".filters button").forEach((b) => {
  b.onclick = () => {
    filter = b.dataset.f;
    document
      .querySelectorAll(".filters button")
      .forEach((x) => x.classList.toggle("active", x === b));
    render();
  };
});

$("#clearDone").onclick = () => {
  tasks = tasks.filter((t) => !t.done);
  save();
  render();
};

applyTheme();
render();
