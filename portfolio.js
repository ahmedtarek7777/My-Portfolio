const coverCopy = {
  "paper-trade": ["NOVA", "EXCHANGE", "VIRTUAL MARKETS / REAL CURIOSITY"],
  arcade: ["PLAY", "WITHOUT LIMITS", "FIVE GAMES. ONE PLAYGROUND."],
  "shop-lane": ["EVERYDAY", "DISCOVERIES", "20,000 REAL PRODUCT RECORDS"],
  taskly: ["MAKE", "THINGS HAPPEN", "A LITTLE CLARITY FOR YOUR DAY"],
  "weather-now": ["UNDER", "THE SAME SKY", "YOUR WORLD / YOUR WEATHER"],
  "cafe-landing": ["SLOW", "MORNINGS", "EMBER & OAK / COFFEE CULTURE"],
  "flow-board": ["IDEAS", "IN MOTION", "FROM WHAT IF TO WHAT'S NEXT"],
  "budget-lab": ["YOUR MONEY.", "YOUR DIRECTION.", "PLAN WITH PURPOSE"],
  "invoice-studio": ["GOOD WORK.", "WELL PRESENTED.", "THE FINISHING TOUCH"],
  "ink-notes": ["ROOM", "FOR THOUGHT", "CAPTURE WHAT COMES NEXT"],
  "habit-garden": ["SMALL STEPS.", "REAL GROWTH.", "A DAILY PRACTICE"],
  "focus-room": ["DO LESS.", "FOCUS MORE.", "A SPACE FOR DEEP WORK"],
  "calendar-studio": [
    "MAKE TIME",
    "FOR WHAT MATTERS",
    "YOUR DAYS / THOUGHTFULLY ARRANGED",
  ],
  "split-bills": ["SHARED MOMENTS.", "FAIR SHARES.", "KEEP THE GOOD COMPANY"],
  "client-desk": [
    "BETTER",
    "CONNECTIONS",
    "A LITTLE STRUCTURE GOES A LONG WAY",
  ],
  "stock-room": ["EVERYTHING", "IN ITS PLACE", "KNOW YOUR NEXT MOVE"],
  "route-book": ["TAKE THE", "SCENIC ROUTE", "MAKE ROOM FOR DISCOVERY"],
  "meal-studio": ["A BETTER", "KIND OF TABLE", "FRESH IDEAS / EVERY DAY"],
  "workout-log": ["SHOW UP.", "BUILD ON IT.", "YOUR PROGRESS / YOUR PACE"],
  "quiz-academy": ["STAY", "CURIOUS", "TEST AN IDEA. LEARN SOMETHING."],
  "sound-lab": ["MAKE", "SOME NOISE", "YOUR NEXT SOUND STARTS HERE"],
  "image-studio": ["A NEW", "PERSPECTIVE", "SEE WHAT A LITTLE CHANGE CAN DO"],
  pathfinder: ["FIND", "YOUR WAY", "EXPLORE THE PATH LESS OBVIOUS"],
  "type-racer": ["FIND YOUR", "RHYTHM", "ONE KEY AT A TIME"],
  "data-lens": ["SEE THE", "BIGGER PICTURE", "FROM ROWS TO REVELATIONS"],
};
let projects = [];
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
let category = "All";
function settings() {
  let s;
  try {
    s = JSON.parse(localStorage.getItem("ahmed-settings")) || {};
  } catch {
    s = {};
  }
  $("#appearance").value = s.appearance || "dark";
  $("#accent").value = s.accent || "#bca0f5";
  $("#motion").checked = !!s.motion;
  $("#layout").value = s.layout || "grid";
  apply();
}
function apply() {
  let s = {
    appearance: $("#appearance").value,
    accent: $("#accent").value,
    motion: $("#motion").checked,
    layout: $("#layout").value,
  };
  document.body.classList.toggle("light", s.appearance === "light");
  document.body.classList.toggle("reduced", s.motion);
  document.body.classList.toggle("compact", s.layout === "list");
  document.documentElement.style.setProperty("--accent", s.accent);
  localStorage.setItem("ahmed-settings", JSON.stringify(s));
}
$("#settingsButton").onclick = () => {
  let open = $("#settings").hidden;
  $("#settings").hidden = !open;
  $("#settingsButton").setAttribute("aria-expanded", open);
};
$$("#settings input,#settings select").forEach((x) => (x.onchange = apply));
$("#resetSettings").onclick = () => {
  localStorage.removeItem("ahmed-settings");
  settings();
};
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $("#settings").hidden = true;
    $("#settingsButton").setAttribute("aria-expanded", "false");
  }
});
function render() {
  let q = $("#search").value.toLowerCase();
  let list = projects.filter(
    (p) =>
      (category === "All" || p[2] === category) &&
      p.join(" ").toLowerCase().includes(q),
  );
  $("#projectCount").textContent =
    `${String(list.length).padStart(2, "0")} EXPERIENCES / BUILT TO EXPLORE`;
  $("#projects").innerHTML =
    list
      .map((p) => {
        let i = projects.indexOf(p);
        return `<a class="project" href="${p[0]}/${p[0] === "shop-lane" ? "?v=5" : ""}" style="--c:${p[5]}"><div class="cover"><span class="coverNumber">EXPERIMENT ${String(i + 1).padStart(2, "0")}</span><span class="coverArrow">↗</span><img class="coverPhoto" src="assets/covers/${p[0]}.${coverCopy[p[0]] ? "webp" : "svg"}" alt="${(coverCopy[p[0]] || [p[1], "Try it out", p[3]])[2]} themed photograph" loading="lazy" width="1200" height="760"><div class="coverShade"></div><div class="coverWords"><span>${(coverCopy[p[0]] || [p[1], "Try it out", p[3]])[2]}</span><strong>${(coverCopy[p[0]] || [p[1], "Try it out", p[3]])[0]}<br>${(coverCopy[p[0]] || [p[1], "Try it out", p[3]])[1]}</strong></div><span class="coverSymbol">${p[4]}</span></div><div class="projectmeta"><h3>${p[1]}</h3><span>${p[2]}</span></div><p>${p[3]}</p></a>`;
      })
      .join("") || "<p>No projects match. Try another search.</p>";
}
fetch("projects.json", { cache: "no-store" })
  .then((r) => r.json())
  .then((p) => {
    projects = p;
    $("#filters").innerHTML = ["All", ...new Set(p.map((x) => x[2]))]
      .map(
        (c) => `<button class="${c === "All" ? "active" : ""}">${c}</button>`,
      )
      .join("");
    $$("#filters button").forEach(
      (b) =>
        (b.onclick = () => {
          category = b.textContent;
          $$("#filters button").forEach((x) =>
            x.classList.toggle("active", x === b),
          );
          render();
        }),
    );
    render();
  })
  .catch(
    () =>
      ($("#projects").textContent =
        "Could not load the gallery. Please refresh."),
  );
$("#search").oninput = render;
settings();
