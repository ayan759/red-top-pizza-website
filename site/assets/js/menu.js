/* Red Top Pizza — builds the full menu page from data.js. Runs before main.js. */
(() => {
  "use strict";
  const D = window.RTP;
  const root = document.getElementById("menu-sections");
  if (!root) return;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const keep = (s) => esc(s).replace(/(\S+-\S+)/g, '<span class="nowrap">$1</span>');
  const money = (n) => "$" + (Number.isInteger(n) ? String(n) : n.toFixed(2));
  const icon = (id) => `<svg class="icon" aria-hidden="true"><use href="assets/img/icons.svg#${id}"></use></svg>`;

  const photo = (img, alt, eager) => img
    ? `<div class="menu-item-photo"><img src="assets/img/menu/${img}.webp" alt="${esc(alt)}" ${eager ? "" : 'loading="lazy"'} width="720" height="540"></div>`
    : `<div class="menu-item-photo" aria-hidden="true"><div class="no-photo"><span><i></i><i></i><i></i></span></div></div>`;

  const tags = (item) => {
    const t = [];
    if (item.tag) {
      const cls = item.tag === "New" ? " tag--new" : item.tag === "Seasonal" ? " tag--seasonal" : "";
      t.push(`<span class="tag${cls}">${item.tag === "New" ? icon("sparkle") : ""}${esc(item.tag)}</span>`);
    }
    if (item.meatless) t.push(`<span class="tag tag--meatless">${icon("leaf")}Meatless</span>`);
    return t.length ? `<span class="tags">${t.join("")}</span>` : "";
  };

  const priceGrid = (prices) => `<dl class="price-grid">${D.sizes.map((s) => {
    const v = prices[s.key];
    return v == null
      ? `<div class="is-na"><dt>${esc(s.short)}</dt><dd><span aria-hidden="true">–</span><span class="visually-hidden">not available</span></dd></div>`
      : `<div><dt>${esc(s.short)}</dt><dd>${money(v)}</dd></div>`;
  }).join("")}</dl>`;

  const pizzaCard = (p, i) => `<li class="menu-item menu-item--pizza" data-search="${esc((p.name + " " + p.desc).toLowerCase())}">
    ${photo(p.img, `${p.name} pizza`, i < 3)}
    <div class="menu-item-body">
      <div class="menu-item-title"><h3>${keep(p.name)}</h3>${tags(p)}</div>
      <p>${esc(p.desc)}</p>
      ${priceGrid(p.prices)}
    </div>
  </li>`;

  const itemCard = (it) => `<li class="menu-item" data-search="${esc((it.name + " " + (it.desc || "")).toLowerCase())}">
    ${photo(it.img, it.name)}
    <div class="menu-item-body">
      <div class="menu-item-title"><h3>${keep(it.name)}</h3><span class="price">${money(it.price)}</span></div>
      ${tags(it)}
      ${it.desc ? `<p>${esc(it.desc)}</p>` : ""}
    </div>
  </li>`;

  const section = (id, title, intro, cards) => `<section class="menu-section" id="${id}" aria-labelledby="${id}-title" data-menu-section>
    <div class="wrap">
      <h2 class="h2" id="${id}-title" style="font-size: var(--step-3)">${keep(title)}</h2>
      ${intro ? `<p>${intro}</p>` : ""}
      <ul class="menu-grid">${cards}</ul>
    </div>
  </section>`;

  const bundleCards = D.bundles.flatMap((g) => g.rows.map((r) => itemCard({
    name: `${r.pizzas} × ${g.group.replace(/ bundles$/, "")}`,
    price: r.price,
    img: g.image.replace(/^.*\/|\.webp$/g, ""),
    desc: `Choose any ${r.pizzas}. Save ${money(r.save)}.${r.serves ? ` Feeds up to ${r.serves}.` : " Premium selections may cost extra."}`
  }))).join("");

  const html = [
    section("pizzas", "Signature pizzas",
      "Every pizza comes Detroit-style in a 4 Square or 8 Square pan, and most also come as a traditional 10\", 12\" or 14\" round. Half-and-half is available on rounds.",
      D.pizzas.map(pizzaCard).join("") + pizzaCard(D.buildYourOwn, 99)),
    section("seasonal", "Seasonal pizzas", "Here for a limited time.", D.seasonal.map((p, i) => pizzaCard(p, 99 + i)).join("")),
    section("bundles", "Pizza bundles", "Feeding a group? Bundle pizzas and save. Prices before tax.", bundleCards),
    ...D.sections.map((s) => section(s.id, s.title, "", s.items.map(itemCard).join("")))
  ].join("");
  root.innerHTML = html;

  /* ---------- Category tabs: scrollspy with a sliding indicator ---------- */
  const tabs = document.querySelector(".menu-tabs");
  const indicator = tabs.querySelector(".tab-indicator");
  const links = [...tabs.querySelectorAll("a")];
  const moveIndicator = (a) => {
    if (!a) return;
    indicator.style.width = `${a.offsetWidth}px`;
    indicator.style.transform = `translateX(${a.offsetLeft}px)`;
    const left = a.offsetLeft - tabs.clientWidth / 2 + a.offsetWidth / 2;
    tabs.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const setActive = (id) => {
    links.forEach((a) => (a.hash === `#${id}` ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    moveIndicator(links.find((a) => a.hash === `#${id}`));
  };
  setActive("pizzas");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: "-30% 0px -65% 0px" });
    document.querySelectorAll("[data-menu-section]").forEach((s) => io.observe(s));
  }
  window.addEventListener("resize", () => moveIndicator(links.find((a) => a.hasAttribute("aria-current"))));

  /* ---------- Search ---------- */
  const input = document.getElementById("menu-search");
  const empty = document.getElementById("menu-empty");
  const status = document.getElementById("menu-search-status");
  let timer;
  const filter = () => {
    const q = input.value.trim().toLowerCase();
    let total = 0;
    document.querySelectorAll("[data-menu-section]").forEach((sec) => {
      let shown = 0;
      sec.querySelectorAll("[data-search]").forEach((li) => {
        const hit = !q || li.dataset.search.includes(q);
        li.hidden = !hit;
        if (hit) shown++;
      });
      sec.hidden = shown === 0;
      total += shown;
    });
    empty.classList.toggle("is-shown", total === 0);
    empty.querySelector("[data-query]").textContent = input.value.trim();
    status.textContent = q ? `${total} ${total === 1 ? "item matches" : "items match"} “${input.value.trim()}”` : "";
  };
  input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(filter, 120); });
  document.getElementById("menu-clear").addEventListener("click", () => { input.value = ""; filter(); input.focus(); });
})();
