/* ============================================================
   PRODUCTS: the single source of truth for the shop.
   The shop pages read this file in the browser, and /api/checkout
   reads the same file on the server to charge the right price, so a
   price edited here can't be changed by anyone in their browser.

   Adding a product: copy an entry, give it a unique slug, pick a
   `cat` from CATS below, set the price (in pounds) and list its
   images (see "Images" below).
   Adding a new kind of product (e.g. shampoo, homeware): add a
   category to CATS with its group. It gets a filter chip
   automatically.

   Images: files live in /shop/images/. The main image is
   <pre><slug>.jpg and gallery images are <pre><slug>-1.jpg, -2.jpg…
   `pre` defaults to "nioxin-420-". `imgs` lists which numbers exist
   (0 = the main image with no suffix). imgs: [] shows a placeholder.

   All prices are retail prices. TODO(client): confirm with Sacha.
   ============================================================ */

export const GROUPS = {
  thinning: "Thinning hair & scalp",
  gifts: "Gift sets",
  // haircare: "Haircare",   // ready for when the shop grows
  // home: "Home",
};

export const CATS = {
  kit:     { label: "System kits",      group: "thinning" },
  serum:   { label: "Serums",           group: "thinning" },
  scalp:   { label: "Scalp care",       group: "thinning" },
  niogift: { label: "Nioxin gift sets", group: "thinning" },
  gift:    { label: "Wella gift sets",  group: "gifts" },
};

export const PRODUCTS = [
  /* ---------- Nioxin system kits ---------- */
  {slug:"system1-trial-kit", name:"System 1 Trial Kit", cat:"kit", sys:1, price:42.75, imgs:[0,4,5,6,7], badge:"Start here", hand:true, featured:true,
   sub:"Natural hair · light thinning · 30-day size",
   what:"Nioxin's 3-step system for natural hair with light thinning: cleanse, condition and treat the scalp for fuller-looking hair."},
  {slug:"system2-trial-kit", name:"System 2 Trial Kit", cat:"kit", sys:2, price:42.75, imgs:[0,1,2,3,4,5,6,7], badge:"Start here", hand:true, featured:true,
   sub:"Natural hair · progressed thinning · 30-day size",
   what:"Nioxin's 3-step system for natural hair with progressed thinning: cleanse, condition and treat the scalp for fuller-looking hair."},
  {slug:"system3-trial-kit", name:"System 3 Trial Kit", cat:"kit", sys:3, price:42.75, imgs:[0,1,2,3,4,5,6,7],
   sub:"Coloured hair · light thinning · 30-day size",
   what:"Nioxin's 3-step system for coloured, dry or damaged hair with light thinning, with colour-safe care."},
  {slug:"system4-trial-kit", name:"System 4 Trial Kit", cat:"kit", sys:4, price:42.75, imgs:[1,2,3,4,5,6,7],
   sub:"Coloured hair · progressed thinning · 30-day size",
   what:"Nioxin's 3-step system for coloured, dry or damaged hair with progressed thinning, with colour-safe care."},
  {slug:"system1-loyalty-kit", name:"System 1 Loyalty Kit", cat:"kit", sys:1, price:67, imgs:[1,2,3,4,5,6,7],
   sub:"Natural hair · light thinning · larger sizes",
   what:"The full-size System 1 routine, for when you know it works for you."},
  {slug:"system3-loyalty-kit", name:"System 3 Loyalty Kit", cat:"kit", sys:3, price:67, imgs:[0,1,2,3,4,5,6,7],
   sub:"Coloured hair · light thinning · larger sizes",
   what:"The full-size System 3 routine, for when you know it works for you."},
  {slug:"system4-loyalty-kit", name:"System 4 Loyalty Kit", cat:"kit", sys:4, price:67, imgs:[0,1,2,3,4,5,6,7],
   sub:"Coloured hair · progressed thinning · larger sizes",
   what:"The full-size System 4 routine, for when you know it works for you."},

  /* ---------- Serums ---------- */
  {slug:"hair-booster-serum-100ml", name:"Hair Booster Serum", cat:"serum", price:71.20, imgs:[0,1,2,3,4,5], badge:"Sacha's pick", hand:true, featured:true,
   sub:"For progressed thinning · 100ml",
   what:"A targeted leave-in treatment from Nioxin for areas of progressed thinning. Apply to the scalp where hair looks thinnest."},
  {slug:"diaboost-serum-100ml", name:"Diaboost Thickening Serum", cat:"serum", price:63.20, imgs:[0,1,2,3,4,5,6,7,8], featured:true,
   sub:"Leave-in thickening treatment · 100ml",
   what:"A leave-in thickening serum from Nioxin's Density Defend range that helps hair look and feel fuller."},
  {slug:"night-density-rescue-serum-70ml", name:"Night Density Rescue Serum", cat:"serum", price:63.20, imgs:[1,2,3],
   sub:"Overnight thickening treatment · 70ml",
   what:"An overnight leave-in treatment from Nioxin to support fuller-looking hair while you sleep."},
  {slug:"hair-fall-defense-serum-70ml", name:"Hair Fall Defense Serum", cat:"serum", price:57.50, imgs:[0,1,2,3,4,5,6,7],
   sub:"Nioxin Hair Fall Defense range · 70ml",
   what:"A leave-in serum from Nioxin's Hair Fall Defense range, designed for daily scalp care."},

  /* ---------- Scalp care ---------- */
  {slug:"scalp-recovery-kit", name:"Scalp Recovery Kit", cat:"scalp", price:59.60, imgs:[0,1,2,3,4,5,6,7,8],
   sub:"Anti-dandruff · for itchy, flaky scalps",
   what:"Nioxin's 3-step Scalp Recovery anti-dandruff routine: a purifying shampoo, a moisturising conditioner and a leave-on soothing serum for an itchy, flaky scalp. Suitable for all hair types.",
   inside:"Purifying Shampoo 200ml + Moisturising Conditioner 200ml + Scalp Soothing Serum 100ml"},
  {slug:"scalp-recovery-soothing-serum-100ml", name:"Scalp Recovery Soothing Serum", cat:"scalp", price:31.50, imgs:[0,1,2,3,4,5,6,7,8,9],
   sub:"Anti-dandruff leave-on serum · 100ml",
   what:"A leave-on anti-dandruff serum from Nioxin's Scalp Recovery range, with pyrithione zinc, for an itchy, flaky scalp. Apply directly to the scalp, massage in and don't rinse. Suitable for all hair types."},

  /* ---------- Nioxin gift sets ---------- */
  {slug:"giftset-thickening-anti-breakage", name:"Thickening & Anti-Breakage Gift Set", cat:"niogift", price:52, imgs:[1,2,3,4,5,6,7,8,9], badge:"Gift set", seasonal:true,
   sub:"For natural hair with light thinning",
   what:"Nioxin's 3-step System Kit 1 to thicken and strengthen, plus a free full-size Anti-Breakage Strengthening Mask to help protect against breakage.",
   inside:"System Kit 1 (shampoo, conditioner, leave-in treatment) + free full-size Anti-Breakage Strengthening Mask"},
  {slug:"giftset-density-anti-breakage", name:"Density & Anti-Breakage Gift Set", cat:"niogift", price:52, imgs:[0,1,2,3,4,5,6,7,8,9,10,11], badge:"Gift set", seasonal:true,
   sub:"For natural hair with progressed thinning",
   what:"Nioxin's 3-step System Kit 2 to boost hair density, plus a free full-size Anti-Breakage Strengthening Mask to help strengthen hair and protect against breakage.",
   inside:"System Kit 2 (shampoo, conditioner, leave-in treatment) + free full-size Anti-Breakage Strengthening Mask"},
  {slug:"giftset-thickening-nourishing-anti-breakage", name:"Thickening, Nourishing & Anti-Breakage Gift Set", cat:"niogift", price:52, imgs:[0,10,11], badge:"Gift set", seasonal:true,
   sub:"For coloured or dry hair with light thinning",
   what:"Nioxin's 3-step System Kit 3, formulated with niacinamide and biotin, plus a free full-size Anti-Breakage Strengthening Mask to help strengthen hair and reduce breakage.",
   inside:"System Kit 3 (shampoo, conditioner, leave-in treatment) + full-size Anti-Breakage Strengthening Mask"},
  {slug:"giftset-density-nourishing-anti-breakage", name:"Density, Nourishing & Anti-Breakage Gift Set", cat:"niogift", price:52, imgs:[0,1,2,3,4,5,6,7,8,9,10,11], badge:"Gift set", seasonal:true,
   sub:"For coloured or dry hair with progressed thinning",
   what:"Nioxin's 3-step System Kit 4 to boost density and nourish while protecting colour, plus a free full-size Anti-Breakage Strengthening Mask.",
   inside:"System Kit 4 (shampoo, conditioner, leave-in treatment) + free full-size Anti-Breakage Strengthening Mask"},

  /* ---------- Wella Christmas gift sets ---------- */
  {slug:"wella-make-it-strong", pre:"", brand:"Wella Professionals", name:"Ultimate Repair: Make It Strong", cat:"gift", price:52, imgs:[], badge:"Christmas gift", seasonal:true,
   sub:"For damaged hair · 3-step gift set",
   what:"Wella Professionals' Ultimate Repair routine for damaged hair, gift-boxed for Christmas. Powered by AHA and omega-9 to help strengthen hair from the inside out and leave it smooth and shiny.",
   inside:"Ultimate Repair Shampoo 250ml + Ultimate Repair Conditioner 200ml + Ultimate Repair Miracle Hair Rescue 30ml"},
  {slug:"wella-make-it-last", pre:"", brand:"Wella Professionals", name:"Ultimate Color: Make It Last", cat:"gift", price:52, imgs:[], badge:"Christmas gift", seasonal:true,
   sub:"For coloured hair · gift set",
   what:"Wella Professionals' Ultimate Color routine to help keep coloured hair vibrant and glossy between salon visits, gift-boxed for Christmas."},
  {slug:"wella-make-it-smooth", pre:"", brand:"Wella Professionals", name:"Ultimate Smooth: Make It Smooth", cat:"gift", price:52, imgs:[], badge:"Christmas gift", seasonal:true,
   sub:"For dry, frizzy hair · gift set",
   what:"Wella Professionals' Ultimate Smooth routine to help tame frizz and leave dry hair soft, smooth and shiny, gift-boxed for Christmas."},
];

/* "Complete the routine" suggestions shown on product pages */
export const PAIRS = { niogift:"hair-booster-serum-100ml", kit:"hair-booster-serum-100ml", serum:"system2-trial-kit", scalp:"scalp-recovery-soothing-serum-100ml" };

export const bySlug = slug => PRODUCTS.find(p => p.slug === slug);

/* Image path relative to the site root, e.g. /shop/images/nioxin-420-system1-trial-kit.jpg */
export function imgPath(p, i = p.imgs[0]) {
  if (i === undefined) return null;
  const pre = p.pre !== undefined ? p.pre : "nioxin-420-";
  return `/shop/images/${pre}${p.slug}${i ? "-" + i : ""}.jpg`;
}
