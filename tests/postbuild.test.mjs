import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'portfolio-postbuild-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  mkdirSync(join(root, 'scripts'));
  mkdirSync(join(root, 'out'));
  copyFileSync(new URL('../scripts/postbuild.mjs', import.meta.url), join(root, 'scripts/postbuild.mjs'));
  return {out: join(root, 'out'), run: () => execFileSync(process.execPath, [join(root, 'scripts/postbuild.mjs')])};
}

test('export rewrites plain and hashed OG links without doubling extensions', (t) => {
  const {out, run} = fixture(t);
  writeFileSync(join(out, 'opengraph-image'), 'image bytes');
  writeFileSync(join(out, 'index.html'), '<meta content="/opengraph-image"><meta content="/projects/test/opengraph-image?abc123"><meta content="/opengraph-image.png">');
  run();
  assert.equal(readFileSync(join(out, 'opengraph-image.png'), 'utf8'), 'image bytes');
  const html = readFileSync(join(out, 'index.html'), 'utf8');
  assert.match(html, /content="\/opengraph-image.png"/);
  assert.match(html, /test\/opengraph-image.png"/);
  assert.doesNotMatch(html, /png.png/);
  run();
  assert.equal(readFileSync(join(out, 'index.html'), 'utf8'), html);
});
