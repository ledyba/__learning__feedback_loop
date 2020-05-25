import Chart from 'chart.js';
import { Engine} from './engine/Engine';

let engine: Engine | null;

function resize() {
  if(engine) {
    engine.onResize();
  }
}

function exec(modelName: string) {
  switch(modelName) {
    case "cache-hit":
      console.log(modelName);
      break;
  }
}

function main() {
  const graph = document.getElementById('graph')! as HTMLCanvasElement;
  const ctx: CanvasRenderingContext2D = graph.getContext('2d')!;
  const chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6],
      datasets: [{
        borderColor: 'rgba(0, 0, 0, 0.5)',
        fill: false,
        label: 'test',
        data: [12, 19, 3, 5, 2, 3],
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
  engine = new Engine(graph, ctx, chart);
  window.addEventListener('resize', resize);
  document.getElementById('exec-button')!.addEventListener('click', (ev) => {
    const opt = document.getElementById('exec-selecter') as HTMLSelectElement;
    exec(opt.value);
  });
}

document.addEventListener('DOMContentLoaded', main);
