import test from 'node:test';
import assert from 'node:assert/strict';
import { copyText } from '../src/lib/copy.ts';

test('modern clipboard succeeds without invoking the legacy fallback', async () => {
  let copied;
  Object.defineProperty(globalThis, 'navigator', {configurable: true, value: {clipboard: {writeText: async (text) => {copied = text;}}}});
  assert.equal(await copyText('hello'), true);
  assert.equal(copied, 'hello');
});

test('legacy copy reports failure accurately and always restores focus and removes its textarea', async () => {
  Object.defineProperty(globalThis, 'navigator', {configurable: true, value: {}});
  globalThis.HTMLElement = class {};
  for (const result of [true, false, 'throw']) {
    let removed = false; let focused = false;
    const previous = new HTMLElement();
    previous.focus = () => {focused = true;};
    globalThis.document = {
      activeElement: previous, body: {appendChild() {}},
      createElement: () => ({style: {}, setAttribute() {}, select() {}, remove() {removed = true;}}),
      execCommand: () => {if (result === 'throw') throw Error('denied'); return result;},
    };
    assert.equal(await copyText('hello'), result === true);
    assert.equal(removed, true);
    assert.equal(focused, true);
  }
});
