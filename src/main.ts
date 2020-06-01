import Chart, { ChartData, LinearTickOptions } from 'chart.js';
import { Engine} from './engine/Engine';
import helloFeedback from './cases/00HelloFeedback'
import simpleFactory from './cases/01SimpleFactory';

let engine: Engine | null;

function resize() {
  if(engine) {
    engine.onResize();
  }
}

function exec(modelName: string): ChartData | null {
  switch(modelName) {
    case "00-hello-feedback (P gain=0.5, no delay)":
      return helloFeedback(0.5, 0, 50);
    case "00-hello-feedback (P gain=1.5, no delay)":
      return helloFeedback(1.5, 0, 50);
    case "00-hello-feedback (P gain=0.5, 3 steps delay)":
      return helloFeedback(0.5, 3, 100);
    case "00-hello-feedback (P gain=1.5, 3 steps delay)":
      return helloFeedback(1.5, 3, 100);
    case "00-hello-feedback (P gain=0.25, 3 steps delay)":
      return helloFeedback(0.25, 3, 100);
    case "01-simple-factory-undershoot":
      return simpleFactory(0.5);
    case "01-simple-factory-overshoot":
      return simpleFactory(1.5);
    default:
      alert(`Unknown model: ${modelName}`);
      return null;
  }
}

function createEngine(): Engine {
  const graph = document.getElementById('graph')! as HTMLCanvasElement;
  const chart = new Chart(graph, {
    type: 'line',
    data: {},
    options: {
      animation: {
        duration: 0
      },
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
  return new Engine(graph, chart);
}

function run() {
  const opt = document.getElementById('exec-selecter')! as HTMLFormElement;
  const data = exec(opt.value);
  if(data != null) {
    engine?.updateData(data);
  }

}

function main() {
  engine = createEngine();
  window.addEventListener('resize', resize);
  const form = document.getElementById('exec-form')! as HTMLFormElement;
  const opt = document.getElementById('exec-selecter')! as HTMLFormElement;
  opt.addEventListener('keypress', (ev)=>{
    if(ev.key === 'Enter') {
      window.requestAnimationFrame(run);
    }
  });
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    window.requestAnimationFrame(run);
    return false;
  });
  window.requestAnimationFrame(() => {
    opt.focus();
  });
}

document.addEventListener('DOMContentLoaded', main);
