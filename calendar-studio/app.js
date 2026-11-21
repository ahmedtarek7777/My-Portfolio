let events = load("daylight-events", []),
  view = new Date(),
  selected = new Date().toLocaleDateString("en-CA");
const key = (d) =>
  d.getFullYear() +
  "-" +
  String(d.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(d.getDate()).padStart(2, "0");
selected = key(new Date());
$("#date").value = selected;
function render() {
  save("daylight-events", events);
  $("#monthName").textContent = view.toLocaleDateString("en", {
    month: "long",
    year: "numeric",
  });
  let first = new Date(view.getFullYear(), view.getMonth(), 1),
    pad = (first.getDay() + 6) % 7,
    n = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  $("#calendar").innerHTML =
    ["M", "T", "W", "T", "F", "S", "S"]
      .map((d) => `<small style="text-align:center;padding:12px">${d}</small>`)
      .join("") +
    "<div></div>".repeat(pad) +
    Array.from({ length: n }, (_, i) => {
      let d = key(new Date(view.getFullYear(), view.getMonth(), i + 1)),
        count = events.filter((e) => e.date === d).length;
      return `<button data-date="${d}" style="height:72px;padding:6px;border-radius:9px;${selected === d ? "border-color:var(--accent);background:#594776;" : ""}">${i + 1}<small style="display:block;margin-top:8px;color:var(--green)">${count ? "● " + count : ""}</small></button>`;
    }).join("");
  $$("[data-date]").forEach(
    (b) =>
      (b.onclick = () => {
        selected = b.dataset.date;
        $("#date").value = selected;
        render();
      }),
  );
  $("#dayTitle").textContent = new Date(selected + "T12:00").toLocaleDateString(
    "en",
    { weekday: "long", month: "short", day: "numeric" },
  );
  $("#events").innerHTML =
    events
      .filter((e) => e.date === selected)
      .sort((a, b) => a.time.localeCompare(b.time))
      .map(
        (e) =>
          `<article class="item"><div class="row"><h3>${esc(e.title)}</h3><button data-del="${e.id}" aria-label="Delete event">×</button></div><span class="pill">${e.time} - ${e.end}</span><p>${esc(e.notes)}</p></article>`,
      )
      .join("") || "<p>Nothing scheduled. Space to breathe.</p>";
  $$("[data-del]").forEach(
    (b) =>
      (b.onclick = () => {
        events = events.filter((e) => e.id !== +b.dataset.del);
        render();
      }),
  );
}
$("#prev").onclick = () => {
  view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
  render();
};
$("#next").onclick = () => {
  view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
  render();
};
$("#today").onclick = () => {
  view = new Date();
  selected = key(view);
  $("#date").value = selected;
  render();
};
$("#add").onsubmit = (e) => {
  e.preventDefault();
  if ($("#end").value <= $("#time").value)
    return toast("End time must be after start time");
  let event = {
    id: Date.now(),
    title: $("#title").value.trim(),
    date: $("#date").value,
    time: $("#time").value,
    end: $("#end").value,
    notes: $("#notes").value,
  };
  let overlap = events.some(
    (x) => x.date === event.date && x.time < event.end && x.end > event.time,
  );
  if (overlap && !confirm("This overlaps an existing event. Save anyway?"))
    return;
  events.push(event);
  selected = event.date;
  view = new Date(selected + "T12:00");
  $("#title").value = "";
  render();
};
$("#export").onclick = () => {
  const clean = (s) =>
    s
      .replace(/\\/g, "\\\\")
      .replace(/\n/g, "\\n")
      .replace(/,/g, "\\,")
      .replace(/;/g, "\\;")
      .replace(/\r/g, "");
  download(
    "daylight.ics",
    "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Ahmed Studio//Daylight//EN\r\n" +
      events
        .map(
          (e) =>
            "BEGIN:VEVENT\r\nUID:" +
            e.id +
            "@daylight.local\r\nDTSTAMP:" +
            new Date().toISOString().replace(/[-:]/g, "").split(".")[0] +
            "Z\r\nDTSTART:" +
            e.date.replace(/-/g, "") +
            "T" +
            e.time.replace(":", "") +
            "00\r\nDTEND:" +
            e.date.replace(/-/g, "") +
            "T" +
            e.end.replace(":", "") +
            "00\r\nSUMMARY:" +
            clean(e.title) +
            "\r\nDESCRIPTION:" +
            clean(e.notes) +
            "\r\nEND:VEVENT\r\n",
        )
        .join("") +
      "END:VCALENDAR",
    "text/calendar",
  );
};
render();
