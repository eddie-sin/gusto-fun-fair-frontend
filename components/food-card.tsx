"use client";
/* oxlint-disable next/no-img-element */

import { Plus } from "lucide-react";
import { useState } from "react";
import { formatMoney, mediaUrl } from "@/lib/api";
import type { Food } from "@/lib/types";
import { AddToCartDialog } from "./add-to-cart-dialog";

export function FoodCard({
  food,
  compact = false,
}: {
  food: Food;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const discountText =
    food.discount.value <= 0
      ? ""
      : food.discount.type === "percentage"
        ? `${food.discount.value}% preorder saving`
        : `${formatMoney(food.discount.value)} preorder saving`;
  const lowStock = food.ticketsRemaining > 0 && food.ticketsRemaining <= 15;
  return (
    <article className={`food-card ${compact ? "food-card--compact" : ""}`}>
      <div className="food-card__image-wrap">
        <img
          src={
            mediaUrl(food.food.image?.url) ||
            food.demoImage ||
            "/images/chicken-burger.webp"
          }
          alt={food.food.name}
          loading={compact ? "eager" : "lazy"}
        />
        {discountText && (
          <span className="discount-ribbon">{discountText}</span>
        )}
      </div>
      <div className="food-card__body">
        <p className="food-card__stall">
          {food.stallName}
          {food.stallBatch ? ` · ${food.stallBatch}` : ""}
        </p>
        <h3>{food.food.name}</h3>
        {!compact && food.food.description && (
          <p className="food-card__description">{food.food.description}</p>
        )}
        <div className="food-card__footer">
          <div className="price-stack">
            {food.preorderPrice < food.eventDayPrice && (
              <s>{formatMoney(food.eventDayPrice)}</s>
            )}
            <strong>{formatMoney(food.preorderPrice)}</strong>
          </div>
          <button
            className="add-button"
            onClick={() => setOpen(true)}
            disabled={food.ticketsRemaining < 1}
            aria-label={`Add ${food.food.name} to cart`}
          >
            <Plus aria-hidden="true" size={20} />
          </button>
        </div>
        {!compact && (
          <p className={`stock-copy ${lowStock ? "stock-copy--low" : ""}`}>
            {food.ticketsRemaining > 0
              ? `${food.ticketsRemaining} preorder tickets left`
              : "Sold out"}
          </p>
        )}
      </div>
      <AddToCartDialog food={food} open={open} onOpenChange={setOpen} />
    </article>
  );
}
