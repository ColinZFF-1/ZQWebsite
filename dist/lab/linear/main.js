(()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,K=['agent','tools','writing','marketing'];
const v=$('#v');let loaded=false;
function sel(i,play){$$('.it').forEach((b,k)=>{b.classList.toggle('sel',k===i);b.setAttribute('aria-selected',k===i)});const c=CAPS[i];
 $('#ck').textContent=c.kicker;$('#ctt').textContent=c.title;$('#cb').textContent=c.body;$('#ci').innerHTML=c.inc.map(s=>'<li>'+s+'</li>').join('');$('#cd').textContent=c.deliv;
 const x=$('#ctx');x.classList.remove('swap');void x.offsetWidth;x.classList.add('swap');v.poster='../../assets/scene-'+K[i]+'.webp';if(play||loaded){loaded=true;v.src='../../assets/videos/capability-'+K[i]+'.mp4';if(!reduce)v.play().catch(()=>{})}}
$$('.it').forEach((b,i)=>{b.addEventListener('click',()=>sel(i,true));b.addEventListener('keydown',e=>{if(e.key==='ArrowDown'){e.preventDefault();($$('.it')[i+1]||b).focus()}if(e.key==='ArrowUp'){e.preventDefault();($$('.it')[i-1]||b).focus()}})});
$$('[data-cap]').forEach(a=>a.addEventListener('click',()=>sel(+a.dataset.cap,true)));sel(0,false);
new IntersectionObserver(es=>{if(es[0].isIntersecting&&!loaded){sel($$('.it').findIndex(b=>b.classList.contains('sel')),true)}},{threshold:.3}).observe($('#caps'));
// active section in sidebar
const secs=$$('.sec');new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)$$('.snav a').forEach(a=>a.classList.toggle('on',a.dataset.s===x.target.id))}),{rootMargin:'-45% 0px -50% 0px'}).observe&&secs.forEach(s=>new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting)$$('.snav a').forEach(a=>a.classList.toggle('on',a.dataset.s===x.target.id))}),{rootMargin:'-45% 0px -50% 0px'}).observe(s));
// process: steps tick as section scrolls into view
const chk=$$('.chk');new IntersectionObserver(es=>{if(es[0].isIntersecting){chk.forEach((c,i)=>setTimeout(()=>c.classList.add('done'),reduce?0:i*140))}},{threshold:.4}).observe($('.checks'));
// copy + toast
const toast=m=>{const t=$('#toast');t.textContent=m;t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1800)};
$$('.copy').forEach(b=>b.addEventListener('click',()=>{const s=b.dataset.copy;(navigator.clipboard&&isSecureContext?navigator.clipboard.writeText(s):Promise.reject()).catch(()=>{const t=document.createElement('textarea');t.value=s;document.body.appendChild(t);t.select();try{document.execCommand('copy')}catch(e){}t.remove()}).finally(()=>toast('已复制 '+s))}));
// command palette
const P=[['概览','#overview'],['能力','#caps'],...CAPS.map((c,i)=>[c.title,'#caps',i]),['案例','#cases'],['合作流程','#process'],['联系','#contact']];
const pal=$('#pal'),pin=$('#pin'),pls=$('#pls');let idx=0,cur=P;
function render(){cur=P.filter(p=>p[0].includes(pin.value.trim()));idx=Math.min(idx,Math.max(0,cur.length-1));pls.innerHTML=cur.map((p,i)=>'<li class="'+(i===idx?'on':'')+'" data-i="'+i+'">'+p[0]+'</li>').join('')}
function open(){pal.hidden=false;pin.value='';idx=0;render();pin.focus()}function close(){pal.hidden=true}
function go(p){close();if(p[2]!=null)sel(p[2],true);document.querySelector(p[1]).scrollIntoView({behavior:reduce?'auto':'smooth'})}
$('#kbtn').addEventListener('click',open);addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();pal.hidden?open():close()}else if(!pal.hidden){if(e.key==='Escape')close();if(e.key==='ArrowDown'){idx=Math.min(cur.length-1,idx+1);render()}if(e.key==='ArrowUp'){idx=Math.max(0,idx-1);render()}if(e.key==='Enter'&&cur[idx])go(cur[idx])}});
pin.addEventListener('input',()=>{idx=0;render()});pls.addEventListener('click',e=>{const l=e.target.closest('li');if(l)go(cur[+l.dataset.i])});pal.addEventListener('click',e=>{if(e.target===pal)close()});})();