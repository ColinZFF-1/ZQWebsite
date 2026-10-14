(()=>{const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)],reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
// 5x7 dot-matrix glyphs
const G={Z:["11111","00001","00010","00100","01000","10000","11111"],H:["10001","10001","10001","11111","10001","10001","10001"],A:["01110","10001","10001","11111","10001","10001","10001"],O:["01110","10001","10001","10001","10001","10001","01110"],Q:["01110","10001","10001","10001","10101","10010","01101"],I:["11111","00100","00100","00100","00100","00100","11111"],
"0":["01110","10001","10011","10101","11001","10001","01110"],"1":["00100","01100","00100","00100","00100","00100","01110"],"2":["01110","10001","00001","00010","00100","01000","11111"],"3":["11110","00001","00001","01110","00001","00001","11110"],"4":["00010","00110","01010","10010","11111","00010","00010"],"5":["11111","10000","11110","00001","00001","10001","01110"],"6":["00110","01000","10000","11110","10001","10001","01110"],"7":["11111","00001","00010","00100","01000","01000","01000"],"8":["01110","10001","10001","01110","10001","10001","01110"],"9":["01110","10001","10001","01111","00001","00010","01100"],
"+":["00000","00100","00100","11111","00100","00100","00000"],"%":["11000","11001","00010","00100","01000","10011","00011"],".":["00000","00000","00000","00000","00000","01100","01100"]};
function draw(cv,progress){const t=cv.dataset.text,dpr=Math.min(2,devicePixelRatio||1),W=cv.clientWidth,H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;const x=cv.getContext('2d');x.scale(dpr,dpr);
 const cols=t.length*6-1,cell=Math.min(W/cols,H/7),r=cell*.36;let n=0,lit=Math.floor(progress*999);
 for(let ci=0;ci<t.length;ci++){const g=G[t[ci]]||G['0'];for(let y=0;y<7;y++)for(let xx=0;xx<5;xx++){const on=g[y][xx]==='1';const px=(ci*6+xx)*cell+cell/2,py=y*cell+cell/2;
  x.beginPath();x.arc(px,py,r,0,7);x.fillStyle=on?(n++<lit?'#f2f2ef':'#2a2a2a'):'#161616';x.fill();}}
 return n;}
const dms=[$('#word'),...$$('.dm')];
function boot(cv){if(reduce){draw(cv,1);return}const t0=performance.now();(function f(t){const p=Math.min(1,(t-t0)/900);draw(cv,p);if(p<1)requestAnimationFrame(f)})(t0);}
const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){boot(x.target);io.unobserve(x.target)}}),{threshold:.4});dms.forEach(d=>io.observe(d));
addEventListener('resize',()=>dms.forEach(d=>draw(d,1)));
// capability selector -> screen
const cv=$('#cv'),K=['agent','tools','writing','marketing'];
function sel(i){const c=CAPS[i];$$('.slot').forEach((s,k)=>{s.classList.toggle('sel',k===i);s.setAttribute('aria-pressed',k===i)});
 const ro=$('.readout');ro.classList.remove('swap');void ro.offsetWidth;ro.classList.add('swap');
 $('#ct').textContent=c.title;$('#cb').textContent=c.body;$('#ci').innerHTML=c.inc.map(s=>'<li>'+s+'</li>').join('');$('#cd').textContent=c.deliv;
 cv.poster='../../assets/scene-'+K[i]+'.webp';cv.src='../../assets/videos/capability-'+K[i]+'.mp4';if(!reduce)cv.play().catch(()=>{});}
$$('.slot').forEach((s,i)=>s.addEventListener('click',()=>sel(i)));
// lazy: only load video when panel visible
let first=true;new IntersectionObserver(es=>{if(es[0].isIntersecting&&first){first=false;sel(0)}},{threshold:.2}).observe($('#caps'));
$('#ct').textContent=CAPS[0].title;$('#cb').textContent=CAPS[0].body;$('#ci').innerHTML=CAPS[0].inc.map(s=>'<li>'+s+'</li>').join('');$('#cd').textContent=CAPS[0].deliv;
// process keys -> LCD
function step(i){$$('.key').forEach((k,j)=>k.classList.toggle('on',j===i));$('#pn').textContent='STEP '+(i+1)+' / 6';$('#pt').textContent=STEPS[i][0];$('#pd').textContent=STEPS[i][1];}
$$('.key').forEach((k,i)=>k.addEventListener('click',()=>step(i)));step(0);})();