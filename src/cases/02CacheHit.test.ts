import {Cache} from "./02CacheHit"

test('basic', () => {
  const cache = new Cache<number>(2);
  expect(cache.size).toBe(0);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
  expect(cache.size).toBe(1);
  expect(cache.getEntry(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(true);
  expect(cache.size).toBe(2);
  expect(cache.getEntry(3)).toBe(false);
  expect(cache.getEntry(3)).toBe(true);
  expect(cache.size).toBe(2);
});

test('cache with one entry', () => {
  const cache = new Cache<number>(1);
  expect(cache.size).toBe(0);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
  expect(cache.size).toBe(1);
  expect(cache.getEntry(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(true);
  expect(cache.size).toBe(1);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
  expect(cache.size).toBe(1);
});

test('allow zero entry', () => {
  const cache = new Cache<number>(0);
  expect(cache.size).toBe(0);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.size).toBe(0);
});

test('test LRU', () => {
  const cache = new Cache<number>(2);
  expect(cache.size).toBe(0);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
  expect(cache.size).toBe(1);

  expect(cache.getEntry(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(true);
  expect(cache.size).toBe(2);

  expect(cache.getEntry(3)).toBe(false);
  expect(cache.getEntry(3)).toBe(true);
  expect(cache.size).toBe(2);

  // id=1 must be dropped!
  expect(cache.has(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(false);
  expect(cache.getEntry(1)).toBe(true);
  expect(cache.size).toBe(2);

  // id=2 must be dropped!
  expect(cache.has(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(false);
  expect(cache.getEntry(2)).toBe(true);
  expect(cache.size).toBe(2);

  // id=3 must be dropped!
  expect(cache.getEntry(3)).toBe(false);
  expect(cache.getEntry(3)).toBe(true);
  expect(cache.size).toBe(2);

  // id=2 is the last entry, and it's not dropped yet.
  expect(cache.has(2)).toBe(true);
  expect(cache.getEntry(2)).toBe(true);
  expect(cache.size).toBe(2);
  expect(cache.has(2)).toBe(true);

});
test('random test', () => {
  for(let j = 0; j < 10000; ++j) {
    const cache = new Cache<number>(10);
    const recents = new Array();
    for(let i = 0; i < 1000; ++i) {
      const id = (Math.random() * 30) | 0;
      const pos = recents.indexOf(id);
      if(pos < 0) {
        recents.push(id);
        while(recents.length > cache.capacity) {
          recents.shift();
        }
      } else {
        recents.splice(pos, 1);
        recents.push(id);
      }
      cache.getEntry(id);
    }
    expect(cache.size).toBe(10);
    expect(cache.capacity).toBe(10);
    expect(cache.keys.length).toBe(10);
    expect(cache.keys).toStrictEqual(recents);
  }
});
