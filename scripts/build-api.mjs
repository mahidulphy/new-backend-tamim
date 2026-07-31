import { build } from 'esbuild';

await build({
  entryPoints: ['server/vercel-entry.ts'],
  outfile: 'api/index.js',
  bundle: true,
  platform: 'node',
  format: 'esm',
  packages: 'external',
  target: 'node20',
  logLevel: 'info',
});

console.log('Built api/index.js');
