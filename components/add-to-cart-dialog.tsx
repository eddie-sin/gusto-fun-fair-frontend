'use client';

import Link from 'next/link';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { formatMoney } from '@/lib/api';
import type { Food } from '@/lib/types';
import { useApp } from './app-provider';

export function AddToCartDialog({ food, open, onOpenChange }: { food: Food; open: boolean; onOpenChange: (open: boolean) => void }) {
  const { auth, addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const add = () => { addToCart(food, quantity); onOpenChange(false); setQuantity(1); };
  return <Dialog open={open} onOpenChange={onOpenChange}><DialogContent className="quantity-dialog"><DialogHeader><DialogTitle>{food.food.name}</DialogTitle><DialogDescription>{food.stallName} · {food.ticketsRemaining} available</DialogDescription></DialogHeader>
    {auth ? <><div className="quantity-row"><span>Quantity</span><div className="quantity-control"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} aria-label="Decrease quantity"><Minus size={18} /></button><output aria-live="polite">{quantity}</output><button onClick={() => setQuantity(Math.min(food.ticketsRemaining, quantity + 1))} aria-label="Increase quantity"><Plus size={18} /></button></div></div><div className="dialog-total"><span>Preorder total</span><strong>{formatMoney(food.preorderPrice * quantity)}</strong></div><button className="button button--full" onClick={add}>Add to cart</button></>
      : <div className="dialog-login"><p>Log in before adding food to your cart. Your menu will still be here when you return.</p><Link href="/login" className="button button--full">Log in to continue</Link></div>}
  </DialogContent></Dialog>;
}
