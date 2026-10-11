import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const sharp=require('sharp');
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('static brand preserves all source path geometry and appears as non-animated images',()=>{
  const paths=s=>[...s.matchAll(/\bd="([^"]+)"/g)].map(m=>m[1]);
  const source=paths(read('source-assets/valve-aperture-science-original.svg'));
  assert.equal(source.length,8);
  assert.deepEqual(paths(read('public/assets/aperture-logo.svg')),source);
  const html=read('public/index.html');
  assert.equal((html.match(/class="brand-mark"/g)||[]).length,2);
  assert.equal((html.match(/class="aperture-svg /g)||[]).length,1);
  assert(!read('public/assets/site.js').includes('.mini-aperture'));
});

test('favicon is a valid multi-size ICO and favo.ico is an identical alias',async()=>{
  const ico=fs.readFileSync(new URL('../public/favicon.ico',import.meta.url));
  assert(ico.equals(fs.readFileSync(new URL('../public/favo.ico',import.meta.url))));
  assert.equal(ico.readUInt16LE(0),0);assert.equal(ico.readUInt16LE(2),1);
  assert.equal(ico.readUInt16LE(4),6);
  for(let i=0;i<6;i++){
    const at=6+i*16,size=ico[at]||256,length=ico.readUInt32LE(at+8),offset=ico.readUInt32LE(at+12);
    const meta=await sharp(ico.subarray(offset,offset+length)).metadata();
    assert.equal(meta.width,size);assert.equal(meta.height,size);
    assert.equal(meta.hasAlpha,true,'Favicon must retain transparency');
    const {data,info}=await sharp(ico.subarray(offset,offset+length)).ensureAlpha().raw().toBuffer({resolveWithObject:true});
    const alpha=(x,y)=>data[(y*info.width+x)*info.channels+3];
    assert.equal(alpha(0,0),0,'Top-left background must be transparent');
    assert.equal(alpha(size-1,size-1),0,'Bottom-right background must be transparent');
    assert.equal(alpha(Math.floor(size/2),Math.floor(size/2)),0,'Central hole must be transparent');
  }
});
