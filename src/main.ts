import Chart, { ChartData, LinearTickOptions } from 'chart.js';
import { Engine} from './engine/Engine';
import { System, ConstantSetpoint, invert, defaultOutput, constantSetpoint } from './engine/System';

let engine: Engine | null;

function resize() {
  if(engine) {
    engine.onResize();
  }
}

function helloFeedback(): ChartData {
  const input = constantSetpoint(0.5);
  const block = invert();
  const output = defaultOutput();
  const system = new System(input, block, output);
  return system.exec(0.1, 1000);
}

function cacheHit(): ChartData {
  return helloFeedback();
}

function exec(modelName: string): ChartData | null {
  switch(modelName) {
    case "hello-feedback":
      return helloFeedback();
    case "cache-hit":
      return cacheHit();
    default:
      alert(`Unknown model: ${modelName}`);
      return null;
  }
}

function main() {
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
  engine = new Engine(graph, ctx, chart);
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
