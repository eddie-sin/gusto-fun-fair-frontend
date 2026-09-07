'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ShoppingBag, Ticket, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { SITE_NAME } from '@/lib/content';
import { useApp } from './app-provider';

const links = [['/', 'Home'], ['/foods', 'Food'], ['/stalls', 'Stalls'], ['/memories', 'Memories'], ['/crush-letters', 'Crush Letters']] as const;

export function SiteHeader() {
  const pathname = usePathname();
  const { auth, cartCount } = useApp();
  const [open, setOpen] = useState(false);
  return <header className="site-header">
      <div className="site-container site-header__inner">
        <Link href="/" className="brand" aria-label={`${SITE_NAME} home`}><Ticket aria-hidden="true" size={24} strokeWidth={1.8} /><span>{SITE_NAME}</span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">{links.map(([href, label]) => <Link key={href} href={href} className={pathname === href ? 'is-active' : ''}>{label}</Link>)}</nav>
        <div className="header-actions">
          {auth ? <>
            <Link href="/cart" className="icon-link" aria-label={`Cart with ${cartCount} items`}><ShoppingBag aria-hidden="true" size={20} />{cartCount > 0 && <span className="cart-count">{cartCount}</span>}</Link>
            <Link href="/profile" className="profile-link" aria-label="Your account"><UserRound aria-hidden="true" size={19} /><span>{auth.user.name}</span></Link>
          </> : <><Link href="/login" className="text-link desktop-only">Log in</Link><Link href="/register" className="button button--small desktop-only">Create account</Link></>}
          <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle navigation">{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
        </div>
      </div>
      {open && <nav className="mobile-nav" aria-label="Mobile navigation">
        {links.map(([href, label]) => <Link key={href} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
        {auth ? <><Link href="/orders" onClick={() => setOpen(false)}>My orders</Link><Link href="/profile" onClick={() => setOpen(false)}>My account</Link></> : <><Link href="/login" onClick={() => setOpen(false)}>Log in</Link><Link href="/register" onClick={() => setOpen(false)}>Create account</Link></>}
      </nav>}
    </header>;
}
