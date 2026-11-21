const recipes = [
  {
    name: "Lemon pasta",
    time: 20,
    tag: "Vegetarian",
    ingredients: [
      ["pasta", 200, "g"],
      ["lemon", 1, ""],
      ["olive oil", 2, "tbsp"],
      ["parmesan", 40, "g"],
    ],
    steps: [
      "Boil pasta in salted water until al dente.",
      "Mix lemon juice and olive oil.",
      "Toss pasta with dressing and cheese.",
    ],
  },
  {
    name: "Chickpea bowl",
    time: 15,
    tag: "Vegan",
    ingredients: [
      ["chickpeas", 240, "g"],
      ["cucumber", 1, ""],
      ["tomato", 2, ""],
      ["olive oil", 2, "tbsp"],
    ],
    steps: [
      "Rinse cooked chickpeas.",
      "Dice cucumber and tomato.",
      "Toss with oil, salt and your preferred seasoning.",
    ],
  },
  {
    name: "Tomato eggs",
    time: 25,
    tag: "Vegetarian",
    ingredients: [
      ["eggs", 4, ""],
      ["tomato", 4, ""],
      ["olive oil", 1, "tbsp"],
      ["onion", 1, ""],
    ],
    steps: [
      "Soften chopped onion in oil.",
      "Add diced tomato and simmer until thick.",
      "Make wells, add eggs and cook covered until fully set.",
    ],
  },
  {
    name: "Roasted vegetables",
    time: 40,
    tag: "Vegan",
    ingredients: [
      ["potato", 400, "g"],
      ["carrot", 200, "g"],
      ["olive oil", 2, "tbsp"],
      ["onion", 1, ""],
    ],
    steps: [
      "Heat oven to 200°C.",
      "Chop vegetables evenly and coat with oil.",
      "Roast for about 30 minutes until tender, turning halfway.",
    ],
  },
  {
    name: "Oat breakfast",
    time: 10,
    tag: "Vegetarian",
    ingredients: [
      ["oats", 100, "g"],
      ["milk", 400, "ml"],
      ["banana", 1, ""],
    ],
    steps: [
      "Combine oats and milk in a pan.",
      "Simmer gently, stirring until creamy.",
      "Top with sliced banana.",
    ],
  },
  {
    name: "Rice and beans",
    time: 30,
    tag: "Vegan",
    ingredients: [
      ["rice", 150, "g"],
      ["cooked beans", 240, "g"],
      ["tomato", 2, ""],
      ["onion", 1, ""],
    ],
    steps: [
      "Cook rice according to package directions.",
      "Soften chopped onion, then add tomatoes and beans.",
      "Simmer and serve over rice.",
    ],
  },
];
let plan = load("meal-plan", {}),
  active = 0;
const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
function detail(i) {
  active = i;
  let r = recipes[i];
  $("#detail").innerHTML =
    `<h2>${r.name}</h2><p>${r.tag} · ${r.time} minutes · contains common allergens, check ingredients</p><label>Servings<input id="servings" type="number" min="1" max="20" value="2"></label><ul id="ingredients"></ul><h3>Method</h3><ol>${r.steps.map((s) => `<li style="padding:9px">${s}</li>`).join("")}</ol>`;
  function scale() {
    let n = Math.max(1, Math.min(20, +$("#servings").value || 2)) / 2;
    $("#ingredients").innerHTML = r.ingredients
      .map(([k, v, u]) => `<li>${+(v * n).toFixed(2)} ${u} ${k}</li>`)
      .join("");
  }
  $("#servings").oninput = scale;
  scale();
}
function render() {
  save("meal-plan", plan);
  let q = $("#search").value.toLowerCase();
  $("#recipes").innerHTML = recipes
    .map((r, i) => ({ ...r, i }))
    .filter((r) => (r.name + r.tag).toLowerCase().includes(q))
    .map(
      (r) =>
        `<button data-recipe="${r.i}" style="text-align:left;padding:24px"><span style="font-size:30px">${["◒", "❀", "☀", "✳", "◡", "◈"][r.i]}</span><h3>${r.name}</h3><small>${r.time} min · ${r.tag}</small></button>`,
    )
    .join("");
  $$("[data-recipe]").forEach(
    (b) => (b.onclick = () => detail(+b.dataset.recipe)),
  );
  $("#plan").innerHTML = days
    .map(
      (d) =>
        `<label class="item">${d}<select data-day="${d}"><option value="">Unplanned</option>${recipes.map((r, i) => `<option value="${i}" ${String(plan[d]) === String(i) ? "selected" : ""}>${r.name}</option>`).join("")}</select></label>`,
    )
    .join("");
  $$("[data-day]").forEach(
    (b) =>
      (b.onchange = () => {
        if (b.value === "") delete plan[b.dataset.day];
        else plan[b.dataset.day] = +b.value;
        render();
      }),
  );
  let totals = {};
  Object.values(plan).forEach((i) =>
    recipes[i].ingredients.forEach(([k, v, u]) => {
      if (!totals[k]) totals[k] = { v: 0, u };
      totals[k].v += v;
    }),
  );
  $("#shopping").innerHTML =
    Object.entries(totals)
      .map(
        ([k, x]) =>
          `<label class="item" style="display:block"><input type="checkbox"> ${x.v} ${x.u} ${k}</label>`,
      )
      .join("") || "<p>Plan a meal to build your list.</p>";
  $("#export").onclick = () =>
    download(
      "shopping-list.txt",
      Object.entries(totals)
        .map(([k, x]) => `${x.v} ${x.u} ${k}`)
        .join("\n"),
      "text/plain",
    );
}
$("#search").oninput = render;
render();
detail(0);
