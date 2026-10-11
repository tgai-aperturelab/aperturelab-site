import data from './logo-leaves.js';
export const BLADES=Object.freeze(data.leaves.map(b=>Object.freeze({...b,points:Object.freeze(b.points.map(Object.freeze)),pivot:Object.freeze(b.pivot),path:'M'+b.points.map(p=>p.join(' ')).join(' L')+' Z'})));
export const DRAW_ORDER=Object.freeze(data.order);
export const IRIS=Object.freeze({radius:313,maxAngle:25.2,zoom:.78});
export const transformPoint=(m,p)=>({x:m.a*p[0]+m.c*p[1]+m.e,y:m.b*p[0]+m.d*p[1]+m.f});
// Logo-derived rigid bodies, not manufacturing CAD. All vertices stay fixed.
export function irisGeometry(progress=0){
 const theta=Math.max(0,Math.min(1,progress))*IRIS.maxAngle*Math.PI/180,c=Math.cos(theta),s=Math.sin(theta);
 return {blades:BLADES.map(b=>{const [x,y]=b.pivot;return {...b,matrix:{a:c,b:s,c:-s,d:c,e:x-c*x+s*y,f:y-s*x-c*y}};}),hingeAngle:theta};
}
