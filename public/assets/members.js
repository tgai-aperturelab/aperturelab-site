export function matchesMember(search,directions,query,filter){
  return (filter==='all'||directions.split(' ').includes(filter))&&search.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase());
}
export function initMembers(root){
  const tools=root?.querySelector('.member-tools');if(!tools)return;
  const cards=[...root.querySelectorAll('[data-member]')],buttons=[...tools.querySelectorAll('[data-filter]')],input=tools.querySelector('input');
  let filter='all';
  function update(){let visible=0;for(const card of cards){card.hidden=!matchesMember(card.dataset.search,card.dataset.directions,input.value,filter);if(!card.hidden)visible++;}tools.querySelector('.member-count').textContent=`显示 ${visible} 位成员`;root.querySelector('.member-empty').hidden=visible!==0;}
  buttons.forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;buttons.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update();}));
  input.addEventListener('input',update);tools.hidden=false;update();
}
