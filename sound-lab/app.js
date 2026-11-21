const notes = [
  ["C5", 523.25],
  ["A4", 440],
  ["G4", 392],
  ["E4", 329.63],
  ["D4", 293.66],
  ["C4", 261.63],
];
let pattern = Array.from({ length: 6 }, (_, r) =>
    Array.from(
      { length: 16 },
      (_, c) => (r === 5 && c % 4 === 0) || (r === 3 && c % 4 === 2),
    ),
  ),
  ctx = null,
  playing = false,
  step = 0,
  timer = null;
function sound(freq) {
  ctx ??= new (window.AudioContext || window.webkitAudioContext)();
  ctx.resume();
  let o = ctx.createOscillator(),
    g = ctx.createGain(),
    now = ctx.currentTime,
    len = +$("#length").value;
  o.type = $("#wave").value;
  o.frequency.value = freq;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(+$("#volume").value, now + 0.01);
  g.gain.exponentialRampToValueAtTime(0.001, now + len);
  o.connect(g);
  g.connect(ctx.destination);
  o.start(now);
  o.stop(now + len + 0.02);
}
function draw() {
  $("#sequencer").innerHTML =
    '<div style="min-width:630px">' +
    notes
      .map(
        ([n, f], r) =>
          `<div style="display:grid;grid-template-columns:45px repeat(16,1fr);gap:5px;margin-bottom:8px;align-items:center"><small>${n}</small>${pattern[r].map((v, c) => `<button data-r="${r}" data-c="${c}" aria-label="${n} step ${c + 1}" aria-pressed="${v}" style="height:45px;padding:0;border-radius:5px;background:${v ? "var(--accent)" : "var(--bg)"};border-color:${playing && step === c ? "var(--green)" : "var(--line)"}"></button>`).join("")}</div>`,
      )
      .join("") +
    "</div>";
  $$("[data-r]").forEach(
    (b) =>
      (b.onclick = () => {
        let r = +b.dataset.r,
          c = +b.dataset.c;
        pattern[r][c] = !pattern[r][c];
        if (pattern[r][c]) sound(notes[r][1]);
        draw();
      }),
  );
}
function pulse() {
  notes.forEach(([n, f], r) => {
    if (pattern[r][step]) sound(f);
  });
  draw();
  step = (step + 1) % 16;
  timer = setTimeout(pulse, 60000 / +$("#bpm").value / 4);
}
$("#play").onclick = () => {
  playing = !playing;
  $("#play").textContent = playing ? "Stop" : "Play pattern";
  if (playing) {
    step = 0;
    pulse();
  } else {
    clearTimeout(timer);
    draw();
  }
};
$("#clear").onclick = () => {
  pattern = pattern.map((r) => r.map(() => false));
  draw();
};
$("#keys").innerHTML = notes
  .slice()
  .reverse()
  .map(
    ([n, f]) =>
      `<button data-f="${f}" style="height:110px;min-width:55px;background:#eae5f4;color:#201a2a">${n}</button>`,
  )
  .join("");
$$("[data-f]").forEach((b) => (b.onclick = () => sound(+b.dataset.f)));
$("#bpm").oninput = () =>
  ($("#bpmLabel").textContent = $("#bpm").value + " BPM");
$("#save").onclick = () => {
  save("sound-lab", { pattern, bpm: $("#bpm").value, wave: $("#wave").value });
  toast("Pattern saved");
};
$("#load").onclick = () => {
  let s = load("sound-lab", null);
  if (!s) return toast("No saved pattern");
  pattern = s.pattern;
  $("#bpm").value = s.bpm;
  $("#wave").value = s.wave;
  $("#bpm").oninput();
  draw();
};
$("#export").onclick = () =>
  download(
    "sound-lab.json",
    JSON.stringify(
      { pattern, bpm: +$("#bpm").value, wave: $("#wave").value },
      null,
      2,
    ),
  );
window.addEventListener("pagehide", () => {
  clearTimeout(timer);
  ctx?.close();
});
draw();
