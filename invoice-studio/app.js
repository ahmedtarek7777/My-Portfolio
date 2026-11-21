let d = load("invoice-draft", {
  business: "Your Studio",
  client: "Example Client",
  number: "INV-001",
  due: "",
  tax: 0,
  discount: 0,
  notes: "Thank you for your business.",
  items: [{ description: "Website design", qty: 1, rate: 1200 }],
});
for (let k of [
  "business",
  "client",
  "number",
  "due",
  "tax",
  "discount",
  "notes",
])
  $("#" + k).value = d[k];
function render() {
  for (let k of ["business", "client", "number", "due", "notes"])
    d[k] = $("#" + k).value;
  d.tax = Math.max(0, Math.min(100, +$("#tax").value || 0));
  d.discount = Math.max(0, +$("#discount").value || 0);
  $("#numberPreview").textContent = d.number;
  $("#clientPreview").innerHTML =
    `<h3>${esc(d.business)}</h3><p>Bill to: <strong>${esc(d.client)}</strong><br>Due: ${esc(d.due || "On receipt")}</p>`;
  $("#lines").innerHTML =
    "<table><tr><th>Service</th><th>Qty</th><th>Rate</th><th>Total</th></tr>" +
    d.items
      .map(
        (x) =>
          `<tr><td>${esc(x.description)}</td><td>${x.qty}</td><td>${money(x.rate)}</td><td>${money(x.rate * x.qty)}</td></tr>`,
      )
      .join("") +
    "</table>";
  let sub = d.items.reduce((a, x) => a + x.rate * x.qty, 0),
    discount = Math.min(sub, d.discount),
    tax = ((sub - discount) * d.tax) / 100;
  $("#totals").innerHTML =
    `<p style="text-align:right">Subtotal ${money(sub)}<br>Discount −${money(discount)}<br>Tax ${money(tax)}</p><h2 style="text-align:right">Total ${money(sub - discount + tax)}</h2>`;
  $("#notePreview").textContent = d.notes;
  $("#editLines").innerHTML = d.items
    .map(
      (x, i) =>
        `<div class="item row"><span>${esc(x.description)}</span><button data-del="${i}" aria-label="Delete line item">×</button></div>`,
    )
    .join("");
  $$("[data-del]").forEach(
    (b) =>
      (b.onclick = () => {
        d.items.splice(+b.dataset.del, 1);
        render();
      }),
  );
}
$("#details").oninput = render;
$("#add").onsubmit = (e) => {
  e.preventDefault();
  d.items.push({
    description: $("#description").value.trim(),
    qty: +$("#qty").value,
    rate: +$("#rate").value,
  });
  $("#description").value = "";
  render();
};
$("#save").onclick = () => {
  save("invoice-draft", d);
  toast("Draft saved on this device");
};
$("#print").onclick = () => window.print();
$("#download").onclick = () =>
  download(d.number + ".json", JSON.stringify(d, null, 2));
render();
