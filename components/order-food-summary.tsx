"use client";
/* oxlint-disable next/no-img-element */

import { useState } from 'react';
import { ArrowUpRight, Utensils } from 'lucide-react';
import { formatMoney } from '@/lib/api';
import { orderImage } from '@/lib/order-images';
import type { Order } from '@/lib/types';

function FoodPhoto({ src, name, preview = false }: { src: string; name: string; preview?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <span className="order-photo-fallback"><Utensils size={preview ? 38 : 20} aria-hidden="true" />{preview && <span>Photo unavailable</span>}</span>;
  return <img src={src} alt={preview ? name : ''} onError={() => setFailed(true)} loading="lazy" />;
}

export function OrderFoodSummary({ order }: { order: Order }) {
  const [selected, setSelected] = useState(0);
  const item = order.items[selected] || order.items[0];
  const image = orderImage(item?.foodImage);
  return <section className="order-food-summary" aria-labelledby="order-food-title">
    <div className="order-food-summary__heading"><div><p className="eyebrow">On your ticket</p><h2 id="order-food-title">Your selection</h2></div><span>{order.totalQuantity} food ticket{order.totalQuantity === 1 ? '' : 's'}</span></div>
    <div className="order-food-summary__body">
      <div className="order-food-menu">
        <p className="order-food-menu__hint">Select a food to preview its photo.</p>
        <ul className="order-food-menu__list">{order.items.map((line, index) => {
          const photo = orderImage(line.foodImage);
          return <li key={`${line.stallFoodId || line.foodId || line.foodName}-${index}`}><button type="button" className={`order-food-choice ${selected === index ? 'is-selected' : ''}`} aria-pressed={selected === index} aria-controls="order-food-preview" onPointerEnter={(event) => { if (event.pointerType === 'mouse') setSelected(index); }} onClick={() => setSelected(index)} onFocus={() => setSelected(index)}>
            <span className="order-food-choice__thumb"><FoodPhoto key={photo.src} src={photo.src} name={line.foodName} /></span>
            <span className="order-food-choice__copy"><strong>{line.foodName}</strong><span>{line.stallName}</span><small>{line.quantity} × {formatMoney(line.unitPrice)}</small><b>{formatMoney(line.subtotal)}</b></span>
            <ArrowUpRight size={17} aria-hidden="true" />
          </button></li>;
        })}</ul>
        <div className="order-food-total"><span>Order total<small>{order.totalQuantity} food ticket{order.totalQuantity === 1 ? '' : 's'}</small></span><strong>{formatMoney(order.totalAmount)}</strong></div>
      </div>
      {item && <figure id="order-food-preview" className="order-food-preview">
        <div className="order-food-preview__image"><FoodPhoto key={image.src} src={image.src} name={item.foodName} preview /><span className="order-food-preview__quantity">× {item.quantity}</span></div>
        <figcaption><span className="order-food-preview__stall">{item.stallName}</span><h3>{item.foodName}</h3><div className="order-food-preview__price"><span>{formatMoney(item.unitPrice)} each</span><strong>{formatMoney(item.subtotal)}</strong></div>{image.illustrative && image.src && <small className="order-food-preview__note">Illustrative demo photo</small>}</figcaption>
      </figure>}
    </div>
  </section>;
}
