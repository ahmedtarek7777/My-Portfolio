const games = ["Memory", "Tic Tac Toe", "Reaction", "Word Puzzle", "2048"];
let selected = 0,
  lock = false,
  best = load("playlab-best", {}),
  timer = null;
function record(k, v, lower = false) {
  if (best[k] === undefined || (lower ? v < best[k] : v > best[k])) {
    best[k] = v;
    save("playlab-best", best);
  }
  scores();
}
function scores() {
  $("#scores").innerHTML = games
    .map(
      (x) =>
        `<div class="item row"><span>${x}</span><strong>${best[x] ?? "Not played"}</strong></div>`,
    )
    .join("");
}
$("#gameTabs").innerHTML = games
  .map((g, i) => `<button data-i="${i}">${g}</button>`)
  .join("");
$$("#gameTabs button").forEach(
  (b) =>
    (b.onclick = () => {
      selected = +b.dataset.i;
      start();
    }),
);
$("#restart").onclick = () => start();
function start() {
  clearTimeout(timer);
  document.onkeydown = null;
  lock = false;
  $$("#gameTabs button").forEach((b, i) =>
    b.classList.toggle("active", i === selected),
  );
  $("#gameName").textContent = games[selected];
  $("#status").textContent = "";
  $("#arena").innerHTML = "";
  [memory, ttt, reaction, word, numbers][selected]();
  scores();
}
function memory() {
  let cards = ["✦", "◈", "☀", "☾", "♣", "♥", "⚡", "❖"];
  cards = [...cards, ...cards].sort(() => Math.random() - 0.5);
  let open = [],
    matched = [],
    moves = 0;
  $("#rules").textContent = "Match all eight pairs. Fewer moves is better.";
  $("#arena").innerHTML =
    '<div id="board" style="display:grid;grid-template-columns:repeat(4,65px);gap:10px"></div>';
  cards.forEach((c, i) => {
    let b = document.createElement("button");
    b.style.cssText = "height:65px;font-size:24px";
    b.textContent = "?";
    b.onclick = () => {
      if (lock || open.includes(i) || matched.includes(i)) return;
      b.textContent = c;
      open.push(i);
      if (open.length === 2) {
        moves++;
        let [a, z] = open;
        if (cards[a] === cards[z]) {
          matched.push(a, z);
          open = [];
          if (matched.length === 16) {
            $("#status").textContent = `Complete in ${moves} moves!`;
            record("Memory", moves, true);
          }
        } else {
          lock = true;
          timer = setTimeout(() => {
            for (let j of open) $("#board").children[j].textContent = "?";
            open = [];
            lock = false;
          }, 650);
        }
      }
    };
    $("#board").append(b);
  });
}
function ttt() {
  let board = Array(9).fill(""),
    over = false;
  $("#rules").textContent =
    "You are X. Play against the computer. Three in a row wins.";
  $("#arena").innerHTML =
    '<div id="board" style="display:grid;grid-template-columns:repeat(3,88px);gap:9px"></div>';
  const win = (b) =>
    [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ].some((a) => a.every((i) => b[i] && b[i] === b[a[0]]));
  function draw() {
    $$("#board button").forEach((b, i) => (b.textContent = board[i]));
    if (win(board) || board.every(Boolean)) {
      over = true;
      let winner = win(board)
        ? board.filter(Boolean).length % 2
          ? "You win!"
          : "Computer wins."
        : "Draw.";
      $("#status").textContent = winner;
      if (winner === "You win!")
        record("Tic Tac Toe", (best["Tic Tac Toe"] || 0) + 1);
    }
  }
  for (let i = 0; i < 9; i++) {
    let b = document.createElement("button");
    b.style.cssText = "height:88px;font-size:32px";
    b.onclick = () => {
      if (board[i] || over || lock) return;
      board[i] = "X";
      draw();
      if (over) return;
      lock = true;
      timer = setTimeout(() => {
        let free = board.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
        let choice;
        for (let c of ["O", "X"]) {
          for (let n of free) {
            let test = [...board];
            test[n] = c;
            if (win(test)) {
              choice = n;
              break;
            }
          }
          if (choice !== undefined) break;
        }
        if (choice === undefined)
          choice = free.includes(4)
            ? 4
            : free[Math.floor(Math.random() * free.length)];
        board[choice] = "O";
        lock = false;
        draw();
      }, 350);
    };
    $("#board").append(b);
  }
}
function reaction() {
  let ready = false,
    armed = false,
    startTime = 0;
  $("#rules").textContent =
    "Click to start. Wait for green, then click as fast as you can.";
  let b = document.createElement("button");
  b.style.cssText = "width:100%;height:290px;font-size:26px";
  b.textContent = "Click to begin";
  b.onclick = () => {
    if (ready) {
      let ms = Math.round(performance.now() - startTime);
      b.textContent = ms + " ms · Play again";
      ready = armed = false;
      record("Reaction", ms, true);
      return;
    }
    if (armed) {
      clearTimeout(timer);
      armed = false;
      b.textContent = "Too soon! Click to retry";
      return;
    }
    armed = true;
    b.textContent = "Wait for green...";
    b.style.background = "#3a2633";
    timer = setTimeout(
      () => {
        ready = true;
        b.style.background = "#226349";
        b.textContent = "NOW!";
        startTime = performance.now();
      },
      1500 + Math.random() * 2500,
    );
  };
  $("#arena").append(b);
}
function word() {
  let words = [
    "ORBIT",
    "PIXEL",
    "STACK",
    "NODES",
    "REACT",
    "LOGIC",
    "ARRAY",
    "SCOPE",
  ];
  let target = words[Math.floor(Math.random() * words.length)],
    tries = 0,
    done = false;
  $("#rules").textContent =
    "Guess the five-letter code in six tries. Green = right place. Purple = present elsewhere.";
  $("#arena").innerHTML =
    '<div style="width:100%"><div id="guesses" class="stack" style="margin-bottom:20px"></div><form id="guess" class="actions"><input id="word" placeholder="5 letters" maxlength="5" minlength="5" pattern="[A-Za-z]{5}" required aria-label="Five letter guess"><button class="primary">Guess</button></form></div>';
  $("#guess").onsubmit = (e) => {
    e.preventDefault();
    if (done) return;
    let v = $("#word").value.toUpperCase();
    if (!/^[A-Z]{5}$/.test(v)) return;
    tries++;
    let used = Array(5).fill(false),
      colors = Array(5).fill("#333744");
    for (let i = 0; i < 5; i++)
      if (v[i] === target[i]) {
        colors[i] = "#246747";
        used[i] = true;
      }
    for (let i = 0; i < 5; i++)
      if (colors[i] !== "#246747") {
        let j = [...target].findIndex((x, j) => !used[j] && x === v[i]);
        if (j >= 0) {
          colors[i] = "#654997";
          used[j] = true;
        }
      }
    let row = document.createElement("div");
    row.style.display = "flex";
    row.style.gap = "7px";
    row.innerHTML = [...v]
      .map(
        (c, i) =>
          `<span style="display:grid;place-items:center;width:45px;height:45px;background:${colors[i]};border-radius:8px;font-size:20px">${c}</span>`,
      )
      .join("");
    $("#guesses").append(row);
    $("#word").value = "";
    if (v === target || tries === 6) {
      done = true;
      $("#status").textContent =
        v === target ? "Code cracked!" : "The code was " + target;
      if (v === target) record("Word Puzzle", tries, true);
    }
  };
}
function numbers() {
  let b = Array(16).fill(0),
    score = 0;
  $("#rules").textContent =
    "Merge equal tiles with arrow keys or the buttons. Reach 2048.";
  $("#arena").innerHTML =
    '<div><div id="board" style="display:grid;grid-template-columns:repeat(4,64px);gap:8px"></div><div class="actions" style="margin-top:20px"><button data-d="0">←</button><button data-d="1">↑</button><button data-d="2">→</button><button data-d="3">↓</button></div></div>';
  function spawn() {
    let empty = b.map((x, i) => (x ? -1 : i)).filter((i) => i >= 0);
    if (empty.length)
      b[empty[Math.floor(Math.random() * empty.length)]] =
        Math.random() < 0.9 ? 2 : 4;
  }
  function draw() {
    $("#board").innerHTML = b
      .map(
        (x) =>
          `<div style="width:64px;height:64px;display:grid;place-items:center;border-radius:9px;font-weight:bold;font-size:22px;background:${x ? "hsl(" + (270 - Math.log2(x) * 12) + " 45% " + Math.min(60, 23 + Math.log2(x) * 4) + "%)" : "#242834"}">${x || ""}</div>`,
      )
      .join("");
    $("#status").textContent =
      "Score: " + score + (b.includes(2048) ? " · You reached 2048!" : "");
    record("2048", score);
  }
  function move(d) {
    let old = b.join(",");
    for (let r = 0; r < 4; r++) {
      let ids = Array.from({ length: 4 }, (_, c) =>
        d === 0
          ? r * 4 + c
          : d === 2
            ? r * 4 + 3 - c
            : d === 1
              ? c * 4 + r
              : (3 - c) * 4 + r,
      );
      let a = ids.map((i) => b[i]).filter(Boolean),
        out = [];
      for (let i = 0; i < a.length; i++) {
        if (a[i] === a[i + 1]) {
          out.push(a[i] * 2);
          score += a[i] * 2;
          i++;
        } else out.push(a[i]);
      }
      while (out.length < 4) out.push(0);
      ids.forEach((id, i) => (b[id] = out[i]));
    }
    if (old !== b.join(",")) spawn();
    draw();
    if (
      !b.includes(0) &&
      !b.some(
        (x, i) => (i % 4 < 3 && x === b[i + 1]) || (i < 12 && x === b[i + 4]),
      )
    )
      $("#status").textContent += " · Game over. Start a new game.";
  }
  $$("[data-d]").forEach((x) => (x.onclick = () => move(+x.dataset.d)));
  document.onkeydown = (e) => {
    let d = ["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"].indexOf(e.key);
    if (d >= 0) {
      e.preventDefault();
      move(d);
    }
  };
  spawn();
  spawn();
  draw();
}
start();
