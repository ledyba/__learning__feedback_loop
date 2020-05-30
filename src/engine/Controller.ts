import { Block } from "./System";
import { ChartDataSets } from "chart.js";

export class ProportionalBlock implements Block {
  private weight: number;
  constructor(weight: number) {
    this.weight = weight;
  }
  step(at: number, dt: number, input: number): number {
    return input * this.weight;
  }
  get inspect(): ChartDataSets[] {
    return []
  }
}