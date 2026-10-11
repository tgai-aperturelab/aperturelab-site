import test from 'node:test';
import assert from 'node:assert/strict';
import {createIrisMotion} from '../public/assets/iris-animation.js';

function fixture(){
  let time=0,id=0;const queue=new Map(),poses=[];
  const motion=createIrisMotion(p=>poses.push(p),{request:fn=>{queue.set(++id,fn);return id;},cancel:key=>queue.delete(key),now:()=>time});
  const step=delta=>{time+=delta;const callbacks=[...queue.values()];queue.clear();for(const fn of callbacks)fn(time);};
  return {motion,poses,queue,step};
}

test('rapid hover reversals retain the last pose and never create competing frame loops',()=>{
  const f=fixture();
  for(let n=0;n<40;n++){
    const before=f.poses.at(-1);f.motion.setActive(n%2===0);
    assert.equal(f.poses.at(-1),before);
    assert(f.queue.size<=1);
    f.step(16);
    assert(Math.abs(f.poses.at(-1)-before)<.02,'Reversal jumped to a different pose');
  }
  f.motion.setActive(true);f.step(1000);
  assert.equal(f.poses.at(-1),1);assert.equal(f.queue.size,0);
  f.motion.setActive(false);f.step(1000);
  assert.equal(f.poses.at(-1),0);assert.equal(f.queue.size,0);
});

test('reduced motion and background completion leave no running animation',()=>{
  const f=fixture();f.motion.setActive(true);f.step(150);
  f.motion.setReduced(true);assert.equal(f.poses.at(-1),1);assert.equal(f.queue.size,0);
  f.motion.setActive(false);assert.equal(f.poses.at(-1),0);assert.equal(f.queue.size,0);
  f.motion.setReduced(false);f.motion.setActive(true);f.step(80);f.motion.finish();
  assert.equal(f.poses.at(-1),1);assert.equal(f.queue.size,0);
});
