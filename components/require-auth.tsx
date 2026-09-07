'use client';

import Link from 'next/link';
import { LockKeyhole } from 'lucide-react';
import { useApp } from './app-provider';

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { auth, authReady } = useApp();
  if (!authReady) return <div className="page-loading"><span>Loading your account…</span></div>;
  if (!auth) return <main className="centered-page"><LockKeyhole aria-hidden="true" /><p className="eyebrow">Account needed</p><h1>Log in to see this page</h1><p>Your cart, orders and tickets are kept with your account.</p><div><Link href="/login" className="button">Log in</Link><Link href="/register" className="button button--quiet">Create account</Link></div></main>;
  return children;
}
