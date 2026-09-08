'use client';

import { usePathname } from 'next/navigation';
import { AppProvider } from './app-provider';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { PreorderStrip } from './preorder-strip';
import { PreorderGuide } from './preorder-guide';

const GUIDE_ROUTES = ['/', '/foods', '/stalls', '/orders', '/cart'];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const bare = pathname === '/login' || pathname === '/register';
  const showGuide = GUIDE_ROUTES.includes(pathname || '');
  return <AppProvider><PreorderStrip />{!bare && <SiteHeader />}{children}{!bare && <SiteFooter />}{showGuide && <PreorderGuide />}</AppProvider>;
}
