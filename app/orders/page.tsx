'use client';
/* oxlint-disable react/react-compiler */

import Link from 'next/link';
import { ArrowRight, ClipboardList, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useApp } from '@/components/app-provider';
import { RequireAuth } from '@/components/require-auth';
import { apiRequest, formatDateTime, formatMoney } from '@/lib/api';
import { orderStatus } from '@/lib/order-display';
import type { Order, Ticket } from '@/lib/types';

export default function OrdersPage() {
  const { auth } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => {
    if (!auth) return;
    setLoading(true); setError('');
    try {
      const [orderResult, ticketResult] = await Promise.all([apiRequest<{ orders: Order[] }>('/orders', { token: auth.token, dedupe: true }), apiRequest<{ tickets: Ticket[] }>('/tickets/mine', { token: auth.token, dedupe: true })]);
      setOrders(orderResult.orders); setTickets(ticketResult.tickets);
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Orders could not be loaded.'); }
    finally { setLoading(false); }
  }, [auth]);
  useEffect(() => { void load(); }, [load]);
  const ticketFor = (orderId: string) => tickets.find((ticket) => (typeof ticket.orderId === 'string' ? ticket.orderId : ticket.orderId._id) === orderId);

  return <RequireAuth><main className="orders-page site-container"><div className="section-heading"><div><p className="eyebrow">Your purchases</p><h1>My orders</h1></div><button className="refresh-button" onClick={load} disabled={loading}><RefreshCw size={17} className={loading ? 'is-spinning' : ''} /> Refresh</button></div>
    {error && <div className="catalog-notice"><div><span><strong>We could not refresh your orders.</strong> {error}</span></div><button onClick={load}>Try again</button></div>}
    {!loading && orders.length === 0 ? <div className="empty-state"><ClipboardList aria-hidden="true" /><h2>No orders yet</h2><p>Your completed checkouts will appear here.</p><Link href="/foods" className="button">Find something good</Link></div>
      : <div className="order-list">{orders.map((order) => { const status = orderStatus(order.status); const ticket = ticketFor(order._id); return <article className="order-row" key={order._id}><div className="order-row__top"><div><p className={`status-pill status-pill--${status.tone}`}>{status.label}</p><h2>Order {order.paymentReference}</h2><p>{formatDateTime(order.createdAt)} · {order.totalQuantity} food tickets</p></div><strong>{formatMoney(order.totalAmount)}</strong></div><div className="order-row__items">{order.items.slice(0,3).map((item, index) => <span key={`${item.foodName}-${index}`}>{item.foodName} × {item.quantity}</span>)}{order.items.length > 3 && <span>+{order.items.length - 3} more</span>}</div><div className="order-row__bottom"><span>{ticket ? `Ticket ${ticket.code}` : status.message}</span><Link href={`/orders/${order._id}`}>View details <ArrowRight size={16} /></Link></div></article>; })}</div>}
  </main></RequireAuth>;
}
