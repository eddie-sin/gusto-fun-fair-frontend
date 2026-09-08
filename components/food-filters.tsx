'use client';

import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { NativeSelect, NativeSelectOption } from '@/components/ui/native-select';

const SORT_LABELS: Record<string, string> = {
  featured: 'Featured order',
  'price-low': 'Price: low to high',
  'price-high': 'Price: high to low',
  name: 'Name: A to Z',
};

type FoodFiltersProps = {
  search: string; onSearch: (value: string) => void;
  category: string; onCategory: (value: string) => void;
  stall: string; onStall: (value: string) => void;
  sort: string; onSort: (value: string) => void;
  categories: string[]; stalls: string[]; count: number;
};

export function FoodFilters({ search, onSearch, category, onCategory, stall, onStall, sort, onSort, categories, stalls, count }: FoodFiltersProps) {
  const activeCount = Number(category !== 'all') + Number(stall !== 'all') + Number(sort !== 'featured');
  const reset = () => { onCategory('all'); onStall('all'); onSort('featured'); };
  return <div className="food-tools">
    <Dialog>
      <div className="food-tools__row">
        <div className="food-search">
          <Search size={19} aria-hidden="true" />
          <label className="sr-only" htmlFor="food-search">Search food</label>
          <input id="food-search" type="search" value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Find a food…" />
          {search && <button type="button" aria-label="Clear search" onClick={() => onSearch('')}><X size={17} aria-hidden="true" /></button>}
        </div>
        <DialogTrigger className="food-filter-trigger" aria-label={`Filters and sort${activeCount ? `, ${activeCount} active` : ''}`}>
          <SlidersHorizontal size={18} aria-hidden="true" /> Filters {activeCount > 0 && <span aria-hidden="true">{activeCount}</span>}
        </DialogTrigger>
      </div>
      <DialogContent className="food-filter-dialog">
        <DialogHeader><DialogTitle>Find your favourites</DialogTitle><DialogDescription>Narrow down the menu or change the order.</DialogDescription></DialogHeader>
        <div className="food-filter-fields">
          <label>Category<NativeSelect aria-label="Filter by category" value={category} onChange={(event) => onCategory(event.target.value)}><NativeSelectOption value="all">All categories</NativeSelectOption>{categories.map((item) => <NativeSelectOption value={item} key={item}>{item}</NativeSelectOption>)}</NativeSelect></label>
          <label>Stall<NativeSelect aria-label="Filter by stall" value={stall} onChange={(event) => onStall(event.target.value)}><NativeSelectOption value="all">All stalls</NativeSelectOption>{stalls.map((item) => <NativeSelectOption value={item} key={item}>{item}</NativeSelectOption>)}</NativeSelect></label>
          <label>Sort by<NativeSelect aria-label="Sort food" value={sort} onChange={(event) => onSort(event.target.value)}>{Object.entries(SORT_LABELS).map(([value, label]) => <NativeSelectOption value={value} key={value}>{label}</NativeSelectOption>)}</NativeSelect></label>
        </div>
        <div className="food-filter-actions"><button type="button" className="food-filter-reset" disabled={!activeCount} onClick={reset}>Reset</button><DialogClose className="button button--primary">Show {count} {count === 1 ? 'item' : 'items'}</DialogClose></div>
      </DialogContent>
    </Dialog>
    {activeCount > 0 && <div className="food-filter-chips" aria-label="Active filters">
      {category !== 'all' && <button type="button" onClick={() => onCategory('all')} aria-label={`Remove category filter: ${category}`}><span>{category}</span><X size={14} aria-hidden="true" /></button>}
      {stall !== 'all' && <button type="button" onClick={() => onStall('all')} aria-label={`Remove stall filter: ${stall}`}><span>{stall}</span><X size={14} aria-hidden="true" /></button>}
      {sort !== 'featured' && <button type="button" onClick={() => onSort('featured')} aria-label="Reset sort to featured order"><span>{SORT_LABELS[sort]}</span><X size={14} aria-hidden="true" /></button>}
    </div>}
  </div>;
}
