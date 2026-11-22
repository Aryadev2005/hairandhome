/* Copies partials/header.html and partials/footer.html into every page,
   between the <!-- header:start --> / <!-- header:end --> (and footer) markers,
   and marks the current page in the navigation.
   Run after editing a partial:  npm run sync   (or: node scripts/sync-partials.mjs)
   The site itself has no build step: the pages are plain HTML. */
import { readFileSync, writeFileSync } from "node:fs";

const PAGES = {
  "index.html": "/",
  "thinning-hair/index.html": "/thinning-hair/",
  "results/index.html": "/results/",
  "shop/index.html": "/shop/",
  "shop/thanks/index.html": "/shop/",
};
const header = readFileSync("partials/header.html", "utf8").trim();
const footer = readFileSync("partials/footer.html", "utf8").trim();

for (const [file, route] of Object.entries(PAGES)) {
  let html = readFileSync(file, "utf8");
  const nav = header.replace(new RegExp(`(<a href="${route.replace(/\//g, "\\/")}")>`, "g"), `$1 aria-current="page">`);
  for (const [name, part] of [["header", route === "/" ? header : nav], ["footer", footer]]) {
    const re = new RegExp(`<!-- ${name}:start -->[\\s\\S]*?<!-- ${name}:end -->`);
    if (!re.test(html)) throw new Error(`${file}: missing ${name} markers`);
    html = html.replace(re, `<!-- ${name}:start -->\n${part}\n<!-- ${name}:end -->`);
  }
  writeFileSync(file, html);
  console.log("synced", file);
}
