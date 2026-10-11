export function matchesProject(search,direction,query,filter){return (filter==='all'||direction===filter)&&search.toLowerCase().includes(query.trim().toLowerCase());}
export function initProjects(root){
 const tools=root?.querySelector('.project-tools');if(!tools)return;
 const cards=[...root.querySelectorAll('[data-project]')],buttons=[...tools.querySelectorAll('[data-project-filter]')],input=tools.querySelector('input');let filter='all';
 function update(){let count=0;for(const card of cards){card.hidden=!matchesProject(card.dataset.search,card.dataset.direction,input.value,filter);if(!card.hidden)count++;}tools.querySelector('.project-count').textContent=`${count} 个公开项目`;root.querySelector('.project-empty').hidden=count>0;}
 buttons.forEach(b=>b.addEventListener('click',()=>{filter=b.dataset.projectFilter;buttons.forEach(x=>x.setAttribute('aria-pressed',String(x===b)));update();}));input.addEventListener('input',update);tools.hidden=false;update();
}
