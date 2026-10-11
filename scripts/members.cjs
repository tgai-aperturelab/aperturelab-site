const fs=require('node:fs');
const path=require('node:path');
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const directions={software:'软件与人工智能',hardware:'机器人与电子制作',systems:'网络与系统'};
function renderMembers(data,publicRoot){
  if(!Array.isArray(data.members)||!Number.isInteger(data.placeholderCount)||data.placeholderCount<0||data.placeholderCount>12)throw new Error('Invalid members data');
  const ids=new Set();
  for(const m of data.members){
    if(!/^[a-z0-9-]+$/.test(m.id)||ids.has(m.id))throw new Error('Invalid or duplicate member id');ids.add(m.id);
    if(typeof m.name!=='string'||!m.name.trim()||m.name.length>40)throw new Error('Member needs a display name');
    if(!Array.isArray(m.directions)||m.directions.some(d=>!directions[d]))throw new Error('Unknown member direction');
    for(const key of ['role','bio','avatar','url'])if(m[key]!=null&&typeof m[key]!=='string')throw new Error('Invalid member '+key);
    if(m.url){const u=new URL(m.url);if(u.protocol!=='https:'||u.username||u.password)throw new Error('Member links must use HTTPS');}
    if(m.avatar){
      if(!/^\/assets\/members\/[a-zA-Z0-9_-]+\.(webp|png)$/.test(m.avatar))throw new Error('Use a local PNG/WebP member avatar');
      if(publicRoot&&!fs.existsSync(path.join(publicRoot,m.avatar)))throw new Error('Missing member avatar');
    }
  }
  if(!data.members.length)return `<div class="member-grid" aria-label="成员墙空白展示位">${Array.from({length:data.placeholderCount},(_,i)=>`<article class="member-card member-placeholder" aria-label="空白展示位 ${i+1}"><div class="member-portrait" aria-hidden="true"><span class="placeholder-emblem emblem-${i%3}"></span><span class="placeholder-index mono">${String(i+1).padStart(2,'0')}</span></div><div class="member-info" aria-hidden="true"><span class="skeleton-line"></span><span class="skeleton-line short"></span></div></article>`).join('')}</div><p class="section-footnote">以上为空白展示位，不代表真实成员。</p>`;
  const cards=data.members.map(m=>`<article class="member-card" data-member data-directions="${escape(m.directions.join(' '))}" data-search="${escape([m.name,m.role,m.bio,...m.directions.map(d=>directions[d])].filter(Boolean).join(' '))}"><div class="member-portrait">${m.avatar?`<img src="${escape(m.avatar)}" alt="" width="480" height="480" loading="lazy">`:`<span class="member-initial" aria-hidden="true">${escape([...m.name][0])}</span>`}</div><div class="member-info"><h3>${escape(m.name)}</h3>${m.role?`<p class="member-role">${escape(m.role)}</p>`:''}${m.bio?`<p>${escape(m.bio)}</p>`:''}<div class="tags">${m.directions.map(d=>`<span>${directions[d]}</span>`).join('')}</div>${m.url?`<a class="inline-link" href="${escape(m.url)}" target="_blank" rel="noopener noreferrer">个人主页 ↗<span class="sr-only">：${escape(m.name)}</span></a>`:''}</div></article>`).join('');
  return `<div class="member-tools" hidden><div class="member-filters" role="group" aria-label="按方向筛选成员"><button type="button" data-filter="all" aria-pressed="true">全部</button>${Object.entries(directions).map(([id,label])=>`<button type="button" data-filter="${id}" aria-pressed="false">${label}</button>`).join('')}</div><label class="member-search">搜索成员<input type="search" maxlength="100" placeholder="姓名、方向或关键词" autocomplete="off"></label><p class="member-count" role="status" aria-live="polite"></p></div><div class="member-grid">${cards}</div><p class="member-empty" hidden>没有匹配的成员。试试其他关键词或方向。</p>`;
}
module.exports={renderMembers};
