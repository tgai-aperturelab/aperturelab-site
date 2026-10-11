const {irisGeometry,DRAW_ORDER,IRIS}=require('../public/assets/iris-geometry.js');
let count=0;
function apertureSvg(className='',options={}){
 const g=irisGeometry(options.progress??0),id='logo-iris-'+(++count);
 const blades=DRAW_ORDER.map(i=>{const b=g.blades[i],m=b.matrix;return '<path class="iris-blade" d="'+b.path+'" transform="matrix('+[m.a,m.b,m.c,m.d,m.e,m.f].join(' ')+')" fill="#ededed" stroke="#070707" stroke-width="1.3"/>';}).join('');
 return '<svg xmlns="http://www.w3.org/2000/svg" class="aperture-svg '+className+'" viewBox="0 0 600 600" aria-hidden="true"><defs><clipPath id="'+id+'"><circle r="'+IRIS.radius+'"/></clipPath></defs><g transform="translate(300 300) scale('+IRIS.zoom+')"><g clip-path="url(#'+id+')">'+blades+'</g></g></svg>';
}
module.exports={apertureSvg};
