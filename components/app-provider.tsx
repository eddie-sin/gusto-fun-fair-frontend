'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { maxOrderQuantity } from '@/lib/order-policy';
import { apiRequest } from '@/lib/api';
import { CACHE_KEYS, CACHE_TIMES } from '@/lib/content';
import type { CartLine, EventData, Food, User } from '@/lib/types';
import { useCachedResource } from '@/lib/use-cached-resource';

type AuthState = { user: User; token: string } | null;
type AppContextValue = {
  event?: EventData; eventLoading: boolean; eventError: string; refreshEvent: () => void;
  auth: AuthState; authReady: boolean;
  login: (name: string, password: string) => Promise<void>;
  register: (name: string, password: string) => Promise<void>;
  logout: () => void;
  cart: CartLine[]; cartCount: number; cartTotal: number;
  addToCart: (food: Food, quantity: number) => void;
  updateCart: (stallFoodId: string, quantity: number, ticketsRemaining?: number) => void;
  removeFromCart: (stallFoodId: string) => void;
  clearCart: () => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children, loadEvent = true }: { children: React.ReactNode; loadEvent?: boolean }) {
  const eventResource = useCachedResource<{ event: EventData }>({ cacheKey: CACHE_KEYS.event, path: '/event', ttl: CACHE_TIMES.event, enabled: loadEvent });
  const [auth, setAuth] = useState<AuthState>(null);
  const [authReady, setAuthReady] = useState(false);
  const [cart, setCart] = useState<CartLine[]>([]);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem(CACHE_KEYS.auth);
      const savedCart = localStorage.getItem(CACHE_KEYS.cart);
      if (savedAuth) setAuth(JSON.parse(savedAuth));
      if (savedCart) setCart((JSON.parse(savedCart) as CartLine[]).filter(line => line.food && Number.isInteger(line.quantity) && line.quantity > 0 && maxOrderQuantity(line.food.ticketsRemaining) > 0).map(line => ({ ...line, quantity: Math.min(line.quantity, maxOrderQuantity(line.food.ticketsRemaining)) })));
    } catch { /* Ignore damaged browser storage. */
    } finally { setAuthReady(true); }
  }, []);

  useEffect(() => { if (authReady) localStorage.setItem(CACHE_KEYS.cart, JSON.stringify(cart)); }, [authReady, cart]);

  const authenticate = async (mode: 'login' | 'register', name: string, password: string) => {
    const result = await apiRequest<{ user: User; token: string }>(`/auth/${mode}`, { method: 'POST', body: JSON.stringify({ name, password }) });
    const next = { user: result.user, token: result.token };
    localStorage.setItem(CACHE_KEYS.auth, JSON.stringify(next));
    setAuth(next);
  };

  const value: AppContextValue = {
    event: eventResource.data?.event,
    eventLoading: eventResource.isLoading,
    eventError: eventResource.error,
    refreshEvent: eventResource.refresh,
    auth, authReady,
    login: (name, password) => authenticate('login', name, password),
    register: (name, password) => authenticate('register', name, password),
    logout: () => { localStorage.removeItem(CACHE_KEYS.auth); setAuth(null); },
    cart,
    cartCount: cart.reduce((sum, line) => sum + line.quantity, 0),
    cartTotal: cart.reduce((sum, line) => sum + line.quantity * line.food.preorderPrice, 0),
    addToCart: (food, quantity) => setCart((current) => {
      if (!Number.isInteger(quantity) || quantity < 1 || !maxOrderQuantity(food.ticketsRemaining)) return current;
      const existing = current.find((line) => line.stallFoodId === food.stallFoodId);
      if (!existing) return [...current, { stallFoodId: food.stallFoodId, quantity: Math.min(quantity, maxOrderQuantity(food.ticketsRemaining)), food }];
      return current.map((line) => line.stallFoodId === food.stallFoodId ? { ...line, quantity: Math.min(maxOrderQuantity(food.ticketsRemaining), line.quantity + quantity), food } : line);
    }),
    updateCart: (id, quantity, ticketsRemaining) => setCart((current) => current.map((line) => line.stallFoodId === id ? { ...line, food: { ...line.food, ticketsRemaining: ticketsRemaining ?? line.food.ticketsRemaining }, quantity: Math.max(1, Math.min(maxOrderQuantity(ticketsRemaining ?? line.food.ticketsRemaining), Number.isInteger(quantity) ? quantity : 1)) } : line)),
    removeFromCart: (id) => setCart((current) => current.filter((line) => line.stallFoodId !== id)),
    clearCart: () => setCart([]),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}
