import type { Metadata } from 'next';
import './globals.css';
import { SiteShell } from '@/components/site-shell';

export const metadata: Metadata = {
  title: { default: 'GUSTO Fun Fair', template: '%s · GUSTO Fun Fair' },
  description: 'Preorder fair-day food, keep your tickets together, and take part in GUSTO Fun Fair memories.',
  icons: { icon: '/favicon.svg' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body><SiteShell>{children}</SiteShell></body>
    </html>
  );
}
