import {ChartData} from 'chart.js';

export interface Input {
  step(at: number, dt: number): number;
  inspect: ChartData;
}

export interface Output {
  step(at: number, dt: number, output: number): void;
  inspect: ChartData;
}

export interface Block {
  step(at: number, dt: number, input: number): number;
  inspect: ChartData[];
}

export class System {
  input: Input;
  block: Block;
  output: Output;
  constructor(input: Input, block: Block, output: Output) {
    this.input = input;
    this.block = block;
    this.output = output;
  }
  exec(dt: number, count: number): ChartData[] {
    for(let i = 0; i < count; ++i) {
      const at = dt * i;
      this.output.step(at, dt, this.block.step(at, dt, this.input.step(at, dt)));
    }
    return [this.input.inspect, ...this.block.inspect, this.output.inspect]
  }
}

export class Connect implements Block {
  private from: Block;
  private to: Block;
  constructor(from: Block, to: Block) {
    this.from = from;
    this.to = to;
  }
  step(at: number, dt: number, input: number): number {
    return this.to.step(at, dt, this.from.step(at, dt, input));
  }
  get inspect(): ChartData[] {
    const f = this.from.inspect;
    const t = this.to.inspect;
    return [...f, ...t];
  }
}
