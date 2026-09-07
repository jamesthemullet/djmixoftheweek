import { execFileSync, spawnSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { expect, test } from '@playwright/test';

/**
 * sanitize-html is a CJS package that internally does `require('htmlparser2')`.
 * Node has quietly supported require()-ing synchronous ESM graphs since
 * 22.12, which hides a real incompatibility: htmlparser2 v9+ ships as
 * ESM-only ("type": "module"), and Vercel's production Node runtime does
 * not have that require(esm) support enabled. There every slug page 500s
 * with ERR_REQUIRE_ESM the moment a request renders a comment. Reproduce
 * that exact runtime by building for real and loading the bundled server
 * chunk with --no-experimental-require-module, which is the only way this
 * regression shows up locally.
 */
function findChunkImporting(rootDir: string, specifier: string): string {
  const stack = [rootDir];
  while (stack.length) {
    const dir = stack.pop();
    if (!dir) continue;
    for (const entry of readdirSync(dir)) {
      const fullPath = path.join(dir, entry);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        stack.push(fullPath);
      } else if (entry.endsWith('.mjs') && readFileSync(fullPath, 'utf-8').includes(specifier)) {
        return fullPath;
      }
    }
  }
  throw new Error(`No built chunk imports "${specifier}" under ${rootDir} - has comment.astro changed?`);
}

test.describe('production server function', () => {
  test.setTimeout(180_000);

  test('the chunk that renders sanitized comment HTML loads under a strict CJS Node runtime', async () => {
    const repoRoot = path.resolve(import.meta.dirname, '..');

    execFileSync('npx', ['astro', 'build'], {
      cwd: repoRoot,
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'production' },
    });

    const functionDir = path.join(repoRoot, '.vercel/output/functions/_render.func');
    const serverDir = path.join(functionDir, '.vercel/output/server');
    const sanitizeChunk = findChunkImporting(serverDir, 'sanitize-html');

    const result = spawnSync(
      process.execPath,
      [
        '--no-experimental-require-module',
        '-e',
        `import(${JSON.stringify(pathToFileURL(sanitizeChunk).href)}).then(() => process.exit(0), (err) => { console.error(err.code, err.message); process.exit(1); })`,
      ],
      { cwd: functionDir, encoding: 'utf-8' },
    );

    expect(result.stderr, result.stderr).not.toContain('ERR_REQUIRE_ESM');
    expect(result.status, result.stderr).toBe(0);
  });
});
