(() => {
  const ar = document.documentElement.lang.startsWith("ar");
  const T = (a, e) => (ar ? a : e);
  const css = document.createElement("style");
  css.textContent = `
.ai-fab{position:fixed;bottom:22px;${ar ? "left" : "right"}:22px;z-index:60;display:flex;align-items:center;gap:10px;border:1px solid var(--line,#2c2d34);background:var(--panel,#191b21);color:var(--text,#f1f0f3);padding:8px 18px 8px 8px;border-radius:999px;cursor:pointer;font:600 14px inherit;font-family:inherit;box-shadow:0 10px 30px #0006;transition:transform .2s,box-shadow .2s}
.ai-fab:hover{transform:translateY(-3px);box-shadow:0 14px 34px #0008}
.ai-fab .ai-orb{position:relative;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-size:21px;color:#18141f;background:linear-gradient(135deg,var(--accent,#bca0f5),#7fd6ff)}
.ai-fab .ai-orb::after{content:"";position:absolute;inset:0;border-radius:50%;border:2px solid var(--accent,#bca0f5);animation:ai-pulse 2.4s ease-out infinite}
.ai-fab .ai-dot{position:absolute;top:2px;${ar ? "left" : "right"}:2px;width:11px;height:11px;border-radius:50%;background:#4ade80;border:2px solid var(--panel,#191b21)}
.ai-tip{position:fixed;bottom:84px;${ar ? "left" : "right"}:26px;z-index:60;background:var(--panel,#191b21);color:var(--text,#f1f0f3);border:1px solid var(--line,#2c2d34);padding:9px 30px 9px 14px;border-radius:14px;font-size:13px;box-shadow:0 8px 24px #0005;animation:ai-in .5s .8s both}
.ai-tip button{position:absolute;top:3px;${ar ? "left" : "right"}:4px;border:0;background:none;color:var(--muted,#96969f);cursor:pointer;font-size:15px}
.ai-win{position:fixed;bottom:22px;${ar ? "left" : "right"}:22px;z-index:61;width:min(390px,calc(100vw - 24px));height:min(600px,calc(100vh - 44px));display:flex;flex-direction:column;background:var(--bg,#101115);border:1px solid var(--line,#2c2d34);border-radius:22px;overflow:hidden;box-shadow:0 24px 70px #000a;transform-origin:bottom ${ar ? "left" : "right"};animation:ai-open .28s cubic-bezier(.2,.9,.3,1.2)}
.ai-win[hidden],.ai-fab[hidden],.ai-tip[hidden]{display:none}
.ai-win header{display:flex;align-items:center;gap:12px;padding:14px 16px;background:linear-gradient(135deg,var(--accent,#bca0f5),#7fd6ff);color:#18141f}
.ai-win header .ai-orb{width:38px;height:38px;border-radius:50%;background:#ffffff55;display:grid;place-items:center;font-size:18px}
.ai-win header b{display:block;font-size:15px}.ai-win header small{font-size:12px;opacity:.8}
.ai-win header small::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#16a34a;margin-inline-end:5px}
.ai-win header div{flex:1}
.ai-win header button{border:0;background:#ffffff44;color:inherit;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px}
.ai-win iframe{flex:1;border:0;width:100%;background:transparent}
@keyframes ai-pulse{0%{transform:scale(1);opacity:.6}100%{transform:scale(1.5);opacity:0}}
@keyframes ai-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes ai-open{from{opacity:0;transform:scale(.85) translateY(20px)}to{opacity:1;transform:none}}
@media(max-width:520px){.ai-win{inset:0;width:100%;height:100%;border-radius:0}}`;
  const fab = document.createElement("button");
  fab.className = "ai-fab";
  fab.setAttribute("aria-label", T("افتح المساعد", "Open assistant"));
  fab.innerHTML = `<span class="ai-orb">✦<i class="ai-dot"></i></span><span>${T("اسألني أي حاجة", "Ask me anything")}</span>`;
  const tip = document.createElement("div");
  tip.className = "ai-tip";
  tip.innerHTML = `<span>${T("محتاج مساعدة؟ 👋", "Need a hand? 👋")}</span><button aria-label="x">×</button>`;
  const win = document.createElement("div");
  win.className = "ai-win";
  win.hidden = true;
  win.innerHTML = `<header><span class="ai-orb">✦</span><div><b>${T("مساعد المعرض", "Portfolio Assistant")}</b><small>${T("متصل", "Online")}</small></div><button aria-label="${T("اقفل", "Close")}">×</button></header>`;
  const open = () => {
    win.hidden = false; fab.hidden = true; tip.hidden = true;
    if (!win.querySelector("iframe")) {
      const f = document.createElement("iframe");
      f.title = T("مساعد المعرض", "Portfolio assistant");
      f.src = "site-assistant/?embed=1&v=12";
      win.append(f);
    }
  };
  const close = () => { win.hidden = true; fab.hidden = false; };
  fab.onclick = open;
  tip.querySelector("button").onclick = () => (tip.hidden = true);
  win.querySelector("button").onclick = close;
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !win.hidden) close(); });
  setTimeout(() => { tip.hidden = true; }, 12000);
  document.head.append(css);
  document.body.append(fab, tip, win);
})();
