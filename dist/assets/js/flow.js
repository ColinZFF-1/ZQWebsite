/* 昭桥 preview-flow：视频承载转场（hero→能力1 共享元素变形；能力间镜头推拉；后续屏推轨） */
(function(){
  'use strict';
  const root=document.documentElement;
  const desk=innerWidth>900&&innerHeight>=560;
  if(!desk||!('animate' in Element.prototype))return;          // mobile: keep native snap + crossfades
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.ZQ_FLOW=true;root.classList.add('flow');
  const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
  const D=1100,EASE='cubic-bezier(.76,0,.24,1)';
  const q=t=>t<.5?8*t*t*t*t:1-Math.pow(-2*t+2,4)/2;             // quart in-out (for computed frames)
  const xo=t=>t===1?1:1-Math.pow(2,-10*t);                        // expo out
  let S,cur=0,busy=false;
  function frames(fn,n=24,ease=q){const f=[];for(let k=0;k<=n;k++){const t=k/n;f.push(Object.assign({offset:t},fn(ease(t),t)));}return f;}
  const textEls=sc=>$$('.hero-kicker,#hero-title,.hero-sub,.hero-ctas,.cap-pane .kicker,.cap-pane h2,.cap-body,.cap-inc,.cap-deliv,.copy-link',sc);
  const outEls=sc=>$$('.hero-head,.hero-ctas,.hero-scroll,.cap-pane',sc);
  function run(list,rev){return Promise.all(list.map(([el,kf,opt])=>{const a=el.animate(kf,Object.assign({duration:D,easing:'linear',fill:'both'},opt,rev?{direction:'reverse'}:{}));a._el=el;return a.finished.then(()=>a);}));}
  const textOut=(sc,dy=-18,o={})=>outEls(sc).map(e=>[e,[{opacity:1,transform:'none'},{opacity:0,transform:`translateY(${dy}px)`}],Object.assign({duration:D*.36,easing:'cubic-bezier(.5,0,.75,0)'},o)]);
  const textIn=(sc,dy=22,o={})=>textEls(sc).map((e,i)=>[e,[{opacity:0,transform:`translateY(${dy}px)`},{opacity:1,transform:'none'}],Object.assign({duration:D*.6,easing:'cubic-bezier(.16,1,.3,1)',delay:D*.48+i*45},o)]);
  const rect=el=>el.getBoundingClientRect();

  // hero -> cap1: hero video pushes in, then morphs into cap1 frame
  function heroToCap(a,b){const bg=$('.hero-bg',a),v=$('video',bg),m=$('.cap-media',b),r=rect(m),W=innerWidth,H=innerHeight;
    const sx=r.width/W,sy=r.height/H,s=Math.max(sx,sy),P=.28,k0=1.14;
    const outer=frames((e,t)=>{if(t<=P){const k=1+(k0-1)*q(t/P);return {transform:`translate(${(1-k)*W/2}px,${(1-k)*H/2}px) scale(${k})`};}
      const u=q((t-P)/(1-P)),X=(1-k0)*W/2,Y=(1-k0)*H/2,kx=k0+(sx-k0)*u,ky=k0+(sy-k0)*u;
      return {transform:`translate(${X+(r.left-X)*u}px,${Y+(r.top-Y)*u}px) scale(${kx},${ky})`};},32,t=>t);
    const inner=frames((e,t)=>{if(t<=P)return {transform:'none'};const u=q((t-P)/(1-P)),kx=k0+(sx-k0)*u,ky=k0+(sy-k0)*u,ss=k0+(s-k0)*u;return {transform:`scale(${ss/kx},${ss/ky})`};},32,t=>t);
    const ov=[{opacity:1},{opacity:0,offset:.5},{opacity:0}];
    return [[bg,outer],[v,inner],[bg,[{opacity:1},{opacity:1,offset:.86},{opacity:0}]],
      [m,[{opacity:0},{opacity:0,offset:.8},{opacity:1}]],
      ...textOut(a,-26),...textIn(b)];}

  // cap -> cap: current pushes toward camera, next grows out of it
  function capToCap(a,b){const ma=$('.cap-media',a),mb=$('.cap-media',b),ra=rect(ma),rb=rect(mb);
    const dx=(ra.left+ra.width/2)-(rb.left+rb.width/2),dy=(ra.top+ra.height/2)-(rb.top+rb.height/2),k=ra.width/rb.width;
    return [[ma,frames(e=>({transform:`scale(${1+.22*e})`,opacity:1-Math.min(1,e*2.4)}))],
      [mb,frames(e=>({transform:`translate(${dx*(1-e)}px,${dy*(1-e)}px) scale(${(k*.72)+(1-k*.72)*e})`,opacity:Math.min(1,e*2.2)}),24,t=>xo(q(t)*.5+t*.5))],
      [$('video',mb),frames(e=>({transform:`scale(${1.25-.25*e})`}))],
      ...textOut(a),...textIn(b)];}

  // dolly: into / out of cases, process, contact
  function dolly(a,b){const L=[[a,[{opacity:1,transform:'scale(1)'},{opacity:0,transform:'scale(.95)'}],{duration:D*.6,easing:'cubic-bezier(.5,0,.75,0)'}],
      [b,[{opacity:0,transform:'scale(1.06)'},{opacity:1,transform:'scale(1)'}],{duration:D,easing:'cubic-bezier(.16,1,.3,1)',delay:D*.15}]];
    $$('.case-card',b).forEach((c,i)=>L.push([c,[{opacity:0,transform:`translate3d(${(i-1.5)*-24}px,46px,0) scale(.94)`},{opacity:1,transform:'none'}],{duration:D*.8,easing:'cubic-bezier(.16,1,.3,1)',delay:D*.35+i*70}]));
    $$('.pstep,.model',b).forEach((c,i)=>L.push([c,[{opacity:0,transform:'translateY(26px)'},{opacity:1,transform:'none'}],{duration:D*.7,easing:'cubic-bezier(.16,1,.3,1)',delay:D*.4+i*40}]));
    return L;}
  function fade(a,b){return [[a,[{opacity:1},{opacity:0}],{duration:450,easing:'ease'}],[b,[{opacity:0},{opacity:1}],{duration:500,delay:200,easing:'ease'}]];}

  function plan(i,j){const lo=Math.min(i,j),hi=Math.max(i,j),A=S[lo],B=S[hi];
    if(reduce)return {list:fade(S[i],S[j]),rev:false};
    if(hi-lo===1&&lo===0)return {list:heroToCap(A,B),rev:j<i,top:j<i?B:A};
    if(hi-lo===1&&lo>=1&&hi<=4)return {list:capToCap(A,B),rev:j<i,top:B};
    return {list:dolly(S[i],S[j]),rev:false,top:S[j]};}

  function go(j){j=Math.max(0,Math.min(S.length-1,j));if(busy||j===cur)return;busy=true;const i=cur,a=S[i],b=S[j];
    b.classList.add('cur');const p=plan(i,j);S.forEach(s=>s.style.zIndex='');(p.top||b).style.zIndex=3;(p.top===b?a:b).style.zIndex=2;
    const late=b.matches('.cases,.process');window.ZQ_BUSY=true;root.classList.add('busy');if(!late&&window.ZQactivate)ZQactivate(b);
    run(p.list,p.rev).then(anims=>{window.ZQ_BUSY=false;root.classList.remove('busy');if(late&&window.ZQactivate)ZQactivate(b);a.classList.remove('cur');anims.forEach(x=>x.cancel());cur=j;busy=false;history.replaceState(null,'',j?'#'+(b.id||''):location.pathname);});
    window.__zqLast=performance.now();}
  window.ZQgo=go;

  document.addEventListener('DOMContentLoaded',()=>{S=$$('[data-screen]');S[0].classList.add('cur');window.ZQactivate&&ZQactivate(S[0]);
    let lastWheel=0,acc=0;
    addEventListener('wheel',e=>{e.preventDefault();const now=performance.now();if(busy||now-lastWheel<(now-(window.__zqLast||0)<D+500?D+500:0)){return;}
      acc+=e.deltaY;if(Math.abs(acc)>30){lastWheel=now;go(cur+(acc>0?1:-1));acc=0;}},{passive:false});
    addEventListener('keydown',e=>{if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();go(cur+1);}else if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();go(cur-1);}
      else if(e.key==='Home')go(0);else if(e.key==='End')go(S.length-1);});
    document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const t=$(a.getAttribute('href')==='#top'?'.hero':a.getAttribute('href'));if(!t)return;
      const sc=t.closest('[data-screen]');if(sc){e.preventDefault();go(S.indexOf(sc));}});
  });
})();
