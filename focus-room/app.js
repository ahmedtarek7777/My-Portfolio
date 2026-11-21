let data = load("focus-room", { tasks: [], log: [] }),
  mode = "focus",
  remaining = 1500,
  end = 0,
  running = false,
  tick = null,
  count = 0;
function duration() {
  return Math.max(1, Math.min(180, +$("#" + mode + "Min").value || 1)) * 60;
}
function display() {
  let mins = Math.floor(remaining / 60),
    sec = remaining % 60;
  $("#clock").textContent =
    String(mins).padStart(2, "0") + ":" + String(sec).padStart(2, "0");
  document.title = $("#clock").textContent + " / Focus Room";
  $("#start").textContent = running ? "Pause" : "Start session";
  $("#sessionCount").textContent = count + " focus sessions this visit";
}
function stop() {
  clearInterval(tick);
  running = false;
  display();
}
function phase(m) {
  stop();
  mode = m;
  remaining = duration();
  $$("[data-mode]").forEach((b) =>
    b.classList.toggle("active", b.dataset.mode === mode),
  );
  display();
}
function render() {
  save("focus-room", data);
  $("#tasks").innerHTML = data.tasks
    .map(
      (t, i) =>
        `<div class="item row"><span>${esc(t)}</span><div class="actions"><button data-focus="${i}">Focus</button><button data-del="${i}" aria-label="Complete task">✓</button></div></div>`,
    )
    .join("");
  $$("[data-focus]").forEach(
    (b) =>
      (b.onclick = () =>
        ($("#current").textContent = data.tasks[+b.dataset.focus])),
  );
  $$("[data-del]").forEach(
    (b) =>
      (b.onclick = () => {
        data.tasks.splice(+b.dataset.del, 1);
        render();
      }),
  );
  $("#log").innerHTML =
    data.log
      .slice()
      .reverse()
      .slice(0, 20)
      .map(
        (l) =>
          `<div class="item row"><span>${esc(l.task)}</span><small>${esc(l.date)} · ${l.minutes} min</small></div>`,
      )
      .join("") || "<p>Your completed focus sessions will appear here.</p>";
}
$("#start").onclick = () => {
  if (running) {
    remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
    stop();
    return;
  }
  end = Date.now() + remaining * 1000;
  running = true;
  display();
  tick = setInterval(() => {
    remaining = Math.max(0, Math.ceil((end - Date.now()) / 1000));
    display();
    if (!remaining) {
      stop();
      if (mode === "focus") {
        count++;
        data.log.push({
          task: $("#current").textContent,
          date: new Date().toLocaleString(),
          minutes: +$("#focusMin").value,
        });
        render();
        toast("Focus complete. Time for a break.");
        phase(count % 4 === 0 ? "long" : "short");
      } else {
        toast("Break complete. Ready to focus?");
        phase("focus");
      }
    }
  }, 250);
};
$("#reset").onclick = () => phase(mode);
$("#skip").onclick = () => phase(mode === "focus" ? "short" : "focus");
$$("[data-mode]").forEach((b) => (b.onclick = () => phase(b.dataset.mode)));
$("#add").onsubmit = (e) => {
  e.preventDefault();
  if (!$("#task").value.trim()) return;
  data.tasks.push($("#task").value.trim());
  $("#task").value = "";
  render();
};
render();
display();
