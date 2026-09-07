# GUSTO Fun Fair frontend

A React/Vinext visitor and customer frontend for the GUSTO Fun Fair backend.

## Start locally

1. Copy `.env.example` to `.env.local`.
2. Keep `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api` while using the local backend.
3. Run `npm install`.
4. Run `npm run dev -- --port 5173` and open `http://localhost:5173` (matching the backend’s default allowed origin).

The backend base URL is defined once in `.env.local`, so moving to a hosted API only requires changing that value.

## Organiser-owned event copy

The public event name, physical date, time and place intentionally live in `lib/content.ts`. Update `EVENT_DETAILS` there when the final time and venue are confirmed. The preorder status and schedule still come from the backend because they are operational information.

## Slow-connection behaviour

- Event details are cached on the device for five minutes.
- Food and stall lists are cached for two minutes and reused between pages.
- Food stock gets a quiet refresh when the user returns after 45 seconds.
- Duplicate in-flight reads are combined into one request.
- The backend always rechecks current price and stock when checkout creates an order.
- The cart stays in local storage and does not make API requests.
- Order status refreshes when the customer opens the page or explicitly chooses Refresh; it is not polled continuously.
- Optimised local WebP demo images keep the disconnected state useful without relying on external image hosts.

## Main routes

- `/` home and event overview
- `/foods` searchable, sortable menu with category and stall filters
- `/stalls` stall directory
- `/stalls/[slug]` stall menu
- `/crush-letters` anonymous letter submission
- `/memories` memory photo upload
- `/login` and `/register`
- `/cart`
- `/orders` and `/orders/[id]`
- `/profile`

Run `npm run lint` and `npm run build` before shipping changes.

## Working together with Git

After cloning this repository, follow the local setup above. Run the backend separately; MongoDB and R2 credentials belong only in the backend environment, never in this frontend.

For each change:

1. Switch to `main` and run `git pull --ff-only`.
2. Create a branch, for example `git switch -c feature/memory-gallery`.
3. Make your changes and run `npm run lint` and `npm run build`.
4. Stage the intended files and commit with a descriptive message.
5. Push your branch and open a pull request on GitHub for review before merging into `main`.

Keep `.env.local` private. Only `.env.example`, containing non-secret setup values, is versioned. Public frontend environment variables are visible to browser users.
