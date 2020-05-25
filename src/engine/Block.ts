import {ChartData} from 'chart.js';

interface Block {
  run(input: number): number;
  inspect: ChartData[];
}

class Connect implements Block {
  private from_: Block;
  private to_: Block;
  constructor(from: Block, to: Block) {
    this.from_ = from;
    this.to_ = to;
  }
  run(input: number): number {
    const tmp = this.from_.run(input);
    return this.to_.run(tmp);
  }
  get inspect(): ChartData[] {
    const f = this.from_.inspect;
    const t = this.to_.inspect;
    return [...f, ...t];
  }
}
