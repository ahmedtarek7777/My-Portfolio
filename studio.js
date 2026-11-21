const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
function load(k, d) {
  try {
    return JSON.parse(localStorage.getItem(k)) ?? d;
  } catch {
    return d;
  }
}
function save(k, v) {
  localStorage.setItem(k, JSON.stringify(v));
}
function toast(t) {
  let e = $("#toast");
  if (!e) {
    e = document.createElement("div");
    e.id = "toast";
    e.setAttribute("role", "status");
    document.body.append(e);
  }
  e.textContent = t;
  e.hidden = false;
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => (e.hidden = true), 3500);
}
function download(name, text, type = "application/json") {
  let a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([text], { type }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(n);
}
document.body.classList.toggle("light", load("studio-light", false));
$("#theme").onclick = () => {
  document.body.classList.toggle("light");
  save("studio-light", document.body.classList.contains("light"));
};
