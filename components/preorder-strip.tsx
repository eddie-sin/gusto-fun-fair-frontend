"use client";

import { Clock3 } from "lucide-react";
import { formatDateTime } from "@/lib/api";
import { useApp } from "./app-provider";

export function PreorderStrip() {
  const { event, eventLoading } = useApp();
  const status = event?.preorderStatus;
  const copy =
    status === "OPEN"
      ? `Preorders are open now · closes ${formatDateTime(event?.preorderCloseAt)}`
      : status === "UPCOMING"
        ? `Preorders open ${formatDateTime(event?.preorderOpenAt)}`
        : status === "CLOSED"
          ? `Preorders closed ${formatDateTime(event?.preorderCloseAt)}`
          : status === "DISABLED"
            ? "Preorders are temporarily paused"
            : eventLoading
              ? "Checking the preorder schedule…"
              : "Preorder schedule is currently unavailable";
  return (
    <output
      className={`preorder-strip preorder-strip--${status?.toLowerCase() || "unknown"}`}
    >
      <span className="site-container preorder-strip__inner">
        <Clock3 aria-hidden="true" size={16} strokeWidth={1.8} />
        <span>{copy}</span>
      </span>
    </output>
  );
}
