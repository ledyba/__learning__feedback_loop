import { ChartData, ChartDataSets } from 'chart.js';

export interface Input {
  step(at: number, dt: number): number;
  inspect: ChartDataSets;
}

export interface Output {
  step(at: number, dt: number, output: number): void;
  inspect: ChartDataSets;
}

export interface Block {
  step(at: number, dt: number, input: number): number;
  inspect: ChartDataSets[];
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
  exec(dt: number, count: number): ChartData {
    const labels: Array<number> = [];
    for(let i = 0; i < count; ++i) {
      const at = dt * i;
      labels.push(at);
      this.output.step(at, dt, this.block.step(at, dt, this.input.step(at, dt)));
    }
    return {
      labels: labels,
      datasets: [this.input.inspect, ...this.block.inspect, this.output.inspect]
    }
  }
}

/******************************************************************************
 * Building blocks
 ******************************************************************************/

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
  get inspect(): ChartDataSets[] {
    const f = this.from.inspect;
    const t = this.to.inspect;
    return [...f, ...t];
  }
}

export function connect(from: Block, to: Block): Connect {
  return new Connect(from, to);
}

export class Loop implements Block {
  private forward: Block;
  private backward: Block;
  private prev = 0.0;
  constructor(forward: Block, backward: Block) {
    this.forward = forward;
    this.backward = backward;
  }
  step(at: number, dt: number, input: number): number {
    const out = this.forward.step(at, dt, input + this.prev);
    this.prev = this.backward.step(at, dt, out);
    return out;
  }
  get inspect(): ChartDataSets[] {
    const f = this.forward.inspect;
    const b = this.backward.inspect;
    return [...f, ...b];
  }
}

export function loop(forward: Block, backward: Block): Loop {
  return new Loop(forward, backward);
}

export class Mix implements Block {
  private blocks: Array<Block>;
  constructor(...blocks: Array<Block>) {
    this.blocks = blocks;
  }
  step(at: number, dt: number, input: number): number {
    throw new Error("Method not implemented.");
  }
  get inspect(): ChartDataSets[] {
    const dataSet: ChartDataSets[] = [];
    for(const block of this.blocks) {
      dataSet.concat(block.inspect);
    }
    return dataSet;
  }
}

export function mix(...blocks: Array<Block>):Mix {
  return new Mix(...blocks);
}

export class Invert implements Block {
  constructor() {
  }
  step(at: number, dt: number, input: number): number {
    return -input;
  }
  get inspect(): ChartDataSets[] {
    return [];
  }
}

export function invert():Invert {
  return new Invert();
}

export class Delay implements Block {
  private delay: number;
  private history: Array<number>;
  private idx: number;
  constructor(delay: number) {
    this.delay = delay | 0;
    this.history = new Array(this.delay);
    this.idx = 0;
    this.history = this.history.map(() => 0);
  }
  step(at: number, dt: number, input: number): number {
    const val = this.history[this.idx];
    this.history[this.idx] = input;
    this.idx = (this.idx + 1) % this.history.length;
    return val;
  }
  get inspect(): ChartDataSets[] {
    return [];
  }
}

export function delay(time: number):Delay {
  return new Delay(time);
}

/******************************************************************************
 * Utility implementations
 ******************************************************************************/

export class DataRecorder {
  private label: string;
  private color: string;
  private values: Array<number> = [];
  constructor(label: string, color: string) {
    this.label = label;
    this.color = color;
  }
  intoDataSet(): ChartDataSets {
    return {
      label: this.label,
      borderColor: this.color,
      data: this.values,
      fill: false,
    };
  }
  record(data: number) {
    this.values.push(data);
  }
}

export class ConstantSetpoint implements Input {
  private setPoint: number;
  private recorder: DataRecorder = new DataRecorder('set point', 'rgba(0, 255, 0, 0.5)');
  constructor(setPoint: number) {
    this.setPoint = setPoint;
  }
  step(at: number, dt: number): number {
    this.recorder.record(this.setPoint);
    return this.setPoint;
  }
  get inspect(): ChartDataSets {
    return this.recorder.intoDataSet();
  }
}
export function constantSetpoint(setPoint: number): ConstantSetpoint {
  return new ConstantSetpoint(setPoint);
}

export class DefaultOutput implements Output {
  private recorder: DataRecorder = new DataRecorder('output', 'rgba(0, 0, 255, 0.5)');
  constructor() {
  }
  step(at: number, dt: number, output: number): void {
    this.recorder.record(output);
  }
  get inspect(): ChartDataSets {
    return this.recorder.intoDataSet();
  }
}

export function defaultOutput(): DefaultOutput {
  return new DefaultOutput();
}
