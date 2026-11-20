/* Red Top Pizza — shared behaviour for every page. Reads its content from data.js. */
(() => {
  "use strict";
  const D = window.RTP;
  const B = D.business;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const ICONS = "assets/img/icons.svg#";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const icon = (id, cls = "icon") => `<svg class="${cls}" aria-hidden="true"><use href="${ICONS}${id}"></use></svg>`;
  const money = (n) => "$" + (Number.isInteger(n) ? String(n) : n.toFixed(2));
  /* Keep hyphenated words like "Detroit-style" together in wide headings */
  const keepHyphens = (s) => esc(s).replace(/(\S+-\S+)/g, '<span class="nowrap">$1</span>');
  window.RTPUtil = { esc, icon, money, keepHyphens };

  /* ---------- Links come from data.js so they only live in one place ---------- */
  $$("[data-pickup-link]").forEach((a) => (a.href = B.pickupUrl));
  $$("[data-delivery-link]").forEach((a) => (a.href = B.deliveryUrl));
  $$("[data-reviews-link]").forEach((a) => (a.href = B.reviewsUrl));
  $$("[data-directions-link]").forEach((a) => (a.href = B.directionsUrl));
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));

  /* ---------- Header: shadow on scroll, mobile menu ---------- */
  const header = $("[data-header]");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = $("[data-menu-toggle]");
  const nav = $("#site-nav");
  const setMenu = (open) => {
    if (!toggle || !nav) return;
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
  };
  if (toggle) {
    toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") { setMenu(false); toggle.focus(); }
    });
    window.matchMedia("(min-width: 1081px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });
  }

  /* Highlight the nav link for the section on screen (home page) */
  const spyLinks = $$("[data-spy]");
  if (spyLinks.length && "IntersectionObserver" in window) {
    const byId = new Map(spyLinks.map((a) => [a.dataset.spy, a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        const link = byId.get(en.target.id);
        if (!link) return;
        if (en.isIntersecting) {
          spyLinks.forEach((a) => a.removeAttribute("aria-current"));
          link.setAttribute("aria-current", "true");
        } else if (link.getAttribute("aria-current")) {
          link.removeAttribute("aria-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    byId.forEach((_, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }

  /* ---------- Order dialog: every "Order" button asks pickup or delivery ---------- */
  const dialog = $("#order-dialog");
  const closeDialog = () => {
    if (!dialog || !dialog.open) return;
    if (reduceMotion) { dialog.close(); return; }
    dialog.classList.add("is-closing");
    dialog.addEventListener("animationend", () => { dialog.classList.remove("is-closing"); dialog.close(); }, { once: true });
  };
  if (dialog) {
    document.addEventListener("click", (e) => {
      const trigger = e.target.closest("[data-order]");
      if (!trigger) return;
      e.preventDefault();
      setMenu(false);
      dialog.showModal();
    });
    dialog.addEventListener("cancel", (e) => { e.preventDefault(); closeDialog(); });
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) closeDialog();
      if (e.target.closest("[data-close-dialog]")) closeDialog();
    });
  }

  /* ---------- Hours and open/closed status (Calgary time) ---------- */
  const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const toMin = (t) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const fmtTime = (t) => {
    const [h, m] = t.split(":").map(Number);
    const h12 = h % 12 || 12;
    return `${h12}${m ? ":" + String(m).padStart(2, "0") : ""} ${h < 12 ? "a.m." : "p.m."}`;
  };
  const nowInCalgary = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: B.timeZone, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23"
    }).formatToParts(new Date());
    const get = (t) => parts.find((p) => p.type === t).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    return { day, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
  };
  const hoursFor = (day) => D.hours.find((h) => h.day === day);
  const status = () => {
    const { day, minutes } = nowInCalgary();
    const today = hoursFor(day);
    if (today && minutes >= toMin(today.open) && minutes < toMin(today.close)) {
      return { open: true, short: `Open now until ${fmtTime(today.close)}`, day };
    }
    if (today && minutes < toMin(today.open)) {
      return { open: false, short: `Closed now. Opens today at ${fmtTime(today.open)}`, day };
    }
    for (let i = 1; i <= 7; i++) {
      const next = hoursFor((day + i) % 7);
      if (next) {
        const when = i === 1 ? "tomorrow" : DAY_NAMES[(day + i) % 7];
        return { open: false, short: `Closed now. Opens ${when} at ${fmtTime(next.open)}`, day };
      }
    }
    return { open: false, short: "Closed", day };
  };
  const renderStatus = () => {
    const s = status();
    $$("[data-status-text]").forEach((el) => (el.textContent = s.short));
    $$("[data-status-dot]").forEach((el) => el.classList.toggle("is-closed", !s.open));
    $$("[data-status-long]").forEach((el) => (el.textContent = s.short));
    const table = $("[data-hours-table] tbody");
    if (table) {
      const order = [1, 2, 3, 4, 5, 6, 0];
      table.innerHTML = order.map((d) => {
        const h = hoursFor(d);
        const isToday = d === s.day;
        return `<tr${isToday ? ' class="is-today"' : ""}><th scope="row">${DAY_NAMES[d]}${isToday ? '<span class="visually-hidden"> (today)</span>' : ""}</th>` +
          `<td>${h ? `${fmtTime(h.open)} – ${fmtTime(h.close)}` : "Closed"}</td></tr>`;
      }).join("");
    }
  };
  renderStatus();
  setInterval(renderStatus, 60 * 1000);

  /* ---------- Home: The Detroiter prices ---------- */
  const detroiterPrices = $("[data-detroiter-prices]");
  if (detroiterPrices) {
    const p = D.pizzas.find((x) => x.id === "detroiter");
    detroiterPrices.innerHTML = D.sizes.filter((s) => p.prices[s.key] != null).map((s) =>
      `<li><span class="size">${esc(s.label)}</span><span class="price">${money(p.prices[s.key])}</span></li>`
    ).join("");
  }

  /* ---------- Home: Red Top Fan Favourites in the pan grid ---------- */
  const featured = $("#featured-list");
  if (featured) {
    const allItems = D.sections.flatMap((s) => s.items);
    const sizeLabel = (key) => (D.sizes.find((s) => s.key === key) || {}).label || key;
    const card = ({ name, img, alt, desc, tag, prices }) => `<li class="slice"><div class="slice-card">
        <div class="slice-photo">
          ${img ? `<img src="assets/img/menu/${img}.webp" alt="${esc(alt)}" loading="lazy" width="720" height="540">` : `<div class="no-photo" aria-hidden="true"><span><i></i><i></i><i></i></span></div>`}
          ${tag ? `<span class="tag${tag === "New" ? " tag--new" : ""}">${esc(tag)}</span>` : ""}
        </div>
        <div class="slice-body">
          <h3 class="h3">${esc(name)}</h3>
          ${desc ? `<p>${esc(desc)}</p>` : ""}
          <div class="slice-foot">
            <div class="slice-prices">${prices}</div>
            <button class="btn btn--sm" type="button" data-order>Order<span class="visually-hidden"> ${esc(name)}</span></button>
          </div>
        </div>
      </div></li>`;
    featured.innerHTML = D.favourites.map((f) => {
      if (f.pizza) {
        const p = D.pizzas.find((x) => x.id === f.pizza);
        if (!p) return "";
        const sizes = (f.sizes || ["sq4", "sq8"]).filter((k) => p.prices[k] != null);
        const round = sizes.length && sizes.every((k) => k.startsWith("r"));
        return card({
          name: p.name, img: f.img || p.img, tag: p.tag, desc: f.desc || p.desc,
          alt: round ? `${p.name}, a traditional round pizza` : `${p.name} Detroit-style pizza, cut into squares`,
          prices: sizes.map((k) => `<span><small>${esc(sizeLabel(k))}</small><span class="price">${money(p.prices[k])}</span></span>`).join("")
        });
      }
      const it = allItems.find((x) => x.name === f.item);
      if (!it) return "";
      return card({
        name: it.name, img: it.img, alt: it.name, desc: f.desc || it.desc,
        prices: `<span><span class="price">${money(it.price)}</span></span>`
      });
    }).join("");
  }

  /* ---------- Home: promo and bundles ---------- */
  const P = D.promo || {};
  const promoOn = P.on !== false && !!P.title;
  // Short line in the order popup and on the menu page
  $$("[data-promo-short]").forEach((el) => {
    el.hidden = !(promoOn && P.short);
    if (!el.hidden) el.textContent = " " + P.short;
  });
  const promo = $("[data-promo]");
  if (promo && !promoOn) {
    promo.hidden = true;
  } else if (promo) {
    promo.hidden = false;
    $("[data-promo-title]", promo).textContent = P.title;
    $("[data-promo-detail]", promo).textContent = P.detail || "";
    const img = $("[data-promo-img]", promo);
    if (img) {
      img.hidden = !P.img;
      if (P.img) { img.src = `assets/img/menu/${P.img}.webp`; img.alt = P.title; }
    }
    const codeRow = $("[data-promo-code-row]", promo);
    if (codeRow) codeRow.hidden = !P.code;
    $("[data-promo-code]", promo).textContent = P.code || "";
  }
  if (promo && promoOn && P.code) {
    const copyBtn = $("[data-copy-code]", promo);
    const label = $("span", copyBtn);
    copyBtn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(D.promo.code);
        label.textContent = "Copied";
      } catch {
        label.textContent = D.promo.code;
      }
      copyBtn.classList.add("is-copied");
      copyBtn.setAttribute("aria-live", "polite");
      setTimeout(() => { label.textContent = "Copy code"; copyBtn.classList.remove("is-copied"); }, 2400);
    });
  }
  const bundleList = $("#bundle-list");
  if (bundleList) {
    bundleList.innerHTML = D.bundles.map((g) => {
      const hasServes = g.rows.some((r) => r.serves);
      return `<article class="bundle" data-reveal="rise">
        <figure class="bundle-photo"><img src="${g.image}" alt="" loading="lazy" width="720" height="480"></figure>
        <div class="bundle-body">
          <h3 class="h3">${keepHyphens(g.group)}</h3>
          <p>${esc(g.note)}</p>
          <table class="bundle-table">
            <thead><tr><th scope="col">Bundle</th><th scope="col">Price</th><th scope="col">You save</th>${hasServes ? '<th scope="col" class="col-serves">Feeds</th>' : ""}<th scope="col"><span class="visually-hidden">Order</span></th></tr></thead>
            <tbody>${g.rows.map((r) => `<tr>
              <td><strong>${r.pizzas} pizzas</strong></td>
              <td class="price">${money(r.price)}</td>
              <td class="save">${money(r.save)}</td>
              ${hasServes ? `<td class="col-serves">Up to ${r.serves}</td>` : ""}
              <td><button class="btn btn--sm" type="button" data-order>Order<span class="visually-hidden"> ${r.pizzas}-pizza bundle</span></button></td>
            </tr>`).join("")}</tbody>
          </table>
        </div>
      </article>`;
    }).join("");
  }

  /* ---------- Home: rating, mentions, reviews ---------- */
  const R = D.rating;
  const checked = new Date(R.checked + "T12:00:00").toLocaleDateString("en-CA", { day: "numeric", month: "long", year: "numeric" });
  $$("[data-rating-short]").forEach((el) => (el.textContent = `${R.value} on Google (${R.count} reviews)`));
  const ratingValue = $("[data-rating-value]");
  if (ratingValue) {
    ratingValue.textContent = R.value.toFixed(1);
    $("[data-rating-meta]").textContent = `Rated ${R.value} out of 5 from ${R.count} Google reviews. Last checked ${checked}.`;
    const starRow = (n) => Array.from({ length: n }, () => icon("star-fill")).join("");
    $("[data-stars]").innerHTML = `${starRow(5)}<span class="stars-fill" style="width:${(R.value / 5) * 100}%">${starRow(5)}</span>`;
    const max = Math.max(...R.topics.map((t) => t.count));
    const mentions = $("[data-mentions]");
    mentions.innerHTML = R.topics.map((t, i) =>
      `<li class="mention" style="--i:${i}">
        <span>${esc(t.label)}</span>
        <span class="mention-bar" aria-hidden="true"><span style="width:${Math.max(4, (t.count / max) * 100)}%"></span></span>
        <span class="mention-count">${t.count} reviews</span>
      </li>`).join("");
    const cards = $("[data-review-cards]");
    if (D.reviews.length) {
      cards.innerHTML = D.reviews.map((r) => `<li class="review-card">
        <span class="stars" aria-label="${r.rating} out of 5 stars">${starRow(r.rating)}</span>
        <blockquote><p>${esc(r.text)}</p></blockquote>
        <footer>${esc(r.name)}${r.date ? `, ${esc(r.date)}` : ""} on Google</footer>
      </li>`).join("");
      cards.hidden = false;
    }
  }

  /* ---------- Social links ---------- */
  const social = $("[data-social]");
  if (social) {
    social.innerHTML = B.social.map((s) => `<a class="social-tile" href="${s.url}" target="_blank" rel="noopener">
      ${icon(s.icon)}<span><strong>${esc(s.name)}</strong><span>${esc(s.handle)}</span></span>
      <span class="visually-hidden">(opens in a new tab)</span></a>`).join("");
  }
  $$("[data-footer-social]").forEach((el) => {
    el.innerHTML = B.social.map((s) => `<a href="${s.url}" target="_blank" rel="noopener" aria-label="${esc(s.name)} (opens in a new tab)">${icon(s.icon)}</a>`).join("");
  });

  /* ---------- Request a quote ---------- */
  const form = $("#quote-form");
  if (form) {
    const success = $("#quote-success");
    const summary = $("#quote-errors");
    const dateInput = $("#q-date");
    const todayISO = () => {
      const d = new Date();
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    };
    dateInput.min = todayISO();

    const rules = {
      "q-date": (v) => (!v ? "Choose the date of your event." : v < todayISO() ? "Choose a date from today onwards." : ""),
      "q-size": (v) => {
        if (!v) return "Enter how many people you’re feeding.";
        const n = Number(v);
        return Number.isInteger(n) && n >= 1 ? "" : "Enter a whole number of people, like 25.";
      },
      "q-name": (v) => (v.trim() ? "" : "Enter your name so we know who to reply to."),
      "q-email": (v) => (!v.trim() ? "Enter your email so we can send your quote." : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? "" : "Enter an email address like name@example.com."),
      "q-phone": (v) => (!v.trim() || v.replace(/\D/g, "").length >= 10 ? "" : "Enter a 10-digit phone number, or leave it blank.")
    };
    const showError = (id) => {
      const input = document.getElementById(id);
      const msg = rules[id](input.value);
      const err = document.getElementById(`${id}-error`);
      input.setAttribute("aria-invalid", msg ? "true" : "false");
      err.textContent = msg;
      err.classList.toggle("is-shown", !!msg);
      return msg;
    };
    Object.keys(rules).forEach((id) => {
      const input = document.getElementById(id);
      input.addEventListener("blur", () => { if (input.value || input.getAttribute("aria-invalid") === "true") showError(id); });
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const errors = Object.keys(rules).map((id) => [id, showError(id)]).filter(([, m]) => m);
      if (errors.length) {
        $("ul", summary).innerHTML = errors.map(([id, m]) => `<li><a href="#${id}">${esc(m)}</a></li>`).join("");
        summary.classList.add("is-shown");
        summary.focus();
        return;
      }
      summary.classList.remove("is-shown");
      const data = Object.fromEntries(new FormData(form).entries());
      const lines = [
        `Event date: ${data.date}`,
        `Group size: ${data.groupSize} people`,
        `Occasion: ${data.occasion || "Not specified"}`,
        `Name: ${data.name}`,
        `Email: ${data.email}`,
        `Phone: ${data.phone || "Not given"}`,
        "",
        `Notes: ${data.notes || "None"}`
      ];
      const submitBtn = $("button[type=submit]", form);
      if (B.quoteEndpoint) {
        submitBtn.disabled = true;
        submitBtn.textContent = "Sending…";
        try {
          const res = await fetch(B.quoteEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(data)
          });
          if (!res.ok) throw new Error(String(res.status));
          $("[data-success-text]", success).textContent = "Thanks! Your request is in. We’ll reply by email, usually within one business day.";
        } catch {
          submitBtn.disabled = false;
          submitBtn.textContent = "Request a quote";
          $("ul", summary).innerHTML = `<li>Your request didn’t send. Check your connection and try again, or call ${esc(B.phone)}.</li>`;
          summary.classList.add("is-shown");
          summary.focus();
          return;
        }
      } else {
        const subject = `Catering quote request: ${data.groupSize} people on ${data.date}`;
        window.location.href = `mailto:${B.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
      }
      form.hidden = true;
      success.classList.add("is-shown");
      success.focus();
    });

    $("[data-quote-reset]", success).addEventListener("click", () => {
      form.reset();
      dateInput.min = todayISO();
      const submitBtn = $("button[type=submit]", form);
      submitBtn.disabled = false;
      submitBtn.textContent = "Request a quote";
      success.classList.remove("is-shown");
      form.hidden = false;
      $("#q-date").focus();
    });
  }

  /* ---------- Motion: scroll reveals and the hero entrance ---------- */
  /* Cards in a slice grid reveal one by one as each scrolls into view; a sauce graphic inside a
     revealing photo waits for the photo; a standalone one is watched on its own. */
  const sliceCards = $$("[data-reveal='slice'] > *");
  const revealTargets = [
    ...$$("[data-reveal]:not([data-reveal='slice']), .mentions"),
    ...sliceCards,
    ...$$("[data-sauce]").filter((s) => !s.closest("[data-reveal]"))
  ];
  if ("IntersectionObserver" in window && !reduceMotion) {
    /* Masked photos (wipes and cards) are hidden until revealed, and browsers won't fetch a hidden lazy image.
       So start each download ourselves when the photo is about a screen away... */
    const prefetch = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.querySelectorAll("img").forEach((img) => { img.loading = "eager"; });
        prefetch.unobserve(en.target);
      });
    }, { rootMargin: "100% 0px 100% 0px" });
    [...$$("[data-reveal='wipe']"), ...sliceCards].forEach((el) => prefetch.observe(el));

    /* ...and only start the reveal once the photo is downloaded and decoded (or after 3 s, so nothing stays hidden). */
    const photoReady = (img) => {
      if (!img) return Promise.resolve();
      img.loading = "eager";
      const loaded = img.complete && img.naturalWidth
        ? Promise.resolve()
        : new Promise((res) => {
            img.addEventListener("load", res, { once: true });
            img.addEventListener("error", res, { once: true });
          });
      return loaded.then(() => (img.decode ? img.decode().catch(() => {}) : null));
    };
    const show = (el) => {
      el.classList.add("is-in");
      const s = el.querySelector("[data-sauce]");
      if (s) setTimeout(() => s.classList.add("is-in"), 450);
    };

    const io = new IntersectionObserver((entries) => {
      let row = 0; // cards that arrive together (one row) are staggered left to right
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        io.unobserve(el);
        const isCard = el.parentElement && el.parentElement.matches("[data-reveal='slice']");
        if (isCard) el.style.setProperty("--i", row++);
        if (!isCard && !el.matches("[data-reveal='wipe']")) { show(el); return; }
        const timeout = new Promise((r) => setTimeout(r, 3000));
        Promise.race([photoReady(el.querySelector("img")), timeout])
          .then(() => requestAnimationFrame(() => show(el)));
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-in"));
  }

  const ready = () => document.documentElement.classList.add("is-ready");
  const heroImg = $(".hero-media img");
  const waits = [document.fonts ? document.fonts.ready : Promise.resolve()];
  if (heroImg && heroImg.decode) waits.push(heroImg.decode().catch(() => {}));
  Promise.race([Promise.all(waits), new Promise((r) => setTimeout(r, 1200))]).then(() => requestAnimationFrame(ready));
})();
