import { ChartDataSets, ChartData } from 'chart.js';
import { constantSetpoint, invert, defaultOutput, System, Block, DataRecorder, connect, loop, mix } from "../engine/System";
import { ProportionalBlock, IntegralController } from '../engine/Controller';

/**
 * Hello, feedback!
 *
 * From chapter 1.6
 */ 

class Buffer implements Block {
  private recorder: DataRecorder = new DataRecorder('pool size', 'rgba(255,0,0,0.5)');
  private pool:number = 0;
  private buffer: number = 0;
  step(at: number, dt: number, input: number): number {
    input = Math.max(0, input | 0);
    this.pool += input;
    this.pool = Math.min(50, Math.max(0, this.pool | 0));
    this.recorder.record(this.pool);
    // consume from pool
    const transfer = Math.round(Math.random() * this.pool);
    this.pool -= transfer;
    // consumed randomly
    this.buffer += transfer;
    const consumed = Math.round(Math.random() * 10);
    this.buffer -= consumed;
    this.buffer = Math.max(0, this.buffer | 0);
    // record
    return this.buffer;
  }
  get inspect(): ChartDataSets[] {
    return [this.recorder.intoDataSet()];
  }
}

export default function simpleFactory(pGain: number, iGain: number): ChartData {
  const input = constantSetpoint(50);
  const forward = (()=>{
    const controller = (()=>{
      if(iGain <= 0) {
        return new ProportionalBlock(pGain);
      }
      return mix(new ProportionalBlock(pGain), new IntegralController(iGain));
    })();
    const plant = new Buffer();
    return connect(controller, plant);
  })();
  const block = loop(forward, invert());
  const output = defaultOutput();
  const system = new System(input, block, output);
  return system.exec(1, 1000);
}
