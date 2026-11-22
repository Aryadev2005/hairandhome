# Hair & Home: website

The website for Hair & Home, 263a Rose Lane, Liverpool L18 5HJ. A Product by Codzo.

The site is built to win **thinning-hair clients**. Every page leads to two actions: **book a free scalp check** (on Booksy) or **buy online** (Stripe checkout).

Plain HTML, CSS and JavaScript with no framework and no build step, plus one small serverless function that takes payments.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Thinning-hair hero, signs, how it works, results, shop edit, reviews, Sacha, other services, homeware, visit |
| Thinning hair | `thinning-hair/index.html` | Treatments & prices, 90-day timeline, results, FAQ (with FAQ schema for Google) |
| Results | `results/index.html` | Before & after gallery with filters |
| Shop | `shop/index.html` | Quiz, Nioxin range, gift sets, product pages (`#/p/<slug>`) |
| Order confirmed | `shop/thanks/index.html` | Where Stripe sends customers after paying |

Every page has the same header (Book + Bag), a fixed booking bar on phones, and the bag drawer, so "Add to bag" works on any page.

## Where to change things

| To change… | Edit |
|---|---|
| Products, prices, images, categories | `data/products.js` |
| Booking link, WhatsApp, Google reviews link, delivery fee, free-delivery threshold, Christmas cut-off | `data/config.js` |
| Header, navigation, footer, mobile bar | `partials/header.html` / `partials/footer.html`, then run `npm run sync` |
| Colours, fonts, buttons, shared components | `assets/site.css` |

**Prices live in one place.** The shop shows prices from `data/products.js`, and the checkout function charges from the same file, so a price can't be changed in someone's browser.

**Adding new kinds of products** (shampoos, styling, homeware): add a category to `CATS` (and a group to `GROUPS` if it's a new section) in `data/products.js`, then add the products. Filter chips and sections are created automatically.

**Booking links** in the HTML have a `data-book` attribute. On page load they're pointed at `SITE.bookingUrl`, so changing the URL in `config.js` updates every button.

## Payments (Stripe)

`api/checkout.js` runs as a Vercel serverless function. It checks the bag, prices it from `data/products.js`, and opens a Stripe Checkout page. That page takes card, Apple Pay, Google Pay and Link, plus PayPal if it's switched on in Stripe.

- **Click & collect:** free, and no address is asked for.
- **Liverpool delivery:** £3.95, free over £50. A UK address is collected.
- The gift note and delivery choice are saved in the payment's metadata in the Stripe dashboard.
- Discount codes from the Stripe dashboard work at checkout.

### Setup
1. Create a Stripe account for the salon (the client's own account; they get paid into it).
2. In Vercel → Project → Settings → Environment Variables, add:
   - `STRIPE_SECRET_KEY`: start with the **test** key (`sk_test_…`)
   - `SITE_URL` (optional): e.g. `https://hairandhome.co.uk`
3. Redeploy. Test with card `4242 4242 4242 4242`, any future date, any CVC.
4. In Stripe → Settings → Emails, turn on customer receipts. Under notifications, turn on successful-payment emails so the salon hears about every order.
5. When everything checks out, swap in the **live** key (`sk_live_…`).

Until a key is added, checkout shows: "Online payment is being switched on. Message us on WhatsApp to order today."

### Tests
```
npm install
npm test        # checkout pricing, delivery rules, validation, every product image exists
```

## Before launch: what the client needs to supply

Anything still missing shows on the preview with a **dashed gold outline and a label**, so it's easy to spot.

- [ ] **Thinning-hair before & after photos** (3 or more): same angle and light, with each client's written consent. Home, Thinning hair and Results pages.
- [ ] **In-salon scalp treatment**: confirm it's offered, what's included, how long it takes and the price (Thinning hair page and "Salon care" step on Home).
- [ ] **Google reviews link** → `SITE.reviewsUrl` in `data/config.js`.
- [ ] **A thinning-hair review**, copied word for word from Google (Home page).
- [ ] **Photo of Sacha** (Home and Shop).
- [ ] **Confirm all product prices** and the Christmas last-order date.
- [ ] **Stripe account** + keys (see above).
- [ ] Confirm the results-page note (same angle and light, client permission) matches how photos are actually taken.

## Launch checklist
- [ ] Remove `<meta name="robots" content="noindex, nofollow">` from every page.
- [ ] Replace `robots.txt` with one that allows crawling and lists the sitemap.
- [ ] Remove "Preview build" from `partials/footer.html` and run `npm run sync`.
- [ ] Switch Stripe to the live key.
- [ ] Point the domain at Vercel.

## Copy rules (UK advertising, ASA/CAP)
Nioxin is a cosmetic product. Don't say it "regrows hair", "stops hair loss" or "cures" anything. Use "thicker-looking", "fuller-looking" and "healthier-looking scalp", which is how Nioxin itself describes its products. Before & after photos must be real, unretouched, and shared with the client's permission. Hair loss can have medical causes, so the site points people to their GP when loss is sudden or patchy.

## Deploying
Vercel, framework preset "Other", no build command. Vercel installs `stripe` for the function automatically from `package.json`.
