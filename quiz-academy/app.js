const bank = {
  JavaScript: [
    [
      "Which method creates a new array by transforming each element?",
      ["map", "push", "pop", "shift"],
      0,
      "map returns a new array of transformed values without changing the original array.",
    ],
    [
      "What does === compare?",
      ["Value only", "Type only", "Value and type", "Object properties deeply"],
      2,
      "Strict equality checks type and value without type coercion.",
    ],
    [
      "Which declaration has block scope?",
      ["var", "let", "Both", "Neither"],
      1,
      "let and const have block scope. var is function-scoped.",
    ],
    [
      "What does JSON.parse do?",
      [
        "Sends a request",
        "Converts JSON text to a value",
        "Encrypts data",
        "Creates HTML",
      ],
      1,
      "JSON.parse reads valid JSON text and returns its JavaScript value.",
    ],
    [
      "How do you wait for a promise inside an async function?",
      ["pause", "wait", "await", "yield"],
      2,
      "await suspends the async function until the promise settles.",
    ],
  ],
  CSS: [
    [
      "Which layout is designed for two dimensions?",
      ["Float", "Grid", "Inline", "Absolute"],
      1,
      "CSS Grid controls rows and columns together.",
    ],
    [
      "Which unit is relative to root font size?",
      ["px", "em", "rem", "vh"],
      2,
      "rem refers to the root element font size.",
    ],
    [
      "Which selector matches a focused keyboard control?",
      [":hover", ":focus-visible", ":visited", ":empty"],
      1,
      ":focus-visible lets you show a focus indicator when the browser determines one is needed.",
    ],
    [
      "What does border-box include in width?",
      [
        "Content only",
        "Content, padding and border",
        "Margin only",
        "All including margin",
      ],
      1,
      "border-box includes content, padding and borders, but not margins.",
    ],
    [
      "Which media feature honors reduced animation preferences?",
      [
        "prefers-color-scheme",
        "prefers-reduced-motion",
        "orientation",
        "hover",
      ],
      1,
      "prefers-reduced-motion reflects the user’s system motion preference.",
    ],
  ],
  Web: [
    [
      "What HTTP code means Not Found?",
      ["200", "301", "404", "500"],
      2,
      "404 means the server could not find the requested resource.",
    ],
    [
      "Which element is a native action control?",
      ["div", "span", "button", "section"],
      2,
      "A button includes focus and keyboard interaction behavior by default.",
    ],
    [
      "What does HTTPS protect in transit?",
      [
        "Only images",
        "Network communication",
        "Local files",
        "Browser extensions",
      ],
      1,
      "HTTPS uses TLS to protect communication between client and server.",
    ],
    [
      "What does localStorage store?",
      [
        "Server files",
        "String values for an origin",
        "Secret encrypted passwords",
        "HTTP cookies",
      ],
      1,
      "localStorage is browser-side, origin-scoped string storage. It is not secure secret storage.",
    ],
    [
      "What is alt text for?",
      [
        "Image file size",
        "Alternative image description",
        "Changing color",
        "SEO keywords only",
      ],
      1,
      "Alternative text conveys an image’s purpose or content when the image cannot be perceived.",
    ],
  ],
};
let topic = "JavaScript",
  questions = [],
  index = 0,
  score = 0,
  answers = [],
  history = load("quiz-history", []);
$("#topics").innerHTML = Object.keys(bank)
  .map((t) => `<button data-topic="${t}">${t}</button>`)
  .join("");
$$("[data-topic]").forEach(
  (b) =>
    (b.onclick = () => {
      topic = b.dataset.topic;
      start();
    }),
);
function record() {
  save("quiz-history", history);
  $("#history").innerHTML =
    history
      .slice()
      .reverse()
      .slice(0, 12)
      .map(
        (h) =>
          `<div class="item row"><span>${h.topic}</span><strong>${h.score}/${h.total}</strong><small>${esc(h.date)}</small></div>`,
      )
      .join("") || "<p>No attempts yet. Pick a topic to begin.</p>";
}
function start() {
  questions = [...bank[topic]].sort(() => Math.random() - 0.5);
  index = score = 0;
  answers = [];
  $$("[data-topic]").forEach((b) =>
    b.classList.toggle("active", b.dataset.topic === topic),
  );
  draw();
}
function draw() {
  let q = questions[index];
  $("#quiz").innerHTML =
    `<span class="badge">Question ${index + 1} of ${questions.length}</span><h2 style="margin-top:20px;line-height:1.5">${esc(q[0])}</h2><div class="stack" id="options">${q[1].map((a, i) => `<button data-answer="${i}" style="text-align:left">${String.fromCharCode(65 + i)}. ${esc(a)}</button>`).join("")}</div><div id="explanation"></div>`;
  $$("[data-answer]").forEach(
    (b) =>
      (b.onclick = () => {
        let answer = +b.dataset.answer;
        answers.push(answer);
        if (answer === q[2]) score++;
        $$("[data-answer]").forEach((x) => {
          x.disabled = true;
          if (+x.dataset.answer === q[2]) x.style.borderColor = "var(--green)";
        });
        $("#explanation").innerHTML =
          `<p class="${answer === q[2] ? "positive" : "negative"}">${answer === q[2] ? "Correct." : "Not quite."}</p><p>${esc(q[3])}</p><button id="next" class="primary">${index + 1 === questions.length ? "See results" : "Next question"}</button>`;
        $("#next").onclick = () => {
          index++;
          if (index < questions.length) draw();
          else finish();
        };
      }),
  );
}
function finish() {
  history.push({
    topic,
    score,
    total: questions.length,
    date: new Date().toLocaleDateString(),
  });
  record();
  $("#quiz").innerHTML =
    `<span class="badge">Session complete</span><div class="metric" style="font-size:80px">${score}/${questions.length}</div><p>${score === questions.length ? "Perfect round. Nicely done." : "Keep going. Understanding grows with practice."}</p><button id="again" class="primary">Try again</button><h2 style="margin-top:30px">Your review</h2>` +
    questions
      .map(
        (q, i) =>
          `<div class="item"><strong>${esc(q[0])}</strong><p class="${answers[i] === q[2] ? "positive" : "negative"}">Your answer: ${esc(q[1][answers[i]])}</p><p>Correct: ${esc(q[1][q[2]])}<br>${esc(q[3])}</p></div>`,
      )
      .join("");
  $("#again").onclick = start;
}
record();
start();
