import tailwindcss from '@tailwindcss/postcss';
import vinext from 'vinext';
import { defineConfig } from 'vite';

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === 'seatbelt';

export default defineConfig({
  css: { postcss: { plugins: [tailwindcss()] } },
  server: isCodexSeatbeltSandbox
    ? { watch: { useFsEvents: false, usePolling: true } }
    : undefined,
  environments: {
    client: {
      // Vinext dynamically imports navigation exports. Preserve their names when
      // Rolldown shares code with the browser entry; otherwise production links
      // fail with `navigateClientSide/getPrefetchInterceptionContext is not a function`.
      build: { rolldownOptions: { preserveEntrySignatures: 'strict' } },
    },
  },
  plugins: [vinext()],
});
