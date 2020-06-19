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
  expect(cache.has(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
  expect(cache.has(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(true);
  // id=3 is last used!
  expect(cache.getEntry(3)).toBe(false);
  expect(cache.getEntry(3)).toBe(true);
});

test('fuzzing', () => {
  const cache = new Cache(10);
  const lasts = new Array(10);
  for(let i = 0; i < 1000; ++i) {
    const id = Math.floor(Math.random() * 1000);
    lasts[i % 10] = id;
    cache.getEntry(id);
  }
  for(let id = 0; id < 1000; ++id) {
    expect(cache.has(id)).toBe(lasts.indexOf(id) >= 0);
  }
});
