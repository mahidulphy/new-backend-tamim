import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const target = new URL('../src/generated/prisma/client.ts', import.meta.url);
if (!existsSync(target)) {
  console.error('patch-prisma-client: generated client not found, skipping');
  process.exit(0);
}

const original = await readFile(target, 'utf8');
const from = "globalThis['__dirname'] = path.dirname(fileURLToPath(import.meta.url))";
const to = "globalThis['__dirname'] = import.meta?.url ? path.dirname(fileURLToPath(import.meta.url)) : __dirname";

if (original.includes(from) && !original.includes(to)) {
  await writeFile(target, original.replace(from, to), 'utf8');
  console.log('patch-prisma-client: patched import.meta shim for CJS bundling');
} else {
  console.log('patch-prisma-client: no patch needed');
}
