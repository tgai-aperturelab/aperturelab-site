import {BLADES,DRAW_ORDER,IRIS,irisGeometry} from './iris-geometry.js?v=logo-rigid-20261011';
export function createIrisRenderer(svg){
 const canvas=document.createElement('canvas');
 canvas.className='iris-canvas';canvas.setAttribute('aria-hidden','true');
 const ctx=canvas.getContext('2d',{alpha:true});if(!ctx)return ()=>{};
 const paths=BLADES.map(b=>new Path2D(b.path));svg.after(canvas);let progress=0,size=0;
 function draw(value){
 progress=value;
 const desired=Math.max(240,Math.ceil(svg.parentElement.clientWidth*Math.min(window.devicePixelRatio||1,2)));
 if(desired!==size){size=desired;canvas.width=size;canvas.height=size;}
 ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,size,size);
 const unit=size/600*IRIS.zoom;ctx.setTransform(unit,0,0,unit,size/2,size/2);
 ctx.save();ctx.beginPath();ctx.arc(0,0,IRIS.radius,0,Math.PI*2);ctx.clip();
 const pose=irisGeometry(value);
 for(const i of DRAW_ORDER){const m=pose.blades[i].matrix;ctx.save();ctx.transform(m.a,m.b,m.c,m.d,m.e,m.f);
 ctx.fillStyle='#ededed';ctx.fill(paths[i]);ctx.strokeStyle='#070707';ctx.lineWidth=1.3;ctx.stroke(paths[i]);ctx.restore();}
 ctx.restore();canvas.dataset.irisProgress=value.toFixed(4);canvas.dataset.renderer='logo-rigid-blades';
 svg.dataset.irisProgress=value.toFixed(4);svg.setAttribute('hidden','');
 }
 new ResizeObserver(()=>draw(progress)).observe(svg.parentElement);return draw;
}
