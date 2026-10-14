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
    fitTitle();if(l==='zh')splitHero();requestAnimationFrame(()=>{hasGsap?ScrollTrigger.refresh():layoutLine();});}
  $('#lang-toggle').addEventListener('click',()=>setLang(root.lang==='en'?'zh':'en'));

  /* ---------- hero title: one line, fitted to width ---------- */
  function fitTitle(){const h=$('#hero-title');if(!h)return;h.style.fontSize='100px';const w=h.scrollWidth,avail=Math.min(h.parentElement.clientWidth,1180)*(innerWidth>900?.92:.96);
    const max=root.lang==='en'?(innerWidth>900?60:40):(innerWidth>900?84:40);h.style.fontSize=Math.max(12,Math.min(max,100*avail/w)).toFixed(1)+'px';}
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
  const CASE_MEDIA={1:{image:'assets/cases/case-01.webp',video:''},2:{image:'assets/cases/case-02.webp',video:''},3:{image:'assets/cases/case-03.webp',video:''},4:{image:'assets/cases/case-04.webp',video:''}};
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
    const cp=$('#caps-progress');if(cp)cp.textContent='0'+(i+1)+' / 04';
    const pane=capPanes[i];if(pane&&root.classList.contains('pinned'))$$('.count',pane).forEach(countUp);}
  // stacked mode: play videos when visible
  const vio=new IntersectionObserver(es=>es.forEach(e=>{if(root.classList.contains('pinned'))return;const v=loadVid(e.target);if(e.isIntersecting)v.play().catch(()=>{});else v.pause();}),{threshold:.3});
  capMedias.forEach(m=>vio.observe(m));

  /* ---------- count up ---------- */
  function countUp(el){if(el.dataset.done)return;el.dataset.done=1;const to=parseFloat(el.dataset.to),dec=+(el.dataset.dec||0),suf=el.dataset.suffix||'';
    if(reduce||!hasGsap){el.textContent=to.toFixed(dec)+suf;return;}const o={v:0};gsap.to(o,{v:to,duration:1.6,ease:'power3.out',onUpdate:()=>el.textContent=o.v.toFixed(dec)+suf});}

  /* ---------- nav state ---------- */
  const nav=$('#site-nav');
  function navState(){if(nav.classList.contains('always-dark')){nav.classList.toggle('scrolled',scrollY>20);return;}const y=innerHeight*0.08;let dark=false;$$('[data-dark]').forEach(s=>{const r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>y)dark=true;});nav.classList.toggle('is-dark',dark);nav.classList.toggle('scrolled',scrollY>20);}

  /* ---------- connecting line ---------- */
  const svg=$('#zq-line'),base=$('#zq-base'),draw=$('#zq-draw'),halo=$('#zq-halo'),tip=$('#zq-tip');
  let samples=[],total=0,nodes=[];
  function docPos(el){const r=el.getBoundingClientRect();return{x:r.left+scrollX+r.width/2,y:r.top+scrollY+r.height/2,top:r.top+scrollY,bottom:r.bottom+scrollY};}
  function layoutLine(){
    const page=$('.page'),H=page.scrollHeight,W=innerWidth;svg.setAttribute('height',H);svg.setAttribute('viewBox','0 0 '+W+' '+H);
    $('#zqGrad').setAttribute('y2',H);
    const gx=Math.max(8,$('.cases .wrap').getBoundingClientRect().left/2);
    nodes=$$('[data-node]').map(n=>({el:n,...docPos(n)}));
    const btn=docPos($('#contact-btn'));
    const cta=docPos($('.hero-ctas .btn-primary')),hb=docPos($('.hero'));const sx=cta.x,sy=cta.bottom+10;
    let d='M'+gx+' '+(hb.bottom+24);
    nodes.forEach(n=>{d+=' L'+gx+' '+n.y;});
    const bl=$('#contact-btn').getBoundingClientRect().left+scrollX-8;d+=' L'+gx+' '+(btn.y-70)+' C'+gx+' '+btn.y+' '+(gx+40)+' '+btn.y+' '+(gx+90)+' '+btn.y+' L'+bl+' '+btn.y;
    base.setAttribute('d',d);draw.setAttribute('d',d);halo.setAttribute('d',d);
    total=draw.getTotalLength();draw.style.strokeDasharray=total;halo.style.strokeDasharray=total;samples=[];
    for(let l=0;l<=total;l+=12){const p=draw.getPointAtLength(l);samples.push([l,p.y,p.x]);}
    updateLine();
  }
  function updateLine(){
    if(!total)return;const mx=document.documentElement.scrollHeight-innerHeight,near=Math.max(0,1-(mx-scrollY)/innerHeight);const target=scrollY+innerHeight*(0.62+0.5*near);let len=total;
    if(!reduce){len=0;for(const s of samples){if(s[1]<=target)len=s[0];else break;}
      // ensure monotonic: line only goes down the page, so the last sample under target is fine
    }
    draw.style.strokeDashoffset=total-len;halo.style.strokeDashoffset=total-len;const p=draw.getPointAtLength(Math.max(0,len));tip.setAttribute('cx',p.x);tip.setAttribute('cy',p.y);
    nodes.forEach(n=>n.el.classList.toggle('on',n.y<=p.y+2||reduce));
    $('#contact-btn').classList.toggle('lit',len>=total-4);
  }

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
  if(lang==='en')setLang('en');fitTitle();if(document.fonts)document.fonts.ready.then(()=>{fitTitle();hasGsap&&ScrollTrigger.refresh();});addEventListener('resize',fitTitle);

  if(!hasGsap||reduce){
    // static fallback: stacked layout, fully drawn line, final numbers
    setCap(0);$$('.count').forEach(countUp);$$('.tl-step').forEach(e=>e.classList.add('lit'));
    addEventListener('load',layoutLine);addEventListener('resize',layoutLine);
    addEventListener('scroll',()=>{navState();updateLine();},{passive:true});navState();layoutLine();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if(window.Lenis){lenis=new Lenis({lerp:.1,smoothWheel:true});lenis.on('scroll',ScrollTrigger.update);gsap.ticker.add(t=>lenis.raf(t*1000));gsap.ticker.lagSmoothing(0);}
  let ticking=false;addEventListener('scroll',()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{ticking=false;navState();updateLine();});},{passive:true});

  // hero intro
  const tl=gsap.timeline({defaults:{ease:'expo.out'}});
  tl.from('.hero-window',{opacity:0,duration:1.6,ease:'power2.out'})
    .from('.hero-kicker',{y:14,opacity:0,duration:.9},.2)
    .from('#hero-title .ch',{yPercent:100,opacity:0,duration:1,stagger:.03},.3)
        .from('.hero-sub',{y:14,opacity:0,duration:1},.85)
    .from('.hero-ctas .btn',{y:14,opacity:0,stagger:.08,duration:.9},1.05)
    .from('.hero-scroll',{opacity:0,duration:1},1.4);
  // hero copy fades as you leave (opacity only, video untouched)
  gsap.to('.hero-head,.hero-ctas',{opacity:0,ease:'none',scrollTrigger:{trigger:'.hero',start:'60% top',end:'bottom top',scrub:.6}});

  // background colour transitions between sections
  $$('[data-bg]').forEach(sec=>ScrollTrigger.create({trigger:sec,start:'top 55%',end:'bottom 55%',onToggle:st=>{if(st.isActive)gsap.to('.bgwash',{backgroundColor:sec.dataset.bg,duration:1.2,ease:'power2.out',overwrite:true});}}));
  // kicker lines draw, section content staggers in
  $$('.kicker:not(.cap-pane .kicker)').forEach(k=>gsap.from(k,{opacity:0,x:-12,duration:.9,ease:'expo.out',scrollTrigger:{trigger:k,start:'top 90%'}}));
  // contact: mask wipe
  gsap.fromTo('.contact',{clipPath:'inset(0% 5% 0% 5% round 48px)'},{clipPath:'inset(0% 0% 0% 0% round 0px)',ease:'none',scrollTrigger:{trigger:'.contact',start:'top bottom',end:'top 30%',scrub:.6}});
  // cases: clip reveal
  $$('.case-card').forEach((c,k)=>gsap.fromTo(c,{clipPath:'inset(12% 0% 0% 0% round 24px)',opacity:0},{clipPath:'inset(0% 0% 0% 0% round 24px)',opacity:1,duration:1.2,ease:'expo.out',delay:(k%2)*.12,scrollTrigger:{trigger:c,start:'top 88%'}}));

  // heading reveals
  $$('.reveal').forEach(h=>gsap.from(h,{yPercent:60,opacity:0,clipPath:'inset(0 0 100% 0)',duration:1.1,ease:'expo.out',scrollTrigger:{trigger:h,start:'top 88%'}}));
  gsap.utils.toArray('.model,.note').forEach(el=>gsap.from(el,{y:40,opacity:0,duration:1,ease:'expo.out',scrollTrigger:{trigger:el,start:'top 92%'}}));
  {const fill=$('#tl-fill'),steps=$$('.tl-step'),vert=!desktop();fill.style.transformOrigin=vert?'top':'left';
    gsap.set(fill,vert?{scaleY:0}:{scaleX:0});gsap.set(steps,{opacity:.25});
    $$('.tl-ico path,.tl-ico circle,.tl-ico rect').forEach(e=>{const L=e.getTotalLength?e.getTotalLength():60;e.style.strokeDasharray=L;e.style.strokeDashoffset=L;});
    const pt=gsap.timeline({paused:true,defaults:{ease:'power2.out'}});
    pt.to(fill,{...(vert?{scaleY:1}:{scaleX:1}),duration:3.0,ease:'none'},0);
    steps.forEach((st,k)=>{const t=k/(steps.length-1)*3.0;
      pt.to(st,{opacity:1,duration:.5},t).call(()=>st.classList.add('lit'),null,t)
        .fromTo($('.tl-num',st),{scale:.7},{scale:1,duration:.7,ease:'back.out(2.2)'},t)
        .to($$('.tl-ico *',st),{strokeDashoffset:0,duration:.9,stagger:.08},t+.05)
        .from($$('b,small',st),{y:10,opacity:0,duration:.6,stagger:.06},t+.1)
        .from($('.tl-big',st),{opacity:0,duration:.8},t);});
    ScrollTrigger.create({trigger:'.proc-panel',start:'top 72%',once:true,onEnter:()=>pt.play()});}
  $$('.cases .count').forEach(el=>ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:()=>countUp(el)}));

  // capabilities storytelling
  const mm=gsap.matchMedia();
  mm.add('(min-width: 0px)',()=>{capPanes.forEach(p=>$$('.count',p).forEach(el=>ScrollTrigger.create({trigger:el,start:'top 90%',once:true,onEnter:()=>countUp(el)})));});

  $$('.cap-pane').forEach(p=>gsap.from(p.children,{y:16,opacity:0,stagger:.08,duration:.9,ease:'expo.out',scrollTrigger:{trigger:p,start:'top 82%'}}));
  $$('.cap-media').forEach(m=>gsap.fromTo(m,{opacity:0,clipPath:'inset(8% 8% 8% 8% round 24px)'},{opacity:1,clipPath:'inset(0% 0% 0% 0% round 24px)',duration:1.3,ease:'expo.out',scrollTrigger:{trigger:m,start:'top 85%'}}));
  ScrollTrigger.addEventListener('refresh',()=>{layoutLine();});
  addEventListener('load',()=>ScrollTrigger.refresh());
  navState();ScrollTrigger.refresh();
})();
