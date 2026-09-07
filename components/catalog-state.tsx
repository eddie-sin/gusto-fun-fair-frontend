'use client';

import { RefreshCw, WifiOff } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function CatalogNotice({ sample, refreshing, error, onRefresh }: { sample: boolean; refreshing: boolean; error: string; onRefresh: () => void }) {
  if (!sample && !error && !refreshing) return null;
  return <output className="catalog-notice"><span>{sample || error ? <WifiOff aria-hidden="true" /> : <RefreshCw aria-hidden="true" className={refreshing ? 'is-spinning' : ''} />}<span><strong>{sample ? 'Showing a sample menu' : refreshing ? 'Refreshing availability' : 'Using saved information'}</strong>{sample ? ' Live prices and stock will appear when the server reconnects.' : error ? ` ${error}` : ' You can keep browsing.'}</span></span><button onClick={onRefresh} disabled={refreshing}>Try again</button></output>;
}

export function FoodGridSkeleton() {
  return <div className="food-grid" aria-label="Loading food"><span className="sr-only">Loading food</span>{[1,2,3,4,5,6].map((item) => <div className="food-skeleton" key={item}><Skeleton className="food-skeleton__image" /><Skeleton className="food-skeleton__line" /><Skeleton className="food-skeleton__line food-skeleton__line--short" /></div>)}</div>;
}
