/* ============================================================
   Hair & Home: shared behaviour for every page
   (header, mobile menu, mobile action bar, before/after sliders,
   scroll reveal, in-view video, opening hours, site links)
   ============================================================ */
import { SITE, SHOP } from "/data/config.js";

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Links set from config, so the booking URL lives in one place */
$$("[data-book]").forEach(a => { a.href = SITE.bookingUrl; a.target = "_blank"; a.rel = "noopener"; });
$$("[data-whatsapp]").forEach(a => { a.href = SITE.whatsapp; a.target = "_blank"; a.rel = "noopener"; });
$$("[data-maps]").forEach(a => { a.href = SITE.mapsUrl; a.target = "_blank"; a.rel = "noopener"; });
$$("[data-instagram]").forEach(a => { a.href = SITE.instagram; a.target = "_blank"; a.rel = "noopener"; });
$$("[data-reviews]").forEach(a => {
  if (SITE.reviewsUrl) { a.href = SITE.reviewsUrl; a.target = "_blank"; a.rel = "noopener"; }
  else { a.classList.add("todo"); a.dataset.todo = "Google reviews link needed"; a.href = "#reviews"; }
});
$$("[data-cutoff]").forEach(el => el.textContent = SHOP.christmasCutoff);
$$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

/* Header border on scroll + mobile action bar */
const hdr = $("header.site"), mbar = $(".mbar"), foot = $("footer.site");
const onScroll = () => {
  const y = scrollY;
  hdr && hdr.classList.toggle("scrolled", y > 8);
  if (mbar) {
    const nearFoot = foot && foot.getBoundingClientRect().top < innerHeight - 40;
    mbar.classList.toggle("show", y > innerHeight * 0.45 && !nearFoot && !document.body.classList.contains("bag-open"));
  }
};
addEventListener("scroll", onScroll, { passive: true }); onScroll();
document.addEventListener("bag:toggle", onScroll);

/* Mobile menu */
const mnav = $("#mnav");
if (mnav) {
  const open = () => { mnav.classList.add("open"); mnav.setAttribute("aria-hidden", "false"); $("#menuClose")?.focus(); document.body.style.overflow = "hidden"; };
  const close = () => { mnav.classList.remove("open"); mnav.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; $("#menuBtn")?.focus(); };
  $("#menuBtn")?.addEventListener("click", open);
  $("#menuClose")?.addEventListener("click", close);
  $$("a", mnav).forEach(a => a.addEventListener("click", () => { mnav.classList.remove("open"); document.body.style.overflow = ""; }));
  addEventListener("keydown", e => { if (e.key === "Escape" && mnav.classList.contains("open")) close(); });
}

/* Before / after sliders */
export function initBA(root = document) {
  $$(".ba .stage", root).forEach(s => {
    const r = s.querySelector("input[type=range]"); if (!r || r._ba) return; r._ba = 1;
    const set = () => s.style.setProperty("--pos", r.value + "%");
    r.addEventListener("input", set); set();
  });
}
initBA();

/* Reveal on scroll: only content that starts below the fold gets hidden,
   so nothing above the fold flickers and nothing stays hidden if JS fails. */
export function reveal(root = document) {
  const els = $$("[data-rv], [data-rv-group] > *", root).filter(e => !e.classList.contains("on"));
  if (REDUCED || !("IntersectionObserver" in window)) return;
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -6% 0px" });
  const counts = new Map();
  els.forEach(e => {
    if (e.getBoundingClientRect().top < innerHeight) return;
    const g = e.parentElement, i = counts.get(g) || 0; counts.set(g, i + 1);
    e.style.transitionDelay = Math.min(i, 5) * 70 + "ms";
    e.classList.add("rv"); io.observe(e);
  });
  /* safety net: if anything is still hidden after a fast scroll, show it */
  addEventListener("scroll", () => { clearTimeout(reveal._t); reveal._t = setTimeout(() => $$(".rv:not(.on)").forEach(e => { if (e.getBoundingClientRect().top < innerHeight) e.classList.add("on"); }), 120); }, { passive: true });
}
reveal();

/* Videos play only while on screen, never with reduced motion */
const vids = $$("video.auto");
if (!REDUCED && "IntersectionObserver" in window) {
  const vio = new IntersectionObserver(es => es.forEach(e => {
    const v = e.target;
    if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; v.play()?.catch(() => {}); }
    else v.pause();
  }), { threshold: .25 });
  vids.forEach(v => vio.observe(v));
}

/* Today in the opening hours */
$(`tr[data-d="${new Date().getDay()}"]`)?.classList.add("today");
