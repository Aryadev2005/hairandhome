/* Small rendering helpers shared by the shop, the homepage and the bag */
import { imgPath, CATS } from "/data/products.js";

export const gbp = n => "£" + Number(n).toFixed(2);
export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

export function imgTag(p, i = p.imgs[0], { eager = false, alt = p.name } = {}) {
  const src = imgPath(p, i);
  if (!src) return `<div class="ph">${esc(p.name)}</div>`;
  return `<img src="${src}" alt="${esc(alt)}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async" onerror="this.replaceWith(Object.assign(document.createElement('div'),{className:'ph',textContent:this.alt}))">`;
}

export const productUrl = p => `/shop/#/p/${p.slug}`;

export function badgeHtml(p) {
  if (!p.badge) return "";
  const dark = p.cat === "gift" || p.cat === "niogift";
  return `<span class="badge ${dark ? "dark" : ""} ${p.hand ? "hand" : ""}">${esc(p.badge)}</span>`;
}

export function productCard(p) {
  return `<article class="pcard" data-rv>
    <a class="media" href="${productUrl(p)}" tabindex="-1" aria-hidden="true">${badgeHtml(p)}${imgTag(p)}</a>
    <div class="body">
      <h3><a href="${productUrl(p)}">${esc(p.name)}</a></h3>
      <p class="sub">${esc(p.sub)}</p>
      <div class="foot"><span class="price">${gbp(p.price)}</span>
        <button class="btn solid sm add" data-add="${p.slug}" aria-label="Add ${esc(p.name)} to bag">Add to bag</button></div>
    </div></article>`;
}

export const catLabel = c => CATS[c]?.label || "";
