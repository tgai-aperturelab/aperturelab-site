import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../public/'+p,import.meta.url),'utf8');
test('home is an entry page and functional areas have independent second-level documents',()=>{
 const home=read('index.html');
 assert.equal((home.match(/<section\b/g)||[]).length,1);
 assert(!home.includes('data-project data-direction'));assert(!home.includes('member-placeholder'));
 for(const route of ['projects','members','resources','about','collaborate','contact']){
  const page=read(route+'/index.html');
  assert.equal((page.match(/<h1\b/g)||[]).length,1,route);
  assert(page.includes('href="https://aperturelab.space/'+route+'/"'));
  assert(!page.includes('class="aperture-control"'));
 }
 assert(read('projects/index.html').includes('https://github.com/tgai-aperturelab/aperturelab-site'));
 assert.equal((read('members/index.html').match(/class="member-card member-placeholder"/g)||[]).length,6);
 assert(read('contact/index.html').includes('tel:19164395693'));
});
