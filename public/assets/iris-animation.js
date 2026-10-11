import {createIrisRenderer} from './iris-renderer.js?v=logo-rigid-20261011';

// Exactly one frame loop owns the complete iris. Reversals start at the last
// drawn pose; neither a CSS transition nor an SVG mask runs in parallel.
export function createIrisMotion(draw,{request=requestAnimationFrame,cancel=cancelAnimationFrame,now=()=>performance.now(),reduced=false}={}){
  let value=0,target=0,from=0,start=0,duration=0,frame=0,disposed=false;
  const paint=value=>draw(value);
  function tick(time){
    frame=0;
    const t=Math.min(1,Math.max(0,(time-start)/duration));
    const eased=t*t*(3-2*t);
    value=from+(target-from)*eased;
    paint(value);
    if(t<1)frame=request(tick);
  }
  function finish(){
    if(frame)cancel(frame);
    frame=0;value=target;paint(value);
  }
  paint(0);
  return {
    setActive(active){
      if(disposed)return;
      const next=active?1:0;
      if(next===target)return;
      if(frame)cancel(frame);
      frame=0;target=next;
      if(target===value){finish();return;}
      if(reduced){finish();return;}
      from=value;start=now();duration=Math.max(100,680*Math.abs(target-from));
      frame=request(tick);
    },
    setReduced(value){reduced=value;if(reduced)finish();},
    finish,
    dispose(){disposed=true;if(frame)cancel(frame);frame=0;}
  };
}

export function initIrisAnimator(svg){
  if(!svg)return {setActive(){}};
  const media=window.matchMedia('(prefers-reduced-motion: reduce)');
  const motion=createIrisMotion(createIrisRenderer(svg),{reduced:media.matches});
  media.addEventListener('change',event=>motion.setReduced(event.matches));
  document.addEventListener('visibilitychange',()=>{if(document.hidden)motion.finish();});
  return motion;
}
