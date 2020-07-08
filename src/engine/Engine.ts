import Chart, { ChartData } from 'chart.js';

export class Engine {
  private readonly element: HTMLCanvasElement;
  private readonly chart: Chart;
  constructor(element: HTMLCanvasElement) {
    this.element = element;
    this.chart = new Chart(this.element, {
      type: 'line',
      data: {},
      options: {
        tooltips: {enabled: false},
        events: [],
        animation: {
          duration: 0,
        },
        hover: {
          animationDuration: 0
        },
        responsiveAnimationDuration: 0,
        elements: {
          line: {
            // disables bezier curves
            tension: 0,
          },
          point: { radius: 0 }
        },
        scales: {
          xAxes: [
            {
              position: 'bottom',
              ticks: {
                beginAtZero: true,
                maxTicksLimit: 10,
              }
            }
          ],
          yAxes: [
            {
              id: 'default',
              type: 'linear',
              ticks: {
              }
            }
          ],
        }
      }
    });
  }
  private removeAxis(id: string) {
    let changed: boolean = false;
    const axes = this.chart.options.scales?.yAxes;
    if(!axes) {
      return false;
    }
    const idx = axes.findIndex((axis, idx, obj) => axis.id === id)
    if(idx < 0) {
      return false;
    }
    this.chart.options.scales?.yAxes?.splice(idx, 1);
    return true;
  }
  private addAxis(id: string) {
    this.chart.options.scales?.yAxes?.push({
      id: id,
      type: 'linear',
      ticks: {
      }
    });
  }
  onResize() {
    this.chart.resize();
  }
  updateData(data: ChartData) {
    this.chart.data = data;
    this.chart.update();
  }
}