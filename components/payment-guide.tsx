"use client";

import { useEffect, useState } from 'react';
import { ArrowRight, Check, Clock3, Copy, Info } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { formatDateTime, formatMoney } from '@/lib/api';
import type { CheckoutPayment, Order } from '@/lib/types';

function CopyDetail({ value, label }: { value: string; label: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  useEffect(() => {
    if (state === 'idle') return;
    const timer = window.setTimeout(() => setState('idle'), 3500);
    return () => window.clearTimeout(timer);
  }, [state]);
  const copy = async () => {
    try { await navigator.clipboard.writeText(value); setState('copied'); }
    catch { setState('failed'); }
  };
  return <div className="payment-copy-detail">
    <div><strong>{value}</strong><button type="button" onClick={copy} aria-label={`Copy ${label}`}>
      {state === 'copied' ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      <span>{state === 'copied' ? 'Copied' : 'Copy'}</span>
    </button></div>
    <span className={state === 'failed' ? 'payment-copy-feedback' : 'sr-only'} role="status">{state === 'copied' ? `${label} copied` : state === 'failed' ? 'Select the text above and copy it manually.' : ''}</span>
  </div>;
}

export function PaymentGuide({ order, checkout, working, onPaid }: { order: Order; checkout?: CheckoutPayment; working: boolean; onPaid: () => Promise<void> }) {
  const accountNumber = checkout?.kbzAccountNumber?.trim();
  return <Dialog>
    <div className="payment-guide">
      <p className="eyebrow">Complete your transfer</p>
      <h2>{formatMoney(order.totalAmount)}</h2>
      <DialogTrigger className="payment-help-trigger"><Info size={17} aria-hidden="true" /> How to pay</DialogTrigger>
      {accountNumber ? <div className="payment-recipient"><span>KBZ phone / account number</span><CopyDetail value={accountNumber} label="KBZ phone or account number" /><span>Account name</span><strong>{checkout?.kbzAccountName || 'Confirm the recipient name with the organisers.'}</strong></div>
        : <p className="inline-warning">Recipient details are missing. Contact the organisers for the correct KBZ number before paying.</p>}
      <div className="payment-reference"><span>Payment note / reference</span><CopyDetail value={order.paymentReference} label="order reference" /></div>
      <p className="payment-guide__reminder">Include this reference in your payment note.</p>
      <p className="deadline"><Clock3 size={17} aria-hidden="true" /> Pay and confirm by {formatDateTime(order.reservationExpiresAt)}</p>
      <button type="button" className="button button--full payment-guide__continue" onClick={onPaid} disabled={working}>{working ? 'Opening upload…' : <>I’ve paid — upload receipt <ArrowRight size={17} aria-hidden="true" /></>}</button>
      <p className="payment-guide__footnote">After a successful transfer, upload your receipt for review.</p>
    </div>
    <DialogContent className="payment-help-dialog">
      <DialogHeader>
        <DialogTitle className="payment-help-dialog__title">How to pay</DialogTitle>
        <DialogDescription className="payment-help-dialog__description">Pay in your KBZ app, then send your receipt here. Follow these four steps.</DialogDescription>
      </DialogHeader>
      <ol className="payment-steps">
        <li><div className="payment-step__body"><h3>Enter the recipient and amount</h3><p>In your KBZ app, enter <strong>{formatMoney(order.totalAmount)}</strong>{accountNumber ? <> and send to <strong className="payment-help-value">{accountNumber}</strong></> : '. Ask the organisers for the correct KBZ number before paying'}. Check the recipient name{checkout?.kbzAccountName ? <> is <strong>{checkout.kbzAccountName}</strong></> : ' before continuing'}.</p></div></li>
        <li><div className="payment-step__body"><h3>Add your order reference</h3><p>Put <strong className="payment-help-value">{order.paymentReference}</strong> in the <strong>payment note / remark</strong> field, then confirm the transfer.</p></div></li>
        <li><div className="payment-step__body"><h3>Save the successful receipt</h3><p>Save or screenshot the confirmation showing the amount, recipient and transaction number.</p></div></li>
        <li><div className="payment-step__body"><h3>Return here and upload it</h3><p>Close this guide and select <strong>I’ve paid — upload receipt</strong>. Choose your saved image, then select <strong>Send receipt for review</strong>. Your order changes to Payment under review once the upload succeeds.</p></div></li>
      </ol>
      {checkout?.paymentInstructions && <div className="payment-organiser-note"><strong>From the organisers</strong><p>{checkout.paymentInstructions}</p></div>}
      <p className="payment-help-dialog__note">Only confirm after your transfer succeeds. You cannot cancel the order after confirming payment.</p>
      <DialogClose className="button button--quiet payment-help-dialog__close">Got it — back to payment</DialogClose>
    </DialogContent>
  </Dialog>;
}
