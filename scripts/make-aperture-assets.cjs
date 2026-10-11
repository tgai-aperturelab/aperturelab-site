const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const {apertureSvg} = require('./aperture.cjs');
const root = path.resolve(__dirname,'..');
function iris(progress=0) { return apertureSvg('',{progress}); }
function icon(width,progress=0) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${width}" viewBox="0 0 600 600"><rect width="600" height="600" fill="#070707"/>${iris(progress)}</svg>`;
}
async function main() {
  fs.mkdirSync(path.join(root,'reports'),{recursive:true});
  const assets=path.join(root,'public/assets');
  const logo=fs.readFileSync(path.join(assets,'aperture-logo.svg'));
  const darkLogo=Buffer.from(logo.toString().replaceAll('#ffffff','#171717'));
  const adaptive=darkLogo.toString().replace('</svg>','<style>@media(prefers-color-scheme:dark){path{fill:#ffffff}}</style></svg>');
  fs.writeFileSync(path.join(assets,'favicon.svg'),adaptive);
  for(const [name,size] of [['favicon.png',64],['apple-touch-icon.png',180],['aperture-logo.png',160]]) await sharp(name==='favicon.png'?darkLogo:logo).resize(size,size).png().toFile(path.join(assets,name));
  const sizes=[16,32,48,64,128,256];
  const pngs=await Promise.all(sizes.map(size=>sharp(darkLogo).resize(size,size).ensureAlpha().png().toBuffer()));
  const directory=Buffer.alloc(6+16*sizes.length);
  directory.writeUInt16LE(1,2);directory.writeUInt16LE(sizes.length,4);
  let offset=directory.length;
  sizes.forEach((size,i)=>{const at=6+16*i;directory[at]=size===256?0:size;directory[at+1]=size===256?0:size;directory.writeUInt16LE(1,at+4);directory.writeUInt16LE(32,at+6);directory.writeUInt32LE(pngs[i].length,at+8);directory.writeUInt32LE(offset,at+12);offset+=pngs[i].length;});
  const ico=Buffer.concat([directory,...pngs]);
  fs.writeFileSync(path.join(root,'public/favicon.ico'),ico);
  fs.writeFileSync(path.join(root,'public/favo.ico'),ico);
  const cover=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630"><rect width="1200" height="630" fill="#070707"/><path d="M60 60H1140M60 565H1140" stroke="#303030"/><text x="68" y="133" font-family="Arial" font-size="15" letter-spacing="4" fill="#999">CURIOSITY. COLLABORATION. CREATION.</text><text x="62" y="289" font-family="Arial" font-size="86" letter-spacing="-5" font-weight="600" fill="#eee">APERTURE</text><text x="62" y="389" font-family="Arial" font-size="86" letter-spacing="-5" font-weight="600" fill="#eee">LAB.</text><text x="68" y="522" font-family="Arial" font-size="17" letter-spacing="2" fill="#999">aperturelab.space</text><image x="650" y="92" width="440" height="440" href="data:image/svg+xml;base64,${logo.toString('base64')}"/></svg>`;
  await sharp(Buffer.from(cover)).webp({quality:90}).toFile(path.join(assets,'aperture-social.webp'));
  await sharp(Buffer.from(icon(600))).png().toFile(path.join(root,'reports/aperture-open.png'));
  await sharp(Buffer.from(icon(600,1))).png().toFile(path.join(root,'reports/aperture-focused.png'));
  const stages=[0,.25,.5,.75,1];
  const previews=await Promise.all(stages.map(async(progress,i)=>({input:await sharp(Buffer.from(icon(360,progress))).png().toBuffer(),left:i*360,top:35})));
  const labels=`<svg width="1800" height="400"><rect width="1800" height="400" fill="#070707"/>${stages.map((p,i)=>`<text x="${i*360+180}" y="27" text-anchor="middle" font-family="Arial" font-size="14" fill="#aaa">${p===0?'OPEN':p===1?'STOPPED DOWN':`${Math.round(p*100)}%`}</text>`).join('')}</svg>`;
  await sharp(Buffer.from(labels)).composite(previews).png().toFile(path.join(root,'reports/iris-motion-stages.png'));
  console.log('Generated monochrome vector-based identity assets and animation reference frames.');
}
main().catch(e=>{console.error(e.message);process.exitCode=1;});
