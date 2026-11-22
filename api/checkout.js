/* POST /api/checkout → { url } of a Stripe Checkout page.
   Needs the STRIPE_SECRET_KEY environment variable in Vercel
   (sk_test_… for testing, sk_live_… when the shop goes live).
   Optional: SITE_URL, e.g. https://hairandhome.co.uk */
import Stripe from "stripe";
import { buildSessionParams, CartError } from "../lib/checkout.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "method_not_allowed" });
  }
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(503).json({ error: "not_configured" });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = null; } }

  const origin = (process.env.SITE_URL ||
    `${req.headers["x-forwarded-proto"] || "https"}://${req.headers["x-forwarded-host"] || req.headers.host}`).replace(/\/$/, "");

  try {
    const { params } = buildSessionParams(body, origin);
    const stripe = new Stripe(key);
    const session = await stripe.checkout.sessions.create(params);
    return res.status(200).json({ url: session.url });
  } catch (err) {
    if (err instanceof CartError) return res.status(400).json({ error: "bad_cart", message: err.message });
    console.error("checkout failed", err?.type, err?.message);
    return res.status(502).json({ error: "stripe_error", message: "Sorry, we couldn't open checkout just now. Please try again in a moment." });
  }
}
