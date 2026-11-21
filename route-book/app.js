let s = load("route-book", {
  name: "My next adventure",
  stops: [],
  packing: [
    { name: "Passport / ID", done: false },
    { name: "Phone charger", done: false },
  ],
});
$("#tripName").value = s.name;
$("#day").value = new Date().toISOString().slice(0, 10);
function render() {
  save("route-book", s);
  let days = [...new Set(s.stops.map((x) => x.day))].sort();
  $("#stats").innerHTML = [
    ["Days planned", days.length],
    ["Activities", s.stops.length],
    ["Estimated total", money(s.stops.reduce((a, x) => a + x.cost, 0))],
  ]
    .map(
      ([k, v]) =>
        `<div class="panel"><span class="muted">${k}</span><div class="metric">${v}</div></div>`,
    )
    .join("");
  $("#days").innerHTML =
    days
      .map(
        (d) =>
          `<h3>${new Date(d + "T12:00").toLocaleDateString("en", { weekday: "long", month: "short", day: "numeric" })}</h3>` +
          s.stops
            .filter((x) => x.day === d)
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(
              (x) =>
                `<div class="item row"><span class="pill">${x.time}</span><div style="flex:1"><strong>${esc(x.title)}</strong><p>${esc(x.notes)}</p></div><span>${money(x.cost)}</span><button data-del="${x.id}" aria-label="Delete activity">×</button></div>`,
            )
            .join(""),
      )
      .join("") || "<p>Your next adventure starts with one stop.</p>";
  $$("[data-del]").forEach(
    (b) =>
      (b.onclick = () => {
        s.stops = s.stops.filter((x) => x.id !== +b.dataset.del);
        render();
      }),
  );
  $("#packing").innerHTML = s.packing
    .map(
      (p, i) =>
        `<label class="item" style="display:block"><input type="checkbox" data-pack="${i}" ${p.done ? "checked" : ""}> ${esc(p.name)}</label>`,
    )
    .join("");
  $$("[data-pack]").forEach(
    (b) =>
      (b.onchange = () => {
        s.packing[+b.dataset.pack].done = b.checked;
        render();
      }),
  );
}
$("#add").onsubmit = (e) => {
  e.preventDefault();
  s.stops.push({
    id: Date.now(),
    day: $("#day").value,
    time: $("#time").value,
    title: $("#title").value.trim(),
    cost: +$("#cost").value,
    notes: $("#notes").value,
  });
  $("#title").value = "";
  render();
};
$("#tripName").oninput = () => {
  s.name = $("#tripName").value;
  save("route-book", s);
};
$("#packForm").onsubmit = (e) => {
  e.preventDefault();
  s.packing.push({ name: $("#pack").value, done: false });
  $("#pack").value = "";
  render();
};
$("#export").onclick = () =>
  download("route-book.json", JSON.stringify(s, null, 2));
render();
