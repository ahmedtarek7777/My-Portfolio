let tasks = load("flow-board", [
  {
    id: 1,
    title: "Sketch the new dashboard",
    priority: "High",
    due: "",
    status: 0,
  },
  {
    id: 2,
    title: "Build responsive components",
    priority: "Normal",
    due: "",
    status: 1,
  },
  {
    id: 3,
    title: "Define project goals",
    priority: "Normal",
    due: "",
    status: 2,
  },
]);
function render() {
  save("flow-board", tasks);
  $("#board").innerHTML = ["Backlog", "In progress", "Complete"]
    .map(
      (name, col) =>
        `<section class="panel" data-col="${col}"><h2>${name} <span class="pill">${tasks.filter((t) => t.status === col).length}</span></h2>${
          tasks
            .filter(
              (t) =>
                t.status === col &&
                t.title
                  .toLowerCase()
                  .includes($("#search").value.toLowerCase()),
            )
            .map(
              (t) =>
                `<article draggable="true" data-id="${t.id}" class="panel" style="margin-bottom:14px;background:var(--bg)"><span class="pill">${esc(t.priority)}</span><h3>${esc(t.title)}</h3><p>${t.due ? esc(t.due) : "No due date"}</p><div class="actions"><select data-move="${t.id}" aria-label="Move ${esc(t.title)}">${["Backlog", "In progress", "Complete"].map((x, i) => `<option value="${i}" ${i === col ? "selected" : ""}>${x}</option>`).join("")}</select><button data-del="${t.id}" aria-label="Delete ${esc(t.title)}">×</button></div></article>`,
            )
            .join("") || "<p>Nothing here yet.</p>"
        }</section>`,
    )
    .join("");
  $$("[data-move]").forEach(
    (x) =>
      (x.onchange = () => {
        tasks.find((t) => t.id === +x.dataset.move).status = +x.value;
        render();
      }),
  );
  $$("[data-del]").forEach(
    (x) =>
      (x.onclick = () => {
        tasks = tasks.filter((t) => t.id !== +x.dataset.del);
        render();
      }),
  );
  $$("[draggable]").forEach(
    (x) =>
      (x.ondragstart = (e) =>
        e.dataTransfer.setData("text/plain", x.dataset.id)),
  );
  $$("[data-col]").forEach((x) => {
    x.ondragover = (e) => e.preventDefault();
    x.ondrop = (e) => {
      e.preventDefault();
      let t = tasks.find((t) => t.id === +e.dataTransfer.getData("text/plain"));
      if (t) {
        t.status = +x.dataset.col;
        render();
      }
    };
  });
}
$("#add").onsubmit = (e) => {
  e.preventDefault();
  if (!$("#title").value.trim()) return;
  tasks.push({
    id: Date.now(),
    title: $("#title").value.trim(),
    priority: $("#priority").value,
    due: $("#due").value,
    status: 0,
  });
  $("#title").value = "";
  render();
};
$("#search").oninput = render;
$("#export").onclick = () =>
  download("flow-board.json", JSON.stringify(tasks, null, 2));
$("#import").onchange = async (e) => {
  try {
    let data = JSON.parse(await e.target.files[0].text());
    if (
      !Array.isArray(data) ||
      !data.every(
        (t) =>
          Number.isFinite(t.id) &&
          typeof t.title === "string" &&
          [0, 1, 2].includes(t.status) &&
          typeof t.priority === "string" &&
          typeof t.due === "string",
      )
    )
      throw Error();
    tasks = data;
    render();
    toast("Board imported");
  } catch {
    toast("That file is not a valid board");
  }
};
render();
