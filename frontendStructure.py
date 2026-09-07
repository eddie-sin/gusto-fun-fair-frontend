#!/usr/bin/env python3
"""Print the frontend files that are useful when asking for coding help."""

from __future__ import annotations

import argparse
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]

ROLES = {
    "app/page.tsx": "Home page (/)",
    "app/foods/page.tsx": "Food listing, search, filters and sorting (/foods)",
    "app/stalls/page.tsx": "Stall listing (/stalls)",
    "app/stalls/[slug]/page.tsx": "One stall and its menu (/stalls/:slug)",
    "app/cart/page.tsx": "Cart, totals and checkout (/cart)",
    "app/orders/page.tsx": "Current user's order history (/orders)",
    "app/orders/[id]/page.tsx": "Order details, payment proof and ticket (/orders/:id)",
    "app/login/page.tsx": "Login page (/login)",
    "app/register/page.tsx": "Account creation page (/register)",
    "app/profile/page.tsx": "User profile page (/profile)",
    "app/memories/page.tsx": "Memory photo submission (/memories)",
    "app/crush-letters/page.tsx": "Anonymous crush-letter submission (/crush-letters)",
    "app/layout.tsx": "Root document metadata, fonts and global shell",
    "app/not-found.tsx": "Custom 404 page",
    "app/globals.css": "Main visual design: colors, spacing, typography and responsive layout",
    "components/app-provider.tsx": "Shared login, event and cart state; localStorage handling",
    "components/site-shell.tsx": "Wraps pages with provider, preorder strip, header and footer",
    "components/site-header.tsx": "Desktop/mobile navigation, login/profile and cart controls",
    "components/site-footer.tsx": "Site footer",
    "components/preorder-strip.tsx": "Preorder status shown on every page",
    "components/food-card.tsx": "Reusable food card",
    "components/add-to-cart-dialog.tsx": "Quantity selection popup",
    "components/auth-form.tsx": "Shared login/register form",
    "components/catalog-state.tsx": "Loading skeleton and offline/sample-data notice",
    "components/page-hero.tsx": "Reusable page heading section",
    "components/require-auth.tsx": "Protects pages that require login",
    "lib/api.ts": "API base URL, fetch helper, authentication headers and API errors",
    "lib/use-cached-resource.ts": "Local caching, refresh timing and offline fallback behavior",
    "lib/use-catalog.ts": "Fetches and combines food/stall catalogue data",
    "lib/content.ts": "Frontend-owned event text and cache settings",
    "lib/demo-data.ts": "Sample menu displayed when the backend cannot be reached",
    "lib/types.ts": "TypeScript descriptions of backend data",
    "lib/order-display.ts": "User-facing order status names and messages",
    "lib/use-webmcp-cart.ts": "Optional browser tool integration for adding food to cart",
    "lib/utils.ts": "Small shared class-name utility",
    ".env.local": "Local backend API address; may contain local configuration",
    ".env.example": "Safe example of required environment variables",
    "package.json": "Dependencies and development/build commands",
    "vite.config.ts": "Vite/vinext build configuration",
    "next.config.ts": "Next-compatible application configuration",
    "tsconfig.json": "TypeScript and @/ import-path configuration",
    "public/favicon.svg": "Browser-tab icon",
}


def existing(paths: list[Path]) -> list[Path]:
    return sorted({path for path in paths if path.exists()}, key=lambda path: path.as_posix())


def print_section(title: str, paths: list[Path]) -> None:
    print(f"\n{title}")
    for path in existing(paths):
        relative = path.relative_to(ROOT).as_posix()
        role = ROLES.get(relative, "Project file")
        print(f"- {relative} — {role}")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--include-ui",
        action="store_true",
        help="also list every low-level component in components/ui",
    )
    args = parser.parse_args()

    print("GUSTO Fun Fair frontend — important file map")
    print(f"Project root: {ROOT}")

    page_files = list((ROOT / "app").glob("**/page.tsx"))
    page_files += [ROOT / "app/layout.tsx", ROOT / "app/not-found.tsx"]
    print_section("PAGES AND ROUTING", page_files)

    print_section("SHARED PAGE COMPONENTS", list((ROOT / "components").glob("*.tsx")))
    print_section("API, DATA, CACHE AND TYPES", list((ROOT / "lib").glob("*.ts")))
    print_section("DESIGN", [ROOT / "app/globals.css"])
    print_section("CONFIGURATION", [
        ROOT / ".env.example",
        ROOT / ".env.local",
        ROOT / "package.json",
        ROOT / "vite.config.ts",
        ROOT / "next.config.ts",
        ROOT / "tsconfig.json",
    ])
    print_section("STATIC IMAGES AND ICONS", list((ROOT / "public").glob("**/*.*")))

    ui_files = list((ROOT / "components/ui").glob("*.tsx"))
    if args.include_ui:
        print_section("LOW-LEVEL UI BUILDING BLOCKS", ui_files)
    else:
        print(f"\nLOW-LEVEL UI BUILDING BLOCKS\n- components/ui/ — {len(ui_files)} reusable controls; usually attach only the one involved in the problem")

    print("\nIgnored: node_modules/, dist/, generated build files and Git internals")


if __name__ == "__main__":
    main()
