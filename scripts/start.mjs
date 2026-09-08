// Run the standalone build in production mode, behind a local reverse proxy.
process.env.NODE_ENV = 'production';
process.env.HOST ??= '127.0.0.1';
await import('../dist/standalone/server.js');
