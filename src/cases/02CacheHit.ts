import { ChartDataSets, ChartData } from 'chart.js';
import { constantSetpoint, invert, defaultOutput, System, Block, DataRecorder, connect, loop, mix } from "../engine/System";
import { ProportionalBlock, IntegralController } from '../engine/Controller';

/**
 * Cache hit!
 */

class CacheEntry {
  readonly id: number;
  next: CacheEntry | null = null;
  prev: CacheEntry | null = null;
  constructor(id: number) {
    this.id = id;
  }
}

export class Cache {
  private maxSize_:number = 0;
  private readonly map:Map<number, CacheEntry> = new Map();
  private first: CacheEntry | null = null;
  private last: CacheEntry | null = null;
  constructor(size: number) {
    this.maxSize_ = size;
  }

  public getEntry(id: number): boolean {
    const cache = this.map.get(id);
    if(!!cache) {
      this.pushFirst(cache);
      return true;
    }
    const entry = new CacheEntry(id);
    this.map.set(id, entry);
    this.pushFirst(entry);
    if(this.map.size > this.maxSize_ && this.maxSize_ > 0) {
      this.map.delete(this.popLast()!.id);
    }
    return false;
  }

  private popLast() : CacheEntry | null {
    const last = this.last;
    if(!last) {
      return null;
    }
    const nextLast = last.next;
    if(nextLast) {
      nextLast.prev = null;
      this.last = nextLast;
    } else {
      this.last = null;
    }
    return last;
  }

  private pushFirst(entry: CacheEntry) {
    if(!!entry.next) {
      entry.next.prev = entry.prev;
    }
    if(!!entry.prev) {
      entry.prev.next = entry.next;
    }
    entry.next = null;
    entry.prev = this.first;
    this.first = entry;
    if(!this.last) {
      this.last = entry;
    }
  }

  get maxSize():number {
    return this.maxSize_;
  }
  get size():number {
    return this.map.size;
  }
}
