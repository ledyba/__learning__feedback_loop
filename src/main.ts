import Chart, { ChartData, LinearTickOptions } from 'chart.js';
import { Engine} from './engine/Engine';
import helloFeedback from './cases/00HelloFeedback'
import simpleFactory from './cases/01SimpleFactory';
import { cacheHit, UniformDemand, PowerLawDemand } from './cases/02CacheHit';

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
    case '02: WebCache - PowerLawDemand':
      return cacheHit(new PowerLawDemand(100, 1.5), 500, 1, 3);
    default:
      alert(`Unknown model: ${modelName}`);
      return null;
  }
}

function createEngine(): Engine {
  return new Engine(document.getElementById('graph')! as HTMLCanvasElement);
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
  window.addEventListener('keypress', (ev)=>{
    if(ev.key === 'Enter') {
      window.requestAnimationFrame(run);
    }
  });
  opt.addEventListener('keypress', (ev)=>{
    if(ev.key === 'Enter') {
      window.requestAnimationFrame(run);
      ev.preventDefault();
    }
  });
  
  window.addEventListener('keydown', (ev)=>{
    switch(ev.key) {
      case 'ArrowDown':
        opt.selectedIndex = (opt.selectedIndex + 1) % opt.options.length;
        ev.preventDefault();
        break;
      case 'ArrowUp':
        opt.selectedIndex = (opt.selectedIndex + opt.options.length - 1) % opt.options.length;
        ev.preventDefault();
        break;
    }
  });
  form.addEventListener('submit', (ev) => {
    ev.preventDefault();
    window.requestAnimationFrame(run);
    return false;
  });
}

document.addEventListener('DOMContentLoaded', main);
