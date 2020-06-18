import {Cache} from "./02CacheHit"

test('basic', () => {
  const cache = new Cache(1);
  expect(!cache.getEntry(1));
  expect(cache.getEntry(1));
});

test('allow zero entry', () => {
  const cache = new Cache(0);
  expect(!cache.getEntry(1));
  expect(!cache.getEntry(1));
});

test('test LRU', () => {
  const cache = new Cache(2);
  expect(!cache.getEntry(1));
  expect(cache.getEntry(1));
  expect(!cache.getEntry(2));
  expect(cache.getEntry(2));
  expect(!cache.getEntry(3));
  expect(cache.getEntry(3));
  // id=1 is last used!
  expect(!cache.getEntry(1));
  expect(cache.getEntry(1));
});

