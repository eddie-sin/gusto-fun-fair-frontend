'use client';

import { FoodFilters } from '@/components/food-filters';
import { useMemo, useState } from 'react';
import { CatalogNotice, FoodGridSkeleton } from '@/components/catalog-state';
import { FoodCard } from '@/components/food-card';
import { PageHero } from '@/components/page-hero';
import { useApp } from '@/components/app-provider';
import { useFoods } from '@/lib/use-catalog';
import { useWebMcpCart } from '@/lib/use-webmcp-cart';

export default function FoodsPage() {
  const resource = useFoods();
  const { addToCart } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [stall, setStall] = useState('all');
  const [sort, setSort] = useState('featured');
  useWebMcpCart(resource.foods, addToCart);

  const categories = useMemo(() => [...new Set(resource.foods.map((item) => item.food.category).filter((item): item is string => Boolean(item)))].sort((a, b) => a.localeCompare(b)), [resource.foods]);
  const stalls = useMemo(() => [...new Set(resource.foods.map((item) => item.stallName))].sort((a, b) => a.localeCompare(b)), [resource.foods]);
  const filtered = useMemo(() => {
    const result = resource.foods.filter((item) => {
      const matchesSearch = item.food.name.toLowerCase().includes(search.trim().toLowerCase());
      return matchesSearch && (category === 'all' || item.food.category === category) && (stall === 'all' || item.stallName === stall);
    });
    return result.sort((a, b) => sort === 'price-low' ? a.preorderPrice - b.preorderPrice : sort === 'price-high' ? b.preorderPrice - a.preorderPrice : sort === 'name' ? a.food.name.localeCompare(b.food.name) : 0);
  }, [category, resource.foods, search, sort, stall]);

  return <main><PageHero eyebrow="The full menu" title="Pick your fair-day favourites" description="Prices shown are preorder prices. Availability is refreshed when you return to this tab and checked again at checkout." />
    <section className="catalog-section site-container">
      <CatalogNotice sample={resource.isSample} refreshing={resource.isRefreshing} error={resource.error} onRefresh={resource.refresh} />
      <FoodFilters search={search} onSearch={setSearch} category={category} onCategory={setCategory} stall={stall} onStall={setStall} sort={sort} onSort={setSort} categories={categories} stalls={stalls} count={filtered.length} />
      <div className="results-row"><p><strong>{filtered.length}</strong> menu {filtered.length === 1 ? 'item' : 'items'}</p>{resource.isRefreshing && <span>Checking live stock…</span>}</div>
      {resource.isLoading && resource.foods.length === 0 ? <FoodGridSkeleton /> : filtered.length > 0 ? <div className="food-grid">{filtered.map((food) => <FoodCard key={food.stallFoodId} food={food} />)}</div> : <div className="empty-state"><h2>No food matches that search</h2><p>Try a different name, stall or category.</p><button className="button button--quiet" onClick={() => { setSearch(''); setCategory('all'); setStall('all'); }}>Clear filters</button></div>}
    </section>
  </main>;
}
