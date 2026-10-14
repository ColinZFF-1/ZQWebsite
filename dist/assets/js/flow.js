/* 昭桥 视频承载转场（hero→能力1 共享元素变形；能力间镜头推拉；后续屏推轨） */
(function(){
  'use strict';
  const root=document.documentElement;
  const desk=innerWidth>900&&innerHeight>=560;
  if(!desk||!('animate' in Element.prototype))return;          // mobile: keep native snap + crossfades
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.ZQ_FLOW=true;const HASH0=location.hash;root.classList.add('flow');
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const q=t=>t<.5?8*t*t*t*t:1-Math.pow(-2*t+2,4)/2;             // quart in-out
  const xo=t=>t===1?1:1-Math.pow(2,-10*t);                        // expo out
  const OUT=200, EXPO='cubic-bezier(.16,1,.3,1)', IN_E='cubic-bezier(.5,0,.75,0)';
  let S,cur=0,busy=false;
  function frames(fn,n=24,ease=q){const f=[];for(let k=0;k<=n;k++){const t=k/n;f.push(Object.assign({offset:t},fn(ease(t),t)));}return f;}
  const inEls=sc=>sc.classList.contains('hero')?$$('.hero-kicker,#hero-title,.hero-sub,.hero-ctas',sc)
    :sc.classList.contains('cap')?$$('.cap-pane>*',sc)
    :$$('.sec-head .kicker,.sec-head h2,.sec-note,.case-card,.proc,.pnotes .note,.contact-main',sc);
  const outEls=sc=>$$('.hero-head,.hero-ctas,.hero-scroll,.cap-pane,.sec-head,.case-grid,.proc,.pnotes,.contact-main',sc);
  // phase helpers (explicit delays; never play in reverse, so it's always out -> move -> in)
  const textOut=sc=>outEls(sc).map(e=>[e,[{opacity:1,transform:'none'},{opacity:0,transform:'translateY(-10px)'}],{duration:OUT,easing:IN_E}]);
  const textIn=(sc,at)=>inEls(sc).map((e,i)=>[e,[{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:440,easing:EXPO,delay:at+Math.min(i,8)*45}]);
  function run(list){return Promise.all(list.map(([el,kf,opt])=>{const a=el.animate(kf,Object.assign({duration:600,easing:'linear',fill:'both'},opt));return a.finished.then(()=>a);}));}
  const rect=el=>el.getBoundingClientRect();
  function morphKF(r,expand){const W=innerWidth,H=innerHeight,sx=r.width/W,sy=r.height/H,s=Math.max(sx,sy),k0=expand?1:1.06,P=expand?0:.24;
    const at=u=>{const kx=k0+(sx-k0)*u,ky=k0+(sy-k0)*u,X=(1-k0)*W/2,Y=(1-k0)*H/2;return {o:`translate(${X+(r.left-X)*u}px,${Y+(r.top-Y)*u}px) scale(${kx},${ky})`,i:`scale(${(k0+(s-k0)*u)/kx},${(k0+(s-k0)*u)/ky})`};};
    const outer=frames((e,t)=>{if(!expand&&t<=P){const k=1+(k0-1)*q(t/P);return {transform:`translate(${(1-k)*W/2}px,${(1-k)*H/2}px) scale(${k})`};}
      const u=expand?1-q(t):q((t-P)/(1-P));return {transform:at(u).o};},28,t=>t);
    const inner=frames((e,t)=>{if(!expand&&t<=P)return {transform:'none'};const u=expand?1-q(t):q((t-P)/(1-P));return {transform:at(u).i};},28,t=>t);
    return [outer,inner];}
  // hero -> cap1: text out, hero video pushes in and lands in cap1 frame, cap1 video takes over, text in
  function heroToCap(a,b){const bg=$('.hero-bg',a),m=$('.cap-media',b),[o,i]=morphKF(rect(m),false),T=OUT-60,M=640;
    return [...textOut(a),[bg,o,{delay:T,duration:M}],[$('video',bg),i,{delay:T,duration:M}],
      [m,[{opacity:0},{opacity:1}],{delay:T+M-40,duration:160}],...textIn(b,T+200)];}
  // cap1 -> hero: text out, cap1 frame expands into the full-bleed hero video, hero text in
  function capToHero(a,b){const bg=$('.hero-bg',b),[o,i]=morphKF(rect($('.cap-media',a)),true),T=OUT-40,M=620;
    return [...textOut(a),[bg,o,{delay:T,duration:M}],[$('video',bg),i,{delay:T,duration:M}],[bg,[{opacity:0},{opacity:1}],{delay:T,duration:150}],
      ...textIn(b,T+260)];}
  // cap <-> cap: old video pushes toward camera and is gone before the new one grows out of its frame
  function capSwap(a,b){const ma=$('.cap-media',a),mb=$('.cap-media',b),ra=rect(ma),rb=rect(mb);
    const dx=(ra.left+ra.width/2)-(rb.left+rb.width/2),dy=(ra.top+ra.height/2)-(rb.top+rb.height/2),T=260;
    return [...textOut(a),[ma,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(1.12)'}],{duration:T,easing:IN_E}],
      [mb,[{opacity:0,offset:0},{opacity:1,offset:.18}],{delay:T,duration:620,easing:'linear'}],
      [mb,frames(e=>({transform:`translate(${dx*(1-e)}px,${dy*(1-e)}px) scale(${.8+.2*e})`}),20,xo),{delay:T,duration:620}],
      [$('video',mb),[{transform:'scale(1.14)'},{transform:'scale(1)'}],{delay:T,duration:700,easing:EXPO}],
      ...textIn(b,T+80)];}
  // dolly: old content out fast, camera settles from 1.05, new content assembles
  function dolly(a,b){return [[a,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.985)'}],{duration:OUT,easing:IN_E}],
      [b,[{transform:'scale(1.05)'},{transform:'scale(1)'}],{delay:OUT,duration:620,easing:EXPO}],
      ...textIn(b,OUT+40)];}
  function fade(a,b){return [[a,[{opacity:1},{opacity:0}],{duration:160,easing:'ease'}],[b,[{opacity:0},{opacity:1}],{delay:160,duration:260,easing:'ease'}]];}

  function plan(i,j){const a=S[i],b=S[j];
    if(reduce)return {list:fade(a,b),top:b};
    if(i===0&&j===1)return {list:heroToCap(a,b),top:a};
    if(i===1&&j===0)return {list:capToHero(a,b),top:b};
    if(Math.abs(i-j)===1&&Math.min(i,j)>=1&&Math.max(i,j)<=4)return {list:capSwap(a,b),top:b};
    return {list:dolly(a,b),top:b};}

  function go(j,instant){j=Math.max(0,Math.min(S.length-1,j));if(busy||j===cur)return;const i=cur,a=S[i],b=S[j];
    if(instant){a.classList.remove('cur');b.classList.add('cur');cur=j;window.ZQactivate&&ZQactivate(b);return;}
    busy=true;b.classList.add('cur');const p=plan(i,j);S.forEach(s=>s.style.zIndex='');p.top.style.zIndex=3;(p.top===b?a:b).style.zIndex=2;
    window.ZQ_BUSY=true;root.classList.add('busy');
    setTimeout(()=>{window.ZQactivate&&ZQactivate(b);},reduce?120:OUT);
    run(p.list).then(anims=>{a.classList.remove('cur');anims.forEach(x=>x.cancel());S.forEach(s=>s.style.zIndex='');window.ZQ_BUSY=false;root.classList.remove('busy');cur=j;busy=false;});
    window.__zqLast=performance.now();}
  window.ZQgo=go;

  document.addEventListener('DOMContentLoaded',()=>{S=$$('[data-screen]');const h=HASH0&&document.getElementById(HASH0.slice(1));const sc0=(h&&h.closest('[data-screen]'))||S[0];cur=S.indexOf(sc0);sc0.classList.add('cur');window.ZQactivate&&ZQactivate(sc0);
    let lastWheel=0,acc=0;
    addEventListener('wheel',e=>{e.preventDefault();const now=performance.now();if(busy||now-lastWheel<(now-(window.__zqLast||0)<1400?1400:0)){return;}
      acc+=e.deltaY;if(Math.abs(acc)>30){lastWheel=now;go(cur+(acc>0?1:-1));acc=0;}},{passive:false});
    addEventListener('keydown',e=>{if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();go(cur+1);}else if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();go(cur-1);}
      else if(e.key==='Home')go(0);else if(e.key==='End')go(S.length-1);});
    document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const t=$(a.getAttribute('href')==='#top'?'.hero':a.getAttribute('href'));if(!t)return;
      const sc=t.closest('[data-screen]');if(sc){e.preventDefault();go(S.indexOf(sc));}});
  });
})();
