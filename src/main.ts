import Chart, { ChartData, LinearTickOptions } from 'chart.js';
import { Engine} from './engine/Engine';
import helloFeedback from './cases/01HelloFeedback'

let engine: Engine | null;

function resize() {
  if(engine) {
    engine.onResize();
  }
}

function exec(modelName: string): ChartData | null {
  switch(modelName) {
    case "hello-feedback":
      return helloFeedback();
    case "cache-hit":
      return helloFeedback();
    default:
      alert(`Unknown model: ${modelName}`);
      return null;
  }
}

function createEngine(): Engine {
  const graph = document.getElementById('graph')! as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = graph.getContext('2d')!;
  const chart = new Chart(ctx, {
    type: 'line',
    data: {},
    options: {
      scales: {
        xAxes: [
          {
            //type: 'linear',
            position: 'bottom',
            ticks: {
              beginAtZero: true,
              maxTicksLimit: 10,
            }
          }
        ],
        yAxes: [
          {
            type: 'linear',
            ticks: {
            }
          }
        ],
      }
    }
  });
  return new Engine(graph, ctx, chart);
}

function main() {
  engine = createEngine();
  window.addEventListener('resize', resize);
  document.getElementById('exec-button')!.addEventListener('click', (ev) => {
    const opt = document.getElementById('exec-selecter') as HTMLSelectElement;
    const data = exec(opt.value);
    if(data != null) {
      engine?.updateData(data);
    }
  });
}

document.addEventListener('DOMContentLoaded', main);
