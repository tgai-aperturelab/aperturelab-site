import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {matchesProject} from '../public/assets/projects.js';
const {renderProjects}=createRequire(import.meta.url)('./projects.cjs');
const p={id:'website',title:'官网',summary:'HTML 开发',direction:'software',status:'maintaining',tags:['CSS'],links:[{label:'文档',url:'/docs/'}]};
test('projects render actual data and reject invalid direction, state and script links',()=>{
 const html=renderProjects([p]);assert(html.includes('data-project'));assert(html.includes('持续维护'));assert(html.includes('/docs/'));
 assert.throws(()=>renderProjects([p,p]));assert.throws(()=>renderProjects([{...p,direction:'fake'}]));assert.throws(()=>renderProjects([{...p,status:'fake'}]));assert.throws(()=>renderProjects([{...p,links:[{label:'X',url:'javascript:alert(1)'}]}]));
 assert(!renderProjects([{...p,title:'<script>'}]).includes('<script>'));
});
test('empty project directory is honest and project query combines text and direction',()=>{
 assert(renderProjects([]).includes('暂无匹配'));assert(!renderProjects([]).includes('data-project'));
 assert(matchesProject('官网 HTML CSS','software',' html ','all'));
 assert(!matchesProject('官网 HTML CSS','software','html','hardware'));
 assert(!matchesProject('官网 HTML CSS','software','robot','all'));
});
