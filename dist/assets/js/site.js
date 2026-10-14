/* 昭桥官网 r10：整屏翻页（原生 scroll-snap）、统一进屏动效、流程光路、案例媒体位 */
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=document.documentElement, reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* i18n */
  const i18n=$$('[data-en]');i18n.forEach(el=>el.dataset.zh=el.innerHTML);
  const zhTitle=document.title,enTitle='ZHAOQIAO — AI for real business';
  function setLang(l){i18n.forEach(el=>el.innerHTML=l==='en'?el.dataset.en:el.dataset.zh);root.lang=l==='en'?'en':'zh-CN';document.title=l==='en'?enTitle:zhTitle;
    $('#lang-toggle').textContent=l==='en'?'中文':'EN';try{localStorage.setItem('zq-lang',l)}catch(e){}splitHero();splitTitles();fitTitle();requestAnimationFrame(layoutPath);}
  $('#lang-toggle').addEventListener('click',()=>setLang(root.lang==='en'?'zh':'en'));

  /* hero title: split + one line */
  function splitHero(){const h=$('#hero-title');const t=h.textContent;h.setAttribute('aria-label',t);let i=0;
    h.innerHTML=[...t].map(c=>'<span class="ch" aria-hidden="true" style="--i:'+(i++)+'">'+(c===' '?'&nbsp;':c)+'</span>').join('');}
  function fitTitle(){const h=$('#hero-title');h.style.fontSize='100px';const w=h.scrollWidth,avail=Math.min(innerWidth-40,1180)*(innerWidth>900?.9:.96);
    const max=root.lang==='en'?(innerWidth>900?60:22):(innerWidth>900?84:40);h.style.fontSize=Math.max(12,Math.min(max,100*avail/w)).toFixed(1)+'px';}

  /* hero video: poster first, load full src when needed; prefer mobile file on mobile */
  const hv=$('.hero-video');
  if(hv){hv.loop=true;hv.muted=true;let loaded=false;
    const loadHero=()=>{if(loaded)return;loaded=true;const mob=innerWidth<=700||matchMedia('(max-width:700px)').matches;
      hv.src=hv.dataset[mob?'srcMobile':'srcDesktop']||hv.dataset.srcDesktop;hv.load();hv.play().catch(()=>{});};
    const keep=()=>{if(!loaded)return;if(hv.paused&&!document.hidden)hv.play().catch(()=>{});};
    hv.addEventListener('ended',()=>{hv.currentTime=0;keep();});hv.addEventListener('pause',()=>setTimeout(keep,200));
    document.addEventListener('visibilitychange',keep);
    const kick=()=>{loadHero();['pointerdown','keydown','touchstart','wheel'].forEach(ev=>removeEventListener(ev,kick));};
    ['pointerdown','keydown','touchstart','wheel'].forEach(ev=>addEventListener(ev,kick,{passive:true,once:true}));
    // auto-load shortly after first paint if connection is fine
    const conn=navigator.connection;const save=conn&&(conn.saveData||/2g/i.test(conn.effectiveType||''));
    if(!save)setTimeout(loadHero,reduce?0:600);}

  /* 案例媒体：键为案例编号 1-4，填 image 或 video（相对 dist/ 的路径）；留空显示占位。
     推荐：assets/cases/case-0N.webp，1600×1000（16:10）。加载失败自动回退占位。 */
  const CASE_MEDIA={1:{image:'assets/cases/case-01.webp',video:''},2:{image:'assets/cases/case-02.webp',video:''},3:{image:'assets/cases/case-03.webp',video:''},4:{image:'assets/cases/case-04.webp',video:''}};
  $$('.case-card').forEach(card=>{const m=$('.case-media',card),c=CASE_MEDIA[card.dataset.case]||{};const img=m.dataset.image||c.image,vid=m.dataset.video||c.video;
    let el;if(vid){el=document.createElement('video');Object.assign(el,{muted:true,loop:true,playsInline:true,autoplay:true,preload:'metadata'});el.src=vid;if(img)el.poster=img;}
    else if(img){el=document.createElement('img');el.src=img;el.loading='lazy';el.alt=$('h3',card).textContent;}
    if(el){el.addEventListener('error',()=>{el.remove();m.classList.remove('filled');});m.appendChild(el);m.classList.add('filled');}});

  /* unified reveal targets */
  const screens=$$('[data-screen]');
  screens.forEach(sc=>{let d=0;const add=e=>{if(e&&!e.classList.contains('rv')){e.classList.add('rv');e.style.setProperty('--d',d++);}};
    if(sc.classList.contains('hero')){$$('.eyebrow,.hero-sub,.hero-ctas',sc).forEach(e=>{add(e);});$('.hero-sub',sc).style.setProperty('--d',6);$('.hero-ctas',sc).style.setProperty('--d',8);return;}
    const m=$('.cap-media',sc);if(m)m.classList.add('mask');
    $$('.kicker,h2,.sec-note,.cap-body,.cap-inc li,.cap-deliv,.copy-link,.case-card,.pstep,.note,.contact-main>*,.model,.price',sc).forEach(add);});

  /* pager */
  const pager=$('#pager');screens.forEach((sc,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',sc.getAttribute('aria-label')||('Section '+(i+1)));
    b.addEventListener('click',()=>window.ZQgo?window.ZQgo(i):sc.scrollIntoView({behavior:reduce?'auto':'smooth'}));pager.appendChild(b);});
  const dots=$$('button',pager),wash=$('.bgwash'),navLinks=$$('.nav-links a');

  /* count-up */
  function countUp(el){const to=parseFloat(el.dataset.to),dec=+el.dataset.dec||0,suf=el.dataset.suffix||'';if(reduce){return;}const t0=performance.now(),D=1400;
    (function f(t){const p=Math.min(1,(t-t0)/D),e=1-Math.pow(1-p,3);el.textContent=(to*e).toFixed(dec)+suf;if(p<1)requestAnimationFrame(f);})(t0);}

  /* active screen */
  let active=null;
  function activate(sc){if(sc===active)return;active=sc;const i=screens.indexOf(sc);
    screens.forEach(s=>s.classList.toggle('in',s===sc));dots.forEach((d,k)=>d.classList.toggle('on',k===i));wash.style.backgroundColor=sc.dataset.bg||'#2a2763';doWipe(sc.dataset.bg||'#34318a');
    const id=sc.querySelector('[id]')?.id||sc.id;navLinks.forEach(a=>a.classList.toggle('on',sc.classList.contains('cap')?a.getAttribute('href')==='#agent':a.getAttribute('href')==='#'+sc.id));
    $$('.cap video').forEach(v=>{const mine=sc.contains(v);if(mine){if(!v.src)v.src=v.dataset.src;v.play().catch(()=>{});}else if(!v.paused)v.pause();});
    // preload next capability video
    const nx=screens[i+1]&&$('.cap video',screens[i+1]);if(nx&&!nx.src){nx.preload='auto';nx.src=nx.dataset.src;}
    if(sc.classList.contains('cases')&&!sc.dataset.counted){sc.dataset.counted=1;$$('.count',sc).forEach(countUp);}
    if(sc.classList.contains('process'))procStart();else procStop();}
  if(!window.ZQ_FLOW){const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)activate(e.target);});},{threshold:0.55});
  screens.forEach(s=>io.observe(s));
  // tall mobile screens may never reach 55%: fallback
  addEventListener('scroll',()=>{const mid=innerHeight*.5;for(const s of screens){const r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>=mid){activate(s);break;}}},{passive:true});}
  window.ZQactivate=activate;window.ZQscreens=screens;

  /* process: glowing path + comet + lit cards + particles */
  const proc=$('.proc'),base=$('#pp-base'),draw=$('#pp-draw'),comet=$('#pp-comet'),halo=$('#pp-halo'),steps=$$('.pstep');
  let L=1,xs=[],raf=0,running=false,t0=0,drawn=false;
  function layoutPath(){if(!proc)return;const pr=proc.getBoundingClientRect();if(!pr.width)return;
    const pts=steps.map((s,k)=>{const r=s.getBoundingClientRect();return [r.left-pr.left+r.width/2,r.top-pr.top-(k%2?14:46)];});
    const y0=pts[0][1];let d='M'+(pts[0][0]-pr.width*.06)+' '+y0;
    pts.forEach((p,k)=>{const prev=k?pts[k-1]:[pts[0][0]-pr.width*.06,y0];const cx=(prev[0]+p[0])/2;d+=' C'+cx+' '+prev[1]+' '+cx+' '+p[1]+' '+p[0]+' '+p[1];});
    const last=pts[pts.length-1];d+=' C'+(last[0]+40)+' '+last[1]+' '+(last[0]+60)+' '+y0+' '+(last[0]+pr.width*.06)+' '+y0;
    base.setAttribute('d',d);draw.setAttribute('d',d);L=draw.getTotalLength();xs=pts.map(p=>p[0]);
    draw.style.strokeDasharray=L;if(!drawn)draw.style.strokeDashoffset=L;}
  function at(f){const p=draw.getPointAtLength(f*L);comet.setAttribute('cx',p.x);comet.setAttribute('cy',p.y);halo.setAttribute('cx',p.x);halo.setAttribute('cy',p.y);return p;}
  function tick(t){if(!running)return;const DRAW=2600,LOOP=7000;const e=t-t0;
    if(e<DRAW){const f=e/DRAW,g=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2;draw.style.strokeDashoffset=L*(1-g);const p=at(g);steps.forEach((s,k)=>{if(p.x>=xs[k]-4)s.classList.add('lit');});}
    else{drawn=true;draw.style.strokeDashoffset=0;const f=((e-DRAW)%LOOP)/LOOP;const p=at(f);steps.forEach((s,k)=>s.classList.toggle('hot',Math.abs(p.x-xs[k])<70));}
    raf=requestAnimationFrame(tick);}
  const vertical=()=>innerWidth<=900;
  function procStart(){if(running)return;layoutPath();
    if(reduce||vertical()){steps.forEach((s,k)=>setTimeout(()=>s.classList.add('lit'),reduce?0:k*260));return;}
    running=true;t0=performance.now()-(drawn?2600:0);raf=requestAnimationFrame(tick);partStart();}
  function procStop(){running=false;cancelAnimationFrame(raf);partStop();}
  function partStart(){}function partStop(){}
  /* global particle field: sparse, slow, scatters around the mouse */
  (function(){const cv=$('#fx');if(!cv||reduce)return;const cx=cv.getContext('2d');const mob=innerWidth<=900;let W,H,dpr,ps=[],mx=-1e4,my=-1e4,on=true,last=0;
    function size(){dpr=Math.min(1.5,devicePixelRatio||1);W=cv.width=innerWidth*dpr;H=cv.height=innerHeight*dpr;const n=mob?16:42;
      while(ps.length<n)ps.push({x:Math.random()*W,y:Math.random()*H,ox:0,oy:0,r:(Math.random()*1.4+.6)*dpr,v:(Math.random()*.12+.04)*dpr,a:Math.random()*6.3,g:Math.random()<.28});ps.length=n;}
    size();addEventListener('resize',size);
    if(!mob)addEventListener('pointermove',e=>{mx=e.clientX*dpr;my=e.clientY*dpr;},{passive:true});
    document.addEventListener('visibilitychange',()=>{on=!document.hidden;if(on)requestAnimationFrame(f);});
    function f(t){if(!on)return;requestAnimationFrame(f);if(window.ZQ_BUSY||t-last<32)return;last=t;cx.clearRect(0,0,W,H);const R=140*dpr;
      for(const p of ps){p.y-=p.v;p.a+=.006;p.x+=Math.sin(p.a)*.12*dpr;if(p.y<-10){p.y=H+10;p.x=Math.random()*W;}
        const dx=p.x+p.ox-mx,dy=p.y+p.oy-my,d2=dx*dx+dy*dy;if(d2<R*R){const d=Math.sqrt(d2)||1,k=(1-d/R)*2.2;p.ox+=dx/d*k;p.oy+=dy/d*k;}
        p.ox*=.95;p.oy*=.95;cx.beginPath();cx.arc(p.x+p.ox,p.y+p.oy,p.r,0,6.283);cx.fillStyle=p.g?'rgba(255,210,122,.42)':'rgba(205,198,255,.32)';cx.fill();}}
    requestAnimationFrame(f);})();

  /* titles: character reveal (text nodes only, keeps nowrap spans) */
  function splitTitles(){$$('.cap-pane h2,.sec-title,.contact h2').forEach(h=>{let i=0;const walk=n=>{[...n.childNodes].forEach(c=>{if(c.nodeType===3){const fr=document.createDocumentFragment();
      [...c.textContent].forEach(ch=>{const s=document.createElement('span');s.className='tch';s.style.setProperty('--i',i++);s.textContent=ch;fr.appendChild(s);});c.replaceWith(fr);}else if(c.nodeType===1&&!c.classList.contains('tch'))walk(c);});};
    h.setAttribute('aria-label',h.textContent);walk(h);h.classList.remove('rv');});}
  /* page wipe */
  const wipe=$('#wipe');let firstAct=true;
  function doWipe(c){if(window.ZQ_FLOW)return;if(reduce||firstAct){firstAct=false;return;}wipe.style.setProperty('--wc',c);wipe.classList.remove('go');void wipe.offsetWidth;wipe.classList.add('go');}
  wipe.addEventListener('transitionend',()=>wipe.classList.remove('go'));
  /* init */
  const lang=(()=>{try{return new URLSearchParams(location.search).get('lang')||localStorage.getItem('zq-lang')||'zh'}catch(e){return 'zh'}})();
  splitTitles();if(lang==='en')setLang('en');else{splitHero();fitTitle();}
  if(document.fonts)document.fonts.ready.then(()=>{fitTitle();layoutPath();});
  let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{fitTitle();layoutPath();if(running){partStop();partStart();}},150);});
})();
