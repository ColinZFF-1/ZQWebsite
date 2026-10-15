(()=>{const t=document.getElementById('toast');document.querySelectorAll('[data-copy]').forEach(b=>b.addEventListener('click',()=>{const s=b.dataset.copy;const done=()=>{if(!t)return;t.textContent='微信号已复制';t.classList.add('show');clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1800)};const fb=()=>{const a=document.createElement('textarea');a.value=s;document.body.appendChild(a);a.select();try{document.execCommand('copy')}catch(e){}a.remove();done()};if(navigator.clipboard&&isSecureContext)navigator.clipboard.writeText(s).then(done,fb);else fb()}))})();
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;(()=>{const cv=document.getElementById('gen'),x=cv.getContext('2d');let W,H,dpr;
const st={cap:-1,step:-1,cases:0,t:0};
function rs(){dpr=Math.min(2,devicePixelRatio||1);W=cv.clientWidth;H=cv.clientHeight;cv.width=W*dpr;cv.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0)}rs();addEventListener('resize',()=>{rs();if(reduce)draw()});
// deterministic seed from the company name: same system every load
let sd=[...'昭桥连接AI与真实业务场景'].reduce((a,ch)=>(a*31+ch.charCodeAt(0))>>>0,7);const rnd=()=>(sd=(sd*1664525+1013904223)>>>0)/4294967296;
const caps=[0,1,2,3].map(i=>({a:-Math.PI/2+i*Math.PI/2+(rnd()-.5)*.5,r:.30+rnd()*.06,ph:rnd()*6})),steps=[0,1,2,3,4,5].map(i=>({a:-Math.PI/2+i*Math.PI/3,ph:rnd()*6})),cases=[0,1,2,3].map(i=>({a:caps[i].a+(rnd()-.5)*.9,ph:rnd()*6}));
function P(a,r,ph,amp){const R=Math.min(W,H);return[W/2+Math.cos(a)*R*r+Math.sin(st.t*.6+ph)*amp,H/2+Math.sin(a)*R*r+Math.cos(st.t*.5+ph)*amp]}
function draw(){x.clearRect(0,0,W,H);const R=Math.min(W,H),amp=reduce?0:R*.008;const hub=[W/2,H/2];
 const sp=steps.map(s=>P(s.a,.44,s.ph,amp));x.lineWidth=1.2;
 for(let i=0;i<6;i++){const a=sp[i],b=sp[(i+1)%6],done=i<st.step||(st.step===5&&i===5);x.strokeStyle=done?'rgba(226,85,43,.9)':'rgba(22,24,26,.08)';x.setLineDash(done?[]:[3,5]);x.beginPath();x.moveTo(...a);x.lineTo(...b);x.stroke()}x.setLineDash([]);
 sp.forEach((p,i)=>{x.beginPath();x.arc(p[0],p[1],i<=st.step?6:4,0,7);x.fillStyle=i<=st.step?'#E2552B':'#F6F5F0';x.fill();x.strokeStyle='#E2552B';x.lineWidth=1.5;x.stroke()});
 const cp=caps.map(c=>P(c.a,c.r,c.ph,amp*1.5));
 cp.forEach((p,i)=>{const on=i===st.cap;x.strokeStyle=on?'rgba(14,138,126,.9)':'rgba(22,24,26,.18)';x.lineWidth=on?2:1;x.beginPath();x.moveTo(...hub);const mx=(hub[0]+p[0])/2+Math.sin(st.t+i)*amp*3,my=(hub[1]+p[1])/2+Math.cos(st.t+i)*amp*3;x.quadraticCurveTo(mx,my,p[0],p[1]);x.stroke();
  if(on&&!reduce){const w=(Math.sin(st.t*2.2)+1)/2;x.beginPath();x.arc(p[0],p[1],14+w*10,0,7);x.strokeStyle='rgba(14,138,126,'+(.35-w*.3)+')';x.stroke()}
  x.beginPath();x.arc(p[0],p[1],on?10:7,0,7);x.fillStyle=on?'#0E8A7E':'rgba(14,138,126,.45)';x.fill()});
 cases.forEach((c,i)=>{if(i>=st.cases)return;const p=P(c.a,.37,c.ph,amp),q=cp[i];x.strokeStyle='rgba(226,85,43,.35)';x.lineWidth=1;x.beginPath();x.moveTo(...q);x.lineTo(...p);x.stroke();x.beginPath();x.arc(p[0],p[1],4.5,0,7);x.fillStyle='#E2552B';x.fill()});
 x.beginPath();x.arc(hub[0],hub[1],16,0,7);x.fillStyle='#16181a';x.fill();x.fillStyle='#fff';x.font='600 12px Sora, "Noto Sans SC"';x.textAlign='center';x.textBaseline='middle';x.fillText('昭桥',hub[0],hub[1]+1)}
// real page state -> system state
const io=new IntersectionObserver(es=>es.forEach(en=>{const t=en.target;if(!en.isIntersecting)return;if(t.dataset.cap){st.cap=+t.dataset.cap;document.querySelectorAll('.cp').forEach(c=>c.classList.toggle('on',c===t))}if(t.dataset.case)st.cases=Math.max(st.cases,+t.dataset.case+1);if(t.dataset.step){st.step=Math.max(st.step,+t.dataset.step);document.querySelectorAll('.st li').forEach((l,k)=>l.classList.toggle('done',k<=st.step))}if(reduce)draw()}),{rootMargin:'-40% 0px -40% 0px'});
document.querySelectorAll('[data-cap],[data-case],[data-step]').forEach(el=>io.observe(el));
document.querySelectorAll('.cp').forEach(c=>c.addEventListener('mouseenter',()=>{st.cap=+c.dataset.cap;if(reduce)draw()}));
if(reduce){draw()}else{(function loop(){if(!document.hidden){st.t+=.012;draw()}requestAnimationFrame(loop)})()}})();