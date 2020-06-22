import { ChartDataSets, ChartData } from 'chart.js';
import { constantSetpoint, invert, defaultOutput, System, Block, DataRecorder, connect, loop, mix } from "../engine/System";
import { ProportionalBlock, IntegralController } from '../engine/Controller';
import { assert } from 'console';

/**
 * Cache hit!
 */

class CacheEntry<K> {
  readonly id: K;
  next: CacheEntry<K> | null = null;
  constructor(id: K) {
    this.id = id;
  }
}

export default class Cache<K> {
  private capacity_:number = 0;
  private readonly map:Map<K, CacheEntry<K> | null> = new Map();
  private first: CacheEntry<K> | null = null;
  private last: CacheEntry<K> | null = null;
  constructor(size: number) {
    this.capacity_ = size;
  }
  public has(id: K): boolean {
    return this.map.get(id) !== undefined;
  }

  public getEntry(id: K): boolean {
    const prev = this.map.get(id);
    if(prev === undefined) {
      const entry = new CacheEntry(id);
      this.map.set(id, this.first);
      if(this.first) {
        this.first.next = entry;
      }
      this.first = entry;
      this.first.next = null;
      if(this.last === null) {
        this.last = entry;
      }
      while(this.map.size > this.capacity_) {
        // delete the last used entry
        this.map.delete(this.last.id);
        this.last = this.last.next;
        if(this.last !== null) {
          this.map.set(this.last.id, null);
        } else {
          this.first = null;
          this.last = null;
          break;
        }
      }
      return false;
    } else if(prev === null) {
      if(this.first === this.last) {
        // already on the first, because there are just only one entry.
        return true;
      }
      const nextLast = this.last!.next!; // It's safe, because there more than 1 elements.
      this.map.set(nextLast.id, null);
      this.map.set(this.last!.id, this.first);
      this.first!.next = this.last;
      this.first = this.last;
      this.first!.next = null;
      this.last = nextLast;
      return true;
    } else {
      const entry = prev.next!; // It's safe, because there should be more than one entries.
      if(this.first === entry) {
        // It's already first.
        return true;
      }
      const next = entry.next!;
      prev.next = next;
      this.map.set(next.id, prev);
      this.map.set(entry.id, this.first);
      this.first!.next = entry; // It's safe, because there should be more than one entries.
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
  get keys(): K[] {
    const keys: K[] = [];
    for(let it = this.last; it !== null; it = it.next) {
      keys.push(it.id);
    }
    return keys;
  }
}

export class WebCache implements Block {
  private readonly cache: Cache<number>;
  constructor(capacity: number) {
    this.cache = new Cache(capacity);
  }
  step(at: number, dt: number, input: number): number {
    return input;
  }
  get inspect(): ChartDataSets[] {
    return [];
  }

}