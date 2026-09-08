'use client';
/* oxlint-disable react/react-compiler */

import Link from 'next/link';
import { ArrowLeft, Check, Clock3, Copy, RefreshCw, TicketCheck, Upload } from 'lucide-react';
import { useParams } from 'next/navigation';
import { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import { useApp } from '@/components/app-provider';
import { PaymentGuide } from '@/components/payment-guide';
import { OrderFoodSummary } from '@/components/order-food-summary';
import { RequireAuth } from '@/components/require-auth';
import { ApiError, apiRequest, formatDateTime } from '@/lib/api';
import { orderStatus } from '@/lib/order-display';
import type { CheckoutPayment, Order, Ticket } from '@/lib/types';

type PaymentRecord = { _id: string; status: string; reuploadReason?: string; rejectionReason?: string; proofVersion?: number };

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { auth } = useApp();
  const [order, setOrder] = useState<Order>();
  const [payment, setPayment] = useState<PaymentRecord>();
  const [checkout, setCheckout] = useState<CheckoutPayment>();
  const [ticket, setTicket] = useState<Ticket>();
  const [file, setFile] = useState<File>();
  const [fileError, setFileError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [working, setWorking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [privilegeCopied, setPrivilegeCopied] = useState(false);
  const uploading = useRef(false);
  const [uploadFeedback, setUploadFeedback] = useState<{ message: string; retryAt?: number }>();
  const [clock, setClock] = useState(0);
  const retrySeconds = uploadFeedback?.retryAt ? Math.max(0, Math.ceil((uploadFeedback.retryAt - clock) / 1000)) : 0;

  useEffect(() => { setFile(undefined); setFileError(''); setUploadFeedback(undefined); }, [id]);
  useEffect(() => {
    const deadline = uploadFeedback?.retryAt;
    if (!deadline) return;
    setClock(Date.now());
    const timer = setInterval(() => {
      setClock(Date.now());
      if (Date.now() >= deadline) clearInterval(timer);
    }, 1000);
    return () => clearInterval(timer);
  }, [uploadFeedback?.retryAt]);

  const load = useCallback(async () => {
    if (!auth || !id) return;
    setLoading(true); setError('');
    try {
      const orderResult = await apiRequest<{ order: Order }>(`/orders/${id}`, { token: auth.token, dedupe: true });
      setOrder(orderResult.order);
      // A cached checkout must belong to this order; missing/bad storage must not hide the order.
      setCheckout(undefined);
      try {
        const local = localStorage.getItem(`gff.checkout.${id}`);
        const saved: CheckoutPayment | undefined = local ? JSON.parse(local) : undefined;
        if (saved?.reference === orderResult.order.paymentReference) setCheckout(saved);
      } catch { /* The guide explains how to obtain missing recipient details. */ }
      if (['PAYMENT_DECLARED','PAYMENT_SUBMITTED','PAYMENT_REUPLOAD_REQUESTED','PAYMENT_APPROVED','PAYMENT_REJECTED'].includes(orderResult.order.status)) {
        try { const result = await apiRequest<{ payment: PaymentRecord }>(`/payments/orders/${id}`, { token: auth.token, dedupe: true }); setPayment(result.payment); } catch { /* Payment may not exist until first proof. */ }
      }
      if (orderResult.order.status === 'PAYMENT_APPROVED') {
        const result = await apiRequest<{ tickets: Ticket[] }>('/tickets/mine', { token: auth.token, dedupe: true });
        setTicket(result.tickets.find((item) => (typeof item.orderId === 'string' ? item.orderId : item.orderId._id) === id));
      }
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'This order could not be loaded.'); }
    finally { setLoading(false); }
  }, [auth, id]);
  useEffect(() => { void load(); }, [load]);

  const declarePayment = async () => {
    if (!auth || !order) return;
    setWorking(true); setError('');
    try { await apiRequest<{ order: Order }>(`/orders/${order._id}/payment-declare`, { method: 'POST', token: auth.token }); await load(); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Payment could not be reported.'); }
    finally { setWorking(false); }
  };

  const chooseFile = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.files?.[0];
    setFile(undefined); setFileError('');
    if (!next) return;
    if (!['image/jpeg','image/png','image/webp'].includes(next.type)) return setFileError('Choose a JPEG, PNG or WebP image.');
    if (next.size > 7 * 1024 * 1024) return setFileError('The image must be 7 MB or smaller.');
    setFile(next);
  };

  const uploadProof = async () => {
    if (!auth || !order || !file || uploading.current || (uploadFeedback?.retryAt && uploadFeedback.retryAt > Date.now())) return;
    uploading.current = true;
    setWorking(true); setError(''); setUploadFeedback(undefined);
    const body = new FormData(); body.append('image', file);
    try { await apiRequest(`/payments/orders/${order._id}`, { method: 'POST', token: auth.token, body }); setFile(undefined); await load(); }
    catch (caught) {
      const apiError = caught instanceof ApiError ? caught : undefined;
      const seconds = apiError?.retryAfterSeconds ?? (apiError?.status === 429 ? 30 : apiError?.status === 503 ? 5 : undefined);
      const message = apiError?.status === 0
        ? 'The upload connection was interrupted. Refresh the order status to check whether your receipt arrived before trying again.'
        : caught instanceof Error ? caught.message : 'The screenshot could not be uploaded. Please try again.';
      setClock(Date.now());
      setUploadFeedback({ message, retryAt: seconds ? Date.now() + seconds * 1000 : undefined });
    }
    finally { uploading.current = false; setWorking(false); }
  };

  if (loading && !order) return <RequireAuth><div className="page-loading"><span>Opening your order…</span></div></RequireAuth>;
  if (!order) return <RequireAuth><main className="centered-page"><p className="eyebrow">Order unavailable</p><h1>We could not open this order</h1><p>{error}</p><Link href="/orders" className="button">Back to my orders</Link></main></RequireAuth>;
  const status = orderStatus(order.status);

  return <RequireAuth><main className="order-detail site-container"><Link href="/orders" className="back-link"><ArrowLeft size={16} /> My orders</Link><div className="order-detail__heading"><div><p className={`status-pill status-pill--${status.tone}`}>{status.label}</p><h1>Order details</h1><p className="order-detail__reference">{order.paymentReference} <span>· {formatDateTime(order.createdAt)}</span></p><p>{status.message}</p></div><button className="refresh-button" onClick={load} disabled={loading || working}><RefreshCw size={17} className={loading ? 'is-spinning' : ''} /> Refresh status</button></div>
    {error && <p className="form-error" role="alert">{error}</p>}
    <div className="order-detail__grid"><OrderFoodSummary key={order._id} order={order} />
      <aside className={`payment-panel ${['AWAITING_PAYMENT', 'PAYMENT_DECLARED', 'PAYMENT_REUPLOAD_REQUESTED'].includes(order.status) ? 'payment-panel--action' : ''}`} aria-label="Payment and collection">{order.status === 'AWAITING_PAYMENT' && <PaymentGuide key={order._id} order={order} checkout={checkout} working={working} onPaid={declarePayment} />}
        {['PAYMENT_DECLARED','PAYMENT_REUPLOAD_REQUESTED'].includes(order.status) && <><p className="eyebrow">Next: send your receipt</p><h2>Upload payment proof</h2><p className="payment-upload-help">Choose the saved receipt or screenshot from your KBZ transfer. Then select <strong>Send receipt for review</strong> below.</p><p className="payment-upload-help">The image should clearly show the amount, recipient and transaction number.</p>{order.status === 'PAYMENT_REUPLOAD_REQUESTED' && <p className="inline-warning">{payment?.reuploadReason || 'The organisers asked for a clearer screenshot.'}</p>}<label className="upload-field"><Upload aria-hidden="true" /><strong>{file ? file.name : 'Choose receipt image'}</strong><span>JPEG, PNG or WebP · up to 7 MB</span><input type="file" accept="image/jpeg,image/png,image/webp" disabled={working} onChange={chooseFile} /></label>{fileError && <p className="form-error">{fileError}</p>}{uploadFeedback && <output className={`payment-upload-feedback ${uploadFeedback.retryAt ? 'inline-warning' : 'form-error'}`}>{uploadFeedback.message}{file && ' Your receipt is still selected.'}</output>}<button className="button button--full" onClick={uploadProof} disabled={!file || working || retrySeconds > 0}>{working ? 'Uploading…' : retrySeconds > 0 ? `Try again in ${retrySeconds}s` : uploadFeedback ? 'Try uploading again' : 'Send receipt for review'}</button><p className="payment-upload-next">After the upload succeeds, your status changes to <strong>Payment under review</strong>.</p>{order.paymentProofExpiresAt && order.status === 'PAYMENT_DECLARED' && <p className="deadline"><Clock3 size={17} /> Upload by {formatDateTime(order.paymentProofExpiresAt)}</p>}</>}
        {order.status === 'PAYMENT_SUBMITTED' && <div className="waiting-panel"><div className="receipt-received"><Check size={18} aria-hidden="true" /> Receipt received</div><p className="eyebrow">With the organisers</p><h2>Payment under review</h2><p>Your receipt was sent successfully. The organisers are checking your transfer.</p><p>Your collection code will appear here once payment is approved. You can use <strong>Refresh status</strong> to check for an update.</p></div>}
        {order.status === 'PAYMENT_APPROVED' && <div className="ticket-panel"><TicketCheck aria-hidden="true" /><p className="eyebrow">Your collection code</p><h2>{ticket?.code || 'Ticket is being prepared'}</h2><p>One code covers every food item in this order. It can only be redeemed once.</p>{ticket?.code && <button className="button button--quiet button--full" onClick={async () => { await navigator.clipboard.writeText(ticket.code); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>{copied ? <Check size={17} /> : <Copy size={17} />}{copied ? 'Copied' : 'Copy code'}</button>}
          {order.preorderPrivilegeCode && <div className="privilege-code"><p className="eyebrow">Your privilege code</p><strong>{order.preorderPrivilegeCode}</strong><p>Use this once on the <Link href="/quiz">Quiz</Link> page or once for an extra <Link href="/memories">Memory</Link> upload.</p><button className="button button--quiet button--full" onClick={async () => { await navigator.clipboard.writeText(order.preorderPrivilegeCode!); setPrivilegeCopied(true); setTimeout(() => setPrivilegeCopied(false), 1800); }}>{privilegeCopied ? <Check size={17} /> : <Copy size={17} />}{privilegeCopied ? 'Copied' : 'Copy code'}</button></div>}</div>}
        {['PAYMENT_REJECTED','PAYMENT_EVIDENCE_EXPIRED','CANCELLED','EXPIRED'].includes(order.status) && <div className="waiting-panel"><p className="eyebrow">Order closed</p><h2>{status.label}</h2><p>{payment?.rejectionReason || status.message}</p><Link href="/foods" className="button button--quiet">Return to the menu</Link></div>}
      </aside></div>
  </main></RequireAuth>;
}
