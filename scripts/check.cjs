const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..','public');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
assert(!/\{\{\w+\}\}/.test(html),'Unrendered template variable');
assert(!/noindex/.test(html),'Production page should be indexable');
assert(!/<form\b/.test(html),'No data collection form expected');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(ids.length,new Set(ids).size,'Duplicate IDs');
for(const m of html.matchAll(/(?:src|srcset|href)="([^"]+)"/g)){
  const url=m[1];
  if(url.startsWith('#')) assert(ids.includes(url.slice(1)),'Missing anchor '+url);
  if(url.startsWith('/')) {
    const parsed=new URL(url,'https://local.test'),target=path.join(root,parsed.pathname.endsWith('/')?parsed.pathname+'index.html':parsed.pathname);
    assert(fs.existsSync(target),'Missing asset '+url);
    if(parsed.hash)assert(fs.readFileSync(target,'utf8').includes('id="'+parsed.hash.slice(1)+'"'),'Missing linked anchor '+url);
  }
}
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);entry.isDirectory()?walk(file):files.push(file);}}
walk(root);
for(const file of files.filter(f=>f.endsWith('.html')&&f!==path.join(root,'index.html'))){
 const page=fs.readFileSync(file,'utf8'),pageIds=[...page.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(pageIds.length,new Set(pageIds).size,'Duplicate page IDs');
 assert(!/\{\{\w+\}\}/.test(page),'Unrendered page template');
 for(const [,url] of page.matchAll(/(?:href|src)="([^"]+)"/g)){
  if(url.startsWith('#'))assert(pageIds.includes(url.slice(1)),'Missing page anchor '+url);
  if(url.startsWith('/')){const p=new URL(url,'https://local.test').pathname;assert(fs.existsSync(path.join(root,p.endsWith('/')?p+'index.html':p)),'Missing page resource '+url);}
 }
}
const allowed=new Set(['.html','.css','.js','.png','.webp','.svg','.ico','.txt','.xml']);
for(const file of files) assert(path.basename(file)==='_headers'||allowed.has(path.extname(file)),'Unexpected public file '+file);
const bytes=files.reduce((sum,p)=>sum+fs.statSync(p).size,0);
assert(bytes<1000000,'Entire public directory exceeds the 1 MB budget');
console.log(JSON.stringify({ok:true,files:files.length,publicBytes:bytes,internalLinksChecked:true,privateFilesExcluded:true},null,2));
