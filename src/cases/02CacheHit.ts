import { ChartDataSets, ChartData } from 'chart.js';
import { constantSetpoint, invert, defaultOutput, System, Block, DataRecorder, connect, loop, mix, AverageFilter, averageFilter, functionSetpoint } from "../engine/System";
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

export class Cache<K> {
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

  private makeRoom() {
    if(this.last === null) {
      return;
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
      this.makeRoom();
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
  set capacity(capacity) {
    this.capacity_ = capacity;
    this.makeRoom();
  }
  get keys(): K[] {
    const keys: K[] = [];
    for(let it = this.last; it !== null; it = it.next) {
      keys.push(it.id);
    }
    return keys;
  }
}

interface Demand {
  next(): number;
}

export class UniformDemand implements Demand {
  private readonly max: number;
  constructor(max:number) {
    this.max = max;
  }
  next(): number {
    return (this.max * Math.random()) | 0;
  }
}

export class PowerLawDemand implements Demand {
  private readonly max: number;
  private readonly alpha: number;
  private readonly cdf: number[];
  private readonly sum: number;
  constructor(max:number, alpha: number) {
    this.max = max | 0;
    this.alpha = alpha;
    this.cdf = new Array<number>(this.max);
    let sum = 0;
    for(let i = 0; i < this.max; ++i) {
      let p = Math.pow(1 + i, this.alpha);
      sum += p;
      this.cdf[i] = sum;
    }
    this.sum = sum;
  }
  next(): number {
    const p = (this.sum * Math.random());
    return this.bisect(p, 0, this.max);
  }
  bisect(p: number, min: number, max: number) {
    while(min < max) {
      const center = (min + (max - min) / 2) | 0;
      if(this.cdf[center] < p) {
        min = center;
      }else{
        max = center;
      }
    }
    return min;
  }
}

export class WebServer implements Block {
  private readonly cache: Cache<number>;
  private readonly demand: Demand;
  private readonly recorder: DataRecorder = new DataRecorder('cache size', 'rgba(255, 255, 0, 0.5)');
  constructor(demand: Demand) {
    this.cache = new Cache(0);
    this.demand = demand;
  }
  step(at: number, dt: number, input: number): number {
    this.recorder.record(Math.round(input));
    this.cache.capacity = Math.round(input);
    return this.cache.getEntry(this.demand.next()) ? 1 : 0;
  }
  get inspect(): ChartDataSets[] {
    return [];//[this.recorder.intoDataSet()];
  }
}

export function cacheHit(demand: Demand, pGain: number, iGain: number): ChartData {
  const input = functionSetpoint((at, dt) => 0.5 + 0.1 * Math.sin(at / 300));
  const forward = (()=>{
    const controller = mix(new ProportionalBlock(pGain), new IntegralController(iGain));
    const plant = connect(new WebServer(demand), averageFilter(100));
    return connect(controller, plant);
  })();
  const block = loop(forward, invert());
  const output = defaultOutput();
  const system = new System(input, block, output);
  return system.exec(1, 10000);
}
