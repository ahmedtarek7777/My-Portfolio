let notes = load("ink-notes", [
    {
      id: 1,
      title: "Welcome to Ink",
      tags: "ideas, welcome",
      content:
        "# Your next idea starts here\n\nWrite freely. Everything saves on this device.\n\n## Markdown basics\n- Use headings with #\n- Make **important** ideas stand out\n- Keep notes grouped with tags",
      updated: Date.now(),
    },
  ]),
  active = notes[0]?.id;
function sidebar() {
  let q = $("#search").value.toLowerCase();
  $("#list").innerHTML = notes
    .filter((n) => (n.title + n.tags + n.content).toLowerCase().includes(q))
    .sort((a, b) => b.updated - a.updated)
    .map(
      (n) =>
        `<button data-note="${n.id}" style="width:100%;text-align:left;margin-top:12px;border-color:${n.id === active ? "var(--accent)" : "var(--line)"}">${esc(n.title || "Untitled")}<small style="display:block;margin-top:5px">${esc(n.tags)}</small></button>`,
    )
    .join("");
  $$("[data-note]").forEach(
    (b) =>
      (b.onclick = () => {
        active = +b.dataset.note;
        open();
      }),
  );
}
function open() {
  let n = notes.find((n) => n.id === active);
  if (!n) {
    $("#title").value = $("#tags").value = $("#content").value = "";
    $("#editor").hidden = true;
    $("#rendered").hidden = true;
    sidebar();
    return;
  }
  $("#editor").hidden = false;
  $("#rendered").hidden = true;
  for (let k of ["title", "tags", "content"]) $("#" + k).value = n[k];
  sidebar();
  count();
}
function count() {
  let t = $("#content").value;
  $("#count").textContent =
    `${t.trim() ? t.trim().split(/\s+/).length : 0} words · ${t.length} characters · Autosaved locally`;
}
function persist() {
  let n = notes.find((n) => n.id === active);
  if (!n) return;
  for (let k of ["title", "tags", "content"]) n[k] = $("#" + k).value;
  n.updated = Date.now();
  save("ink-notes", notes);
  sidebar();
  count();
}
$("#editor").oninput = persist;
$("#search").oninput = sidebar;
$("#new").onclick = () => {
  let n = {
    id: Date.now(),
    title: "Untitled note",
    tags: "",
    content: "",
    updated: Date.now(),
  };
  notes.push(n);
  active = n.id;
  save("ink-notes", notes);
  open();
  $("#title").focus();
};
$("#delete").onclick = () => {
  if (!active || !confirm("Delete this note?")) return;
  notes = notes.filter((n) => n.id !== active);
  active = notes[0]?.id;
  save("ink-notes", notes);
  open();
};
$("#preview").onclick = () => {
  let raw = esc($("#content").value);
  $("#rendered").innerHTML = raw
    .split("\n")
    .map((l) =>
      /^### /.test(l)
        ? "<h3>" + l.slice(4) + "</h3>"
        : /^## /.test(l)
          ? "<h2>" + l.slice(3) + "</h2>"
          : /^# /.test(l)
            ? "<h1>" + l.slice(2) + "</h1>"
            : /^- /.test(l)
              ? "<div>• " + l.slice(2) + "</div>"
              : "<p>" +
                l.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>") +
                "</p>",
    )
    .join("");
  $("#editor").hidden = true;
  $("#rendered").hidden = false;
};
$("#edit").onclick = () => {
  $("#editor").hidden = false;
  $("#rendered").hidden = true;
};
$("#export").onclick = () =>
  download(
    ($("#title").value || "note") + ".md",
    $("#content").value,
    "text/markdown",
  );
open();
