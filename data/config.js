/* ============================================================
   SITE SETTINGS: the one place to change links, fees and dates.
   Used by every page (in the browser) and by /api/checkout (on
   the server), so a change here applies everywhere.
   ============================================================ */

export const SITE = {
  name: "Hair & Home",
  bookingUrl: "https://booksy.com/en-gb/dl/show-business/47975",
  whatsapp: "https://wa.me/447763645720",
  phone: "+447763645720",
  instagram: "https://www.instagram.com/hairandhomeroselane/",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Hair%20%26%20Home%20263a%20Rose%20Lane%20Liverpool&query_place_id=ChIJ-3L5M-Ihe0gRancmfu_h1VQ",
  reviewsUrl: "", // TODO(client): Google reviews link, e.g. https://g.page/r/XXXX/review
  rating: { value: 4.8, count: 35 }, // keep in step with Google
};

export const SHOP = {
  currency: "gbp",
  freeDeliveryOver: 50,     // £: local delivery is free at or above this subtotal
  deliveryFee: 3.95,        // £: local Liverpool delivery
  christmasCutoff: "19 December", // TODO(client): confirm last order date
  maxQtyPerLine: 10,
  maxLines: 25,
};
