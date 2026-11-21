let s = load("fair-share", { people: ["Alex", "Sam", "Jordan"], expenses: [] });
function render() {
  save("fair-share", s);
  $("#people").innerHTML = s.people
    .map((n) => `<span class="pill">${esc(n)}</span>`)
    .join("");
  $("#payer").innerHTML = s.people
    .map((n, i) => `<option value="${i}">${esc(n)}</option>`)
    .join("");
  $("#participants").innerHTML = s.people
    .map(
      (n, i) =>
        `<label style="display:block"><input type="checkbox" data-person="${i}" checked> ${esc(n)}</label>`,
    )
    .join("");
  let balances = Object.fromEntries(s.people.map((p) => [p, 0])),
    total = 0;
  s.expenses.forEach((e) => {
    total += e.cents;
    balances[e.payer] += e.cents;
    let base = Math.floor(e.cents / e.people.length),
      rem = e.cents % e.people.length;
    e.people.forEach((p, i) => (balances[p] -= base + (i < rem ? 1 : 0)));
  });
  $("#stats").innerHTML = [
    ["Total group spend", money(total / 100)],
    ["Group members", s.people.length],
    ["Expenses", s.expenses.length],
  ]
    .map(
      ([k, v]) =>
        `<div class="panel"><span class="muted">${k}</span><div class="metric">${v}</div></div>`,
    )
    .join("");
  $("#expenses").innerHTML =
    s.expenses
      .map(
        (e) =>
          `<div class="item row"><div><strong>${esc(e.title)}</strong><p>${esc(e.payer)} paid ${money(e.cents / 100)} · ${e.people.length} people</p></div><button data-del="${e.id}" aria-label="Delete expense">×</button></div>`,
      )
      .join("") || "<p>No expenses yet.</p>";
  $$("[data-del]").forEach(
    (b) =>
      (b.onclick = () => {
        s.expenses = s.expenses.filter((e) => e.id !== +b.dataset.del);
        render();
      }),
  );
  let creditors = Object.entries(balances)
      .filter(([p, v]) => v > 0)
      .map((x) => [...x]),
    debtors = Object.entries(balances)
      .filter(([p, v]) => v < 0)
      .map(([p, v]) => [p, -v]),
    out = [];
  for (let d of debtors)
    for (let c of creditors) {
      let n = Math.min(d[1], c[1]);
      if (n) {
        out.push(
          `<div class="item row"><span>${esc(d[0])} → ${esc(c[0])}</span><strong>${money(n / 100)}</strong></div>`,
        );
        d[1] -= n;
        c[1] -= n;
      }
    }
  $("#settlements").innerHTML =
    out.join("") || "<p>All balanced. Nothing to settle.</p>";
}
$("#addPerson").onsubmit = (e) => {
  e.preventDefault();
  let p = $("#person").value.trim();
  if (!p || s.people.includes(p)) return toast("Enter a new unique name");
  s.people.push(p);
  $("#person").value = "";
  render();
};
$("#add").onsubmit = (e) => {
  e.preventDefault();
  let people = $$("[data-person]:checked").map(
    (x) => s.people[+x.dataset.person],
  );
  if (!people.length) return toast("Select at least one person");
  s.expenses.push({
    id: Date.now(),
    title: $("#title").value.trim(),
    cents: Math.round(+$("#amount").value * 100),
    payer: s.people[+$("#payer").value],
    people,
  });
  $("#title").value = "";
  $("#amount").value = "";
  render();
};
$("#export").onclick = () =>
  download("fair-share.json", JSON.stringify(s, null, 2));
render();
