const app = document.querySelector("#app"),
  id = document.body.dataset.app;
const $ = (s) => document.querySelector(s);
let clean = () => {},
  timer,
  score = 0;
const say = (t) => ($("#status").textContent = t);
const best = (v) => {
  let k = "best-" + id,
    n = Math.max(v, +(localStorage.getItem(k) || 0));
  localStorage.setItem(k, n);
  $("#best").textContent = n;
};
function shell(rules) {
  app.innerHTML = `<section class="panel gamepanel"><div class="tools"><button id="restart" class="primary">Restart ↻</button><span>Best score: <b id="best">${localStorage.getItem("best-" + id) || 0}</b></span></div><p>${rules}</p><div id="arena"></div><p id="status" role="status"></p><div id="controls"></div></section>`;
  $("#restart").onclick = () => {
    clean();
    clearInterval(timer);
    document.onkeydown = null;
    start();
  };
}
function grid(n, values, click) {
  let g = document.createElement("div");
  g.className = "playgrid";
  g.style.gridTemplateColumns = `repeat(${n},1fr)`;
  values.forEach((v, i) => {
    let b = document.createElement("button");
    b.textContent = v;
    b.onclick = () => click(i, b);
    g.append(b);
  });
  $("#arena").replaceChildren(g);
  return g;
}
function controls(fn) {
  $("#controls").innerHTML =
    '<div class="dpad"><button data-key="ArrowLeft">←</button><button data-key="ArrowUp">↑</button><button data-key="ArrowDown">↓</button><button data-key="ArrowRight">→</button><button data-key=" ">●</button></div>';
  document.onkeydown = (e) => {
    if (
      ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " "].includes(e.key)
    ) {
      e.preventDefault();
      fn(e.key);
    }
  };
  document
    .querySelectorAll("[data-key]")
    .forEach((b) => (b.onclick = () => fn(b.dataset.key)));
}
function start() {
  score = 0;
  (
    ({
      mines,
      "connect-four": connect,
      sudoku,
      "sliding-puzzle": sliding,
      "word-guess": word,
      "lights-out": lights,
      simon,
      "maze-run": maze,
      whack,
      "math-duel": math,
    })[id] || canvasGame
  )();
}
function mines() {
  shell(
    "Reveal the squares. Each number shows how many mines are nearby. Turn on flag mode to mark squares you suspect.",
  );
  let n = 8,
    ms = new Set(),
    seen = new Set(),
    flags = new Set(),
    lost = false,
    flag = false;
  while (ms.size < 10) ms.add((Math.random() * 64) | 0);
  $("#controls").innerHTML = '<button id="flag">Flag mode: Off</button>';
  $("#flag").onclick = () => {
    $("#flag").textContent = "Flag mode: " + ((flag = !flag) ? "On" : "Off");
  };
  const near = (i) =>
    Array.from({ length: 64 }, (_, j) => j).filter(
      (j) =>
        j !== i &&
        Math.abs((j % 8) - (i % 8)) <= 1 &&
        Math.abs(((j / 8) | 0) - ((i / 8) | 0)) <= 1,
    );
  let g = grid(8, Array(64).fill("·"), (i) => {
    if (lost || seen.has(i)) return;
    if (flag) {
      flags.has(i) ? flags.delete(i) : flags.add(i);
      draw();
      return;
    }
    if (flags.has(i)) return;
    if (ms.has(i)) {
      lost = true;
      say("You hit a mine! Try again.");
      draw();
      return;
    }
    function reveal(j) {
      if (seen.has(j) || ms.has(j) || flags.has(j)) return;
      seen.add(j);
      if (!near(j).some((k) => ms.has(k))) near(j).forEach(reveal);
    }
    reveal(i);
    draw();
    if (seen.size === 54) {
      say("You win! You revealed every safe square.");
      best(54);
      lost = true;
    }
  });
  function draw() {
    [...g.children].forEach((b, i) => {
      b.textContent =
        lost && ms.has(i)
          ? "💣"
          : flags.has(i)
            ? "⚑"
            : seen.has(i)
              ? near(i).filter((k) => ms.has(k)).length || " "
              : "·";
      b.style.background = seen.has(i) ? "#3d4b61" : "";
    });
  }
}
function connect() {
  shell(
    "Two players on one device. Choose any column. The first player to connect four horizontally, vertically, or diagonally wins.",
  );
  let b = Array(42).fill(""),
    turn = "🔴",
    done = false;
  let g = grid(7, b, click);
  say("Turn " + turn);
  function click(i) {
    if (done) return;
    let c = i % 7,
      r = 5;
    while (r >= 0 && b[r * 7 + c]) r--;
    if (r < 0) return;
    let at = r * 7 + c;
    b[at] = turn;
    g.children[at].textContent = "●";
    g.children[at].style.color = turn === "🔴" ? "#f37b83" : "#f0ce77";
    for (let [dx, dy] of [
      [1, 0],
      [0, 1],
      [1, 1],
      [1, -1],
    ]) {
      let count = 1;
      for (let sign of [-1, 1])
        for (let k = 1; k < 4; k++) {
          let x = c + dx * k * sign,
            y = r + dy * k * sign;
          if (x < 0 || x > 6 || y < 0 || y > 5 || b[y * 7 + x] !== turn) break;
          count++;
        }
      if (count >= 4) {
        done = true;
        say(turn + " wins!");
        best(1);
        return;
      }
    }
    if (b.every(Boolean)) {
      done = true;
      say("Draw!");
      return;
    }
    turn = turn === "🔴" ? "🟡" : "🔴";
    say("Turn " + turn);
  }
}
function sudoku() {
  shell(
    "Each row, column, and 2×2 box must contain 1, 2, 3, and 4 exactly once. Tap an empty square to change its number.",
  );
  let solution = [1, 2, 3, 4, 3, 4, 1, 2, 2, 1, 4, 3, 4, 3, 2, 1],
    given = new Set([0, 3, 5, 6, 9, 10, 12, 15]),
    b = solution.map((v, i) => (given.has(i) ? v : 0));
  let g = grid(
    4,
    b.map((v) => v || "·"),
    (i, button) => {
      if (given.has(i)) return;
      b[i] = (b[i] % 4) + 1;
      button.textContent = b[i];
      if (b.every(Boolean)) {
        let groups = [];
        for (let y = 0; y < 4; y++) groups.push(b.slice(y * 4, y * 4 + 4));
        for (let x = 0; x < 4; x++)
          groups.push([0, 1, 2, 3].map((y) => b[y * 4 + x]));
        for (let y of [0, 2])
          for (let x of [0, 2])
            groups.push([
              b[y * 4 + x],
              b[y * 4 + x + 1],
              b[(y + 1) * 4 + x],
              b[(y + 1) * 4 + x + 1],
            ]);
        if (groups.every((g) => new Set(g).size === 4)) {
          say("Nice! You solved it.");
          best(1);
        } else
          say("There is still a repeated number. Check the rows and boxes.");
      }
    },
  );
  given.forEach((i) => (g.children[i].style.color = "#9bd6c8"));
}
function sliding() {
  shell(
    "Arrange the numbers from 1 to 8, with the empty space at the end. The puzzle is shuffled with legal moves, so it is always solvable.",
  );
  let a = [1, 2, 3, 4, 5, 6, 7, 8, 0],
    moves = 0;
  const neighbors = (z) =>
    [z - 3, z + 3, z % 3 ? z - 1 : -1, z % 3 < 2 ? z + 1 : -1].filter(
      (i) => i >= 0 && i < 9,
    );
  for (let k = 0; k < 100; k++) {
    let z = a.indexOf(0),
      opts = neighbors(z),
      i = opts[(Math.random() * opts.length) | 0];
    [a[i], a[z]] = [a[z], a[i]];
  }
  let g = grid(
    3,
    a.map((v) => v || ""),
    (i) => {
      let z = a.indexOf(0);
      if (!neighbors(z).includes(i)) return;
      [a[i], a[z]] = [a[z], a[i]];
      moves++;
      [...g.children].forEach((b, j) => (b.textContent = a[j] || ""));
      say(moves + " moves");
      if (a.every((v, j) => v === (j + 1) % 9)) {
        say("Solved in " + moves + " moves!");
        best(Math.max(1, 500 - moves));
      }
    },
  );
}
function word() {
  shell("Guess an Arabic word one letter at a time. You get 7 mistakes.");
  let words = ["coding", "school", "computer", "cairo", "library", "music"],
    w = words[(Math.random() * words.length) | 0],
    guessed = new Set(),
    miss = 0,
    done = false;
  $("#arena").innerHTML = '<h2 id="letters"></h2>';
  grid(7, [..."abcdefghijklmnopqrstuvwxyz"], (i, b) => {
    if (done || b.disabled) return;
    b.disabled = true;
    let c = b.textContent;
    guessed.add(c);
    if (!w.includes(c)) miss++;
    draw();
  });
  $("#arena").insertAdjacentHTML("afterbegin", '<h2 id="letters"></h2>');
  function draw() {
    $("#letters").textContent = [...w]
      .map((c) => (guessed.has(c) ? c : "_"))
      .join(" ");
    say("Mistakes: " + miss + " / 7");
    if ([...w].every((c) => guessed.has(c))) {
      say("You got it! The word is " + w);
      best(7 - miss);
      done = true;
    } else if (miss >= 7) {
      say("Out of tries. The word was : " + w);
      done = true;
    }
  }
  draw();
}
function lights() {
  shell(
    "Each tap changes that square and its four neighbors. Turn them all off. The puzzle starts from a solved board, so it always has a solution.",
  );
  let a = Array(25).fill(false),
    moves = 0;
  function flip(i) {
    [i, i - 5, i + 5, i % 5 ? i - 1 : -1, i % 5 < 4 ? i + 1 : -1]
      .filter((j) => j >= 0 && j < 25)
      .forEach((j) => (a[j] = !a[j]));
  }
  for (let k = 0; k < 12; k++) flip((Math.random() * 25) | 0);
  let g = grid(
    5,
    a.map((v) => (v ? "☀" : "·")),
    (i) => {
      flip(i);
      moves++;
      draw();
      if (a.every((v) => !v)) {
        say("Turned them all off in " + moves + " moves!");
        best(Math.max(1, 200 - moves));
      }
    },
  );
  function draw() {
    [...g.children].forEach((b, i) => {
      b.textContent = a[i] ? "☀" : "·";
      b.style.background = a[i] ? "#caab54" : "#172132";
    });
  }
  draw();
}
let audio;
async function tone(f, t = 0.18) {
  audio ??= new AudioContext();
  await audio.resume();
  let o = audio.createOscillator(),
    g = audio.createGain();
  o.connect(g);
  g.connect(audio.destination);
  o.frequency.value = f;
  g.gain.setValueAtTime(0.12, audio.currentTime);
  g.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + t);
  o.start();
  o.stop(audio.currentTime + t);
}
function simon() {
  shell(
    "Tap Start, remember the color and tone sequence, then repeat it. Sound starts after your first tap.",
  );
  let seq = [],
    pos = 0,
    locked = true,
    run = 0;
  let g = grid(2, ["🟥", "🟩", "🟦", "🟨"], async (i) => {
    if (locked) return;
    flash(i);
    if (i !== seq[pos]) {
      locked = true;
      say("Wrong sequence. You reached level " + seq.length);
      best(seq.length - 1);
      return;
    }
    if (++pos === seq.length) {
      locked = true;
      timer = setTimeout(next, 650);
    }
  });
  [...g.children].forEach((b, i) => {
    b.style.background = ["#b94d60", "#368b73", "#447bc2", "#b89335"][i];
    b.style.color = "white";
    b.textContent = String(i + 1);
  });
  $("#controls").innerHTML = '<button id="begin">Start the tune</button>';
  $("#begin").onclick = () => {
    run++;
    seq = [];
    next();
  };
  async function flash(i) {
    let b = g.children[i];
    b.style.filter = "brightness(2)";
    tone([262, 330, 392, 523][i]);
    setTimeout(() => (b.style.filter = ""), 240);
  }
  async function next() {
    let token = run;
    locked = true;
    pos = 0;
    seq.push((Math.random() * 4) | 0);
    say("Watch and listen to level " + seq.length);
    for (let i of seq) {
      if (token !== run) return;
      flash(i);
      await new Promise((r) => setTimeout(r, 480));
    }
    locked = false;
    say("Your turn!");
  }
  clean = () => {
    run++;
    locked = true;
  };
}
function maze() {
  shell(
    "Guide the green dot to the golden exit. Use the arrow keys or movement buttons.",
  );
  let n = 11,
    a = Array(n * n).fill(1),
    seen = new Set([12]);
  function carve(i) {
    a[i] = 0;
    let x = i % n,
      y = (i / n) | 0;
    for (let [dx, dy] of [
      [2, 0],
      [-2, 0],
      [0, 2],
      [0, -2],
    ].sort(() => Math.random() - 0.5)) {
      let nx = x + dx,
        ny = y + dy,
        j = ny * n + nx;
      if (nx > 0 && nx < n - 1 && ny > 0 && ny < n - 1 && !seen.has(j)) {
        seen.add(j);
        a[i + dx / 2 + (dy / 2) * n] = 0;
        carve(j);
      }
    }
  }
  carve(12);
  let pos = 12,
    end = 108,
    moves = 0,
    g = grid(
      n,
      a.map((v) => (v ? "▪" : "")),
      () => {},
    );
  function draw() {
    [...g.children].forEach((b, i) => {
      b.textContent = i === pos ? "●" : i === end ? "★" : a[i] ? "▪" : "";
      b.style.cssText =
        "padding:0;font-size:16px;background:" +
        (a[i] ? "#3d4d67" : "#141b25") +
        ";color:" +
        (i === pos ? "#99e2b5" : "#e8c477");
    });
  }
  controls((key) => {
    let d = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -n, ArrowDown: n }[key],
      j = pos + d;
    if (d && !a[j] && j >= 0 && j < n * n) {
      pos = j;
      moves++;
      draw();
      if (pos === end) {
        say("Finished in " + moves + " steps!");
        best(Math.max(1, 200 - moves));
      }
    }
  });
  draw();
}
function whack() {
  shell("You have 30 seconds. Tap the circle to score a point.");
  let target = 0,
    left = 30,
    done = false,
    g = grid(4, Array(16).fill(""), (i) => {
      if (done || i !== target) return;
      score++;
      best(score);
      move();
    });
  function move() {
    target = (Math.random() * 16) | 0;
    [...g.children].forEach(
      (b, i) => (b.textContent = i === target ? "🎯" : "·"),
    );
  }
  move();
  timer = setInterval(() => {
    say(
      "Time: " + --left + " sec · points: · Time is up! Your score: " + score,
    );
    if (left <= 0) {
      clearInterval(timer);
      done = true;
      say(
        "Solve as many problems as you can in 60 seconds. Each correct answer earns a point. " +
          score,
      );
    } else move();
  }, 1000);
}
function math() {
  shell("Your answer.");
  let left = 60,
    answer,
    done = false;
  $("#arena").innerHTML =
    '<h2 id="question" dir="ltr"></h2><form id="answerForm"><input id="answer" type="number" inputmode="numeric" aria-label="Answer" required><button>Correct! Points: </button></form>';
  function next() {
    let a = (1 + Math.random() * 20) | 0,
      b = (1 + Math.random() * 20) | 0,
      m = Math.random() > 0.5;
    answer = m ? a + b : a * b;
    $("#question").textContent = `${a} ${m ? "+" : "×"} ${b} = ?`;
    $("#answer").value = "";
  }
  $("#answerForm").onsubmit = (e) => {
    e.preventDefault();
    if (done) return;
    if (+$("#answer").value === answer) {
      score++;
      best(score);
      say("The answer was " + score);
    } else say("Time is up. You scored " + answer);
    next();
  };
  next();
  timer = setInterval(() => {
    if (--left <= 0) {
      clearInterval(timer);
      done = true;
      say(" points " + score + " Time left: ");
      $("#answer").disabled = true;
    } else
      $("#question").title =
        " sec " +
        left +
        " Collect the food with the arrow keys or movement buttons. Avoid the walls and your own tail.";
  }, 1000);
}
function canvasGame() {
  let rules = {
    snake:
      "Move the paddle with touch, mouse, or arrow keys. Break all the bricks.",
    breakout:
      "Move your paddle on the left with touch or the up and down keys. First to 7 wins.",
    pong: "Tap the playfield or the ● button.",
    "sky-hop":
      "or press Space to fly. Pass between the columns. ● Game playfield.",
  };
  shell(rules[id]);
  $("#arena").innerHTML =
    '<canvas width="560" height="420" id="board" tabindex="0" aria-label="Points: "></canvas>';
  let c = $("#board"),
    g = c.getContext("2d"),
    active = true,
    started = false,
    last = 0,
    elapsed = 0,
    keys = {},
    dir = [1, 0],
    pending = dir,
    snake = [
      [8, 8],
      [7, 8],
      [6, 8],
    ],
    food = [15, 10],
    ball = { x: 280, y: 300, vx: 3, vy: -3 },
    paddle = 230,
    enemy = 180,
    lives = 3,
    opponent = 0,
    bird = 180,
    vy = 0,
    pipes = [],
    spawn = 0,
    bricks = Array.from({ length: 36 }, (_, i) => ({
      x: 14 + (i % 9) * 60,
      y: 30 + ((i / 9) | 0) * 24,
      on: true,
    }));
  function key(k) {
    started = true;
    keys[k] = true;
    setTimeout(() => (keys[k] = false), 140);
    if (id === "snake") {
      let d = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      }[k];
      if (d && !(d[0] === -dir[0] && d[1] === -dir[1])) pending = d;
    }
    if (k === " " && id === "sky-hop") vy = -5;
  }
  controls(key);
  document.addEventListener("keyup", up);
  function up(e) {
    keys[e.key] = false;
  }
  function point(e) {
    let r = c.getBoundingClientRect();
    return [
      ((e.clientX - r.left) * 560) / r.width,
      ((e.clientY - r.top) * 420) / r.height,
    ];
  }
  c.onpointermove = (e) => {
    let [x, y] = point(e);
    if (id === "breakout") paddle = Math.min(460, Math.max(0, x - 50));
    if (id === "pong") paddle = Math.min(340, Math.max(0, y - 40));
  };
  c.onpointerdown = (e) => {
    started = true;
    c.setPointerCapture(e.pointerId);
    if (id === "sky-hop") vy = -5;
  };
  const end = (t) => {
    active = false;
    say(t + " · Game over " + score);
    best(score);
  };
  function tick(t) {
    if (!active) return;
    if (!started) {
      g.fillStyle = "#101827";
      g.fillRect(0, 0, 560, 420);
      g.fillStyle = "#b9a4ed";
      g.font = "20px sans-serif";
      g.textAlign = "center";
      g.fillText("Tap the arena or a movement button to start", 280, 210, 520);
      requestAnimationFrame(tick);
      return;
    }
    let dt = Math.min(2, (t - last) / 16.67 || 1);
    last = t;
    elapsed += dt;
    g.fillStyle = "#101827";
    g.fillRect(0, 0, 560, 420);
    g.fillStyle = "#9bd6c8";
    if (id === "snake") {
      if (elapsed > 8) {
        elapsed = 0;
        dir = pending;
        let h = [snake[0][0] + dir[0], snake[0][1] + dir[1]],
          eat = h[0] === food[0] && h[1] === food[1],
          body = eat ? snake : snake.slice(0, -1);
        if (
          h[0] < 0 ||
          h[0] >= 28 ||
          h[1] < 0 ||
          h[1] >= 21 ||
          body.some((p) => p[0] === h[0] && p[1] === h[1])
        )
          return end("Hit a column");
        snake.unshift(h);
        if (eat) {
          score++;
          do {
            food = [(Math.random() * 28) | 0, (Math.random() * 21) | 0];
          } while (snake.some((p) => p[0] === food[0] && p[1] === food[1]));
        } else snake.pop();
      }
      snake.forEach((p) => g.fillRect(p[0] * 20 + 1, p[1] * 20 + 1, 18, 18));
      g.fillStyle = "#f8b87e";
      g.fillRect(food[0] * 20 + 1, food[1] * 20 + 1, 18, 18);
    } else if (id === "sky-hop") {
      vy += 0.25 * dt;
      bird += vy * dt;
      spawn += dt;
      if (spawn > 100) {
        spawn = 0;
        pipes.push({ x: 560, y: 70 + Math.random() * 200, counted: false });
      }
      g.beginPath();
      g.arc(100, bird, 12, 0, Math.PI * 2);
      g.fill();
      for (let p of pipes) {
        p.x -= 2.3 * dt;
        g.fillRect(p.x, 0, 50, p.y - 65);
        g.fillRect(p.x, p.y + 65, 50, 420 - p.y - 65);
        if (
          p.x < 112 &&
          p.x + 50 > 88 &&
          (bird - 12 < p.y - 65 || bird + 12 > p.y + 65)
        )
          return end("Left the playfield");
        if (p.x + 50 < 88 && !p.counted) {
          p.counted = true;
          score++;
        }
      }
      pipes = pipes.filter((p) => p.x > -60);
      if (bird < 12 || bird > 408) return end("Out of lives");
    } else {
      if (id === "breakout") {
        if (keys.ArrowLeft) paddle -= 7 * dt;
        if (keys.ArrowRight) paddle += 7 * dt;
        paddle = Math.max(0, Math.min(460, paddle));
        g.fillRect(paddle, 395, 100, 12);
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        if (ball.x < 7 || ball.x > 553) ball.vx *= -1;
        if (ball.y < 7) ball.vy = Math.abs(ball.vy);
        if (
          ball.vy > 0 &&
          ball.y > 385 &&
          ball.y < 410 &&
          ball.x > paddle &&
          ball.x < paddle + 100
        ) {
          ball.vy = -Math.abs(ball.vy);
          ball.vx = (ball.x - paddle - 50) / 12;
        }
        for (let b of bricks)
          if (b.on) {
            g.fillStyle = `hsl(${b.y * 3},55%,65%)`;
            g.fillRect(b.x, b.y, 54, 18);
            if (
              ball.x > b.x - 6 &&
              ball.x < b.x + 60 &&
              ball.y > b.y - 6 &&
              ball.y < b.y + 24
            ) {
              b.on = false;
              ball.vy *= -1;
              score++;
            }
          }
        if (ball.y > 430) {
          if (--lives <= 0) return end("You broke all the bricks!");
          ball = { x: 280, y: 300, vx: 3, vy: -3 };
        }
        if (bricks.every((b) => !b.on)) return end("You win!");
      } else {
        if (keys.ArrowUp) paddle -= 6 * dt;
        if (keys.ArrowDown) paddle += 6 * dt;
        paddle = Math.max(0, Math.min(340, paddle));
        enemy += Math.sign(ball.y - enemy - 40) * 2.2 * dt;
        enemy = Math.max(0, Math.min(340, enemy));
        ball.x += ball.vx * dt;
        ball.y += ball.vy * dt;
        if (ball.y < 8 || ball.y > 412) ball.vy *= -1;
        if (
          ball.vx < 0 &&
          ball.x < 28 &&
          ball.x > 15 &&
          ball.y > paddle &&
          ball.y < paddle + 80
        )
          ball.vx = Math.abs(ball.vx) + 0.15;
        if (
          ball.vx > 0 &&
          ball.x > 532 &&
          ball.x < 545 &&
          ball.y > enemy &&
          ball.y < enemy + 80
        )
          ball.vx = -Math.abs(ball.vx) - 0.15;
        if (ball.x < 0 || ball.x > 560) {
          ball.x > 560 ? score++ : opponent++;
          ball = { x: 280, y: 210, vx: score % 2 ? 3 : -3, vy: 2 };
          if (score >= 7 || opponent >= 7)
            return end(
              score >= 7 ? "The computer wins this round!" : "Points: ",
            );
        }
        g.fillRect(15, paddle, 12, 80);
        g.fillRect(533, enemy, 12, 80);
      }
      g.fillStyle = "#fff";
      g.beginPath();
      g.arc(ball.x, ball.y, 7, 0, 7);
      g.fill();
    }
    say(
      " · lives: " +
        score +
        (id === "breakout"
          ? " · : " + lives
          : id === "pong"
            ? " : " + opponent
            : ""),
    );
    requestAnimationFrame(tick);
  }
  clean = () => {
    active = false;
    document.removeEventListener("keyup", up);
  };
  requestAnimationFrame(tick);
}
window.addEventListener("pagehide", () => {
  clean();
  clearInterval(timer);
});
start();
