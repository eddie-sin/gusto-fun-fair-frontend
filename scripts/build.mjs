import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// An explicit environment value wins; otherwise production uses Nginx's /api
// route, even when .env.local still points at the developer's localhost API.
const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || '/api';
const result = spawnSync(
  process.execPath,
  [fileURLToPath(new URL('../node_modules/vinext/dist/cli.js', import.meta.url)), 'build', ...process.argv.slice(2)],
  {
    stdio: 'inherit',
    env: { ...process.env, NEXT_PUBLIC_API_BASE_URL: apiBaseUrl },
  },
);

if (result.error) {
  console.error(result.error.message);
}
process.exit(result.status ?? 1);
