const instruments = [
  ["AAPL", "Apple", 189.5],
  ["MSFT", "Microsoft", 415.2],
  ["NVDA", "NVIDIA", 125.8],
  ["AMZN", "Amazon", 186.4],
  ["GOOGL", "Alphabet", 171.2],
  ["BTC", "Bitcoin", 67420],
];
let s = load("nova-v1", {
  cash: 100000,
  positions: {},
  orders: [],
  session: 1,
  prices: instruments.map((x) => x[2]),
  history: instruments.map((x) =>
    Array.from(
      { length: 40 },
      (_, i) => x[2] * (0.94 + i * 0.0015 + Math.sin(i * 0.6) * 0.012),
    ),
  ),
});
s.history.forEach((h, i) => (h[h.length - 1] = s.prices[i]));
for (let id of ["asset", "symbol"])
  $("#" + id).innerHTML = instruments
    .map((x, i) => `<option value="${i}">${x[0]} · ${x[1]}</option>`)
    .join("");
function total() {
  return (
    s.cash +
    Object.entries(s.positions).reduce(
      (a, [i, p]) => a + p.qty * s.prices[i],
      0,
    )
  );
}
function estimate() {
  $("#estimate").textContent = money(
    s.prices[$("#symbol").value] * Number($("#qty").value || 0),
  );
}
function chart() {
  let i = +$("#asset").value,
    c = $("#chart"),
    g = c.getContext("2d"),
    v = s.history[i],
    mn = Math.min(...v) * 0.995,
    mx = Math.max(...v) * 1.005;
  $("#chartTitle").textContent = instruments[i][0] + " / " + instruments[i][1];
  g.clearRect(0, 0, 900, 300);
  g.strokeStyle = "#303441";
  g.fillStyle = "#969eaf";
  g.font = "12px sans-serif";
  for (let y = 20; y < 280; y += 55) {
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(900, y);
    g.stroke();
    g.fillText(money(mx - ((y - 20) / 250) * (mx - mn)), 8, y - 5);
  }
  g.beginPath();
  v.forEach((x, j) => {
    let px = (j / (v.length - 1)) * 900,
      py = 280 - ((x - mn) / (mx - mn)) * 250;
    j ? g.lineTo(px, py) : g.moveTo(px, py);
  });
  g.strokeStyle = "#c2a6ff";
  g.lineWidth = 3;
  g.stroke();
  g.lineTo(900, 300);
  g.lineTo(0, 300);
  g.closePath();
  let grad = g.createLinearGradient(0, 0, 0, 300);
  grad.addColorStop(0, "#a780ef50");
  grad.addColorStop(1, "#a780ef00");
  g.fillStyle = grad;
  g.fill();
}
function render() {
  save("nova-v1", s);
  let value = total(),
    gain = value - 100000;
  $("#metrics").innerHTML = [
    ["Portfolio value", money(value)],
    ["Virtual cash", money(s.cash)],
    ["Total return", `${gain >= 0 ? "+" : ""}${(gain / 1000).toFixed(2)}%`],
    ["Trading session", String(s.session).padStart(3, "0")],
  ]
    .map(
      (x) =>
        `<div class="panel"><span class="muted">${x[0]}</span><div class="metric">${x[1]}</div></div>`,
    )
    .join("");
  $("#markets").innerHTML =
    "<table><tr><th>Instrument</th><th>Simulated price</th><th>Session change</th></tr>" +
    instruments
      .map((x, i) => {
        let h = s.history[i],
          change = (h.at(-1) / h.at(-2) - 1) * 100;
        return `<tr><td><strong>${x[0]}</strong> <span class="muted">${x[1]}</span></td><td>${money(s.prices[i])}</td><td class="${change >= 0 ? "positive" : "negative"}">${change.toFixed(2)}%</td></tr>`;
      })
      .join("") +
    "</table>";
  $("#positions").innerHTML = Object.keys(s.positions).length
    ? "<table><tr><th>Asset</th><th>Qty</th><th>Avg cost</th><th>Unrealized P/L</th></tr>" +
      Object.entries(s.positions)
        .map(
          ([i, p]) =>
            `<tr><td>${instruments[i][0]}</td><td>${p.qty}</td><td>${money(p.cost)}</td><td class="${s.prices[i] >= p.cost ? "positive" : "negative"}">${money((s.prices[i] - p.cost) * p.qty)}</td></tr>`,
        )
        .join("") +
      "</table>"
    : '<div class="empty">Your first position starts with a virtual order.</div>';
  $("#history").innerHTML = s.orders.length
    ? "<table><tr><th>Session</th><th>Side / asset</th><th>Qty</th><th>Price</th></tr>" +
      s.orders
        .slice()
        .reverse()
        .slice(0, 12)
        .map(
          (o) =>
            `<tr><td>${o.session}</td><td>${o.side.toUpperCase()} ${o.symbol}</td><td>${o.qty}</td><td>${money(o.price)}</td></tr>`,
        )
        .join("") +
      "</table>"
    : '<div class="empty">No trades yet.</div>';
  estimate();
  chart();
}
$("#trade").onsubmit = (e) => {
  e.preventDefault();
  let i = +$("#symbol").value,
    n = +$("#qty").value,
    side = $("#side").value,
    p = s.prices[i],
    pos = s.positions[i] || { qty: 0, cost: 0 };
  if (!Number.isInteger(n) || n < 1)
    return toast("Enter a positive whole quantity");
  if (side === "buy") {
    if (p * n > s.cash) return toast("Not enough virtual cash");
    s.positions[i] = {
      qty: pos.qty + n,
      cost: (pos.cost * pos.qty + p * n) / (pos.qty + n),
    };
    s.cash -= p * n;
  } else {
    if (n > pos.qty) return toast("Not enough shares to sell");
    s.cash += p * n;
    pos.qty -= n;
    if (!pos.qty) delete s.positions[i];
    else s.positions[i] = pos;
  }
  s.orders.push({
    session: s.session,
    side,
    symbol: instruments[i][0],
    qty: n,
    price: p,
  });
  render();
  toast("Virtual order filled");
};
$("#step").onclick = () => {
  s.session++;
  s.prices = s.prices.map((p, i) => {
    let next = +(p * (1 + (Math.random() - 0.49) * 0.045)).toFixed(2);
    s.history[i].push(next);
    s.history[i] = s.history[i].slice(-70);
    return next;
  });
  render();
};
$("#reset").onclick = () => {
  if (confirm("Reset all virtual trades and return to $100,000?")) {
    localStorage.removeItem("nova-v1");
    location.reload();
  }
};
$("#export").onclick = () =>
  download("nova-trades.json", JSON.stringify(s, null, 2));
$("#symbol").onchange = estimate;
$("#qty").oninput = estimate;
$("#asset").onchange = chart;
render();
