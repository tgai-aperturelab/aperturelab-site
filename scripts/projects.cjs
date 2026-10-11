const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const directions={software:'软件与人工智能',hardware:'机器人与电子制作',systems:'网络与系统'};
const statuses={developing:'开发中',maintaining:'持续维护',archived:'已归档'};
function renderProjects(projects){
 if(!Array.isArray(projects))throw new Error('Projects must be an array');
 const ids=new Set();
 for(const p of projects){
  if(!/^[a-z0-9-]+$/.test(p.id)||ids.has(p.id)||!directions[p.direction]||!statuses[p.status])throw new Error('Invalid project metadata');ids.add(p.id);
  if(typeof p.title!=='string'||!p.title.trim()||typeof p.summary!=='string'||!Array.isArray(p.tags)||p.tags.some(t=>typeof t!=='string')||!Array.isArray(p.links))throw new Error('Invalid project content');
  for(const l of p.links)if(typeof l.label!=='string'||typeof l.url!=='string'||!(/^(https:\/\/[^\s]+|\/(?!\/)[a-zA-Z0-9/_-]*|#[a-zA-Z0-9_-]+)$/.test(l.url)))throw new Error('Invalid project link');
 }
 const tools=`<div class="project-tools" hidden><div class="project-filters" role="group" aria-label="按方向筛选项目"><button type="button" data-project-filter="all" aria-pressed="true">全部</button>${Object.entries(directions).map(([key,label])=>`<button type="button" data-project-filter="${key}" aria-pressed="false">${label}</button>`).join('')}</div><label class="project-search"><span class="sr-only">搜索项目</span><input type="search" placeholder="搜索项目或技术" maxlength="100"></label><p class="project-count" role="status" aria-live="polite"></p></div>`;
 const cards=projects.map(p=>`<article class="project-card" data-project data-direction="${p.direction}" data-search="${escape([p.title,p.summary,...p.tags].join(' '))}"><div class="project-card-top"><span class="mono">${escape(p.id.toUpperCase())}</span><span class="project-status">${statuses[p.status]}</span></div><h3>${escape(p.title)}</h3><p>${escape(p.summary)}</p><div class="tags">${p.tags.map(t=>`<span>${escape(t)}</span>`).join('')}</div><div class="project-links">${p.links.map(l=>`<a href="${escape(l.url)}"${l.url.startsWith('https:')?' target="_blank" rel="noopener noreferrer"':''}>${escape(l.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div></article>`).join('');
 return (projects.length?tools:'')+`<div class="project-grid">${cards}</div><p class="project-empty"${projects.length?' hidden':''}>暂无匹配的公开项目。你可以调整筛选，或通过下方协作入口提出新项目。</p>`;
}
module.exports={renderProjects};
