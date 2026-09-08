'use client';
/* oxlint-disable next/no-img-element */

import Link from 'next/link';
import { stallTitleClass } from '@/lib/typography';
import { ArrowRight } from 'lucide-react';
import { CatalogNotice } from '@/components/catalog-state';
import { PageHero } from '@/components/page-hero';
import { mediaUrl } from '@/lib/api';
import { useStalls } from '@/lib/use-catalog';

export default function StallsPage() {
  const resource = useStalls();
  return <main><PageHero eyebrow="Meet the makers" title="Every stall has a story" description="Browse the teams behind the menu, then open a stall to see everything they are serving." />
    <section className="catalog-section site-container"><CatalogNotice sample={resource.isSample} refreshing={resource.isRefreshing} error={resource.error} onRefresh={resource.refresh} />
      <div className="stall-grid">{resource.stalls.map((stall, index) => <article className="stall-card" key={stall._id}>
        <div className="stall-card__image"><img src={mediaUrl(stall.image?.url) || ['/images/chicken-burger.webp','/images/shan-noodles.webp','/images/brownie-tea.webp'][index % 3]} alt={`${stall.stallName} stall`} loading="lazy" /><span>{String(index + 1).padStart(2, '0')}</span></div>
        <div className="stall-card__body"><p>{stall.batch}</p><h2 className={stallTitleClass(stall.stallName)}>{stall.stallName}</h2><p>{stall.description || 'Menu details will be available soon.'}</p><Link href={`/stalls/${stall.slug || stall._id}`} className="button button--quiet">View menu <ArrowRight aria-hidden="true" size={17} /></Link></div>
      </article>)}</div>
    </section>
  </main>;
}
