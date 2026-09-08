'use client';
/* oxlint-disable next/no-img-element */

import Link from 'next/link';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/components/app-provider';
import { RequireAuth } from '@/components/require-auth';
import { apiRequest, formatMoney, mediaUrl } from '@/lib/api';
import type { CheckoutPayment, Order } from '@/lib/types';

export default function CartPage() {
  const { auth, cart, cartCount, cartTotal, updateCart, removeFromCart, clearCart, event } = useApp();
  const router = useRouter();
  const [error, setError] = useState('');
  const [checkingOut, setCheckingOut] = useState(false);
  const sampleCart = cart.some((line) => line.stallFoodId.startsWith('demo-'));
  const orderingOpen = event?.preorderStatus === 'OPEN';

  const checkout = async () => {
    if (!auth || cart.length === 0 || sampleCart) return;
    setCheckingOut(true); setError('');
    try {
      const result = await apiRequest<{ order: Order; payment: CheckoutPayment }>('/orders', { method: 'POST', token: auth.token, body: JSON.stringify({ items: cart.map((line) => ({ stallFoodId: line.stallFoodId, quantity: line.quantity })) }) });
      localStorage.setItem(`gff.checkout.${result.order._id}`, JSON.stringify(result.payment));
      clearCart();
      localStorage.removeItem('gff.cache.foods.v1');
      router.push(`/orders/${result.order._id}`);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Checkout could not be completed.'); }
    finally { setCheckingOut(false); }
  };

  return <RequireAuth><main className="cart-page site-container"><Link href="/foods" className="back-link"><ArrowLeft size={16} /> Continue browsing</Link><div className="section-heading cart-heading"><div><p className="eyebrow">Your preorder</p><h1>Cart</h1></div><p>{cartCount} {cartCount === 1 ? 'item' : 'items'}</p></div>
    {cart.length === 0 ? <div className="empty-state empty-state--cart"><ShoppingBag aria-hidden="true" /><h2>Your cart is waiting</h2><p>Add a few fair-day favourites and they will stay on this device until checkout.</p><Link href="/foods" className="button">Browse the menu</Link></div>
      : <div className="cart-layout"><section className="cart-lines" aria-label="Cart items">{cart.map((line) => <article className="cart-line" key={line.stallFoodId}><img src={mediaUrl(line.food.food.image?.url) || line.food.demoImage || '/images/chicken-burger.webp'} alt="" /><div className="cart-line__details"><p>{line.food.stallName}</p><h2>{line.food.food.name}</h2><strong>{formatMoney(line.food.preorderPrice)}</strong></div><div className="quantity-control"><button onClick={() => line.quantity === 1 ? removeFromCart(line.stallFoodId) : updateCart(line.stallFoodId, line.quantity - 1)} aria-label="Decrease quantity"><Minus size={17} /></button><output>{line.quantity}</output><button onClick={() => updateCart(line.stallFoodId, line.quantity + 1)} aria-label="Increase quantity"><Plus size={17} /></button></div><div className="cart-line__subtotal"><strong>{formatMoney(line.quantity * line.food.preorderPrice)}</strong><button onClick={() => removeFromCart(line.stallFoodId)} aria-label={`Remove ${line.food.food.name}`}><Trash2 size={17} /></button></div></article>)}</section>
        <aside className="order-summary"><p className="eyebrow">Order summary</p><h2>{formatMoney(cartTotal)}</h2><div><span>{cartCount} food tickets</span><strong>{formatMoney(cartTotal)}</strong></div><p>Prices shown already include preorder discounts. Live prices and stock are checked again before the order is created.</p>{sampleCart && <p className="inline-warning">This sample cart cannot be purchased. Reconnect to the server for the live menu.</p>}{!orderingOpen && !sampleCart && <p className="inline-warning">Checkout will be available while preorders are open.</p>}{error && <p className="form-error" role="alert">{error}</p>}<button className="button button--full" onClick={checkout} disabled={checkingOut || sampleCart || !orderingOpen}>{checkingOut ? 'Checking availability…' : 'Continue to payment'}</button></aside>
      </div>}
  </main></RequireAuth>;
}
