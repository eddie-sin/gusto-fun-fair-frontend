import test from 'node:test';
import assert from 'node:assert/strict';
import { maxOrderQuantity, PAYMENT_NOTE } from '../lib/order-policy.ts';

test('customer quantity controls use the low-stock boundary and handle unavailable stock', () => {
  assert.deepEqual([-1, 0, 1, 4, 5, 6, 20, NaN].map(maxOrderQuantity), [0, 0, 1, 1, 1, 2, 2, 0]);
  assert.equal(PAYMENT_NOTE, 'fun fair');
});
