const rows = 12,
  cols = 20,
  N = rows * cols;
let board = Array(N).fill(0),
  start = 21,
  end = 218,
  busy = false,
  cancel = 0;
function render() {
  $("#board").innerHTML = board
    .map(
      (v, i) =>
        `<button data-cell="${i}" aria-label="Cell ${Math.floor(i / cols) + 1}, ${(i % cols) + 1}" style="padding:0;aspect-ratio:1;border-radius:3px;min-width:0;background:${i === start ? "#4a9c76" : i === end ? "#bd6987" : v === 1 ? "#676b78" : v === 5 ? "#604a88" : "#242833"};font-size:9px">${i === start ? "S" : i === end ? "E" : v === 5 ? "5" : ""}</button>`,
    )
    .join("");
  $$("[data-cell]").forEach(
    (b) =>
      (b.onclick = () => {
        if (busy) return;
        let i = +b.dataset.cell,
          m = $("#mode").value;
        if (m === "start") {
          if (i === end) return;
          start = i;
          board[i] = 0;
        } else if (m === "end") {
          if (i === start) return;
          end = i;
          board[i] = 0;
        } else if (i !== start && i !== end)
          board[i] =
            m === "wall" ? (board[i] === 1 ? 0 : 1) : m === "weight" ? 5 : 0;
        render();
      }),
  );
}
function neighbors(i) {
  let out = [];
  if (i % cols) out.push(i - 1);
  if (i % cols < cols - 1) out.push(i + 1);
  if (i >= cols) out.push(i - cols);
  if (i < N - cols) out.push(i + cols);
  return out.filter((j) => board[j] !== 1);
}
$("#run").onclick = async () => {
  if (busy) return;
  busy = true;
  let token = ++cancel,
    algo = $("#algorithm").value,
    dist = Array(N).fill(Infinity),
    prev = Array(N).fill(-1),
    done = new Set(),
    q = [start],
    visited = [];
  dist[start] = 0;
  render();
  while (q.length) {
    if (algo === "dijkstra") q.sort((a, b) => dist[a] - dist[b]);
    let i = q.shift();
    if (done.has(i)) continue;
    done.add(i);
    visited.push(i);
    if (i === end) break;
    for (let j of neighbors(i)) {
      let d = dist[i] + (algo === "bfs" ? 1 : board[j] === 5 ? 5 : 1);
      if (d < dist[j]) {
        dist[j] = d;
        prev[j] = i;
        q.push(j);
      }
    }
  }
  for (let i of visited) {
    if (token !== cancel) return;
    if (i !== start && i !== end)
      $("#board").children[i].style.background = "#35566e";
    if (+$("#speed").value)
      await new Promise((r) => setTimeout(r, +$("#speed").value));
  }
  let path = [];
  if (Number.isFinite(dist[end])) {
    for (let i = end; i !== -1; i = prev[i]) path.push(i);
    path.reverse();
    for (let i of path) {
      if (i !== start && i !== end)
        $("#board").children[i].style.background = "#b99a52";
    }
  }
  $("#status").textContent = path.length
    ? `${visited.length} cells explored · ${path.length - 1} steps · Total cost ${dist[end]}`
    : `No route found. ${visited.length} cells explored.`;
  busy = false;
};
function reset(random) {
  cancel++;
  busy = false;
  board = Array.from({ length: N }, (_, i) =>
    random && i !== start && i !== end && Math.random() < 0.25 ? 1 : 0,
  );
  $("#status").textContent = "";
  render();
}
$("#maze").onclick = () => reset(true);
$("#clear").onclick = () => reset(false);
render();
