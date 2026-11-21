const PRODUCTS = [
  {id:1,name:"Aurora Headphones",cat:"audio",price:129,rating:4.8,emoji:"🎧"},
  {id:2,name:"Pulse Speaker",cat:"audio",price:89,rating:4.5,emoji:"🔊"},
  {id:3,name:"Nimbus Earbuds",cat:"audio",price:59,rating:4.3,emoji:"🎵"},
  {id:4,name:"Orbit Smartwatch",cat:"wearables",price:199,rating:4.7,emoji:"⌚"},
  {id:5,name:"Halo Fitness Band",cat:"wearables",price:49,rating:4.2,emoji:"📿"},
  {id:6,name:"Terra Backpack",cat:"bags",price:79,rating:4.6,emoji:"🎒"},
  {id:7,name:"Metro Tote",cat:"bags",price:45,rating:4.1,emoji:"👜"},
  {id:8,name:"Voyager Duffel",cat:"bags",price:95,rating:4.4,emoji:"🧳"},
  {id:9,name:"Lumen Desk Lamp",cat:"home",price:39,rating:4.5,emoji:"💡"},
  {id:10,name:"Drift Ceramic Mug",cat:"home",price:19,rating:4.9,emoji:"☕"},
  {id:11,name:"Echo Wall Clock",cat:"home",price:29,rating:4.0,emoji:"🕰️"},
  {id:12,name:"Zen Mechanical Keyboard",cat:"tech",price:149,rating:4.8,emoji:"⌨️"},
  {id:13,name:"Glide Wireless Mouse",cat:"tech",price:35,rating:4.4,emoji:"🖱️"},
  {id:14,name:"Prism Webcam HD",cat:"tech",price:69,rating:4.3,emoji:"📷"},
  {id:15,name:"Flux USB-C Hub",cat:"tech",price:55,rating:4.6,emoji:"🔌"},
  {id:16,name:"Solstice Sunglasses",cat:"style",price:75,rating:4.2,emoji:"🕶️"},
  {id:17,name:"Canvas Cap",cat:"style",price:25,rating:4.0,emoji:"🧢"},
  {id:18,name:"Runner Sneakers",cat:"style",price:110,rating:4.7,emoji:"👟"},
];

const state = {cat:"all", q:"", max:300, sort:"featured"};
const cart = new Map(JSON.parse(localStorage.getItem("shoplane-cart")||"[]"));

const $ = s => document.querySelector(s);
const grid = $("#grid"), catsEl = $("#categories");

function cats(){ return ["all", ...new Set(PRODUCTS.map(p=>p.cat))]; }

function renderCats(){
  catsEl.innerHTML = "";
  cats().forEach(c=>{
    const b = document.createElement("button");
    b.textContent = c[0].toUpperCase()+c.slice(1);
    b.className = c===state.cat ? "active" : "";
    b.onclick = ()=>{ state.cat=c; renderCats(); renderGrid(); };
    catsEl.appendChild(b);
  });
}

function visible(){
  let list = PRODUCTS.filter(p =>
    (state.cat==="all" || p.cat===state.cat) &&
    p.price <= state.max &&
    p.name.toLowerCase().includes(state.q)
  );
  if(state.sort==="low") list.sort((a,b)=>a.price-b.price);
  if(state.sort==="high") list.sort((a,b)=>b.price-a.price);
  if(state.sort==="rating") list.sort((a,b)=>b.rating-a.rating);
  return list;
}

function renderGrid(){
  const list = visible();
  $("#resultInfo").textContent = `${list.length} product${list.length!==1?"s":""}`;
  $("#empty").hidden = list.length>0;
  grid.innerHTML = "";
  list.forEach(p=>{
    const el = document.createElement("article");
    el.className = "card";
    el.innerHTML = `
      <div class="emoji">${p.emoji}</div>
      <div class="body">
        <span class="cat">${p.cat}</span>
        <h4>${p.name}</h4>
        <span class="rating">${"★".repeat(Math.round(p.rating))} ${p.rating}</span>
        <div class="row"><span class="price">$${p.price}</span>
        <button class="add" data-id="${p.id}">Add to cart</button></div>
      </div>`;
    el.querySelector(".add").onclick = ()=> addToCart(p.id);
    grid.appendChild(el);
  });
}

function saveCart(){ localStorage.setItem("shoplane-cart", JSON.stringify([...cart])); }

function addToCart(id){
  cart.set(id, (cart.get(id)||0)+1);
  saveCart(); renderCart();
  openCart();
}

function renderCart(){
  const items = $("#cartItems");
  let count=0, total=0;
  items.innerHTML = "";
  if(cart.size===0){
    items.innerHTML = `<p class="cartempty">Your cart is empty.<br>Add something nice.</p>`;
  }
  cart.forEach((qty,id)=>{
    const p = PRODUCTS.find(x=>x.id===id);
    count += qty; total += qty*p.price;
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
      <strong>$${(p.price*qty).toFixed(2)}</strong>`;
    row.querySelector('[data-a="inc"]').onclick = ()=>{ cart.set(id,qty+1); saveCart(); renderCart(); };
    row.querySelector('[data-a="dec"]').onclick = ()=>{ qty>1 ? cart.set(id,qty-1) : cart.delete(id); saveCart(); renderCart(); };
    row.querySelector(".rm").onclick = ()=>{ cart.delete(id); saveCart(); renderCart(); };
    items.appendChild(row);
  });
  $("#cartCount").textContent = count;
  $("#cartTotal").textContent = "$"+total.toFixed(2);
}

const drawer = $("#drawer"), overlay = $("#overlay");
function openCart(){ drawer.classList.add("open"); overlay.hidden=false; }
function closeCart(){ drawer.classList.remove("open"); overlay.hidden=true; $("#checkoutMsg").hidden=true; }
$("#cartBtn").onclick = openCart;
$("#closeCart").onclick = closeCart;
overlay.onclick = closeCart;

$("#checkout").onclick = ()=>{
  if(cart.size===0) return;
  cart.clear(); saveCart(); renderCart();
  const msg = $("#checkoutMsg");
  msg.hidden = false;
  msg.textContent = "Order placed! Thanks for shopping with Shop Lane.";
};

$("#search").oninput = e => { state.q = e.target.value.trim().toLowerCase(); renderGrid(); };
$("#price").oninput = e => { state.max = +e.target.value; $("#priceVal").textContent = state.max; renderGrid(); };
$("#sort").onchange = e => { state.sort = e.target.value; renderGrid(); };

renderCats(); renderGrid(); renderCart();
