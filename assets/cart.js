/* ============================================================
   Hair & Home: the bag (works on every page) + Stripe checkout
   - Any element with data-add="<slug>" adds that product.
   - Any element with data-open-bag opens the bag.
   - Elements with data-bag-count show the number of items.
   - Checkout posts the slugs and quantities to /api/checkout, which
     prices everything on the server and returns a Stripe Checkout URL.
   ============================================================ */
import { PRODUCTS, bySlug } from "/data/products.js";
import { SHOP, SITE } from "/data/config.js";
import { gbp, esc, imgTag } from "/assets/shop-ui.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const KEY = "hh_bag_v2";

let BAG = load();
let DELIVERY = "collect", NOTE = "";
let lastFocus = null;

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return raw.filter(l => bySlug(l.s) && Number.isInteger(l.q) && l.q > 0).map(l => ({ s: l.s, q: Math.min(l.q, SHOP.maxQtyPerLine) }));
  } catch { return []; }
}
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(BAG)); } catch {} };
export const count = () => BAG.reduce((a, l) => a + l.q, 0);
const subtotal = () => BAG.reduce((a, l) => a + bySlug(l.s).price * l.q, 0);

/* ---------- drawer markup (injected once) ---------- */
document.body.insertAdjacentHTML("beforeend", `
<div class="scrim" id="scrim"></div>
<aside class="drawer" id="drawer" role="dialog" aria-modal="true" aria-labelledby="bagTitle" aria-hidden="true">
  <div class="dhead"><h2 id="bagTitle">Your bag</h2><button class="iconbtn" id="closeBag" aria-label="Close bag">&times;</button></div>
  <div class="dbody" id="dbody"></div>
  <div class="dfoot" id="dfoot"></div>
</aside>
<div class="toast" id="toast" role="status" aria-live="polite"></div>`);

export function toast(msg, ms = 2600) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), ms);
}

export function add(slug, q = 1, { open = false, silent = false } = {}) {
  const p = bySlug(slug); if (!p) return;
  const l = BAG.find(x => x.s === slug);
  if (l) l.q = Math.min(l.q + q, SHOP.maxQtyPerLine); else BAG.push({ s: slug, q: Math.min(q, SHOP.maxQtyPerLine) });
  save(); render();
  $$("[data-bag-count]").forEach(el => { const b = el.closest(".bagbtn"); if (b) { b.classList.remove("bump"); void b.offsetWidth; b.classList.add("bump"); } });
  if (open) openBag(); else if (!silent) toast(`Added to your bag · ${count()} item${count() === 1 ? "" : "s"}`);
}
function setQ(slug, q) {
  const l = BAG.find(x => x.s === slug); if (!l) return;
  l.q = Math.min(q, SHOP.maxQtyPerLine);
  if (l.q <= 0) BAG = BAG.filter(x => x.s !== slug);
  save(); render();
}

export function openBag() {
  lastFocus = document.activeElement;
  $("#drawer").classList.add("open"); $("#scrim").classList.add("open");
  $("#drawer").setAttribute("aria-hidden", "false");
  document.body.classList.add("bag-open"); document.body.style.overflow = "hidden";
  document.dispatchEvent(new Event("bag:toggle"));
  setTimeout(() => $("#closeBag").focus(), 50);
}
export function closeBag() {
  if (!$("#drawer").classList.contains("open")) return;
  $("#drawer").classList.remove("open"); $("#scrim").classList.remove("open");
  $("#drawer").setAttribute("aria-hidden", "true");
  document.body.classList.remove("bag-open"); document.body.style.overflow = "";
  document.dispatchEvent(new Event("bag:toggle"));
  lastFocus?.focus?.();
}

function render() {
  $$("[data-bag-count]").forEach(el => el.textContent = count());
  $$("[data-mbar-shop]").forEach(a => {
    if (count()) { a.textContent = `Bag (${count()})`; a.href = "/shop/#bag"; a.setAttribute("data-open-bag", ""); }
    else { a.textContent = "Shop"; a.href = "/shop/"; a.removeAttribute("data-open-bag"); }
  });
  const sub = subtotal(), need = Math.max(0, SHOP.freeDeliveryOver - sub);
  const pct = Math.min(100, sub / SHOP.freeDeliveryOver * 100);
  if (!BAG.length) {
    $("#dbody").innerHTML = `<div class="empty"><p class="serif">Your bag is empty</p><p>Not sure where to start?</p>
      <div class="ctas" style="justify-content:center;margin-top:18px"><a class="btn solid" href="/shop/#/quiz">Find my Nioxin system</a><a class="btn ghost" href="${SITE.bookingUrl}" target="_blank" rel="noopener">Book a free scalp check</a></div></div>`;
    $("#dfoot").innerHTML = ""; return;
  }
  $("#dbody").innerHTML = `
    <div class="shipbar">${need > 0 ? `You're <b>${gbp(need)}</b> away from free Liverpool delivery` : `<b>Free Liverpool delivery unlocked</b>`} · click &amp; collect is always free
      <div class="track"><i style="width:${pct}%"></i></div></div>
    ${BAG.map(l => { const p = bySlug(l.s); return `
      <div class="line"><div class="thumb">${imgTag(p)}</div>
        <div><div class="nm">${esc(p.name)}</div><div class="sub">${esc(p.sub)}</div>
          <div><span class="qty"><button aria-label="One fewer ${esc(p.name)}" data-q="${p.slug}" data-v="${l.q - 1}">−</button><span aria-live="polite">${l.q}</span><button aria-label="One more ${esc(p.name)}" data-q="${p.slug}" data-v="${l.q + 1}">+</button></span><button class="rm" data-q="${p.slug}" data-v="0">Remove</button></div></div>
        <div class="price">${gbp(p.price * l.q)}</div></div>`; }).join("")}`;
  const fee = DELIVERY === "deliver" && need > 0 ? SHOP.deliveryFee : 0;
  $("#dfoot").innerHTML = `
    <fieldset class="dopt" style="border:0;padding:0;margin:0 0 12px"><legend class="sr">Delivery or collection</legend>
      <label><span><input type="radio" name="dl" value="collect" ${DELIVERY === "collect" ? "checked" : ""}>Click &amp; collect, Rose Lane</span><b>Free</b></label>
      <label><span><input type="radio" name="dl" value="deliver" ${DELIVERY === "deliver" ? "checked" : ""}>Liverpool delivery</span><b>${need > 0 ? gbp(SHOP.deliveryFee) : "Free"}</b></label>
    </fieldset>
    <details class="giftnote" ${NOTE ? "open" : ""}><summary>Add a gift note</summary><label class="sr" for="gnote">Gift note</label><textarea id="gnote" maxlength="400" placeholder="Your message. We'll handwrite it on a card.">${esc(NOTE)}</textarea></details>
    <div class="tot"><span>Total</span><b>${gbp(sub + fee)}</b></div>
    <button class="btn solid lg block" id="checkoutBtn">Checkout securely</button>
    <div class="pay"><span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg> Secure payment by Stripe</span><span>Card · Apple Pay · Google Pay</span></div>`;
  $$('input[name="dl"]').forEach(r => r.onchange = e => { DELIVERY = e.target.value; render(); });
  const g = $("#gnote"); if (g) g.oninput = e => NOTE = e.target.value;
  $("#checkoutBtn").onclick = checkout;
}

async function checkout() {
  const btn = $("#checkoutBtn"); btn.disabled = true; btn.textContent = "Opening secure checkout…";
  try {
    const r = await fetch("/api/checkout", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: BAG.map(l => ({ slug: l.s, qty: l.q })), delivery: DELIVERY, giftNote: NOTE }),
    });
    const data = await r.json().catch(() => ({}));
    if (r.ok && data.url) { location.href = data.url; return; }
    if (data.error === "not_configured") toast("Online payment is being switched on. Message us on WhatsApp to order today.", 5000);
    else toast(data.message || "Sorry, checkout didn't open. Please try again or message the salon.", 5000);
  } catch {
    toast("Sorry, checkout didn't open. Please check your connection and try again.", 5000);
  }
  btn.disabled = false; btn.textContent = "Checkout securely";
}

/* ---------- wiring ---------- */
document.addEventListener("click", e => {
  const a = e.target.closest("[data-add]");
  if (a) {
    e.preventDefault();
    add(a.dataset.add, Number(a.dataset.qty || 1), { open: a.hasAttribute("data-add-open") });
    if (!a.hasAttribute("data-add-open")) {
      const t = a.textContent; a.classList.add("done"); a.textContent = "Added ✓";
      setTimeout(() => { a.classList.remove("done"); a.textContent = t; }, 1500);
    }
    return;
  }
  if (e.target.closest("[data-open-bag]")) { e.preventDefault(); openBag(); return; }
  const q = e.target.closest("[data-q]");
  if (q) setQ(q.dataset.q, Number(q.dataset.v));
});
$("#closeBag").onclick = closeBag;
$("#scrim").onclick = closeBag;
addEventListener("keydown", e => { if (e.key === "Escape") closeBag(); });

/* keep tabs/pages in sync */
addEventListener("storage", e => { if (e.key === KEY) { BAG = load(); render(); } });

render();
if (location.hash === "#bag") { history.replaceState(null, "", location.pathname + location.search); openBag(); }
if (new URLSearchParams(location.search).get("checkout") === "cancelled") { openBag(); toast("Checkout cancelled. Your bag is saved."); }

export { BAG, PRODUCTS };
