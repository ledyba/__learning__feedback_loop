import Chart from 'chart.js';

export class Engine {
  private element: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  private chart: Chart;
  constructor(element: HTMLCanvasElement, context: CanvasRenderingContext2D, chart: Chart) {
    this.element = element;
    this.context = context;
    this.chart = chart;
  }
  onResize() {
    this.chart.resize();
  }
}