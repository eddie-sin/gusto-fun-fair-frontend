"use client";

import { Info } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export function CollectionGuide() {
  return <Dialog>
    <DialogTrigger className="payment-help-trigger"><Info size={17} aria-hidden="true" /> How to collect your food</DialogTrigger>
    <DialogContent className="payment-help-dialog">
      <DialogHeader><DialogTitle className="payment-help-dialog__title">Your food is waiting!</DialogTitle><DialogDescription className="payment-help-dialog__description">On event day, collect your physical tokens first.</DialogDescription></DialogHeader>
      <ol className="payment-steps">
        <li><div className="payment-step__body"><h3>Visit the Coding Club counter</h3><p>Show this approved order and its collection code to the team.</p></div></li>
        <li><div className="payment-step__body"><h3>Collect your physical tokens</h3><p>The team will check your order and give you tokens for the food and quantities you purchased.</p></div></li>
        <li><div className="payment-step__body"><h3>Enjoy your food</h3><p>Take each token to its corresponding stall and exchange it for your food.</p></div></li>
      </ol>
      <DialogClose className="button button--quiet payment-help-dialog__close">Got it — see you at the fair!</DialogClose>
    </DialogContent>
  </Dialog>;
}
