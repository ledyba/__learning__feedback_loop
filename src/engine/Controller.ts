import { Block } from "./System";
import { ChartDataSets } from "chart.js";

export class ProportionalBlock implements Block {
  private readonly gain: number;
  constructor(gain: number) {
    this.gain = gain;
  }
  step(at: number, dt: number, input: number): number {
    return input * this.gain;
  }
  get inspect(): ChartDataSets[] {
    return []
  }
}

export class IntegralController implements Block {
  private sum: number;
  private priv: number;
  private readonly gain: number;
  constructor(gain: number) {
    this.sum = 0;
    this.priv = 0;
    this.gain = gain;
  }
  step(at: number, dt: number, input: number): number {
    this.sum += (this.priv + input) * dt / 2.0;
    this.priv = input;
    return this.sum * this.gain;
  }
  get inspect(): ChartDataSets[] {
    return [];
  }
}
