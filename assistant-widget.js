(() => {
  let ar = document.documentElement.lang.startsWith("ar"),
    button = document.createElement("button"),
    panel = document.createElement("div");
  button.className = "assistant-launch primary";
  button.textContent = ar
    ? "اسأل مساعد المعرض ✦"
    : "Ask the portfolio assistant ✦";
  button.setAttribute("aria-expanded", "false");
  panel.className = "assistant-dialog";
  panel.hidden = true;
  button.onclick = () => {
    panel.hidden = !panel.hidden;
    button.textContent = panel.hidden ? (ar ? "اسأل مساعد المعرض ✦" : "Ask the portfolio assistant ✦") : (ar ? "اقفل المساعد ×" : "Close assistant ×");
    button.setAttribute("aria-expanded", !panel.hidden);
    if (!panel.hidden && !panel.firstChild) {
      let frame = document.createElement("iframe");
      frame.title = ar ? "مساعد المعرض" : "Portfolio assistant";
      frame.src = "site-assistant/?embed=1";
      panel.append(frame);
    }
  };
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      panel.hidden = true;
      button.setAttribute("aria-expanded", "false");
    }
  });
  document.body.append(button, panel);
})();
