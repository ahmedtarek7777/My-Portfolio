let s = load("stock-room", {
  products: [
    {
      id: 1,
      name: "Apple MacBook Pro",
      sku: "LAP-001",
      price: 1999,
      qty: 12,
      threshold: 5,
      image: "../assets/products/0.webp",
    },
    {
      id: 2,
      name: "Asus Zenbook",
      sku: "LAP-002",
      price: 1499,
      qty: 3,
      threshold: 5,
      image: "../assets/products/1.webp",
    },
  ],
  log: [],
});
function render() {
  save("stock-room", s);
  $("#stats").innerHTML = [
    ["Unique products", s.products.length],
    [
      "Inventory value",
      money(s.products.reduce((a, p) => a + p.qty * p.price, 0)),
    ],
    ["Low-stock alerts", s.products.filter((p) => p.qty <= p.threshold).length],
  ]
    .map(
      ([k, v]) =>
        `<div class="panel"><span class="muted">${k}</span><div class="metric">${v}</div></div>`,
    )
    .join("");
  $("#products").innerHTML =
    s.products
      .filter(
        (p) =>
          (p.name + p.sku)
            .toLowerCase()
            .includes($("#search").value.toLowerCase()) &&
          (!$("#low").checked || p.qty <= p.threshold),
      )
      .map(
        (p) =>
          `<article class="item"><div class="row"><div class="actions" style="align-items:center">${p.image ? `<img src="${p.image}" alt="${esc(p.name)}" width="80" height="70" style="object-fit:contain;background:#ecebf0;border-radius:8px">` : ""}<div><h3>${esc(p.name)}</h3><small>${esc(p.sku)} · ${money(p.price)}</small></div></div><span class="pill" style="color:${p.qty <= p.threshold ? "var(--red)" : "var(--green)"}">${p.qty} in stock</span></div><div class="actions" style="margin-top:15px"><button data-move="${p.id}" data-sign="1">Receive stock</button><button data-move="${p.id}" data-sign="-1">Dispatch</button><button data-del="${p.id}">Remove</button></div></article>`,
      )
      .join("") || "<p>No products match.</p>";
  $$("[data-move]").forEach(
    (b) =>
      (b.onclick = () => {
        let p = s.products.find((p) => p.id === +b.dataset.move),
          raw = prompt(
            "Quantity to " + (+b.dataset.sign > 0 ? "receive" : "dispatch"),
            "1",
          );
        if (raw === null) return;
        let n = Number(raw);
        if (!Number.isInteger(n) || n <= 0)
          return toast("Enter a positive whole quantity");
        let change = n * +b.dataset.sign;
        if (p.qty + change < 0) return toast("Insufficient stock");
        p.qty += change;
        s.log.push({ name: p.name, change, date: new Date().toLocaleString() });
        render();
      }),
  );
  $$("[data-del]").forEach(
    (b) =>
      (b.onclick = () => {
        if (confirm("Remove this inventory item?")) {
          s.products = s.products.filter((p) => p.id !== +b.dataset.del);
          render();
        }
      }),
  );
  $("#log").innerHTML =
    s.log
      .slice()
      .reverse()
      .slice(0, 12)
      .map(
        (l) =>
          `<div class="item"><strong>${esc(l.name)}</strong><p>${l.change > 0 ? "+" : ""}${l.change} units · ${esc(l.date)}</p></div>`,
      )
      .join("") || "<p>No movements recorded.</p>";
}
$("#add").onsubmit = (e) => {
  e.preventDefault();
  let sku = $("#sku").value.trim();
  if (s.products.some((p) => p.sku === sku)) return toast("SKU must be unique");
  s.products.push({
    id: Date.now(),
    name: $("#name").value.trim(),
    sku,
    price: +$("#price").value,
    qty: +$("#qty").value,
    threshold: +$("#threshold").value,
  });
  $("#add").reset();
  render();
};
$("#search").oninput = render;
$("#low").onchange = render;
$("#export").onclick = () =>
  download("stock-room.json", JSON.stringify(s, null, 2));
render();
