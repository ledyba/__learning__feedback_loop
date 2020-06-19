import { ChartDataSets, ChartData } from 'chart.js';
import { constantSetpoint, invert, defaultOutput, System, Block, DataRecorder, connect, loop, mix } from "../engine/System";
import { ProportionalBlock, IntegralController } from '../engine/Controller';
import { assert, timeStamp } from 'console';

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
  private maxSize_:number = 0;
  private readonly map:Map<number, CacheEntry | null> = new Map();
  private first: CacheEntry | null = null;
  private last: CacheEntry | null = null;
  constructor(size: number) {
    this.maxSize_ = size;
  }

  public getEntry(id: number): boolean {
    const prev = this.map.get(id);
    if(prev === undefined) {
      const entry = new CacheEntry(id);
      this.map.set(id, this.first);
      if(this.first) {
        this.first.next = entry;
        this.first = entry;
      }
      if(this.maxSize_ > 0 && this.map.size > this.maxSize_) {
        if(this.last) {
          this.map.delete(this.last.id);
          this.last = this.last.next;
        }
      }
      return false;
    } else if(prev === null) {
      assert(this.last?.id === id);
      return true;
    } else {
      this.pushFront(prev);
      return true;
    }
  }

  private pushFront(prev: CacheEntry) {
    const entry = prev.next;
    if(entry === null) {
      assert(entry !== null);
      return;
    }
    const next = entry.next;
    prev.next = next;
    if(next) {
      this.map.set(prev.id, next);
    }
    this.map.set(entry.id, this.first);
    if(this.first) {
      this.first.next = entry;
      this.map.set(entry.id, this.first);
    }
  }

  get maxSize():number {
    return this.maxSize_;
  }
  get size():number {
    return this.map.size;
  }
}
