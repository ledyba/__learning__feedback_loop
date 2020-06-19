import { ChartDataSets, ChartData } from 'chart.js';
import { constantSetpoint, invert, defaultOutput, System, Block, DataRecorder, connect, loop, mix } from "../engine/System";
import { ProportionalBlock, IntegralController } from '../engine/Controller';
import { assert } from 'console';

/**
 * Cache hit!
 */

class CacheEntry {
  readonly id: number;
  next: CacheEntry | null = null;
  constructor(id: number) {
    this.id = id;
  }
}

export class Cache {
  private capacity_:number = 0;
  private readonly map:Map<number, CacheEntry | null> = new Map();
  private first: CacheEntry | null = null;
  private last: CacheEntry | null = null;
  constructor(size: number) {
    this.capacity_ = size;
  }
  public has(id: number): boolean {
    return this.map.get(id) !== undefined;
  }

  public getEntry(id: number): boolean {
    const prev = this.map.get(id);
    if(prev === undefined) {
      const entry = new CacheEntry(id);
      this.map.set(id, this.first);
      if(this.first) {
        this.first.next = entry;
      }
      this.first = entry;
      this.first.next = null;
      if(this.last == null) {
        this.last = entry;
      }
      if(this.map.size > this.capacity_) {
        // delete the last used entry
        if(!this.last) {
          fail("There are no entry to remove.");
        }
        assert(this.map.get(this.last.id) === null, "map[last.id] should be null.");
        this.map.delete(this.last.id);
        this.last = this.last.next;
        if(this.last) {
          this.map.set(this.last.id, null);
        } else {
          if(this.map.size !== 0) {
            fail(`Next last is null, but hashmap is not empty: ${this.map.size}`);
          }
          this.first = null;
          this.last = null;
        }
      }
      if(this.capacity_ > 0) {
        assert(this.first !== null && this.first.next === null, "the first entry must exists and next entry should be null.");
        assert(this.last !== null && (this.map.size === 1 || this.last.next !== null), "the last entry must exists and next entry should not be null or cache must contain just one entry.");
      } else {
        assert(this.first === null && this.last === null, "Both first and last entries should be null, because the capacity of this cache is 0.");
      }
      return false;
    } else if(prev === null) {
      if(this.last === null || this.first === null) {
        fail(`Hashmap indicates that the entry is last, but last was null: ${this}`);
      }
      if(this.first === this.last && this.first !== null && this.last !== null) {
        // already on the first, because there are just only one entry.
        assert(this.map.size === 1, "Hashmap should contain only one entry iff first === last");
        assert(this.first.id === id, "The ID of first should match the requested id.");
        return true;
      }
      const nextLast = this.last.next!;
      this.map.set(nextLast.id, null);
      this.map.set(this.last.id, this.first);
      this.first.next = this.last;
      this.first = this.last;
      this.last = nextLast;
      return true;
    } else {
      const entry = prev.next;
      if(entry === null) {
        fail("prev.next can not be null. Entry is not the front.");
      }
      if(this.first === null || this.last === null) {
        fail("this.first or this.last cannot be null. Because cache is not empty.");
      }
      if(this.first === entry) {
        // It's already first.
        assert(this.first.next === null, "first.next should be always null.");
        return true;
      }
      assert(entry.next, "entry.next should be not null, if it's not the front.");
      const next = entry.next!;
      prev.next = next;
      this.map.set(next.id, prev);
      this.map.set(entry.id, this.first);
      this.first.next = entry;
      this.first = entry;
      this.first.next = null;
      return true;
    }
  }

  get capacity():number {
    return this.capacity_;
  }
  get size():number {
    return this.map.size;
  }
}
