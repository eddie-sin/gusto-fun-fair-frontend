# GUSTO Fun Fair frontend

A React/Vinext visitor and customer frontend for the GUSTO Fun Fair backend.

## Start locally

1. Copy `.env.example` to `.env.local`.
2. Keep `NEXT_PUBLIC_API_BASE_URL=http://localhost:5001/api` while using the local backend.
3. Use Node.js 24 (also required by the backend) and run `npm ci`.
4. Run `npm run dev -- --port 5173` and open `http://localhost:5173` (matching the backend’s default allowed origin).

Local development reads the backend base URL from `.env.local`. Production builds use `/api` by default, independently of that local setting.

## Production on EC2 / Node.js

The frontend now builds for Node.js, with no Cloudflare Worker runtime required.
The Express backend, MongoDB Atlas and R2 configuration remain separate.

```sh
npm ci
npm run build
HOST=127.0.0.1 PORT=3000 npm start
```

`npm run build` produces `dist/standalone/`, including its server entrypoint,
client assets, public files and runtime dependencies. `npm start` runs that
production server with `NODE_ENV=production` and a default bind address of
`127.0.0.1`; it does not run Vite or Wrangler development mode.
Build on Linux for a Linux deployment (or in a matching Linux build environment).
Do not upload the Mac's `node_modules` as an EC2 installation.

The default production API address is `/api`. The build script sets it before
Vinext reads environment files so a developer's `.env.local` cannot accidentally
point the deployed site at `localhost:5001`. If hosting the API separately,
explicitly set its public URL when building, for example:

```sh
NEXT_PUBLIC_API_BASE_URL=https://api.example.com/api npm run build
```

On Windows PowerShell, set `$env:NEXT_PUBLIC_API_BASE_URL` before building instead.
The API URL is compiled into the frontend: changing it requires another build,
not just restarting the server. Keep all secrets in the backend configuration.

On EC2, configure Nginx to route `/api/` to the Express backend at
`127.0.0.1:5001`, **preserving the `/api/` prefix**, and all other paths to this
frontend at `127.0.0.1:3000`. The standalone server handles dynamic routes such
as `/orders/[id]` and `/stalls/[slug]`; do not replace it with a static SPA fallback.
Set the backend's `CLIENT_URL` to the final HTTPS website origin. HTTPS,
Nginx and automatic process startup are configured separately during deployment.

For a self-contained release, copy the **entire** `dist/standalone/` directory
from a matching Linux build and run `NODE_ENV=production HOST=127.0.0.1 PORT=3000 node server.js`
inside it. No root-project `.env.local` or source files are needed at runtime.
A frontend-only local production preview will serve pages, but `/api` needs the
reverse proxy and running backend for login, ordering and uploads to work.

Before event deployment, check direct visits and refreshes on detail routes,
login, checkout, proof upload and protected order access through the final
HTTPS reverse proxy. No AWS resources are created by these build commands.

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
