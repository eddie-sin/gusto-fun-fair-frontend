'use client';
/* oxlint-disable react/react-compiler */

import { useCallback, useEffect, useRef, useState } from 'react';
import { apiRequest } from './api';

type Cached<T> = { savedAt: number; data: T };

export function useCachedResource<T>({ cacheKey, path, ttl, fallback, enabled = true, focusRefreshAfter }: { cacheKey: string; path: string; ttl: number; fallback?: T; enabled?: boolean; focusRefreshAfter?: number }) {
  const [data, setData] = useState<T>();
  const [isLoading, setLoading] = useState(enabled);
  const [isRefreshing, setRefreshing] = useState(false);
  const [isSample, setSample] = useState(false);
  const [error, setError] = useState('');
  const lastFetched = useRef(0);

  const refresh = useCallback(async (quiet = false) => {
    if (!enabled) return;
    if (quiet) setRefreshing(true); else setLoading(true);
    try {
      const result = await apiRequest<T>(path, { dedupe: true });
      setData(result); setSample(false); setError(''); lastFetched.current = Date.now();
      localStorage.setItem(cacheKey, JSON.stringify({ savedAt: lastFetched.current, data: result }));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to refresh this information.');
      setData((current) => {
        if (current !== undefined) return current;
        if (fallback !== undefined) { setSample(true); return fallback; }
        return current;
      });
    } finally { setLoading(false); setRefreshing(false); }
  }, [cacheKey, enabled, fallback, path]);

  useEffect(() => {
    if (!enabled) { setLoading(false); return; }
    let cached: Cached<T> | undefined;
    try { const raw = localStorage.getItem(cacheKey); cached = raw ? JSON.parse(raw) : undefined; } catch { localStorage.removeItem(cacheKey); }
    if (cached?.data) {
      setData(cached.data); setLoading(false); lastFetched.current = cached.savedAt;
      if (Date.now() - cached.savedAt >= ttl) void refresh(true);
    } else void refresh(false);
  }, [cacheKey, enabled, refresh, ttl]);

  useEffect(() => {
    if (!enabled || !focusRefreshAfter) return;
    const onFocus = () => { if (Date.now() - lastFetched.current >= focusRefreshAfter) void refresh(true); };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [enabled, focusRefreshAfter, refresh]);

  return { data, isLoading, isRefreshing, isSample, error, refresh: () => refresh(true) };
}
