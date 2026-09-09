'use client';

import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { maxOrderQuantity, quantityLimitMessage } from '@/lib/order-policy';
import { formatMoney } from '@/lib/api';
import type { Food } from '@/lib/types';
import { useApp } from './app-provider';

export function AddToCartDialog({ food, open, onOpenChange }: { food: Food; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { auth, addToCart, cart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const inCart = cart.find(line => line.stallFoodId === food.stallFoodId)?.quantity || 0;
  const remainingAllowance = Math.max(0, maxOrderQuantity(food.ticketsRemaining) - inCart);
  const selectedQuantity = Math.min(quantity, remainingAllowance);
  const add = () => { addToCart(food, selectedQuantity); onOpenChange(false); setQuantity(1); };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="quantity-dialog"><DialogHeader><DialogTitle>{food.food.name}</DialogTitle><DialogDescription>{food.stallName} · {food.ticketsRemaining} available</DialogDescription></DialogHeader>
    {auth ? <><div className="quantity-row"><span>Quantity</span><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} disabled={selectedQuantity <= 1} aria-label="Decrease quantity"><Minus size={18} /></button><output aria-live="polite">{selectedQuantity}</output><button onClick={() => setQuantity(Math.min(remainingAllowance, selectedQuantity + 1))} disabled={selectedQuantity >= remainingAllowance} aria-label="Increase quantity"><Plus size={18} /></button></div></div><p className="payment-guide__reminder" role="status">{quantityLimitMessage(food.ticketsRemaining)}{inCart > 0 && ` You already have ${inCart} in your cart.`}</p><div className="dialog-total"><span>Preorder total</span><strong>{formatMoney(food.preorderPrice * selectedQuantity)}</strong></div><button className="button button--full" onClick={add} disabled={remainingAllowance === 0}>{remainingAllowance === 0 ? 'Already at the limit' : 'Add to cart'}</button></>
      : <div className="dialog-login"><p>Log in before adding food to your cart. Your menu will still be here when you return.</p><Link href="/login" className="button button--full">Log in to continue</Link></div>}
  </DialogContent></Dialog>;
}
