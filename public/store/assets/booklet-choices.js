(()=>{
 const root=document.querySelector('#booklet-choices');if(!root)return;
 const tabs=[...root.querySelectorAll('[data-choice-tab]')];
 function select(button){tabs.forEach((tab,i)=>{const active=tab===button;tab.setAttribute('aria-selected',String(active));tab.tabIndex=active?0:-1;root.querySelector('#choice-panel-'+i).hidden=!active;});}
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',()=>select(tab));
  tab.addEventListener('keydown',event=>{
   let next;
   if(event.key==='ArrowRight')next=(i+1)%tabs.length;
   if(event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
   if(event.key==='Home')next=0;
   if(event.key==='End')next=tabs.length-1;
   if(next!==undefined){event.preventDefault();select(tabs[next]);tabs[next].focus();}
  });
 });
})();
