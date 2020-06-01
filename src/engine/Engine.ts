import Chart, { ChartData } from 'chart.js';

export class Engine {
  private readonly element: HTMLCanvasElement;
  private readonly chart: Chart;
  constructor(element: HTMLCanvasElement, chart: Chart) {
    this.element = element;
    this.chart = chart;
  }
  onResize() {
    this.chart.resize();
  }
  updateData(data: ChartData) {
    this.chart.data = data;
    this.chart.update();
  }
}