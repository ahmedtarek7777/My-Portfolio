const coverCopy = {
  "paper-trade": ["NOVA", "EXCHANGE", "VIRTUAL MARKETS / REAL CURIOSITY"],
  arcade: ["PLAY", "WITHOUT LIMITS", "FIVE GAMES. ONE PLAYGROUND."],
  "shop-lane": ["EVERYDAY", "DISCOVERIES", "50,000 REAL PRODUCT RECORDS"],
  taskly: ["MAKE", "THINGS HAPPEN", "A LITTLE CLARITY FOR YOUR DAY"],
  "weather-now": ["UNDER", "THE SAME SKY", "YOUR WORLD / YOUR WEATHER"],
  "cafe-landing": ["SLOW", "MORNINGS", "EMBER & OAK / COFFEE CULTURE"],
  "flow-board": ["IDEAS", "IN MOTION", "FROM WHAT IF TO WHAT'S NEXT"],
  "budget-lab": ["YOUR MONEY.", "YOUR DIRECTION.", "PLAN WITH PURPOSE"],
  "invoice-studio": ["GOOD WORK.", "WELL PRESENTED.", "THE FINISHING TOUCH"],
  "ink-notes": ["ROOM", "FOR THOUGHT", "CAPTURE WHAT COMES NEXT"],
  "habit-garden": ["SMALL STEPS.", "REAL GROWTH.", "A DAILY PRACTICE"],
  "focus-room": ["DO LESS.", "FOCUS MORE.", "A SPACE FOR DEEP WORK"],
  "calendar-studio": [
    "MAKE TIME",
    "FOR WHAT MATTERS",
    "YOUR DAYS / THOUGHTFULLY ARRANGED",
  ],
  "split-bills": ["SHARED MOMENTS.", "FAIR SHARES.", "KEEP THE GOOD COMPANY"],
  "client-desk": [
    "BETTER",
    "CONNECTIONS",
    "A LITTLE STRUCTURE GOES A LONG WAY",
  ],
  "stock-room": ["EVERYTHING", "IN ITS PLACE", "KNOW YOUR NEXT MOVE"],
  "route-book": ["TAKE THE", "SCENIC ROUTE", "MAKE ROOM FOR DISCOVERY"],
  "meal-studio": ["A BETTER", "KIND OF TABLE", "FRESH IDEAS / EVERY DAY"],
  "workout-log": ["SHOW UP.", "BUILD ON IT.", "YOUR PROGRESS / YOUR PACE"],
  "quiz-academy": ["STAY", "CURIOUS", "TEST AN IDEA. LEARN SOMETHING."],
  "sound-lab": ["MAKE", "SOME NOISE", "YOUR NEXT SOUND STARTS HERE"],
  "image-studio": ["A NEW", "PERSPECTIVE", "SEE WHAT A LITTLE CHANGE CAN DO"],
  pathfinder: ["FIND", "YOUR WAY", "EXPLORE THE PATH LESS OBVIOUS"],
  "type-racer": ["FIND YOUR", "RHYTHM", "ONE KEY AT A TIME"],
  "data-lens": ["SEE THE", "BIGGER PICTURE", "FROM ROWS TO REVELATIONS"],
};

Object.assign(coverCopy, {"snake": ["ONE MORE", "BITE.", "Games"], "mines": ["THINK FIRST.", "TREAD LIGHTLY.", "Games"], "connect-four": ["FOUR IN", "A ROW.", "Games"], "breakout": ["BREAK", "THROUGH.", "Games"], "sudoku": ["ONE NUMBER.", "NEW POSSIBILITIES.", "Games"], "sliding-puzzle": ["MAKE", "YOUR MOVE.", "Games"], "word-guess": ["FIND", "THE WORD.", "Games"], "lights-out": ["LIGHTS OFF.", "MIND ON.", "Games"], "simon": ["LISTEN.", "REMEMBER. REPEAT.", "Games"], "maze-run": ["THERE IS", "A WAY OUT.", "Games"], "pong": ["RETURN.", "REPEAT. WIN.", "Games"], "sky-hop": ["A LITTLE", "HIGHER.", "Games"], "whack": ["KEEP YOUR", "EYES OPEN.", "Games"], "math-duel": ["QUICK MIND.", "QUICKER MATH.", "Games"], "drawing-board": ["MAKE", "YOUR MARK.", "Creative"], "pixel-art": ["SMALL PIXELS.", "BIG IDEAS.", "Creative"], "gradient-lab": ["BETWEEN", "TWO COLORS.", "Creative"], "palette-lab": ["FIND YOUR", "TRUE COLORS.", "Creative"], "type-studio": ["LETTERS WITH", "CHARACTER.", "Creative"], "svg-studio": ["SHAPE", "AN IDEA.", "Creative"], "particle-lab": ["A LITTLE", "ATTRACTION.", "Creative"], "fractal-lab": ["INFINITELY", "CURIOUS.", "Creative"], "mandala": ["ROUND", "AND AROUND.", "Creative"], "audio-visualizer": ["SEE", "THE SOUND.", "Creative"], "noise-maker": ["A QUIETER", "KIND OF NOISE.", "Creative"], "drum-machine": ["FIND", "YOUR BEAT.", "Creative"], "pattern-lab": ["ON", "REPEAT.", "Creative"], "translator": ["WORDS", "WITHOUT BORDERS.", "Tools"], "code-studio": ["WRITE. RUN.", "MAKE IT REAL.", "Tools"], "site-assistant": ["ASK ABOUT", "THIS PLAYGROUND.", "Tools"]});
const searchAliases = {"paper-trade": ["بورصة نوفا", "مال وأعمال", "اتعلّم التداول وتابع محفظتك في بورصة تجريبية، من غير فلوس حقيقية.", "NOVA Exchange", "Finance", "Paper trading, portfolio analytics and a simulated market."], "arcade": ["ساحة الألعاب", "ألعاب", "خمس ألعاب سريعة، ونتايجك بتتحفظ عشان تتحدى نفسك كل مرة.", "PLAY / LAB", "Games", "Five games, personal bests and instant play."], "shop-lane": ["السوق المصري", "متاجر", "٥٠ ألف سجل منتج: سوبر ماركت وتقنية ومنزل، بمصادر واضحة وأسعار تجريبية بالجنيه.", "Shop Lane", "Commerce", "50,000 sourced product records across supermarket, technology and home, with demo EGP prices."], "taskly": ["مهامي", "إنتاجية", "رتّب مهامك واسحبها بالترتيب اللي يناسبك، مع وضع فاتح وغامق.", "Taskly", "Productivity", "Plan your day with drag-and-drop tasks and dark mode."], "weather-now": ["الطقس الآن", "أدوات", "اعرف الجو دلوقتي وفي الأيام الجاية، وابحث عن مدن من كل حتة في العالم.", "Weather Now", "Tools", "City search, live conditions and a five-day forecast."], "cafe-landing": ["مقهى إمبر آند أوك", "تجارب", "خد لفة في كافيه متخيّل، وشوف المنيو وجرّب نموذج الحجز من غير حجز حقيقي.", "Ember & Oak", "Experiences", "An atmospheric cafe concept and local demo booking."], "flow-board": ["لوحة المشروعات", "إنتاجية", "قسّم شغلك لمراحل، وحدد الأولويات، وانقل الكروت وخد نسخة من خطتك.", "Flow Board", "Productivity", "A project board with priorities, search, movable cards and JSON backup."], "budget-lab": ["مختبر الميزانية", "مال وأعمال", "سجّل دخلك ومصاريفك، وحدد ميزانية لكل حاجة وشوف الأرقام قدامك.", "Budget Lab", "Finance", "Income, expenses, category budgets, charts and transaction exports."], "invoice-studio": ["استوديو الفواتير", "أعمال", "اعمل فاتورة ببنود وضريبة وخصم، واحفظها أو اطبعها لما تخلص.", "Invoice Studio", "Business", "Editable line items, tax, discounts, saved drafts and print-ready invoices."], "ink-notes": ["دفتر أفكاري", "إنتاجية", "لمّ أفكارك في نوتس، وصنّفها بتاجات ودوّر فيها وقت ما تحتاج.", "Ink Notes", "Productivity", "A searchable notebook with tags, safe Markdown preview and export."], "habit-garden": ["حديقة العادات", "حياة يومية", "تابع عاداتك يوم بيوم، وشوف التزامك وتقدّمك على مدار الأسبوع.", "Habit Garden", "Lifestyle", "Habit tracking with weekly history, streaks and completion analytics."], "focus-room": ["غرفة التركيز", "إنتاجية", "ظبّط وقت التركيز والراحة، وحط مهامك قدامك وسجّل جلساتك.", "Focus Room", "Productivity", "A configurable focus timer with breaks, task queue and session log."], "calendar-studio": ["تقويم أيامي", "إنتاجية", "رتّب مواعيدك على تقويم، وعدّلها أو نزّلها عشان تضيفها لتقويمك.", "Daylight Calendar", "Productivity", "Monthly planning with event editing, reminders on the page and ICS export."], "split-bills": ["قسمة عادلة", "مال وأعمال", "اكتب مين دفع كام، واقسم الحساب واعرف مين عليه لمين.", "Fair Share", "Finance", "Group expenses, equal splits, net balances and simplified settlements."], "client-desk": ["إدارة العملاء", "أعمال", "احفظ بيانات العملاء والملاحظات، وتابع كل صفقة وصلت لفين.", "Client Desk", "Business", "A local CRM with contacts, deal stages, notes, search and pipeline value."], "stock-room": ["المخزن", "أعمال", "تابع المنتجات وحركة المخزون، وخد بالك من اللي قرب يخلص.", "Stock Room", "Business", "Inventory with real product imagery, stock movements, low-stock flags and search."], "route-book": ["دفتر الرحلات", "حياة يومية", "خطط أيام الرحلة وميزانيتها، وجهّز قائمة الشنطة وخد خطتك معاك.", "Route Book", "Lifestyle", "A multi-day itinerary builder with budgets, packing and trip exports."], "meal-studio": ["مخطط الوجبات", "حياة يومية", "اختار وصفات، وظبّط عدد الأفراد، وطلّع خطة أكل وقايمة مشتريات.", "Meal Studio", "Lifestyle", "Recipe search, serving scaling, a weekly meal plan and shopping list."], "workout-log": ["سجل التمارين", "حياة يومية", "سجّل التمارين والمجموعات والأوزان، وشوف مستواك بيتحسن إزاي.", "Rep Studio", "Lifestyle", "Workout sessions, exercise sets, training volume and personal records."], "quiz-academy": ["أكاديمية الأسئلة", "تعلّم", "جرّب معلوماتك، وافهم الإجابات وراجع تقدّمك بعد كل محاولة.", "Quiz Academy", "Learning", "Topic quizzes with explanations, review mode and progress history."], "sound-lab": ["مختبر الصوت", "إبداع", "اعمل أصوات ونغمات من المتصفح، وظبّط الإيقاع واحفظ اللحن.", "Sound Lab", "Creative", "A browser synthesizer and step sequencer with tempo, waveforms and pattern storage."], "image-studio": ["استوديو الصور", "إبداع", "عدّل الإضاءة والألوان والحجم والاتجاه، ونزّل الصورة من غير ما ترفعها لسيرفر.", "Pixel Studio", "Creative", "Private image editing with filters, rotation, resizing and PNG export."], "pathfinder": ["مكتشف المسارات", "تعلّم", "جرّب خوارزميات المسارات، وحط حواجز وأوزان وشوفها بتوصل إزاي.", "Pathfinder", "Learning", "Interactive BFS and Dijkstra pathfinding with walls, weights and animation."], "type-racer": ["سباق الكتابة", "تعلّم", "اختبر سرعتك ودقتك في الكتابة، وتابع أحسن نتايجك مع الوقت.", "Type Racer", "Learning", "Timed typing practice with live accuracy, WPM, progress and personal history."], "data-lens": ["عدسة البيانات", "أعمال", "افتح ملف CSV، ورتّب البيانات واعمل ملخصات ورسوم ونزّل النتيجة.", "Data Lens", "Business", "CSV import, numeric summaries, sortable tables, category charts and export."], "snake": ["الثعبان", "التعبان", "ألعاب", "لمّ الأكل وخلي بالك متخبطش في نفسك.", "Snake", "Games", "Collect food with the arrow keys or movement buttons, and avoid the walls and your own tail."], "mines": ["كاسحة الألغام", "ألعاب", "استخدم الأرقام واكشف المربعات الآمنة.", "Minesweeper", "Games", "Use the numbers to reveal safe squares and avoid the mines."], "connect-four": ["أربعة على خط", "ألعاب", "العب مع صاحبك، أول أربعة جنب بعض يكسبوا.", "Connect Four", "Games", "Play with a friend on the same device. The first player to connect four pieces wins."], "breakout": ["كسّر الطوب", "ألعاب", "حرّك المضرب وكسّر كل الطوب.", "Breakout", "Games", "Move the paddle and break every brick."], "sudoku": ["سودوكو", "ألعاب", "كمّل الأرقام من ١ لـ٤ من غير تكرار.", "Mini Sudoku", "Games", "Fill the grid with 1 through 4 without repeating a number in any row, column, or box."], "sliding-puzzle": ["رتّب الصورة", "ألعاب", "حرّك البلاطات لحد ما الأرقام تترتب.", "Sliding Number Puzzle", "Games", "Slide the tiles until the numbers are in order."], "word-guess": ["خمّن الكلمة", "ألعاب", "الحق الكلمة قبل ما المحاولات تخلص.", "Word Guess", "Games", "Guess the hidden word before you run out of tries."], "lights-out": ["طفي الأنوار", "ألعاب", "دوس على المربعات وطفي اللوحة كلها.", "Lights Out", "Games", "Tap the squares to switch off the entire board."], "simon": ["افتكر اللحن", "ألعاب", "اسمع وشوف الترتيب وكرره صح.", "Simon Says", "Games", "Watch and listen to the sequence, then repeat it."], "maze-run": ["متاهة", "ألعاب", "وصّل للنهاية من غير ما تعدّي الحيطان.", "Maze Run", "Games", "Find your way to the exit without crossing the walls."], "pong": ["بينج بونج", "ألعاب", "اتحدى الكمبيوتر بالمضرب والكرة.", "Pong", "Games", "Challenge the computer with a paddle and ball."], "sky-hop": ["نطّة في السما", "ألعاب", "عدّي بين العواميد وحافظ على ارتفاعك.", "Sky Hop", "Games", "Fly between the columns and keep your height under control."], "whack": ["الحق الدائرة", "ألعاب", "اضغط الهدف قبل ما يختفي واجمع نقط.", "Whack-a-Target", "Games", "Tap the target before it moves and rack up points."], "math-duel": ["تحدي الحساب", "ألعاب", "حل أكبر عدد من المسائل قبل الوقت.", "Math Duel", "Games", "Solve as many math problems as you can before time runs out."], "drawing-board": ["كراسة رسم", "إبداع", "ارسم باللمس أو الماوس، وارجع خطوة ونزّل رسمتك.", "Drawing Board", "Creative", "Draw with touch or a mouse, undo a stroke, and download your artwork."], "pixel-art": ["فن البكسل", "إبداع", "لوّن مربعات صغيرة واعمل رسمة بكسل.", "Pixel Art", "Creative", "Color small squares to create a pixel-art drawing."], "gradient-lab": ["معمل التدرجات", "إبداع", "ركّب ألوان التدرج وخد كود CSS.", "Gradient Lab", "Creative", "Combine gradient colors and copy the CSS code."], "palette-lab": ["ألوان على مزاجك", "إبداع", "كوّن باليتة متناسقة واحفظ ألوانك.", "Color Palette Lab", "Creative", "Build a harmonious color palette and save your colors."], "type-studio": ["ورشة الخطوط", "إبداع", "جرّب الخطوط والمسافات ونزّل تصميمك.", "Typography Studio", "Creative", "Try different fonts and spacing, then download your design."], "svg-studio": ["ورشة الأشكال", "إبداع", "اعمل أشكال فيكتور ونزّل SVG.", "Shape Studio", "Creative", "Create vector shapes and download them as an SVG."], "particle-lab": ["لعب بالنقط", "إبداع", "غيّر الحركة والجاذبية وشوف النقط بترقص.", "Particle Playground", "Creative", "Adjust the motion and attraction to make the particles dance."], "fractal-lab": ["عوالم كسورية", "إبداع", "قرّب من مجموعة ماندلبرو واكتشف تفاصيلها.", "Fractal Lab", "Creative", "Zoom into the Mandelbrot set and explore its details."], "mandala": ["رسمة مراية", "إبداع", "ارسم بنظام التناظر وطلّع ماندالا.", "Mandala Drawing", "Creative", "Draw with radial symmetry to create a mandala."], "audio-visualizer": ["شوف الصوت", "إبداع", "افتح ملف صوت من جهازك وشوف تردده بيتحرّك.", "Audio Visualizer", "Creative", "Open an audio file from your device and watch its frequencies move."], "noise-maker": ["صنع الضوضاء", "إبداع", "امزج ضوضاء بيضا ووردية وبنيّة للتركيز.", "Noise Maker", "Creative", "Mix white, pink, and brown noise for a focused listening session."], "drum-machine": ["ورشة الإيقاع", "إبداع", "ركّب درامز على ١٦ خطوة واحفظ إيقاعك.", "Drum Machine", "Creative", "Arrange drum sounds across 16 steps and save your rhythm."], "pattern-lab": ["ورشة الباترن", "إبداع", "صمّم نقشة متكررة ونزّلها صورة.", "Pattern Lab", "Creative", "Design a repeating pattern and download it as an image."], "translator": ["مترجم الكلام", "أدوات", "ترجم نصوص حقيقية، واسمع النتيجة وانسخها.", "Translator", "Tools", "Translate real text, listen to the result, and copy it."], "code-studio": ["ورشة الكود", "أدوات", "محرر متعدد الملفات، ٢٠ لغة ومعاينة ويب معزولة.", "Code Studio", "Tools", "A multi-file editor with 20 languages and an isolated web preview."], "site-assistant": ["اسأل عن المعرض", "أدوات", "مساعد بحث ذكي يعرف مشروعات أحمد والمعلومات المنشورة هنا.", "Portfolio Assistant", "Tools", "An AI-powered assistant that answers questions about Ahmed's projects and the information published on the site."]};
const normalizeSearch = (value) => value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f\u064b-\u065f\u0670\u0640]/g, "").replace(/[أإآٱ]/g,"ا").replace(/ى/g,"ي").replace(/ة/g,"ه").trim();
let projects = [];
const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
let category = "All";
function settings() {
  let s;
  try {
    s = JSON.parse(localStorage.getItem("ahmed-settings")) || {};
  } catch {
    s = {};
  }
  $("#appearance").value = s.appearance || "dark";
  $("#accent").value = s.accent || "#bca0f5";
  $("#motion").checked = !!s.motion;
  $("#layout").value = s.layout || "grid";
  apply();
}
function apply() {
  let s = {
    appearance: $("#appearance").value,
    accent: $("#accent").value,
    motion: $("#motion").checked,
    layout: $("#layout").value,
  };
  document.body.classList.toggle("light", s.appearance === "light");
  document.body.classList.toggle("reduced", s.motion);
  document.body.classList.toggle("compact", s.layout === "list");
  document.documentElement.style.setProperty("--accent", s.accent);
  localStorage.setItem("ahmed-settings", JSON.stringify(s));
}
$("#settingsButton").onclick = () => {
  let open = $("#settings").hidden;
  $("#settings").hidden = !open;
  $("#settingsButton").setAttribute("aria-expanded", open);
};
$$("#settings input,#settings select").forEach((x) => (x.onchange = apply));
$("#resetSettings").onclick = () => {
  localStorage.removeItem("ahmed-settings");
  settings();
};
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    $("#settings").hidden = true;
    $("#settingsButton").setAttribute("aria-expanded", "false");
  }
});
function render() {
  let terms = normalizeSearch($("#search").value).split(/\s+/).filter(Boolean);
  $("#clearSearch").hidden = !$("#search").value;
  let list = projects.filter(
    (p) =>
      (category === "All" || p[2] === category) &&
      terms.every(term => normalizeSearch([...p, ...(searchAliases[p[0]] || [])].join(" ")).includes(term)),
  );
  $("#projectCount").textContent =
    `${String(list.length).padStart(2, "0")} EXPERIENCES / BUILT TO EXPLORE`;
  $("#projects").innerHTML =
    list
      .map((p) => {
        let i = projects.indexOf(p);
        return `<a class="project" href="${p[0]}/" style="--c:${p[5]}"><div class="cover"><span class="coverNumber">EXPERIMENT ${String(i + 1).padStart(2, "0")}</span><span class="coverArrow">↗</span><img class="coverPhoto" src="assets/covers/${p[0]}.webp" alt="${(coverCopy[p[0]] || [p[1], "Try it out", p[3]])[2]} themed photograph" loading="lazy" width="1200" height="760"><div class="coverShade"></div><div class="coverWords"><span>${(coverCopy[p[0]] || [p[1], "Try it out", p[3]])[2]}</span><strong>${(coverCopy[p[0]] || [p[1], "Try it out", p[3]])[0]}<br>${(coverCopy[p[0]] || [p[1], "Try it out", p[3]])[1]}</strong></div></div><div class="projectmeta"><h3>${p[1]}</h3><span>${p[2]}</span></div><p>${p[3]}</p></a>`;
      })
      .join("") || "<p>No projects match. Try another search.</p>";
}
/* LAB-COPY */Object.assign(coverCopy,{"study-ai": ["STUDY.", "THEN TEST.", "AI"], "interview-coach": ["READY?", "INTERVIEW STARTS.", "AI"], "code-reviewer": ["YOUR CODE.", "SECOND PAIR OF EYES.", "AI"], "ui-from-text": ["DESCRIBE IT.", "SEE IT.", "AI"], "cv-builder": ["YOUR STORY.", "POLISHED.", "AI"], "sentiment-lab": ["HOW DO THEY", "FEEL?", "AI"], "kids-stories": ["ONCE UPON", "A PAGE.", "AI"], "fridge-chef": ["WHAT'S IN", "THE FRIDGE?", "AI"], "trip-planner": ["GO.", "WE PLAN.", "AI"], "content-ideas": ["IDEAS", "ON TAP.", "AI"], "dialect-translator": ["SAY IT", "LIKE YOU MEAN IT.", "AI"], "summarizer": ["TOO LONG?", "HERE'S THE GIST.", "AI"], "support-bot": ["NEED A", "HAND?", "AI"], "brand-namer": ["A NAME", "THAT STICKS.", "AI"], "tower-defense": ["HOLD", "THE LINE.", "Games"], "platformer": ["JUMP.", "AGAIN.", "Games"], "chess-ai": ["YOUR", "MOVE.", "Games"], "roguelike": ["NEW DUNGEON", "EVERY TIME.", "Games"], "top-down-racer": ["FLOOR", "IT.", "Games"], "physics-puzzle": ["AIM.", "WATCH IT FALL.", "Games"], "daily-word": ["ONE WORD", "A DAY.", "Games"], "local-duel": ["YOU VS", "YOUR FRIEND.", "Games"], "text-adventure": ["CHOOSE", "YOUR ENDING.", "Games"], "kanban-board": ["DRAG.", "DONE.", "Tools"], "pomodoro-pro": ["FOCUS.", "REST.", "Tools"], "notes-notion": ["PAGES", "WITHIN PAGES.", "Tools"], "password-gen": ["NO ONE", "GUESSES.", "Tools"], "text-diff": ["WHAT", "CHANGED?", "Tools"], "unit-converter": ["FROM TO", "IN A SECOND.", "Tools"], "css-builder": ["TUNE IT.", "COPY IT.", "Tools"], "habit-heatmap": ["DAY BY DAY.", "HABIT.", "Tools"], "study-planner": ["PLAN", "YOUR TIME.", "Tools"], "clothing-store": ["YOUR SIZE.", "YOUR STYLE.", "Commerce"], "live-auction": ["BID", "BEFORE IT ENDS.", "Commerce"], "food-order": ["ORDER.", "TRACK IT.", "Commerce"], "hotel-booking": ["BOOK.", "UNWIND.", "Commerce"], "price-compare": ["WHERE'S IT", "CHEAPEST?", "Commerce"], "seller-dashboard": ["YOUR SHOP", "IN ONE VIEW.", "Commerce"], "tshirt-designer": ["DESIGN.", "WEAR.", "Commerce"], "world-stats": ["THE WORLD", "IN NUMBERS.", "Maps & Data"], "crypto-live": ["LIVE", "PRICES.", "Maps & Data"], "prayer-qibla": ["TIME", "AND DIRECTION.", "Maps & Data"], "country-explorer": ["EXPLORE", "COUNTRIES.", "Maps & Data"], "nearby-places": ["WHAT'S", "AROUND?", "Maps & Data"], "egypt-timeline": ["HISTORY", "IN MOTION.", "Maps & Data"], "football-dashboard": ["THE LEAGUE", "BY NUMBERS.", "Maps & Data"], "trip-calc": ["FROM HERE", "TO THERE.", "Maps & Data"], "podcast-player": ["PRESS", "PLAY.", "Creative"], "music-visualizer": ["SEE", "SOUND.", "Creative"], "photo-layers": ["LAYER", "UPON LAYER.", "Creative"], "free-paint": ["DRAW.", "FREELY.", "Creative"], "art-gallery-3d": ["WALK", "THE GALLERY.", "Creative"], "wallpaper-gen": ["LIVING", "WALLPAPER.", "Creative"], "video-platform": ["WATCH.", "COMMENT.", "Creative"], "handwriting-studio": ["WRITTEN", "BEFORE YOU.", "Creative"], "egypt-map": ["EGYPT", "ON THE MAP.", "Maps & Data"], "spotify-player": ["YOUR", "MUSIC.", "Creative"], "code-showcase": ["CODE", "THAT SHINES.", "Tools"], "poll-site": ["VOTE.", "WATCH LIVE.", "Tools"], "video-trimmer": ["TRIM.", "MERGE.", "Creative"]});/* END-LAB-COPY */
fetch("projects.json", { cache: "no-store" })
  .then((r) => r.json())
  .then((p) => {
    projects = p;
    $("#filters").innerHTML = ["All", ...new Set(p.map((x) => x[2]))]
      .map(
        (c) => `<button class="${c === "All" ? "active" : ""}">${c}</button>`,
      )
      .join("");
    $$("#filters button").forEach(
      (b) =>
        (b.onclick = () => {
          category = b.textContent;
          $$("#filters button").forEach((x) =>
            x.classList.toggle("active", x === b),
          );
          render();
        }),
    );
    render();
  })
  .catch(
    () =>
      ($("#projects").textContent =
        "Could not load the gallery. Please refresh."),
  );
function searchAll() {
  category = "All";
  $$("#filters button").forEach(b => b.classList.toggle("active", b.textContent === category));
  render();
}
$("#search").oninput = searchAll;
$("#clearSearch").onclick = () => { $("#search").value = ""; searchAll(); $("#search").focus(); };
$("#searchLink").onclick = () => { $("#search").value = ""; searchAll(); requestAnimationFrame(() => $("#search").focus({preventScroll:true})); };
settings();
