/* 昭桥官网交互：连接线、Hero 动效、能力区叙事、Lenis 平滑滚动、标题揭示、数字滚动、磁吸按钮 */
(function(){
  'use strict';
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const root=document.documentElement;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGsap=!!(window.gsap&&window.ScrollTrigger);
  const desktop=()=>innerWidth>900;

  /* ---------- i18n ---------- */
  const i18n=$$('[data-en]');i18n.forEach(el=>el.dataset.zh=el.innerHTML);
  const zhTitle=document.title,enTitle='ZHAOQIAO AI — Connecting AI to real work';
  function setLang(l){i18n.forEach(el=>el.innerHTML=l==='en'?el.dataset.en:el.dataset.zh);root.lang=l==='en'?'en':'zh-CN';document.title=l==='en'?enTitle:zhTitle;$('#lang-toggle').textContent=l==='en'?'中文':'EN';try{localStorage.setItem('zq-lang',l)}catch(e){}
    if(l==='zh')splitHero();requestAnimationFrame(()=>{hasGsap?ScrollTrigger.refresh():layoutLine();});}
  $('#lang-toggle').addEventListener('click',()=>setLang(root.lang==='en'?'zh':'en'));

  /* ---------- hero title split ---------- */
  function splitHero(){const h=$('#hero-title');if(root.lang==='en')return;const t=h.textContent;h.setAttribute('aria-label',t);
    h.innerHTML=[...t].map(c=>c==='｜'?'<span class="ch bar" aria-hidden="true">｜</span>':c===' '?'<span class="ch" aria-hidden="true">&nbsp;</span>':'<span class="ch" aria-hidden="true">'+c+'</span>').join('');}

  /* ---------- hero video: keep looping ---------- */
  const hv=$('.hero-video');
  if(hv){hv.loop=true;hv.muted=true;const keep=()=>{if(hv.paused&&!document.hidden)hv.play().catch(()=>{});};
    hv.addEventListener('ended',()=>{hv.currentTime=0;keep();});hv.addEventListener('pause',()=>setTimeout(keep,200));
    document.addEventListener('visibilitychange',keep);keep();}

  /* ---------- case media (CASE_MEDIA) ---------- */
  // 交付案例媒体配置：键为案例编号(1-4)，填 image 或 video（相对 dist/ 的路径），留空显示占位。
  const CASE_MEDIA={1:{image:'',video:''},2:{image:'',video:''},3:{image:'',video:''},4:{image:'',video:''}};
  $$('.case-card').forEach(card=>{const m=$('.case-media',card),c=CASE_MEDIA[card.dataset.case]||{};const img=m.dataset.image||c.image,vid=m.dataset.video||c.video;
    if(vid){const v=document.createElement('video');Object.assign(v,{muted:true,loop:true,playsInline:true,autoplay:true,preload:'metadata'});v.src=vid;if(img)v.poster=img;m.appendChild(v);m.classList.add('filled');}
    else if(img){const im=document.createElement('img');im.src=img;im.loading='lazy';im.alt=$('h3',card).textContent;m.appendChild(im);m.classList.add('filled');}});

  /* ---------- capability videos ---------- */
  function loadVid(media){const v=$('video',media);if(!v||v.dataset.loaded)return v;v.dataset.loaded=1;v.src=v.dataset.src;v.addEventListener('loadeddata',()=>media.classList.add('has-video'),{once:true});return v;}
  const capMedias=$$('.cap-media'),capPanes=$$('.cap-pane'),capItems=$$('#cap-list li');
  let capActive=-1;
  function setCap(i){if(i===capActive)return;capActive=i;
    capMedias.forEach((m,k)=>{m.classList.toggle('active',k===i);const v=$('video',m);if(k===i){loadVid(m).play().catch(()=>{});}else if(v&&v.dataset.loaded)v.pause();});
    capPanes.forEach((p,k)=>p.classList.toggle('active',k===i));capItems.forEach((l,k)=>l.classList.toggle('active',k===i));
    const li=capItems[i],dot=$('#cap-dot');if(li&&dot)dot.style.transform='translateY('+(li.offsetTop+li.offsetHeight/2-4)+'px)';
    $('#caps-progress').textContent='0'+(i+1)+' / 04';
    const pane=capPanes[i];if(pane&&root.classList.contains('pinned'))$$('.count',pane).forEach(countUp);}
  // stacked mode: play videos when visible
  const vio=new IntersectionObserver(es=>es.forEach(e=>{if(root.classList.contains('pinned'))return;const v=loadVid(e.target);if(e.isIntersecting)v.play().catch(()=>{});else v.pause();}),{threshold:.3});
  capMedias.forEach(m=>vio.observe(m));

  /* ---------- count up ---------- */
  function countUp(el){if(el.dataset.done)return;el.dataset.done=1;const to=parseFloat(el.dataset.to),dec=+(el.dataset.dec||0),suf=el.dataset.suffix||'';
    if(reduce||!hasGsap){el.textContent=to.toFixed(dec)+suf;return;}const o={v:0};gsap.to(o,{v:to,duration:1.6,ease:'power3.out',onUpdate:()=>el.textContent=o.v.toFixed(dec)+suf});}

  /* ---------- nav state ---------- */
  const nav=$('#site-nav');
  function navState(){const y=innerHeight*0.08;let dark=false;$$('[data-dark]').forEach(s=>{const r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>y)dark=true;});nav.classList.toggle('is-dark',dark);nav.classList.toggle('scrolled',scrollY>20);}

  /* ---------- connecting line ---------- */
  const svg=$('#zq-line'),base=$('#zq-base'),draw=$('#zq-draw'),tip=$('#zq-tip');
  let samples=[],total=0,nodes=[];
  function docPos(el){const r=el.getBoundingClientRect();return{x:r.left+scrollX+r.width/2,y:r.top+scrollY+r.height/2,top:r.top+scrollY,bottom:r.bottom+scrollY};}
  function layoutLine(){
    const page=$('.page'),H=page.scrollHeight,W=innerWidth;svg.setAttribute('height',H);svg.setAttribute('viewBox','0 0 '+W+' '+H);
    $('#zqGrad').setAttribute('y2',H);
    const win=docPos($('#hero-window')),wr=$('#hero-window').getBoundingClientRect();
    const gx=Math.max(8,$('.cases .wrap').getBoundingClientRect().left/2);
    nodes=$$('[data-node]').map(n=>({el:n,...docPos(n)}));
    const btn=docPos($('#contact-btn'));
    const sx=wr.left+scrollX, sy=win.bottom-40;
    let d='M'+sx+' '+sy+' C'+(sx-30)+' '+(sy+20)+' '+gx+' '+(sy-10)+' '+gx+' '+(win.bottom+60);
    nodes.forEach(n=>{d+=' L'+gx+' '+n.y;});
    const bl=$('#contact-btn').getBoundingClientRect().left+scrollX-8;d+=' L'+gx+' '+(btn.y-70)+' C'+gx+' '+btn.y+' '+(gx+40)+' '+btn.y+' '+(gx+90)+' '+btn.y+' L'+bl+' '+btn.y;
    base.setAttribute('d',d);draw.setAttribute('d',d);
    total=draw.getTotalLength();draw.style.strokeDasharray=total;samples=[];
    for(let l=0;l<=total;l+=12){const p=draw.getPointAtLength(l);samples.push([l,p.y,p.x]);}
    updateLine();
  }
  function updateLine(){
    if(!total)return;const mx=document.documentElement.scrollHeight-innerHeight,near=Math.max(0,1-(mx-scrollY)/innerHeight);const target=scrollY+innerHeight*(0.62+0.5*near);let len=total;
    if(!reduce){len=0;for(const s of samples){if(s[1]<=target)len=s[0];else break;}
      // ensure monotonic: line only goes down the page, so the last sample under target is fine
    }
    draw.style.strokeDashoffset=total-len;const p=draw.getPointAtLength(Math.max(0,len));tip.setAttribute('cx',p.x);tip.setAttribute('cy',p.y);
    nodes.forEach(n=>n.el.classList.toggle('on',n.y<=p.y+2||reduce));
    $('#contact-btn').classList.toggle('lit',len>=total-4);
  }

  /* ---------- hero connector lines ---------- */
  function heroLinks(){const s=$('#hero-links'),st=$('.hero-stage').getBoundingClientRect(),w=$('#hero-window').getBoundingClientRect();
    const W=st.width,H=st.height,l=w.left-st.left,r=w.right-st.left;s.setAttribute('viewBox','0 0 '+W+' '+H);
    const en=root.lang==='en',lab=en?[['TRAINING',.28],['CO-CREATION',.72],['DELIVERY',.28],['REAL BUSINESS',.72]]:[['赋能培训',.28],['场景共创',.72],['系统落地',.28],['真实业务',.72]];
    const out=-Math.min(80,st.left+4);let g='';
    lab.forEach(([t,f],i)=>{const left=i<2,y=H*f,x0=left?l:r,x1=left?Math.max(out,l-150):Math.min(W-out,r+150),mx=(x0+x1)/2;
      if(Math.abs(x0-x1)<30)return;
      g+='<path class="hl" d="M'+x0+' '+y+' C'+mx+' '+y+' '+mx+' '+(y+(left?-24:24))+' '+x1+' '+(y+(left?-24:24))+'"/><circle r="3" cx="'+x1+'" cy="'+(y+(left?-24:24))+'"/><text x="'+(left?x1+8:x1-8)+'" y="'+(y+(left?-32:16))+'" text-anchor="'+(left?'start':'end')+'">'+t+'</text>';});
    s.innerHTML=g;return $$('path',s);}

  /* ---------- magnetic buttons ---------- */
  if(!reduce&&matchMedia('(pointer:fine)').matches)$$('.magnetic').forEach(b=>{b.addEventListener('mousemove',e=>{const r=b.getBoundingClientRect();const x=(e.clientX-r.left-r.width/2)*.28,y=(e.clientY-r.top-r.height/2)*.38;b.style.transform='translate('+x+'px,'+y+'px)';});b.addEventListener('mouseleave',()=>{b.style.transition='transform .5s cubic-bezier(.2,.8,.2,1)';b.style.transform='';setTimeout(()=>b.style.transition='',500);});});

  /* ---------- smooth anchors ---------- */
  let lenis=null;
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const id=a.getAttribute('href');const t=id==='#top'?document.body:$(id);if(!t)return;e.preventDefault();
    let el=t;if(root.classList.contains('pinned')&&t.classList.contains('cap-pane'))el=$('#capabilities');
    if(lenis)lenis.scrollTo(el,{offset:id==='#top'?0:-10});else el.scrollIntoView({behavior:reduce?'auto':'smooth'});}));

  /* ---------- init ---------- */
  splitHero();
  const lang=(()=>{try{return new URLSearchParams(location.search).get('lang')||localStorage.getItem('zq-lang')||'zh'}catch(e){return 'zh'}})();
  if(lang==='en')setLang('en');

  if(!hasGsap||reduce){
    // static fallback: stacked layout, fully drawn line, final numbers
    setCap(0);$$('.count').forEach(countUp);heroLinks();
    addEventListener('load',layoutLine);addEventListener('resize',()=>{heroLinks();layoutLine();});
    addEventListener('scroll',()=>{navState();updateLine();},{passive:true});navState();layoutLine();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if(window.Lenis){lenis=new Lenis({lerp:.1,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
  let ticking=false;addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;navState();updateLine();});},{passive:true});

  // hero intro
  const tl=gsap.timeline({defaults:{ease:'expo.out'}});
  tl.from('.hero-bigword',{opacity:0,scale:1.08,duration:2})
    .from('.hero-kicker',{y:16,opacity:0,duration:.9},.15)
    .from('#hero-title .ch',{yPercent:110,opacity:0,rotate:4,duration:1.1,stagger:.035},.25)
    .from('.hero-sub',{y:18,opacity:0,duration:1},.7)
    .from('#hero-window',{clipPath:'inset(18% 30% 18% 30% round 26px)',duration:1.6,ease:'expo.inOut'},.35)
    .from('.hero-ctas .btn',{y:20,opacity:0,stagger:.08,duration:.9},1.1);
  function animLinks(){const ps=heroLinks();ps.forEach(p=>{const L=p.getTotalLength();p.style.strokeDasharray=L;p.style.strokeDashoffset=L;});
    gsap.to(ps,{strokeDashoffset:0,duration:1.4,ease:'power2.out',stagger:.12,delay:.2});gsap.from('#hero-links circle,#hero-links text',{opacity:0,duration:.8,stagger:.06,delay:.9});}
  tl.add(animLinks,1.2);
  gsap.to('.hero-bigword',{yPercent:-30,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});
  gsap.to('#hero-window',{scale:.92,ease:'none',scrollTrigger:{trigger:'.hero',start:'top top',end:'bottom top',scrub:true}});

  // heading reveals
  $$('.reveal').forEach(h=>gsap.from(h,{yPercent:60,opacity:0,clipPath:'inset(0 0 100% 0)',duration:1.1,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 88%'}}));
  gsap.utils.toArray('.case-card,.model,.note').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 92%'}}));
  gsap.from('.tl-step',{y:24,opacity:0,stagger:.08,duration:.9,ease:'expo.out',scrollTrigger:{trigger:'#timeline',start:'top 85%'}});
  if(desktop())gsap.from('#tl-fill',{scaleX:0,ease:'none',scrollTrigger:{trigger:'#timeline',start:'top 80%',end:'top 40%',scrub:true}});
  $$('.cases .count').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:()=>countUp(el)}));

  // capabilities storytelling
  const mm=gsap.matchMedia();
  mm.add('(min-width: 901px)',()=>{root.classList.add('pinned');setCap(0);
    const st=ScrollTrigger.create({trigger:'#capabilities',start:'top top',end:'+='+(innerHeight*3),pin:true,anticipatePin:1,
      onUpdate:s=>setCap(Math.min(3,Math.floor(s.progress*4*0.999)))});
    capItems.forEach((li,i)=>li.addEventListener('click',()=>{const y=st.start+(st.end-st.start)*(i+.5)/4;lenis?lenis.scrollTo(y):scrollTo(0,y);}));
    return()=>{root.classList.remove('pinned');capActive=-1;};});
  mm.add('(max-width: 900px)',()=>{setCap(0);capPanes.forEach(p=>$$('.count',p).forEach(el=>ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:()=>countUp(el)})));});

  ScrollTrigger.addEventListener('refresh',()=>{layoutLine();});
  addEventListener('resize',()=>{heroLinks();});
  addEventListener('load',()=>ScrollTrigger.refresh());
  navState();ScrollTrigger.refresh();
})();
