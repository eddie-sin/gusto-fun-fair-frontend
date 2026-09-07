'use client';
/* oxlint-disable next/no-img-element */

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';
import { CatalogNotice, FoodGridSkeleton } from '@/components/catalog-state';
import { FoodCard } from '@/components/food-card';
import { demoFoods, demoStalls } from '@/lib/demo-data';
import { mediaUrl } from '@/lib/api';
import { useCachedResource } from '@/lib/use-cached-resource';

export default function StallMenuPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug || '';
  const demoStall = demoStalls.find((item) => item.slug === slug || item._id === slug) || demoStalls[0];
  const fallback = useMemo(() => ({ stall: demoStall, foods: demoFoods.filter((food) => food.stallId === demoStall._id) }), [demoStall]);
  const resource = useCachedResource<typeof fallback>({ cacheKey: `gff.cache.stall.${slug}.v1`, path: `/stalls/by-slug/${encodeURIComponent(slug)}`, ttl: 2 * 60_000, focusRefreshAfter: 45_000, fallback });
  const stall = resource.data?.stall;
  const foods = resource.data?.foods || [];
  return <main>{stall && <section className="stall-detail-hero"><div className="site-container stall-detail-hero__grid"><div><Link href="/stalls" className="back-link"><ArrowLeft size={16} /> All stalls</Link><p className="eyebrow">{stall.batch}</p><h1>{stall.stallName}</h1><p>{stall.description || 'This stall’s full fair-day menu.'}</p></div><img src={mediaUrl(stall.image?.url) || '/images/chicken-burger.webp'} alt={`${stall.stallName} menu`} /></div></section>}
    <section className="catalog-section site-container"><CatalogNotice sample={resource.isSample} refreshing={resource.isRefreshing} error={resource.error} onRefresh={resource.refresh} /><div className="section-heading"><div><p className="eyebrow">This stall’s menu</p><h2>Ready to preorder</h2></div><p>{foods.length} {foods.length === 1 ? 'item' : 'items'} available</p></div>{resource.isLoading && foods.length === 0 ? <FoodGridSkeleton /> : <div className="food-grid">{foods.map((food) => <FoodCard key={food.stallFoodId} food={{ ...food, stallBatch: stall?.batch }} />)}</div>}</section>
  </main>;
}
