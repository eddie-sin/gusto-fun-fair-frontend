import test from 'node:test';
import assert from 'node:assert/strict';
import { apiRequest, ApiError, retryAfterSeconds } from '../lib/api.ts';

test('reads Retry-After seconds/date and JSON fallback', () => {
  assert.equal(retryAfterSeconds('5'), 5);
  const seconds = retryAfterSeconds(new Date(Date.now() + 30000).toUTCString());
  assert.ok(seconds >= 29 && seconds <= 30);
  assert.equal(retryAfterSeconds(null, 15), 15);
  assert.equal(retryAfterSeconds('invalid', 10), 10);
  assert.equal(retryAfterSeconds(null, -1), undefined);
});

test('upload errors preserve retry details and never automatically resend POST', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ error: {
    message: 'Receipt uploads are busy right now.', details: { code: 'PROOF_UPLOAD_BUSY', retryAfterSeconds: 5 },
  } }), { status: 503, headers: { 'Content-Type': 'application/json', 'Retry-After': '7' } }));
  const body = new FormData(); body.append('image', new Blob(['receipt']), 'receipt.png');
  await assert.rejects(apiRequest('/payments/orders/example', { method: 'POST', body }), error => {
    assert.ok(error instanceof ApiError); assert.equal(error.status, 503);
    assert.equal(error.code, 'PROOF_UPLOAD_BUSY'); assert.equal(error.retryAfterSeconds, 7);
    return true;
  });
  assert.equal(mock.mock.callCount(), 1); assert.ok(body.get('image'));
});

test('cross-origin response can fall back to JSON retry details', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ error: {
    message: 'Please wait.', details: { code: 'PROOF_UPLOAD_RATE_LIMITED', retryAfterSeconds: 42 },
  } }), { status: 429, headers: { 'Content-Type': 'application/json' } }));
  await assert.rejects(apiRequest('/payments/orders/example', { method: 'POST' }), error => error.retryAfterSeconds === 42);
});


test('checkout stock errors preserve the food and updated allowance for cart correction', async t => {
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ error: {
    message: 'Please choose one while stock is low.', details: { code: 'ORDER_QUANTITY_LIMIT', stallFoodId: 'food-a', maxQuantity: 1, ticketsRemaining: 5 },
  } }), { status: 409, headers: { 'Content-Type': 'application/json' } }));
  await assert.rejects(apiRequest('/orders', { method: 'POST' }), error =>
    error.code === 'ORDER_QUANTITY_LIMIT' && error.stallFoodId === 'food-a' && error.maxQuantity === 1 && error.ticketsRemaining === 5);
});

test('hourly order limit preserves retry guidance and does not resend checkout', async t => {
  const mock = t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ error: {
    message: 'Up to 3 orders per hour.', details: { code: 'ORDER_RATE_LIMITED', retryAfterSeconds: 1800 },
  } }), { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '1800' } }));
  await assert.rejects(apiRequest('/orders', { method: 'POST' }), error => error.code === 'ORDER_RATE_LIMITED' && error.retryAfterSeconds === 1800);
  assert.equal(mock.mock.callCount(), 1);
});
