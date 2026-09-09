export const PAYMENT_NOTE = 'fun fair';
export const ORDER_LIMIT_MESSAGE = 'Up to 2 of each food per order, or 1 when only 5 or fewer remain. Up to 3 orders per hour.';
export function maxOrderQuantity(remaining: number) {
  return !Number.isFinite(remaining) || remaining <= 0 ? 0 : remaining > 5 ? 2 : 1;
}
export function quantityLimitMessage(remaining: number) {
  return remaining <= 0 ? 'This food is sold out.' : `Up to ${maxOrderQuantity(remaining)} per order${remaining <= 5 ? ' while stock is low' : ''}, so everyone gets a chance.`;
}
