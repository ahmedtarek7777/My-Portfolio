const PRODUCTS = [
  {
    id: 1,
    name: "Apple MacBook Pro 14 Inch Space Grey",
    cat: "laptops",
    price: 1999.99,
    rating: 3.65,
    emoji: "\ud83d\udecd",
    image: "../assets/products/0.webp",
  },
  {
    id: 2,
    name: "Asus Zenbook Pro Dual Screen Laptop",
    cat: "laptops",
    price: 1799.99,
    rating: 3.95,
    emoji: "\ud83d\udecd",
    image: "../assets/products/1.webp",
  },
  {
    id: 3,
    name: "Huawei Matebook X Pro",
    cat: "laptops",
    price: 1399.99,
    rating: 4.98,
    emoji: "\ud83d\udecd",
    image: "../assets/products/2.webp",
  },
  {
    id: 4,
    name: "Lenovo Yoga 920",
    cat: "laptops",
    price: 1099.99,
    rating: 2.86,
    emoji: "\ud83d\udecd",
    image: "../assets/products/3.webp",
  },
  {
    id: 5,
    name: "iPhone 5s",
    cat: "smartphones",
    price: 199.99,
    rating: 2.83,
    emoji: "\ud83d\udecd",
    image: "../assets/products/4.webp",
  },
  {
    id: 6,
    name: "iPhone 6",
    cat: "smartphones",
    price: 299.99,
    rating: 3.41,
    emoji: "\ud83d\udecd",
    image: "../assets/products/5.webp",
  },
  {
    id: 7,
    name: "iPhone 13 Pro",
    cat: "smartphones",
    price: 1099.99,
    rating: 4.12,
    emoji: "\ud83d\udecd",
    image: "../assets/products/6.webp",
  },
  {
    id: 8,
    name: "iPhone X",
    cat: "smartphones",
    price: 899.99,
    rating: 2.51,
    emoji: "\ud83d\udecd",
    image: "../assets/products/7.webp",
  },
  {
    id: 9,
    name: "Nike Air Jordan 1 Red And Black",
    cat: "mens-shoes",
    price: 149.99,
    rating: 4.77,
    emoji: "\ud83d\udecd",
    image: "../assets/products/8.webp",
  },
  {
    id: 10,
    name: "Nike Baseball Cleats",
    cat: "mens-shoes",
    price: 79.99,
    rating: 3.88,
    emoji: "\ud83d\udecd",
    image: "../assets/products/9.webp",
  },
  {
    id: 11,
    name: "Puma Future Rider Trainers",
    cat: "mens-shoes",
    price: 89.99,
    rating: 4.9,
    emoji: "\ud83d\udecd",
    image: "../assets/products/10.webp",
  },
  {
    id: 12,
    name: "Sports Sneakers Off White & Red",
    cat: "mens-shoes",
    price: 119.99,
    rating: 4.77,
    emoji: "\ud83d\udecd",
    image: "../assets/products/11.webp",
  },
];

const state = { cat: "all", q: "", max: 5000, sort: "featured" };
const cart = new Map(
  JSON.parse(localStorage.getItem("shoplane-cart-v2") || "[]"),
);

const $ = (s) => document.querySelector(s);
const grid = $("#grid"),
  catsEl = $("#categories");

function cats() {
  return ["all", ...new Set(PRODUCTS.map((p) => p.cat))];
}

function renderCats() {
  catsEl.innerHTML = "";
  cats().forEach((c) => {
    const b = document.createElement("button");
    b.textContent = c[0].toUpperCase() + c.slice(1);
    b.className = c === state.cat ? "active" : "";
    b.onclick = () => {
      state.cat = c;
      renderCats();
      renderGrid();
    };
    catsEl.appendChild(b);
  });
}

function visible() {
  let list = PRODUCTS.filter(
    (p) =>
      (state.cat === "all" || p.cat === state.cat) &&
      p.price <= state.max &&
      p.name.toLowerCase().includes(state.q),
  );
  if (state.sort === "low") list.sort((a, b) => a.price - b.price);
  if (state.sort === "high") list.sort((a, b) => b.price - a.price);
  if (state.sort === "rating") list.sort((a, b) => b.rating - a.rating);
  return list;
}

function renderGrid() {
  const list = visible();
  $("#resultInfo").textContent =
    `${list.length} product${list.length !== 1 ? "s" : ""}`;
  $("#empty").hidden = list.length > 0;
  grid.innerHTML = "";
  list.forEach((p) => {
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <div class="emoji"><img src="${p.image}" alt="${p.name}" style="width:100%;height:180px;object-fit:contain"></div>
      <div class="body">
        <span class="cat">${p.cat}</span>
        <h4>${p.name}</h4>
        <span class="rating">${"★".repeat(Math.round(p.rating))} ${p.rating}</span>
        <div class="row"><span class="price">$${p.price}</span>
        <button class="add" data-id="${p.id}">Add to cart</button></div>
      </div>`;
    el.querySelector(".add").onclick = () => addToCart(p.id);
    grid.appendChild(el);
  });
}

function saveCart() {
  localStorage.setItem("shoplane-cart-v2", JSON.stringify([...cart]));
}

function addToCart(id) {
  cart.set(id, (cart.get(id) || 0) + 1);
  saveCart();
  renderCart();
  openCart();
}

function renderCart() {
  const items = $("#cartItems");
  let count = 0,
    total = 0;
  items.innerHTML = "";
  if (cart.size === 0) {
    items.innerHTML = `<p class="cartempty">Your cart is empty.<br>Add something nice.</p>`;
  }
  cart.forEach((qty, id) => {
    const p = PRODUCTS.find((x) => x.id === id);
    if (!p) return;
    count += qty;
    total += qty * p.price;
    const row = document.createElement("div");
    row.className = "ci";
    row.innerHTML = `
      <span class="ce">${p.emoji}</span>
      <div class="info"><h5>${p.name}</h5><p>$${p.price} each</p>
        <div class="qty">
          <button data-a="dec">−</button><span>${qty}</span><button data-a="inc">+</button>
        </div>
        <button class="rm">Remove</button>
      </div>
      <strong>$${(p.price * qty).toFixed(2)}</strong>`;
    row.querySelector('[data-a="inc"]').onclick = () => {
      cart.set(id, qty + 1);
      saveCart();
      renderCart();
    };
    row.querySelector('[data-a="dec"]').onclick = () => {
      qty > 1 ? cart.set(id, qty - 1) : cart.delete(id);
      saveCart();
      renderCart();
    };
    row.querySelector(".rm").onclick = () => {
      cart.delete(id);
      saveCart();
      renderCart();
    };
    items.appendChild(row);
  });
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = "$" + total.toFixed(2);
}

const drawer = $("#drawer"),
  overlay = $("#overlay");
function openCart() {
  drawer.classList.add("open");
  overlay.hidden = false;
}
function closeCart() {
  drawer.classList.remove("open");
  overlay.hidden = true;
  $("#checkoutMsg").hidden = true;
}
$("#cartBtn").onclick = openCart;
$("#closeCart").onclick = closeCart;
overlay.onclick = closeCart;

$("#checkout").onclick = () => {
  if (cart.size === 0) return;
  cart.clear();
  saveCart();
  renderCart();
  const msg = $("#checkoutMsg");
  msg.hidden = false;
  msg.textContent =
    "Demo checkout complete. No order was sent and no payment was taken.";
};

$("#search").oninput = (e) => {
  state.q = e.target.value.trim().toLowerCase();
  renderGrid();
};
$("#price").oninput = (e) => {
  state.max = +e.target.value;
  $("#priceVal").textContent = state.max;
  renderGrid();
};
$("#sort").onchange = (e) => {
  state.sort = e.target.value;
  renderGrid();
};

renderCats();
renderGrid();
renderCart();
