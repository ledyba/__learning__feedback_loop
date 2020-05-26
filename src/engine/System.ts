import {ChartData} from 'chart.js';

export interface Input {
  step(): number;
  inspect: ChartData;
}

export interface Output {
  step(output: number): void;
  inspect: ChartData;
}

export interface Block {
  step(input: number): number;
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
}

export class Connect implements Block {
  private from: Block;
  private to: Block;
  constructor(from: Block, to: Block) {
    this.from = from;
    this.to = to;
  }
  step(input: number): number {
    return this.to.step(this.from.step(input));
  }
  get inspect(): ChartData[] {
    const f = this.from.inspect;
    const t = this.to.inspect;
    return [...f, ...t];
  }
}
