import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {matchesMember} from '../public/assets/members.js';
const {renderMembers}=createRequire(import.meta.url)('./members.cjs');
test('empty wall contains six unnamed placeholders and no fake searchable people',()=>{
 const html=renderMembers({placeholderCount:6,members:[]});
 assert.equal((html.match(/class="member-card member-placeholder"/g)||[]).length,6);
 assert(!html.includes('data-member'));assert(!html.includes('<h3>'));assert(!html.includes('<img'));
 assert(!html.includes('member-tools'));assert(html.includes('不代表真实成员'));
});
test('actual profiles escape HTML, use optional local avatars and expose accessible filters',()=>{
 const html=renderMembers({placeholderCount:6,members:[{id:'test',name:'<test>',directions:['software'],bio:'"<&',url:'https://example.com/'}]});
 assert(html.includes('&lt;test&gt;'));assert(!html.includes('<test>'));assert(html.includes('aria-pressed="true"'));assert(html.includes('noopener noreferrer'));
 assert(!html.includes('member-placeholder'));assert(html.includes('data-member'));
});
test('member data rejects duplicate ids, unsafe links, unknown directions and paths',()=>{
 const base={id:'one',name:'Test',directions:['software']};
 for(const members of [[base,base],[{...base,url:'javascript:alert(1)'}],[{...base,avatar:'/assets/members/../private.png'}],[{...base,directions:['unknown']}],[{...base,name:''}]])assert.throws(()=>renderMembers({placeholderCount:6,members}));
});
test('search and direction filters combine, trim whitespace and match case-insensitively',()=>{
 assert(matchesMember('Alpha 软件','software systems',' ALPHA ','systems'));
 assert(!matchesMember('Alpha 软件','software systems','Alpha','hardware'));
 assert(!matchesMember('Alpha 软件','software','Beta','all'));
 assert(matchesMember('Alpha 软件','software','','all'));
});
