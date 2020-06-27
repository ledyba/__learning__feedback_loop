import Chart, { ChartData, LinearTickOptions } from 'chart.js';
import { Engine} from './engine/Engine';
import helloFeedback from './cases/00HelloFeedback'
import simpleFactory from './cases/01SimpleFactory';
import { cacheHit, UniformDemand } from './cases/02CacheHit';

let engine: Engine | null;

function resize() {
  if(engine) {
    engine.onResize();
  }
}

function exec(modelName: string): ChartData | null {
  switch(modelName) {
    case '00: Hello, feedback control! (P gain=0.5, no delay)':
      return helloFeedback(0.5, 0, 50);
    case '00: Hello, feedback control! (P gain=1.5, no delay)':
      return helloFeedback(1.5, 0, 50);
    case '00: Hello, feedback control! (P gain=0.5, 3 steps delay)':
      return helloFeedback(0.5, 3, 100);
    case '00: Hello, feedback control! (P gain=1.5, 3 steps delay)':
      return helloFeedback(1.5, 3, 100);
    case '00: Hello, feedback control! (P gain=0.25, 3 steps delay)':
      return helloFeedback(0.25, 3, 100);
    case '01: Simple factory - undershoot':
      return simpleFactory(0.5, 0);
    case '01: Simple factory - overshoot':
      return simpleFactory(1.5, 0);
    case '01: Simple factory - with PI':
      return simpleFactory(0.2, 0.01);
    case '02: WebCache - UniformDemand':
      return cacheHit(new UniformDemand(100), 500, 1, 3);
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
      tooltips: {enabled: false},
      events: [],
      animation: {
        duration: 0
      },
      hover: {
        animationDuration: 0
      },
      responsiveAnimationDuration: 0,
      elements: {
        line: {
          tension: 0 // disables bezier curves
        },
        point: { radius: 0 }
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
  const opt = document.getElementById('exec-selecter')! as HTMLSelectElement;
  const data = exec(opt.selectedOptions[0].text);
  if(data != null) {
    engine?.updateData(data);
  }

}

function main() {
  engine = createEngine();
  window.addEventListener('resize', resize);
  const form = document.getElementById('exec-form')! as HTMLFormElement;
  const opt = document.getElementById('exec-selecter')! as HTMLSelectElement;
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
