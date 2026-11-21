let contacts = load("client-desk", [
  {
    id: 1,
    name: "Morgan Lee",
    company: "Example Studio",
    email: "morgan@example.com",
    value: 2400,
    stage: "Proposal",
    notes: "Fictional sample lead. Discuss design scope.",
  },
  {
    id: 2,
    name: "Jamie Reed",
    company: "Demo Co",
    email: "jamie@example.com",
    value: 1200,
    stage: "New lead",
    notes: "Fictional sample. Initial discovery.",
  },
]);
const stages = ["New lead", "Contacted", "Proposal", "Won", "Lost"];
function render() {
  save("client-desk", contacts);
  $("#stats").innerHTML = [
    ["Contacts", contacts.length],
    [
      "Open pipeline",
      money(
        contacts
          .filter((c) => !["Won", "Lost"].includes(c.stage))
          .reduce((a, c) => a + c.value, 0),
      ),
    ],
    [
      "Won value",
      money(
        contacts
          .filter((c) => c.stage === "Won")
          .reduce((a, c) => a + c.value, 0),
      ),
    ],
  ]
    .map(
      ([k, v]) =>
        `<div class="panel"><span class="muted">${k}</span><div class="metric">${v}</div></div>`,
    )
    .join("");
  let q = $("#search").value.toLowerCase();
  $("#contacts").innerHTML =
    contacts
      .filter((c) => (c.name + c.company + c.email).toLowerCase().includes(q))
      .map(
        (c) =>
          `<article class="item"><div class="row"><div><h3>${esc(c.name)}</h3><span class="muted">${esc(c.company)} · ${esc(c.email)}</span></div><strong>${money(c.value)}</strong></div><p>${esc(c.notes)}</p><div class="actions"><select data-stage="${c.id}" aria-label="Deal stage">${stages.map((s) => `<option ${c.stage === s ? "selected" : ""}>${s}</option>`).join("")}</select><button data-note="${c.id}">Edit notes</button><button data-del="${c.id}">Delete</button></div></article>`,
      )
      .join("") || "<p>No matching contacts.</p>";
  $$("[data-stage]").forEach(
    (b) =>
      (b.onchange = () => {
        contacts.find((c) => c.id === +b.dataset.stage).stage = b.value;
        render();
      }),
  );
  $$("[data-note]").forEach(
    (b) =>
      (b.onclick = () => {
        let c = contacts.find((c) => c.id === +b.dataset.note),
          n = prompt("Contact notes", c.notes);
        if (n !== null) {
          c.notes = n;
          render();
        }
      }),
  );
  $$("[data-del]").forEach(
    (b) =>
      (b.onclick = () => {
        if (confirm("Delete contact?")) {
          contacts = contacts.filter((c) => c.id !== +b.dataset.del);
          render();
        }
      }),
  );
}
$("#add").onsubmit = (e) => {
  e.preventDefault();
  let c = { id: Date.now(), stage: "New lead" };
  for (let k of ["name", "company", "email", "notes"])
    c[k] = $("#" + k).value.trim();
  c.value = +$("#value").value;
  contacts.push(c);
  $("#add").reset();
  render();
};
$("#search").oninput = render;
$("#export").onclick = () =>
  download("client-desk.json", JSON.stringify(contacts, null, 2));
render();
