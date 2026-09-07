export const SITE_NAME = "GUSTO Fun Fair";

// Organiser-owned display details live here on purpose and do not depend on the API.
export const EVENT_DETAILS = {
  name: "GUSTO Fun Fair 2026",
  date: "11 September 2026",
  time: "Time to be announced",
  place: "Venue to be announced",
};

export const CACHE_KEYS = {
  event: "gff.cache.event.v1",
  foods: "gff.cache.foods.v1",
  stalls: "gff.cache.stalls.v1",
  auth: "gff.auth.v1",
  cart: "gff.cart.v1",
};

export const CACHE_TIMES = {
  event: 5 * 60_000,
  catalog: 2 * 60_000,
  stockFocusRefresh: 45_000,
};
