/* Builds the Stripe Checkout Session from a cart.
   Prices always come from data/products.js on the server, never from the browser. */
import { bySlug, imgPath } from "../data/products.js";
import { SHOP } from "../data/config.js";

export class CartError extends Error {}

const pence = pounds => Math.round(pounds * 100);

export function buildSessionParams(body, origin) {
  const items = Array.isArray(body?.items) ? body.items : null;
  if (!items || !items.length) throw new CartError("Your bag is empty.");
  if (items.length > SHOP.maxLines) throw new CartError("Too many items in one order.");

  const merged = new Map();
  for (const it of items) {
    const p = bySlug(String(it?.slug || ""));
    const qty = Number(it?.qty);
    if (!p) throw new CartError("One of the products in your bag is no longer available.");
    if (!Number.isInteger(qty) || qty < 1 || qty > SHOP.maxQtyPerLine) throw new CartError("Please check the quantities in your bag.");
    merged.set(p.slug, Math.min((merged.get(p.slug) || 0) + qty, SHOP.maxQtyPerLine));
  }

  const line_items = [], summary = [];
  let subtotal = 0;
  for (const [slug, quantity] of merged) {
    const p = bySlug(slug);
    const unit = pence(p.price);
    subtotal += unit * quantity;
    const img = imgPath(p);
    line_items.push({
      quantity,
      price_data: {
        currency: SHOP.currency,
        unit_amount: unit,
        product_data: {
          name: p.name,
          description: p.sub,
          ...(img ? { images: [origin + img] } : {}),
          metadata: { slug },
        },
      },
    });
    summary.push(`${quantity}x ${slug}`);
  }

  const delivery = body?.delivery === "deliver" ? "deliver" : "collect";
  const fee = delivery === "deliver" && subtotal < pence(SHOP.freeDeliveryOver) ? pence(SHOP.deliveryFee) : 0;
  const giftNote = String(body?.giftNote || "").replace(/\s+/g, " ").trim().slice(0, 450);

  const params = {
    mode: "payment",
    locale: "en-GB",
    line_items,
    shipping_options: [{
      shipping_rate_data: {
        type: "fixed_amount",
        display_name: delivery === "deliver" ? "Local Liverpool delivery" : "Click & collect, 263a Rose Lane",
        fixed_amount: { amount: fee, currency: SHOP.currency },
      },
    }],
    phone_number_collection: { enabled: true },
    allow_promotion_codes: true,
    metadata: { delivery, gift_note: giftNote, items: summary.join(", ").slice(0, 490) },
    payment_intent_data: { description: `Hair & Home shop order (${delivery === "deliver" ? "delivery" : "click & collect"})` },
    custom_text: {
      submit: { message: delivery === "deliver"
        ? "We deliver across Liverpool and will message you with a delivery day."
        : "We'll message you when your order is ready to collect from the salon on Rose Lane." },
    },
    success_url: `${origin}/shop/thanks/?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/shop/?checkout=cancelled`,
  };
  if (delivery === "deliver") {
    params.shipping_address_collection = { allowed_countries: ["GB"] };
    params.custom_text.shipping_address = { message: "Local delivery covers Liverpool postcodes. Further afield? Message us first." };
  }
  return { params, subtotal, fee };
}
