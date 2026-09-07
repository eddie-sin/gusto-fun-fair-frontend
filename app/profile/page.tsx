'use client';

import Link from 'next/link';
import { LogOut, ShoppingBag, Ticket, UserRound } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/app-provider';
import { RequireAuth } from '@/components/require-auth';

export default function ProfilePage() {
  const { auth, cartCount, logout } = useApp();
  const router = useRouter();
  return <RequireAuth><main className="account-page site-container"><div className="account-heading"><div className="account-avatar"><UserRound aria-hidden="true" /></div><div><p className="eyebrow">Your fair-day account</p><h1>{auth?.user.name}</h1><p>Keep your orders, payment updates and collection codes in one place.</p></div></div>
    <div className="account-actions"><Link href="/orders"><Ticket aria-hidden="true" /><span><strong>My orders</strong>Check payment status and ticket codes.</span></Link><Link href="/cart"><ShoppingBag aria-hidden="true" /><span><strong>My cart</strong>{cartCount ? `${cartCount} ${cartCount === 1 ? 'item' : 'items'} ready to checkout.` : 'Your cart is currently empty.'}</span></Link></div>
    <button className="logout-button" onClick={() => { logout(); router.push('/'); }}><LogOut aria-hidden="true" size={18} /> Log out</button>
  </main></RequireAuth>;
}
