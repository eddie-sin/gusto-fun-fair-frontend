import Link from 'next/link';
import { EVENT_DETAILS, SITE_NAME } from '@/lib/content';

export function SiteFooter() {
  return <footer className="site-footer"><div className="site-container footer-grid">
    <div><p className="brand brand--footer">{SITE_NAME}</p><p>A day for good food, old friends and new memories.</p></div>
    <div><p className="footer-title">Fair day</p><p>{EVENT_DETAILS.date}</p><p>{EVENT_DETAILS.place}</p></div>
    <div><p className="footer-title">Explore</p><Link href="/foods">Food</Link><Link href="/stalls">Stalls</Link><Link href="/orders">My orders</Link></div>
  </div></footer>;
}
