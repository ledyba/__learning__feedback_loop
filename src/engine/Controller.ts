import { Block } from "./System";
import { ChartDataSets } from "chart.js";

export class ProportionalBlock implements Block {
  private gain: number;
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