import Link from 'next/link';
import { ArrowLeft, TicketX } from 'lucide-react';

export default function NotFound() {
  return <main className="not-found"><div className="not-found__ticket"><TicketX aria-hidden="true" /><span>404</span></div><p className="eyebrow">Wrong turn at the fair</p><h1>This booth is not here</h1><p>The page may have moved, or the ticket took you to the wrong gate.</p><Link href="/" className="button"><ArrowLeft size={17} /> Back to the fair</Link></main>;
}
