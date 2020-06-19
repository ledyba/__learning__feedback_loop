import {Cache} from "./02CacheHit"

test('basic', () => {
  const cache = new Cache(2);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
  expect(cache.getEntry(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(true);
});

test('cache with one entry', () => {
  const cache = new Cache(1);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
  expect(cache.getEntry(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(true);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
});

test('allow zero entry', () => {
  const cache = new Cache(0);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(false);
});

test('test LRU', () => {
  const cache = new Cache(2);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
  expect(cache.getEntry(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(true);
  expect(cache.getEntry(3)).toBe(false);
  expect(cache.getEntry(3)).toBe(true);
  // id=1 is last used!
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
  expect(cache.getEntry(3)).toBe(false);
  expect(cache.getEntry(3)).toBe(true);
  // id=2 is last used!
  expect(cache.getEntry(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(true);
});

