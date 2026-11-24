const $ = (s) => document.querySelector(s),
  app = $("#app"),
  id = document.body.dataset.app;
const en = document.documentElement.lang === "en";
const T = (ar, english) => (en ? english : ar);
function status(t) {
  $("#status").textContent = t;
}
function escape(s) {
  let e = document.createElement("span");
  e.textContent = s;
  return e.innerHTML;
}
function file(name, text, type = "text/plain") {
  let u = URL.createObjectURL(new Blob([text], { type })),
    a = document.createElement("a");
  a.href = u;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(u), 5000);
}
async function translator() {
  app.innerHTML = `<div class="notice">${T("الترجمة بتستخدم خدمة MyMemory العامة. الكلام بيتبعت للخدمة بس لما تدوس ترجم. بلاش بيانات شخصية أو سرية. الحد المجاني بيتغيّر حسب الخدمة والـIP.", "Translation uses the public MyMemory service. Text is sent only when you press Translate. Do not send private or sensitive content. Free quotas depend on the service and IP.")}</div><div class="tools"><label>${T("من", "From")}<select id="from"></select></label><button id="swap">⇄ ${T("بدّل", "Swap")}</button><label>${T("إلى", "To")}<select id="to"></select></label><label>${T("افتح نص", "Open text")}<input id="import" type="file" accept=".txt,text/plain"></label></div><div class="split"><section class="panel"><label for="input">${T("اكتب اللي عايز تترجمه", "Text to translate")}</label><textarea id="input" maxlength="3000" placeholder="${T("جرّب جملة قصيرة الأول…", "Try a short sentence first…")}"></textarea><p id="count">0 / 3000</p><button class="primary" id="translate">${T("ترجم الكلام", "Translate")}</button><button id="cancel">${T("إلغاء", "Cancel")}</button></section><section class="panel"><h2>${T("الترجمة", "Translation")}</h2><output id="output" dir="auto"></output><div class="tools"><button id="copy">${T("انسخ", "Copy")}</button><button id="speak">${T("اسمع", "Listen")}</button><button id="download">${T("نزّل TXT", "Save TXT")}</button></div></section></div><p id="status" role="status"></p><p>${T("الترجمة آلية وممكن تغلط. الترجمة الطويلة بتتقسم لطلبات صغيرة، والحد اليومي ممكن يوقفها. مش بنعرض ترجمة وهمية لو الخدمة وقفت.", "Machine translation can be wrong. Longer text is split into small requests and daily quotas may apply. Service errors are never replaced with fake translations.")}</p>`;
  let languages = [
    ["ar", "العربي / Arabic"],
    ["en", "English"],
    ["fr", "Français"],
    ["de", "Deutsch"],
    ["es", "Español"],
    ["it", "Italiano"],
    ["pt", "Português"],
    ["tr", "Türkçe"],
    ["ru", "Русский"],
    ["zh-CN", "中文"],
    ["ja", "日本語"],
    ["ko", "한국어"],
    ["hi", "हिन्दी"],
    ["ur", "اردو"],
    ["fa", "فارسی"],
    ["nl", "Nederlands"],
    ["el", "Ελληνικά"],
    ["id", "Bahasa Indonesia"],
    ["sv", "Svenska"],
    ["pl", "Polski"],
  ];
  for (let sel of [$("#from"), $("#to")])
    for (let [code, name] of languages) sel.add(new Option(name, code));
  $("#from").value = en ? "en" : "ar";
  $("#to").value = en ? "ar" : "en";
  let controller;
  $("#input").oninput = () =>
    ($("#count").textContent = $("#input").value.length + " / 3000");
  $("#swap").onclick = () => {
    let a = $("#from").value;
    $("#from").value = $("#to").value;
    $("#to").value = a;
    if ($("#output").textContent) {
      $("#input").value = $("#output").textContent;
      $("#output").textContent = "";
      $("#input").oninput();
    }
  };
  $("#import").onchange = async () => {
    let f = $("#import").files[0];
    if (f) {
      $("#input").value = (await f.text()).slice(0, 3000);
      $("#input").oninput();
    }
  };
  $("#cancel").onclick = () => controller?.abort();
  $("#translate").onclick = async () => {
    let text = $("#input").value.trim();
    if (!text) return status(T("اكتب حاجة الأول.", "Enter some text first."));
    if ($("#from").value === $("#to").value) {
      $("#output").textContent = text;
      return status(
        T(
          "نفس اللغة، مفيش ترجمة مطلوبة.",
          "Same language, no translation needed.",
        ),
      );
    }
    controller?.abort();
    controller = new AbortController();
    $("#translate").disabled = true;
    $("#output").textContent = "";
    let chunks = [];
    for (let rest = text; rest; ) {
      let n = Math.min(400, rest.length);
      if (n < rest.length) {
        let stop = rest.lastIndexOf(" ", n);
        if (stop > 150) n = stop;
      }
      chunks.push(rest.slice(0, n));
      rest = rest.slice(n);
    }
    let translated = [];
    try {
      for (let i = 0; i < chunks.length; i++) {
        status(
          T("بنترجم الجزء ", "Translating part ") +
            (i + 1) +
            " / " +
            chunks.length,
        );
        let timeout = setTimeout(() => controller.abort(), 30000),
          r;
        try {
          r = await fetch(
            "https://api.mymemory.translated.net/get?" +
              new URLSearchParams({
                q: chunks[i],
                langpair: $("#from").value + "|" + $("#to").value,
              }),
            { signal: controller.signal },
          );
        } finally {
          clearTimeout(timeout);
        }
        if (!r.ok) throw Error("HTTP " + r.status);
        let data = await r.json();
        if (+data.responseStatus !== 200 || !data.responseData?.translatedText)
          throw Error(data.responseDetails || "Service quota/error");
        let d = document.createElement("textarea");
        d.innerHTML = data.responseData.translatedText;
        translated.push(d.value);
      }
      $("#output").textContent = translated.join(" ");
      status(
        T(
          "الترجمة جاهزة · المصدر MyMemory",
          "Translation ready · Source: MyMemory",
        ),
      );
    } catch (e) {
      status(
        e.name === "AbortError"
          ? T("الطلب اتلغى أو أخد وقت طويل.", "Request cancelled or timed out.")
          : T(
              "الخدمة مش متاحة أو الحد المجاني خلص. جرّب نص أقصر أو ارجع بعدين. ",
              "Service unavailable or quota reached. Try a shorter text or return later. ",
            ) + e.message,
      );
      if (translated.length) $("#output").textContent = translated.join(" ");
    } finally {
      $("#translate").disabled = false;
    }
  };
  $("#copy").onclick = () =>
    navigator.clipboard
      .writeText($("#output").textContent)
      .then(() => status(T("اتنسخت.", "Copied.")))
      .catch(() =>
        status(
          T("اختار الكلام وانسخه يدوي.", "Select and copy the text manually."),
        ),
      );
  $("#download").onclick = () =>
    file("translation.txt", $("#output").textContent);
  $("#speak").onclick = () => {
    if (!("speechSynthesis" in window))
      return status(
        T(
          "المتصفح مش بيدعم قراءة الصوت.",
          "Speech is not supported in this browser.",
        ),
      );
    speechSynthesis.cancel();
    let u = new SpeechSynthesisUtterance($("#output").textContent);
    u.lang = $("#to").value;
    let voices = speechSynthesis.getVoices();
    if (!voices.some((v) => v.lang.startsWith(u.lang.split("-")[0])))
      status(
        T(
          "الصوت المتاح حسب الأصوات المثبتة على جهازك.",
          "Available voices depend on your device.",
        ),
      );
    speechSynthesis.speak(u);
  };
}
async function editor() {
  app.innerHTML = `<div class="notice">${T("٢٠ لغة للتلوين والتحرير. التشغيل هنا للـHTML وCSS وJavaScript بس، جوه معاينة معزولة. باقي اللغات مش بتتنفّذ، ومفيش سيرفر بيشغّل كودك. الملفات بتتحفظ على الجهاز بس لما تختار احفظ.", "20 languages for editing and syntax highlighting. Only HTML, CSS and JavaScript run here, in a sandboxed preview. Other languages are not executed. No server runs your code. Files stay local when you save.")}</div><div class="tools"><select id="files" aria-label="Files"></select><button id="add">${T("ملف جديد", "New file")}</button><button id="remove">${T("امسح الملف", "Delete file")}</button><select id="language" aria-label="Language"></select><button id="save">${T("احفظ المشروع", "Save workspace")}</button><button id="restore">${T("افتح المحفوظ", "Restore")}</button><button id="export">${T("نزّل المشروع", "Export workspace")}</button><button id="download">${T("نزّل الملف", "Download file")}</button><label>${T("استيراد", "Import")}<input id="import" type="file" accept=".json,.html,.js,.css,.py,.ts,.java,.cpp,.c,.cs,.go,.rs,.php,.rb,.swift,.kt,.sql,.md,.txt"></label></div><div class="tools"><input id="find" placeholder="${T("دوّر على كلمة", "Find text")}"><input id="replace" placeholder="${T("بدّلها بـ", "Replace with")}"><button id="replaceAll">${T("بدّل الكل", "Replace all")}</button><button id="run" class="primary">▶ ${T("شغّل معاينة الويب", "Run web preview")}</button></div><div class="split"><section class="panel" style="padding:0;overflow:hidden"><div id="monaco" dir="ltr" style="height:480px"></div><textarea id="fallback" dir="ltr" style="height:480px;display:none;font-family:monospace" spellcheck="false" aria-label="Code editor"></textarea></section><section class="panel"><h2>${T("المعاينة المعزولة", "Sandboxed preview")}</h2><iframe id="preview" sandbox="allow-scripts" title="Web preview" style="width:100%;height:330px;background:white;border:0"></iframe><h3>Console</h3><pre id="console" dir="ltr" style="white-space:pre-wrap;max-height:180px;overflow:auto"></pre></section></div><p id="status" role="status">${T("بنحمّل المحرر…", "Loading editor…")}</p>`;
  const langs = [
    "html",
    "css",
    "javascript",
    "typescript",
    "python",
    "java",
    "cpp",
    "c",
    "csharp",
    "go",
    "rust",
    "php",
    "ruby",
    "swift",
    "kotlin",
    "sql",
    "json",
    "markdown",
    "xml",
    "shell",
  ];
  langs.forEach((x) => $("#language").add(new Option(x, x)));
  let files = {
      "index.html": {
        language: "html",
        text: '<h1>Hello / أهلاً بالعالم</h1>\n<button id="hello">Try me / جرّبني</button>',
      },
      "style.css": {
        language: "css",
        text: "body { font-family: sans-serif; background: #e7e4f5; padding: 30px; }\nbutton { padding: 12px; border-radius: 12px; }",
      },
      "app.js": {
        language: "javascript",
        text: 'document.querySelector("#hello").onclick = () => {\n document.querySelector("h1").textContent = "It works! / اشتغلت!";\n console.log("Button clicked");\n};',
      },
    },
    current = "index.html",
    ed;
  let get = () => (ed ? ed.getValue() : $("#fallback").value),
    set = (v) => {
      if (ed) ed.setValue(v);
      else $("#fallback").value = v;
    };
  function stash() {
    files[current] = { text: get(), language: $("#language").value };
  }
  function choose(name, save = true) {
    if (save && current in files) stash();
    current = name;
    $("#files").replaceChildren(
      ...Object.keys(files).map((n) => new Option(n, n)),
    );
    $("#files").value = name;
    $("#language").value = files[name].language;
    set(files[name].text);
    if (ed) monaco.editor.setModelLanguage(ed.getModel(), files[name].language);
  }
  $("#files").onchange = () => choose($("#files").value);
  $("#language").onchange = () => {
    if (ed) monaco.editor.setModelLanguage(ed.getModel(), $("#language").value);
    stash();
  };
  $("#add").onclick = () => {
    let name = prompt(T("اسم الملف، مثال main.py", "File name, e.g. main.py"));
    if (!name) return;
    name = name
      .trim()
      .replace(/[\\/\x00-\x1f]/g, "_")
      .slice(0, 100);
    if (!name || ["__proto__", "constructor", "prototype"].includes(name))
      return;
    if (Object.hasOwn(files, name)) return choose(name);
    stash();
    files[name] = {
      text: "",
      language:
        {
          py: "python",
          js: "javascript",
          ts: "typescript",
          html: "html",
          css: "css",
          json: "json",
          md: "markdown",
          java: "java",
          cpp: "cpp",
          c: "c",
          cs: "csharp",
          go: "go",
          rs: "rust",
          php: "php",
          rb: "ruby",
          swift: "swift",
          kt: "kotlin",
          sql: "sql",
          xml: "xml",
          sh: "shell",
        }[name.split(".").pop()] || "javascript",
    };
    choose(name, false);
  };
  $("#remove").onclick = () => {
    if (Object.keys(files).length < 2)
      return status(T("سيب ملف واحد على الأقل.", "Keep at least one file."));
    if (!confirm(T("تمسح الملف الحالي؟", "Delete current file?"))) return;
    delete files[current];
    choose(Object.keys(files)[0], false);
  };
  $("#save").onclick = () => {
    stash();
    try {
      localStorage.setItem("code-studio-workspace", JSON.stringify(files));
      status(
        T("المشروع اتحفظ على الجهاز ده.", "Workspace saved on this device."),
      );
    } catch {
      status(
        T(
          "مساحة التخزين مش كفاية. نزّل المشروع بدل كده.",
          "Storage full. Export your workspace instead.",
        ),
      );
    }
  };
  function valid(data) {
    return (
      data &&
      typeof data === "object" &&
      !Array.isArray(data) &&
      Object.keys(data).length > 0 &&
      Object.keys(data).length <= 100 &&
      Object.entries(data).every(
        ([k, v]) =>
          !["__proto__", "constructor", "prototype"].includes(k) &&
          v &&
          typeof v.text === "string" &&
          langs.includes(v.language),
      )
    );
  }
  $("#restore").onclick = () => {
    try {
      let data = JSON.parse(localStorage.getItem("code-studio-workspace"));
      if (!valid(data)) throw 0;
      files = data;
      choose(Object.keys(files)[0], false);
      status(T("فتحنا المحفوظ.", "Saved workspace restored."));
    } catch {
      status(T("مفيش مشروع محفوظ سليم.", "No valid saved workspace."));
    }
  };
  $("#export").onclick = () => {
    stash();
    file("workspace.json", JSON.stringify(files, null, 2), "application/json");
  };
  $("#download").onclick = () => {
    stash();
    file(current, files[current].text);
  };
  $("#import").onchange = async () => {
    let f = $("#import").files[0];
    if (!f) return;
    if (f.size > 2e6)
      return status(T("الحد الأقصى ٢ ميجابايت.", "Maximum file size is 2 MB."));
    let text = await f.text();
    if (f.name.endsWith(".json")) {
      try {
        let d = JSON.parse(text);
        if (valid(d)) {
          files = d;
          choose(Object.keys(files)[0], false);
          return;
        }
      } catch {}
    }
    stash();
    files[f.name] = {
      text,
      language: langs.includes(f.name.split(".").pop())
        ? f.name.split(".").pop()
        : "javascript",
    };
    choose(f.name, false);
  };
  $("#replaceAll").onclick = () => {
    let q = $("#find").value;
    if (q) set(get().split(q).join($("#replace").value));
  };
  $("#run").onclick = () => {
    stash();
    $("#console").textContent = "";
    let html = files["index.html"]?.text || "",
      css = Object.values(files)
        .filter((f) => f.language === "css")
        .map((f) => f.text)
        .join("\n"),
      js = Object.values(files)
        .filter((f) => f.language === "javascript")
        .map((f) => f.text)
        .join("\n");
    let bridge =
      '<script>for(const k of ["log","warn","error"]){console[k]=(...a)=>parent.postMessage({studioConsole:true,text:k+": "+a.map(x=>{try{return typeof x==="object"?JSON.stringify(x):String(x)}catch{return "[object]"}}).join(" ")},"*")}window.onerror=(m)=>console.error(m);<\/script>';
    let base =
      "<meta http-equiv=\"Content-Security-Policy\" content=\"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; connect-src 'none'; form-action 'none'\"><style>" +
      css +
      "</style>" +
      bridge;
    $("#preview").srcdoc =
      base +
      html +
      "<script>" +
      js.replace(/<\/script/gi, "<\\/script") +
      "<\/script>";
    status(
      T(
        "المعاينة اتحدّثت. مفيش وصول لشبكة أو بيانات الموقع من الكود ده.",
        "Preview updated. Preview code cannot access the network or site data.",
      ),
    );
  };
  window.addEventListener("message", (e) => {
    if (e.source === $("#preview").contentWindow && e.data?.studioConsole)
      $("#console").textContent = (
        String(e.data.text).slice(0, 5000) +
        "\n" +
        $("#console").textContent
      ).slice(0, 12000);
  });
  choose(current, false);
  try {
    await new Promise((resolve, reject) => {
      let s = document.createElement("script");
      s.src =
        "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/loader.js";
      s.onload = resolve;
      s.onerror = reject;
      document.head.append(s);
      setTimeout(reject, 20000);
    });
    window.MonacoEnvironment = {
      getWorkerUrl: () =>
        URL.createObjectURL(
          new Blob(
            [
              `self.MonacoEnvironment={baseUrl:'https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/'};importScripts('https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs/base/worker/workerMain.js');`,
            ],
            { type: "text/javascript" },
          ),
        ),
    };
    require.config({
      paths: { vs: "https://cdn.jsdelivr.net/npm/monaco-editor@0.52.2/min/vs" },
    });
    await new Promise((resolve, reject) =>
      require(["vs/editor/editor.main"], resolve, reject),
    );
    ed = monaco.editor.create($("#monaco"), {
      value: files[current].text,
      language: files[current].language,
      theme: "vs-dark",
      automaticLayout: true,
      minimap: { enabled: false },
      fontSize: 15,
      wordWrap: "on",
      scrollBeyondLastLine: false,
    });
    status(
      T(
        "المحرر جاهز · Ctrl+F للبحث وCtrl+H للاستبدال.",
        "Editor ready · Ctrl+F to find and Ctrl+H to replace.",
      ),
    );
  } catch {
    $("#monaco").style.display = "none";
    $("#fallback").style.display = "block";
    choose(current, false);
    status(
      T(
        "تحميل Monaco وقف، فتحنا محرر نص بديل. التلوين والإكمال محتاجين اتصال بالإنترنت.",
        "Monaco could not load. Plain-text fallback is active; syntax highlighting and completion need internet.",
      ),
    );
  }
  $("#run").click();
}
async function assistant() {
  const projects = await fetch("../projects.json", { cache: "no-store" }).then(
    (r) => r.json(),
  );
  let count = projects.length;
  app.innerHTML = `<div class="notice">${T("ده شات بوت ذكي بيجاوب على أي سؤال، وكمان بيعرف معلومات المعرض ومشروعات أحمد. لو النت أو الخدمة وقفت بيرجع للبحث السريع في المعرض.", "A smart chatbot that answers any question, and also knows Ahmed portfolio and projects. If the AI service is unreachable it falls back to quick portfolio search.")}</div><section class="panel"><div class="tools"><button id="enableAI" class="primary">${T("شغّل البحث الذكي بالمعنى", "Enable semantic AI search")}</button><button id="clear">${T("امسح المحادثة", "Clear chat")}</button></div><p>${T("أول تشغيل بيحمّل نموذج حجمه حوالي ١١٨ ميجابايت من Hugging Face. ممكن ياخد وقت، وبعدها بيتخزن في كاش المتصفح. أسئلتك بتتعالج على جهازك ومش بتتبعت لخدمة شات.", "First use downloads an approximately 118 MB model from Hugging Face and may take time. The browser can cache it. Questions are processed on your device, not sent to a chat service.")}</p><div class="tools"><button data-q="${T("مين أحمد؟", "Who is Ahmed?")}">${T("مين أحمد؟", "About Ahmed")}</button><button data-q="${T("ألعاب", "games")}">${T("عايز ألعب", "Find games")}</button><button data-q="${T("محرر كود", "code editor")}">${T("أدوات البرمجة", "Coding tools")}</button></div><div class="chatlog" id="chat" aria-live="polite"></div><form id="ask"><label for="question">${T("اسأل أي سؤال", "Ask anything")}</label><div class="tools"><input id="question" maxlength="400" required placeholder="${T("اكتب سؤالك…", "Type your question…")}"><button id="send">${T("اسأل", "Ask")}</button></div></form><p id="status" role="status">${T("الوضع الحالي: بحث سريع بالكلمات، من غير نموذج AI.", "Current mode: quick keyword search, no AI model loaded.")}</p></section>`;
  const docs = [
    {
      title: T("عن أحمد طارق", "About Ahmed Tarek"),
      text: T(
        "أحمد طارق مطوّر واجهات ويب من مصر. بيحوّل الأفكار لمواقع وتطبيقات تفاعلية. معلوماته المنشورة هنا هي المرجع، ومفيش بيانات خاصة متاحة للمساعد.",
        "Ahmed Tarek is a frontend web developer from Egypt who builds interactive websites and apps. Only his published portfolio information is available here.",
      ),
      keys: "احمد أحمد مين صاحب الموقع مطور معلوماته Ahmed owner developer who profile",
      url: "../#about",
    },
    {
      title: T("عن المعرض", "About the portfolio"),
      text: T(
        `المعرض فيه ${count} مشروع. الألعاب ١٥ مشروع والإبداع ١٥ مشروع. البيانات في أغلب الأدوات بتتحفظ على الجهاز. المتجر للتجربة بأسعار تجريبية والطقس من Open-Meteo.`,
        `The portfolio has ${count} projects, including 15 Games and 15 Creative projects. Most tools save on your device. Store prices are demonstrations; weather comes from Open-Meteo.`,
      ),
      keys: "كام عدد مشاريع معلومات موقع معرض total count site portfolio",
      url: "../#work",
    },
    ...projects.map((p) => ({
      title: p[1],
      text:
        p[3] +
        (p[0] === "noise-maker"
          ? T(
              " أصوات ثابتة للتركيز والنوم والاسترخاء، من غير موسيقى.",
              " Steady background sounds for concentration, focus, sleep and relaxation, without music.",
            )
          : ""),
      keys: p.join(" "),
      url: "../" + p[0] + "/",
    })),
  ];
  let embed = null,
    vectors = [],
    busy = false;
  function add(label, text, links = []) {
    let a = document.createElement("article"),
      b = document.createElement("strong"),
      p = document.createElement("p");
    b.textContent = label;
    p.textContent = text;
    a.append(b, p);
    for (let d of links) {
      let link = document.createElement("a");
      link.href = d.url;
      link.textContent = d.title + " ↗";
      link.style.display = "block";
      link.target = "_top";
      a.append(link);
    }
    $("#chat").append(a);
    $("#chat").scrollTop = $("#chat").scrollHeight;
  }
  function normal(s) {
    return s
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/ة/g, "ه")
      .replace(/[ًٌٍَُِّْ]/g, "");
  }
  const history = [];
  async function answer(q) {
    if (busy) return;
    busy = true;
    $("#send").disabled = true;
    add(T("إنت", "You"), q);
    const wait = document.createElement("article");
    wait.innerHTML = "<strong></strong><p></p>";
    wait.children[0].textContent = T("المساعد", "Assistant");
    wait.children[1].textContent = "…";
    $("#chat").append(wait);
    $("#chat").scrollTop = $("#chat").scrollHeight;
    try {
      const siteInfo = docs
        .slice(0, 2)
        .map((d) => d.title + ": " + d.text)
        .join("\n") +
        "\nProjects (id | name | category | description):\n" +
        projects.map((p) => p[0] + " | " + p[1] + " | " + p[2] + " | " + p[3]).join("\n");
      const system =
        "You are the smart AI assistant inside Ahmed Tarek's portfolio website (Ahmed is a frontend web developer from Egypt). You are a general-purpose, helpful chatbot: answer ANY question on any topic (general knowledge, coding, math, writing, advice, translation, chat), not only questions about the site. When the user asks about Ahmed or the site's projects, use the site information below and never invent personal details such as phone numbers, age or private data. Reply in the user's language; if they write Arabic, use natural Egyptian colloquial Arabic. Be concise and friendly. Site information:\n" +
        siteInfo.slice(0, 9000);
      history.push({ role: "user", content: q });
      const res = await fetch("https://text.pollinations.ai/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "openai-fast",
          messages: [{ role: "system", content: system }, ...history.slice(-12)],
        }),
      });
      if (!res.ok) throw new Error("http " + res.status);
      const data = await res.json();
      const reply = (data.choices?.[0]?.message?.content || "").trim();
      if (!reply) throw new Error("empty");
      history.push({ role: "assistant", content: reply });
      wait.remove();
      add(T("المساعد", "Assistant"), reply);
      busy = false;
      $("#send").disabled = false;
      return;
    } catch (err) {
      history.pop();
      wait.remove();
      busy = false;
      return localAnswer(q, true);
    }
  }
  async function localAnswer(q, silent) {
    if (busy && !silent) return;
    busy = true;
    $("#send").disabled = true;
    if (!silent) add(T("إنت", "You"), q);
    try {
      let n = normal(q),
        words = n.split(/\W+/u).filter(Boolean);
      words = n.split(/[\s؟?.,،!]+/).filter((w) => w.length > 1);
      let aliases = {
        noise: "ضوضاء",
        كود: "code",
        مترجم: "translator",
        العاب: "ألعاب",
        ابداع: "إبداع",
        music: "صوت",
      };
      let expanded =
        n +
        " " +
        Object.entries(aliases)
          .filter(([k, v]) => n.includes(k))
          .map(([k, v]) => v)
          .join(" ");
      let ranked = docs.map((d, i) => ({
        d,
        i,
        score:
          normal(d.title + " " + d.keys)
            .split(/[\s/.,]+/)
            .reduce(
              (s, w) =>
                s +
                (words.some((q) => w.includes(q) || q.includes(w)) &&
                w.length > 1
                  ? 1
                  : 0),
              0,
            ) + (normal(d.title).includes(n) ? 8 : 0),
      }));
      if (embed) {
        let out = await embed(q, { pooling: "mean", normalize: true }),
          v = Array.from(out.data);
        ranked.forEach(
          (r) => (r.score = v.reduce((s, x, j) => s + x * vectors[r.i][j], 0)),
        );
        ranked.sort((a, b) => b.score - a.score);
        if (ranked[0].score < 0.3) ranked = [];
      } else ranked.sort((a, b) => b.score - a.score);
      if (/احمد|صاحب|who.*ahmed|owner|about ahmed/.test(n))
        ranked = [{ d: docs[0], score: 10 }];
      else if (/كام|عدد|how many|total/.test(n))
        ranked = [{ d: docs[1], score: 10 }];
      const intents = [
        [
          /كود|اكواد|برمج|بايثون|جافا|code|python|javascript|programming|editor/i,
          "code-studio",
        ],
        [/ترجم|مترجم|translation|translate|translator/i, "translator"],
        [/ضوض|اصوات ثابته|noise|background sound|steady sound/i, "noise-maker"],
        [/طقس|الجو|weather|forecast/i, "weather-now"],
        [/سوبر|متجر|منتجات|سوق|تسوق|shop|store|grocer|products/i, "shop-lane"],
        [/لحن|نغم|موسيقي|music|synth|piano/i, "sound-lab"],
      ];
      const intent = intents.find(([pattern]) => pattern.test(n));
      if (intent) {
        const doc = docs.find((d) => d.url === "../" + intent[1] + "/");
        if (doc) ranked = [{ d: doc, score: 10 }];
      }
      if (
        /رقم.*(احمد|تليفون|موبايل)|عمر.*احمد|كلمه.*سر|phone|password|private|age.*ahmed/.test(
          n,
        )
      ) {
        add(
          T("المساعد", "Assistant"),
          T(
            "المعلومة دي مش موجودة في معلومات المعرض المنشورة اللي عندي. مش هخمن بيانات شخصية. تقدر تشوف وسيلة التواصل اللي أحمد ناشرها في الموقع.",
            "That is not in my published portfolio knowledge. I will not guess personal details. You can see Ahmed's published contact option on the site.",
          ),
          [{ title: T("التواصل", "Contact"), url: "../#contact" }],
        );
        return;
      }
      let group = /العاب|games/.test(n)
        ? T("ألعاب", "Games")
        : /ابداع|creative/.test(n)
          ? T("إبداع", "Creative")
          : null;
      if (group) {
        let matches = projects.filter((p) => p[2] === group);
        add(
          T("المساعد", "Assistant"),
          T(
            "عندك هنا " + matches.length + " مشروع، اختار اللي يعجبك:",
            "There are " + matches.length + " projects in this category:",
          ),
          matches.map((p) => ({ title: p[1], url: "../" + p[0] + "/" })),
        );
      } else {
        let top = ranked
          .filter(
            (r) =>
              r.score > 0 &&
              (!embed || r.score >= (ranked[0]?.score || 0) - 0.04),
          )
          .slice(0, 3);
        if (!top.length)
          add(
            T("المساعد", "Assistant"),
            T(
              "معنديش إجابة موثوقة عن ده. اسألني عن أحمد أو مشروع موجود في المعرض.",
              "I do not have a reliable answer to that. Ask about Ahmed or a project in this portfolio.",
            ),
          );
        else
          add(
            T("المساعد", "Assistant"),
            top.map((r) => r.d.title + ": " + r.d.text).join("\n\n"),
            top.map((r) => r.d),
          );
      }
    } catch (e) {
      add(
        T("المساعد", "Assistant"),
        T("البحث وقف، جرّب تاني.", "Search failed. Please try again."),
      );
    } finally {
      busy = false;
      $("#send").disabled = false;
    }
  }
  $("#ask").onsubmit = (e) => {
    e.preventDefault();
    let q = $("#question").value.trim();
    if (q) {
      $("#question").value = "";
      answer(q);
    }
  };
  document
    .querySelectorAll("[data-q]")
    .forEach((b) => (b.onclick = () => answer(b.dataset.q)));
  $("#clear").onclick = () => $("#chat").replaceChildren();
  $("#enableAI").onclick = async () => {
    if (embed) return;
    $("#enableAI").disabled = true;
    status(
      T(
        "بنحمّل النموذج. ممكن ياخد كام دقيقة، وسيب الصفحة مفتوحة.",
        "Downloading the model. This may take a few minutes; keep this page open.",
      ),
    );
    try {
      let { pipeline, env } =
        await import("https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.7.3/dist/transformers.min.js");
      env.allowLocalModels = false;
      env.backends.onnx.wasm.numThreads = 1;
      embed = await pipeline(
        "feature-extraction",
        "Xenova/paraphrase-multilingual-MiniLM-L12-v2",
        { dtype: "q8", device: "wasm" },
      );
      status(
        T(
          "النموذج جاهز، بنفهرس معلومات المعرض…",
          "Model loaded. Indexing portfolio knowledge…",
        ),
      );
      let result = await embed(
        docs.map((d) => d.title + ". " + d.text),
        { pooling: "mean", normalize: true },
      );
      let dim = result.dims[1];
      vectors = docs.map((_, i) =>
        Array.from(result.data.slice(i * dim, (i + 1) * dim)),
      );
      $("#enableAI").textContent = T(
        "الذكاء الاصطناعي شغّال على جهازك ✓",
        "On-device AI is running ✓",
      );
      status(
        T(
          "الوضع الحالي: بحث بالمعنى باستخدام نموذج متعدد اللغات. الإجابات مقتبسة من معلومات الموقع، مش نص مولّد.",
          "Current mode: multilingual semantic AI retrieval. Answers come from site information, not generated text.",
        ),
      );
      window.portfolioAIReady = true;
    } catch (e) {
      embed = null;
      vectors = [];
      $("#enableAI").disabled = false;
      status(
        T(
          "تحميل النموذج وقف. البحث السريع لسه شغّال، جرّب اتصال أقوى.",
          "Model loading failed. Quick search still works; try a stronger connection.",
        ),
      );
    }
  };
  if (new URLSearchParams(location.search).has("embed")) {
    document.querySelector("header").remove();
    document.querySelector(".titlebar").remove();
    document.querySelector("main").style.padding = "10px";
    document.querySelector(".workspace").style.maxWidth = "100%";
    document.body.classList.add("embedded-assistant");
    document.querySelector(".notice").textContent = T(
      "شات بوت ذكي. اسأل في أي حاجة، أو عن أحمد ومشروعاته.",
      "Smart chatbot. Ask me anything, or about Ahmed and his projects.",
    );
    const panel = document.querySelector(".panel"),
      chat = $("#chat"),
      form = $("#ask"),
      suggestions = document.querySelector("[data-q]").parentElement;
    const modelTools = $("#enableAI").parentElement,
      modelNote = modelTools.nextElementSibling;
    const advanced = document.createElement("details"),
      summary = document.createElement("summary");
    summary.textContent = T(
      "البحث الذكي بالمعنى · تنزيل ١١٨ ميجابايت",
      "Semantic AI search · 118 MB download",
    );
    advanced.append(summary, modelNote, modelTools);
    const mode = $("#status");
    panel.replaceChildren(chat, form, suggestions, advanced, mode);
    add(
      T("المساعد", "Assistant"),
      T(
        "أهلاً! اسألني في أي حاجة، أو عن أحمد ومشروعاته.",
        "Hi! Ask me anything, or about Ahmed and his projects.",
      ),
    );
  }
}
({ translator, "code-studio": editor, "site-assistant": assistant })
  [id]()
  .catch((e) => {
    app.textContent = T(
      "الصفحة مقدرتش تحمل، حدّثها وجرب تاني.",
      "Could not load this page. Refresh and try again.",
    );
    console.error(e);
  });
