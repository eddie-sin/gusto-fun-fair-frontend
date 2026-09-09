'use client';

import { useEffect } from 'react';
import { useApp } from '@/components/app-provider';
import { maxOrderQuantity, quantityLimitMessage } from './order-policy';
import type { Food } from './types';

declare global {
  interface Document {
    modelContext?: {
      registerTool: (tool: { name: string; title?: string; description: string; inputSchema: object; annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean }; execute: (input: unknown) => unknown }, options?: { signal?: AbortSignal }) => void | Promise<void>;
    };
  }
}

export function useWebMcpCart(foods: Food[], addToCart: (food: Food, quantity: number) => void) {
  const { cart } = useApp();
  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool || foods.length === 0) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: 'add_food_to_cart',
      title: 'Add food to cart',
      description: 'Add an available GUSTO Fun Fair menu item to the visible shopping cart using its stallFoodId.',
      inputSchema: { type: 'object', properties: { stallFoodId: { type: 'string' }, quantity: { type: 'integer', minimum: 1 } }, required: ['stallFoodId', 'quantity'], additionalProperties: false },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const value = input as { stallFoodId?: string; quantity?: number };
        const food = foods.find((item) => item.stallFoodId === value.stallFoodId);
        if (!food) throw new Error('Menu item not found.');
        if (!Number.isInteger(value.quantity) || !value.quantity || value.quantity < 1 || value.quantity > food.ticketsRemaining) throw new Error('Quantity is not available.');
        const inCart = cart.find(line => line.stallFoodId === food.stallFoodId)?.quantity || 0;
        if (inCart + value.quantity > maxOrderQuantity(food.ticketsRemaining)) throw new Error(quantityLimitMessage(food.ticketsRemaining));
        addToCart(food, value.quantity);
        return { added: true, stallFoodId: food.stallFoodId, quantity: value.quantity, foodName: food.food.name };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, [addToCart, foods, cart]);
}
