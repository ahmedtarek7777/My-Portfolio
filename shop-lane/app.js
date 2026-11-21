(() => {
  const $ = (s) => document.querySelector(s),
    $$ = (s) => [...document.querySelectorAll(s)];
  const en = document.documentElement.lang === "en",
    T = (ar, english) => (en ? english : ar);
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const money = (n) =>
    new Intl.NumberFormat(en ? "en-EG" : "ar-EG", {
      style: "currency",
      currency: "EGP",
    }).format(n);
  const storage = "portfolio-shop-50k-v1",
    read = (k, d) => {
      try {
        return JSON.parse(localStorage.getItem(storage + k)) ?? d;
      } catch {
        return d;
      }
    },
    write = (k, v) => {
      try {
        localStorage.setItem(storage + k, JSON.stringify(v));
      } catch {
        toast(
          T(
            "مساحة الحفظ خلصت. السلة شغالة في الزيارة دي بس.",
            "Storage is full. Your cart works for this visit only.",
          ),
        );
      }
    };
  let meta = {},
    catalogs = {},
    products = [],
    filtered = [],
    cart = read("cart", {}),
    wish = new Set(read("wish", [])),
    loading = false,
    request = 0;
  let state = {
    collection: "grocery",
    q: "",
    category: "all",
    max: 1000000,
    sort: "featured",
    page: 1,
    pageSize: 24,
    localOnly: false,
    favoritesOnly: false,
  };
  function sourceLink(p) {
    try {
      let u = new URL(p.source);
      return u.protocol === "https:" ? u.href : "";
    } catch {
      return "";
    }
  }
  function img(p) {
    let url;
    try {
      let u = new URL(p.image, location.href);
      url = u.protocol === "https:" || u.origin === location.origin ? u.href : "";
    } catch {
      url = "";
    }
    return `<img class="catalogPhoto" src="${esc(url)}" alt="${esc(p.name)}" loading="lazy" decoding="async" referrerpolicy="no-referrer">`;
  }
  function images(scope) {
    scope.querySelectorAll("img").forEach((i) => {
      i.onload = () => i.classList.add("ready");
      i.onerror = () => {
        i.onerror = null;
        i.src = "catalog/unavailable.svg";
        i.alt += " · " + T("الصورة مش متاحة", "Photo unavailable");
      };
      if (i.complete && i.naturalWidth) i.classList.add("ready");
    });
  }
  function persist() {
    write("cart", cart);
    write("wish", [...wish]);
    $("#cartCount").textContent = Object.values(cart).reduce(
      (a, x) => a + x.qty,
      0,
    );
    $("#wishCount").textContent = wish.size;
  }
  function local(p) {
    return (
      p.local === true ||
      p.origin === "fresh" ||
      p.market === "Egypt" ||
      p.egyptian === true ||
      p.arabic === true
    );
  }
  async function collection(which) {
    let token = ++request;
    state.collection = which;
    state.page = 1;
    state.category = "all";
    state.q = "";
    state.max = 1000000;
    state.localOnly = false;
    state.favoritesOnly = false;
    $("#search").value = "";
    $("#price").value = state.max;
    $("#priceLabel").textContent = money(state.max);
    $("#localOnly").checked = false;
    $("#favoritesOnly").checked = false;
    $$("[data-collection]").forEach((b) =>
      b.classList.toggle("active", b.dataset.collection === which),
    );
    $("#collectionTitle").textContent = T(
      meta.collections[which].titleAr,
      meta.collections[which].titleEn,
    );
    $("#loading").hidden = false;
    $("#grid").innerHTML = "";
    $("#pagination").hidden = true;
    $("#empty").hidden = true;
    loading = true;
    $("#results").textContent = T("بنحمّل المجموعة…", "Loading collection…");
    try {
      if (!catalogs[which]) {
        let r = await fetch(meta.collections[which].file);
        if (!r.ok) throw Error(r.status);
        catalogs[which] = await r.json();
      }
      if (token !== request) return;
      products = catalogs[which];
      $("#category").innerHTML =
        '<option value="all">' +
        T("كل الفئات", "All categories") +
        "</option>" +
        [...new Set(products.map((p) => p.cat))]
          .sort()
          .map((c) => `<option value="${esc(c)}">${esc(c)}</option>`)
          .join("");
      loading = false;
      $("#loading").hidden = true;
      render();
    } catch (e) {
      if (token !== request) return;
      loading = false;
      $("#loading").hidden = true;
      $("#results").textContent = T(
        "المجموعة مقدرتش تحمل. اختارها تاني وحاول.",
        "Could not load this collection. Select it again to retry.",
      );
    }
  }
  const normalize = (s) =>
    String(s || "")
      .toLowerCase()
      .replace(/[أإآ]/g, "ا")
      .replace(/[ًٌٍَُِّْ]/g, "");
  function render() {
    if (loading) return;
    let tokens = normalize(state.q).split(/\s+/).filter(Boolean);
    filtered = products.filter(
      (p) =>
        (state.category === "all" || state.category === p.cat) &&
        p.price <= state.max &&
        (!state.localOnly || local(p)) &&
        (!state.favoritesOnly || wish.has(p.id)) &&
        tokens.every((t) =>
          normalize(
            [p.name, p.brand, p.code, p.search || ""].join(" "),
          ).includes(t),
        ),
    );
    if (state.sort === "low") filtered.sort((a, b) => a.price - b.price);
    if (state.sort === "high") filtered.sort((a, b) => b.price - a.price);
    if (state.sort === "name")
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    let pages = Math.max(1, Math.ceil(filtered.length / state.pageSize));
    state.page = Math.max(1, Math.min(pages, state.page));
    let start = (state.page - 1) * state.pageSize,
      list = filtered.slice(start, start + state.pageSize);
    $("#grid").innerHTML = list
      .map(
        (p) =>
          `<article class="product"><div class="photoBox"><button class="wish ${wish.has(p.id) ? "saved" : ""}" data-wish="${esc(p.id)}" aria-label="${T("احفظ", "Save")} ${esc(p.name)}">${wish.has(p.id) ? "♥" : "♡"}</button><button class="detailButton" data-detail="${esc(p.id)}" aria-label="${T("تفاصيل", "Details")} ${esc(p.name)}">${img(p)}</button></div><h3>${esc(p.name)}</h3><div class="brandName">${esc(p.brand || p.cat)}${p.quantity ? " · " + esc(p.quantity) : ""}</div>${local(p) ? `<small class="pill">${T("سجل عربي أو سوق مصري", "Arabic / Egyptian-market record")}</small>` : ""}<div class="productBottom"><div><strong>${money(p.price)}</strong><small class="demoTag">${T("سعر تجريبي مولّد", "Generated demo price")}</small></div><button class="add" data-add="${esc(p.id)}">${T("ضيف للسلة +", "Add to cart +")}</button></div></article>`,
      )
      .join("");
    images($("#grid"));
    $("#results").textContent = filtered.length
      ? `${(start + 1).toLocaleString(en ? "en" : "ar-EG")}–${Math.min(start + state.pageSize, filtered.length).toLocaleString(en ? "en" : "ar-EG")} / ${filtered.length.toLocaleString(en ? "en" : "ar-EG")} · ${products.length.toLocaleString(en ? "en" : "ar-EG")} ${T("منتج في المجموعة", "in this collection")}`
      : T("مفيش نتايج بالاختيارات دي.", "No matches for these filters.");
    $("#empty").hidden = !!list.length;
    $("#pagination").hidden = !list.length;
    $("#pageNumber").value = state.page;
    $("#pageNumber").max = pages;
    $("#pageTotal").textContent = T("من ", "of ") + pages;
    $("#prev").disabled = state.page === 1;
    $("#next").disabled = state.page === pages;
    $$("[data-wish]").forEach(
      (b) =>
        (b.onclick = () => {
          let id = b.dataset.wish;
          wish.has(id) ? wish.delete(id) : wish.add(id);
          persist();
          render();
        }),
    );
    $$("[data-add]").forEach((b) => (b.onclick = () => add(b.dataset.add)));
    $$("[data-detail]").forEach(
      (b) => (b.onclick = () => details(b.dataset.detail)),
    );
    persist();
  }
  function find(id) {
    return products.find((p) => p.id === id) || cart[id]?.product;
  }
  function add(id) {
    let p = find(id);
    if (!p) return;
    if (!cart[id]) cart[id] = { product: p, qty: 0 };
    if (cart[id].qty >= 99) return;
    cart[id].qty++;
    persist();
    renderCart();
    toast(T("اتضاف للسلة التجريبية.", "Added to the demo cart."));
  }
  function details(id) {
    let p = find(id);
    if (!p) return;
    let source = sourceLink(p),
      license = p.imageLicense || p.image_license || p.license || "",
      notice =
        p.origin === "fresh"
          ? T(
              "موديل من علامة فريش المصرية. العلامة المصرية مش معناها إن كل موديل مصنوع في مصر.",
              "A model from the Egyptian Fresh brand. An Egyptian brand does not mean every model is made in Egypt.",
            )
          : T(
              "سجل من مصدر خارجي. بلد السوق أو لغة السجل مش دليل على بلد التصنيع. الاسم ممكن يفضل بلغة المصدر عشان ما نغيّرش المنتج.",
              "An external-source record. Market or record language does not establish manufacturing origin. Names may stay in the source language to preserve the exact product.",
            );
    $("#detailBody").innerHTML =
      `<div class="detailGrid">${img(p)}<div><span class="badge">${esc(p.cat)}</span><h2>${esc(p.name)}</h2><p>${esc(p.brand)} ${esc(p.quantity)}</p><p>${T("كود المنتج", "Product code")}: ${esc(p.code || p.id)}</p><div class="price">${money(p.price)}</div><p>${T("ده سعر مولّد للتجربة، مش سعر بيع حقيقي. التوافر والمخزون مش مضمونين.", "This is a generated demonstration price, not a real offer. Availability and stock are not verified.")}</p><button class="primary" id="detailAdd">${T("ضيف للسلة التجريبية", "Add to demo cart")}</button>${source ? `<p><a href="${esc(source)}" target="_blank" rel="noopener">${T("مصدر بيانات وصورة المنتج ↗", "Product information and photo source ↗")}</a></p>` : ""}<p>${notice}</p>${license ? `<p>${T("ترخيص الصورة / البيانات", "Image / data license")}: ${esc(license)}</p>` : ""}<p><a href="catalog/SOURCES.md">${T("المصادر والتراخيص", "Sources and licenses")}</a></p></div></div>`;
    images($("#detailBody"));
    $("#detailAdd").onclick = () => add(id);
    $("#detail").showModal();
  }
  function renderCart() {
    let entries = Object.entries(cart);
    $("#cartItems").innerHTML =
      entries
        .map(
          ([id, x]) =>
            `<article class="cartItem">${img(x.product)}<div><h3>${esc(x.product.name)}</h3><p>${money(x.product.price)} · ${T("سعر تجريبي", "Demo price")}</p><div class="row"><div class="actions"><button data-dec="${esc(id)}">−</button><span>${x.qty}</span><button data-inc="${esc(id)}">+</button></div><strong>${money(x.product.price * x.qty)}</strong></div><button data-remove="${esc(id)}">${T("شيل من السلة", "Remove")}</button></div></article>`,
        )
        .join("") ||
      "<p>" +
        T(
          "السلة فاضية، خد لفة واختار حاجة.",
          "Your cart is empty. Explore the collections.",
        ) +
        "</p>";
    images($("#cartItems"));
    $("#cartTotal").textContent = money(
      entries.reduce(
        (n, [id, x]) => n + Math.round(x.product.price * 100) * x.qty,
        0,
      ) / 100,
    );
    $("#checkout").disabled = !entries.length;
    $$("[data-inc]").forEach((b) => (b.onclick = () => add(b.dataset.inc)));
    $$("[data-dec]").forEach(
      (b) =>
        (b.onclick = () => {
          let id = b.dataset.dec;
          if (--cart[id].qty <= 0) delete cart[id];
          persist();
          renderCart();
        }),
    );
    $$("[data-remove]").forEach(
      (b) =>
        (b.onclick = () => {
          delete cart[b.dataset.remove];
          persist();
          renderCart();
        }),
    );
  }
  let debounce;
  $("#search").oninput = (e) => {
    clearTimeout(debounce);
    debounce = setTimeout(() => {
      state.q = e.target.value;
      state.page = 1;
      render();
    }, 180);
  };
  $("#category").onchange = (e) => {
    state.category = e.target.value;
    state.page = 1;
    render();
  };
  $("#price").oninput = (e) => {
    state.max = +e.target.value;
    $("#priceLabel").textContent = money(state.max);
    state.page = 1;
    render();
  };
  $("#sort").onchange = (e) => {
    state.sort = e.target.value;
    render();
  };
  for (let key of ["localOnly", "favoritesOnly"])
    $("#" + key).onchange = (e) => {
      state[key] = e.target.checked;
      state.page = 1;
      render();
    };
  $("#wishlistButton").onclick = () => {
    state.favoritesOnly = !state.favoritesOnly;
    $("#favoritesOnly").checked = state.favoritesOnly;
    state.page = 1;
    render();
    $("#catalog").scrollIntoView();
  };
  $("#pageSize").onchange = (e) => {
    state.pageSize = +e.target.value;
    state.page = 1;
    render();
  };
  function page(n) {
    state.page = n;
    render();
    $("#grid").scrollIntoView({ behavior: "smooth", block: "start" });
  }
  $("#prev").onclick = () => page(state.page - 1);
  $("#next").onclick = () => page(state.page + 1);
  $("#pageNumber").onchange = (e) => page(Math.floor(+e.target.value) || 1);
  $("#resetFilters").onclick = () => collection(state.collection);
  $("#closeDetail").onclick = () => $("#detail").close();
  $("#cartButton").onclick = () => {
    renderCart();
    $("#checkoutMessage").textContent = "";
    $("#cartDialog").showModal();
  };
  $("#closeCart").onclick = () => $("#cartDialog").close();
  $("#checkout").onclick = () => {
    cart = {};
    persist();
    renderCart();
    $("#checkoutMessage").textContent = T(
      "التجربة خلصت. مفيش طلب اتبعت، ولا منتج اتحجز، ولا فلوس اتخصمت.",
      "Demo complete. No order was sent, no product was reserved, and no payment was taken.",
    );
  };
  fetch("catalog/manifest.json", { cache: "no-store" })
    .then((r) => {
      if (!r.ok) throw Error(r.status);
      return r.json();
    })
    .then((m) => {
      meta = m;
      $("#totalCount").textContent = m.total.toLocaleString(
        en ? "en" : "ar-EG",
      );
      $("#catalogTotal").textContent = m.total.toLocaleString(
        en ? "en" : "ar-EG",
      );
      $("#collectionTabs").innerHTML = Object.entries(m.collections)
        .map(
          ([key, c]) =>
            `<button data-collection="${key}" id="${key}Collection">${esc(T(c.titleAr, c.titleEn))} (${c.count.toLocaleString(en ? "en" : "ar-EG")})</button>`,
        )
        .join("");
      $$("[data-collection]").forEach(
        (b) => (b.onclick = () => collection(b.dataset.collection)),
      );
      persist();
      collection("grocery");
    })
    .catch(() => {
      $("#loading").hidden = true;
      $("#results").textContent = T(
        "فشل تحميل فهرس المنتجات. حدّث الصفحة وحاول تاني.",
        "Could not load the catalog index. Reload to retry.",
      );
    });
})();
