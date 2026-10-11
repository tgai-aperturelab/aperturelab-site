const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
function derive(){
  const source=fs.readFileSync(path.join(root,'source-assets/valve-aperture-science-original.svg'),'utf8');
  const paths=[...source.matchAll(/\bd="([^"]+)"/g)].map(m=>m[1]);
  const center=[323.5,322.5],angle=28*Math.PI/180;
  function endpoints(d){
    const tokens=d.match(/[a-df-zA-DF-Z]|[-+]?(?:\d*\.)?\d+(?:[eE][-+]?\d+)?/g);
    let i=0,x=0,y=0,start,command;const out=[];
    while(i<tokens.length){
      if(/[a-z]/i.test(tokens[i]))command=tokens[i++];
      const C=command.toUpperCase(),relative=C!==command;
      if(C==='Z'){x=start[0];y=start[1];continue;}
      const count={M:2,L:2,C:6}[C];if(!count)throw new Error('Unsupported source command '+command);
      const a=tokens.slice(i,i+count).map(Number);i+=count;
      x=(relative?x:0)+a[count-2];y=(relative?y:0)+a[count-1];
      if(C==='M')start=[x,y];out.push([x-center[0],y-center[1]]);
    }
    if(Math.hypot(out[0][0]-out.at(-1)[0],out[0][1]-out.at(-1)[1])<.01)out.pop();
    return out;
  }
  const leaves=paths.map((sourcePath,id)=>{
    const vertices=endpoints(sourcePath);
    let k=0;vertices.forEach((v,i)=>{if(Math.hypot(...v)<Math.hypot(...vertices[k]))k=i;});
    const tip=vertices[k];let left=(k+vertices.length-1)%vertices.length,right=(k+1)%vertices.length;
    while(Math.hypot(...vertices[left])<290)left=(left+vertices.length-1)%vertices.length;
    while(Math.hypot(...vertices[right])<290)right=(right+1)%vertices.length;
    const corners=[vertices[left],vertices[right]];
    const points=[tip,...corners.map(p=>p.map((x,i)=>tip[i]+2.3*(x-tip[i])))];
    const cot=1/Math.tan(angle/2);
    return {id,tip,corners,points,pivot:[tip[0]/2+cot*tip[1]/2,tip[1]/2-cot*tip[0]/2],sourcePath};
  });
  const order=leaves.map((_,i)=>i).sort((a,b)=>Math.atan2(leaves[a].tip[1],leaves[a].tip[0])-Math.atan2(leaves[b].tip[1],leaves[b].tip[0]));
  return {center,leaves,order};
}
function write(){const data=derive();fs.writeFileSync(path.join(root,'public/assets/logo-leaves.js'),'// Blade tips and edge rays derived from the eight original Aperture Science paths.\nexport default '+JSON.stringify(data,null,2)+';\n');return data;}
if(require.main===module)write();
module.exports={derive,write};
