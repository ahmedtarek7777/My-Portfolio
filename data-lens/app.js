let headers = [],
  rows = [],
  sortCol = -1,
  asc = true;
function parse(text) {
  let out = [],
    row = [],
    cell = "",
    quoted = false;
  for (let i = 0; i < text.length; i++) {
    let c = text[i];
    if (c === '"') {
      if (quoted && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else quoted = !quoted;
    } else if (c === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((c === "\n" || c === "\r") && !quoted) {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell);
      if (row.some((x) => x !== "")) out.push(row);
      row = [];
      cell = "";
    } else cell += c;
  }
  if (quoted) throw Error("Unclosed quoted cell");
  row.push(cell);
  if (row.some((x) => x !== "")) out.push(row);
  return out;
}
function loadData(text) {
  try {
    let parsed = parse(text.replace(/^\uFEFF/, ""));
    if (parsed.length < 2) throw Error("Need a header and at least one row");
    headers = parsed.shift();
    if (headers.length > 30 || parsed.length > 10000)
      throw Error("Limit: 30 columns and 10,000 rows");
    if (parsed.some((r) => r.length !== headers.length))
      throw Error("Each row must have the same number of columns");
    rows = parsed;
    sortCol = -1;
    $("#group").innerHTML = headers
      .map((h, i) => `<option value="${i}">${esc(h)}</option>`)
      .join("");
    let numeric = headers
      .map((h, i) => i)
      .filter((i) =>
        rows.every((r) => r[i].trim() !== "" && Number.isFinite(Number(r[i]))),
      );
    $("#measure").innerHTML = numeric
      .map((i) => `<option value="${i}">${esc(headers[i])}</option>`)
      .join("");
    render();
  } catch (e) {
    toast("CSV error: " + e.message);
  }
}
function filtered() {
  let q = $("#search").value.toLowerCase();
  let list = rows.filter((r) => r.join(" ").toLowerCase().includes(q));
  if (sortCol >= 0)
    list.sort((a, b) => {
      let x = a[sortCol],
        y = b[sortCol],
        n =
          x.trim() !== "" &&
          y.trim() !== "" &&
          Number.isFinite(+x) &&
          Number.isFinite(+y)
            ? +x - +y
            : x.localeCompare(y);
      return asc ? n : -n;
    });
  return list;
}
function render() {
  let list = filtered(),
    m = $("#measure").value,
    valid = m !== "" && m !== null;
  $("#stats").innerHTML = [
    ["Visible rows", list.length],
    ["Columns", headers.length],
    [
      "Measure total",
      valid
        ? list
            .reduce((a, r) => a + Number(r[m]), 0)
            .toLocaleString(undefined, { maximumFractionDigits: 2 })
        : "No numeric column",
    ],
  ]
    .map(
      ([k, v]) =>
        `<div class="panel"><span class="muted">${k}</span><div class="metric">${v}</div></div>`,
    )
    .join("");
  $("#table").innerHTML =
    "<table><thead><tr>" +
    headers
      .map(
        (h, i) =>
          `<th><button data-sort="${i}">${esc(h)} ${sortCol === i ? (asc ? "↑" : "↓") : "↕"}</button></th>`,
      )
      .join("") +
    "</tr></thead><tbody>" +
    list
      .slice(0, 200)
      .map(
        (r) => "<tr>" + r.map((c) => `<td>${esc(c)}</td>`).join("") + "</tr>",
      )
      .join("") +
    "</tbody></table>";
  $$("[data-sort]").forEach(
    (b) =>
      (b.onclick = () => {
        let c = +b.dataset.sort;
        asc = sortCol === c ? !asc : true;
        sortCol = c;
        render();
      }),
  );
  let totals = Object.create(null);
  if (valid)
    list.forEach((r) => {
      let k = r[$("#group").value];
      totals[k] = (totals[k] || 0) + Number(r[m]);
    });
  let data = Object.entries(totals)
      .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
      .slice(0, 8),
    g = $("#chart").getContext("2d");
  g.clearRect(0, 0, 600, 380);
  g.font = "13px sans-serif";
  let max = Math.max(1, ...data.map((x) => Math.abs(x[1])));
  data.forEach(([k, v], i) => {
    g.fillStyle = v >= 0 ? "#bca0f5" : "#ff899a";
    g.fillRect(150, 20 + i * 43, (Math.abs(v) / max) * 330, 24);
    g.fillStyle = "#969eaf";
    g.fillText(k.slice(0, 17), 0, 37 + i * 43);
    g.fillText(v.toFixed(1), 490, 37 + i * 43);
  });
  $("#summary").textContent = valid
    ? "Sum of " +
      headers[m] +
      " by " +
      headers[$("#group").value] +
      ". Showing up to eight groups; table preview limited to 200 rows."
    : "Choose a CSV with a numeric column to chart.";
}
$("#file").onchange = async (e) => {
  let f = e.target.files[0];
  if (!f) return;
  if (f.size > 2 * 1024 * 1024) return toast("Use a CSV under 2 MB");
  loadData(await f.text());
};
$("#sample").onclick = () =>
  loadData(
    "Region,Product,Revenue,Units\nNorth,Laptop,4200,4\nSouth,Phone,2800,7\nEast,Laptop,6100,6\nWest,Tablet,1800,5\nNorth,Phone,3500,8\nSouth,Tablet,2200,6\nEast,Phone,4800,10\nWest,Laptop,3900,4",
  );
$("#search").oninput = render;
$("#group").onchange = render;
$("#measure").onchange = render;
$("#export").onclick = () => {
  let cell = (s) => {
    let v = String(s);
    if (/^\s*[=+@-]/.test(v)) v = "'" + v;
    return '"' + v.replace(/"/g, '""') + '"';
  };
  download(
    "data-lens.csv",
    [headers, ...filtered()].map((r) => r.map(cell).join(",")).join("\r\n"),
    "text/csv",
  );
};
$("#sample").onclick();
