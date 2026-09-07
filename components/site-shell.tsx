'use client';

import { usePathname } from 'next/navigation';
import { AppProvider } from './app-provider';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { PreorderStrip } from './preorder-strip';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname === '/login' || pathname === '/register';
  return <AppProvider><PreorderStrip />{!bare && <SiteHeader />}{children}{!bare && <SiteFooter />}</AppProvider>;
}
