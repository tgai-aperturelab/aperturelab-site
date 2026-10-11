import test from 'node:test';
import assert from 'node:assert/strict';
import {BLADES,irisGeometry,transformPoint} from '../public/assets/iris-geometry.js';
test('eight logo-derived pointed leaves retain their shape and fixed pivots throughout motion',()=>{
 assert.equal(BLADES.length,8);
 const before=JSON.stringify(BLADES);
 for(let n=0;n<=240;n++)for(const b of irisGeometry(n/240).blades){
  const m=b.matrix,p=transformPoint(m,b.pivot);
  assert(Math.hypot(p.x-b.pivot[0],p.y-b.pivot[1])<1e-9);
  assert(Math.abs(m.a*m.d-m.b*m.c-1)<1e-12);
  assert.equal(b.points.length,3);assert(!/[ACQ]/.test(b.path));
  for(let i=0;i<3;i++)for(let j=i+1;j<3;j++){
   const a=transformPoint(m,b.points[i]),c=transformPoint(m,b.points[j]);
   assert(Math.abs(Math.hypot(a.x-c.x,a.y-c.y)-Math.hypot(b.points[i][0]-b.points[j][0],b.points[i][1]-b.points[j][1]))<1e-9);
  }
 }
 assert.equal(JSON.stringify(BLADES),before);
});
test('rest pose uses logo tips and straight edge rays; tips travel inward continuously',()=>{
 for(let i=0;i<8;i++){
  const leaf=BLADES[i];assert.deepEqual(leaf.points[0],leaf.tip);
  for(let j=0;j<2;j++){
   const a=leaf.corners[j],b=leaf.points[j+1],t=leaf.tip;
   assert(Math.abs((a[0]-t[0])*(b[1]-t[1])-(a[1]-t[1])*(b[0]-t[0]))<1e-8);
  }
  let last=Infinity;
  for(let n=0;n<=240;n++){
   const p=transformPoint(irisGeometry(n/240).blades[i].matrix,leaf.tip),r=Math.hypot(p.x,p.y);
   assert(r<last);last=r;
  }
 }
});
