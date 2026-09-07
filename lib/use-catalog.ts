'use client';

import { useMemo } from 'react';
import { CACHE_KEYS, CACHE_TIMES } from './content';
import { demoFoods, demoStalls } from './demo-data';
import type { Food, Stall } from './types';
import { useCachedResource } from './use-cached-resource';

const foodFallback = { foods: demoFoods };
const stallFallback = { stalls: demoStalls };

export function useFoods() {
  const foods = useCachedResource<{ foods: Food[] }>({ cacheKey: CACHE_KEYS.foods, path: '/foods', ttl: CACHE_TIMES.catalog, focusRefreshAfter: CACHE_TIMES.stockFocusRefresh, fallback: foodFallback });
  const stalls = useCachedResource<{ stalls: Stall[] }>({ cacheKey: CACHE_KEYS.stalls, path: '/stalls', ttl: CACHE_TIMES.catalog, fallback: stallFallback });
  const joined = useMemo(() => (foods.data?.foods || []).map((food) => ({ ...food, stallBatch: stalls.data?.stalls.find((stall) => stall._id === food.stallId)?.batch || food.stallBatch })), [foods.data, stalls.data]);
  return { ...foods, foods: joined, isSample: foods.isSample || stalls.isSample };
}

export function useStalls() {
  const stalls = useCachedResource<{ stalls: Stall[] }>({ cacheKey: CACHE_KEYS.stalls, path: '/stalls', ttl: CACHE_TIMES.catalog, fallback: stallFallback });
  return { ...stalls, stalls: stalls.data?.stalls || [] };
}
