import { test } from "node:test";
import assert from "node:assert/strict";
import { buildSessionParams, CartError } from "../lib/checkout.js";
import { PRODUCTS, imgPath } from "../data/products.js";
import { existsSync } from "node:fs";

const O = "https://example.com";

test("prices come from the server, not the request", () => {
  const { params, subtotal } = buildSessionParams({ items: [{ slug: "system1-trial-kit", qty: 2, price: 0.01 }] }, O);
  assert.equal(params.line_items[0].price_data.unit_amount, 4275);
  assert.equal(params.line_items[0].quantity, 2);
  assert.equal(subtotal, 8550);
});

test("click & collect is free and asks for no address", () => {
  const { params, fee } = buildSessionParams({ items: [{ slug: "scalp-recovery-soothing-serum-100ml", qty: 1 }], delivery: "collect" }, O);
  assert.equal(fee, 0);
  assert.equal(params.shipping_address_collection, undefined);
});

test("delivery under the threshold costs £3.95 and collects a GB address", () => {
  const { params, fee } = buildSessionParams({ items: [{ slug: "scalp-recovery-soothing-serum-100ml", qty: 1 }], delivery: "deliver" }, O);
  assert.equal(fee, 395);
  assert.deepEqual(params.shipping_address_collection.allowed_countries, ["GB"]);
});

test("delivery at or over £50 is free", () => {
  const { fee } = buildSessionParams({ items: [{ slug: "giftset-density-anti-breakage", qty: 1 }], delivery: "deliver" }, O);
  assert.equal(fee, 0);
});

test("duplicate lines merge and quantities are capped", () => {
  const { params } = buildSessionParams({ items: [{ slug: "system2-trial-kit", qty: 6 }, { slug: "system2-trial-kit", qty: 6 }] }, O);
  assert.equal(params.line_items.length, 1);
  assert.equal(params.line_items[0].quantity, 10);
});

test("bad carts are rejected", () => {
  assert.throws(() => buildSessionParams({ items: [] }, O), CartError);
  assert.throws(() => buildSessionParams({ items: [{ slug: "nope", qty: 1 }] }, O), CartError);
  assert.throws(() => buildSessionParams({ items: [{ slug: "system1-trial-kit", qty: 0 }] }, O), CartError);
  assert.throws(() => buildSessionParams({ items: [{ slug: "system1-trial-kit", qty: 1.5 }] }, O), CartError);
  assert.throws(() => buildSessionParams(null, O), CartError);
});

test("gift note is trimmed into metadata", () => {
  const { params } = buildSessionParams({ items: [{ slug: "system1-trial-kit", qty: 1 }], giftNote: "  Happy\n Christmas  " + "x".repeat(600) }, O);
  assert.ok(params.metadata.gift_note.startsWith("Happy Christmas"));
  assert.ok(params.metadata.gift_note.length <= 450);
});

test("every listed product image exists", () => {
  const missing = [];
  for (const p of PRODUCTS) for (const i of p.imgs) { const f = "." + imgPath(p, i); if (!existsSync(f)) missing.push(f); }
  assert.deepEqual(missing, []);
});
