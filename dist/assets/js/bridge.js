/* 昭桥 preview：3D 玻璃桥 hero（Three.js r160，本地） */
import * as T from './three.module.min.js';
export function start(host,{mobile=false}={}){
  const R=new T.WebGLRenderer({antialias:!mobile,alpha:false,powerPreference:'high-performance'});
  R.setPixelRatio(Math.min(1.5,devicePixelRatio||1));R.setClearColor(0x2a2763,1);R.outputColorSpace=T.SRGBColorSpace;
  host.appendChild(R.domElement);
  const S=new T.Scene();S.fog=new T.Fog(0x2a2763,9,26);
  const C=new T.PerspectiveCamera(34,1,.1,80);
  S.add(new T.AmbientLight(0x8f86d8,.9));
  const l1=new T.PointLight(0xa58cff,40,30);l1.position.set(-4,4,4);S.add(l1);
  const l2=new T.PointLight(0xffd27a,18,24);l2.position.set(4,3,3);S.add(l2);
  const W=new T.Group();S.add(W);const B=new T.Group();W.add(B);
  const glass=new T.MeshPhysicalMaterial({color:0xb9b2ff,metalness:0,roughness:.12,clearcoat:1,clearcoatRoughness:.1,transparent:true,opacity:.28,emissive:0x2c2470,emissiveIntensity:.6,side:T.DoubleSide,depthWrite:false});
  const edgeM=new T.LineBasicMaterial({color:0xc9c0ff,transparent:true,opacity:.75,blending:T.AdditiveBlending,depthWrite:false});
  const add=(geo,pos)=>{const m=new T.Mesh(geo,glass);m.position.copy(pos);B.add(m);const e=new T.LineSegments(new T.EdgesGeometry(geo),edgeM);e.position.copy(pos);B.add(e);return m;};
  const SPAN=6.2,TX=3.1,TH=3.2;
  add(new T.BoxGeometry(SPAN*2,.09,1.15),new T.Vector3(0,0,0));
  [-TX,TX].forEach(x=>[-.55,.55].forEach(z=>add(new T.BoxGeometry(.16,TH+1.2,.16),new T.Vector3(x,(TH+1.2)/2-1.2,z))));
  [-TX,TX].forEach(x=>{add(new T.BoxGeometry(.14,.12,1.26),new T.Vector3(x,TH-.25,0));add(new T.BoxGeometry(.14,.1,1.26),new T.Vector3(x,1.4,0));});
  // cables
  const cy=x=>{const a=Math.abs(x);if(a<=TX){const u=a/TX;return .95+(TH-.95)*u*u;}const u=(a-TX)/(SPAN-TX);return TH-(TH-.12)*Math.pow(u,.8);};
  const glowM=(c,o)=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:o,blending:T.AdditiveBlending,depthWrite:false});
  const cables=[];
  [-.55,.55].forEach(z=>{const pts=[];for(let i=0;i<=60;i++){const x=-SPAN+i/60*SPAN*2;pts.push(new T.Vector3(x,cy(x),z));}
    const cv=new T.CatmullRomCurve3(pts);cables.push(cv);const seg=mobile?80:160;
    B.add(new T.Mesh(new T.TubeGeometry(cv,seg,.018,6),glowM(0xe6e0ff,.95)));
    B.add(new T.Mesh(new T.TubeGeometry(cv,seg,.075,8),glowM(0x8a78ff,.14)));
    // hangers
    const hp=[];for(let x=-SPAN+.35;x<SPAN;x+=mobile?.5:.32){if(Math.abs(Math.abs(x)-TX)<.15)continue;hp.push(x,.05,z,x,cy(x),z);}
    const hg=new T.BufferGeometry();hg.setAttribute('position',new T.Float32BufferAttribute(hp,3));
    B.add(new T.LineSegments(hg,new T.LineBasicMaterial({color:0xb7acff,transparent:true,opacity:.35,blending:T.AdditiveBlending,depthWrite:false})));});
  // deck light rails
  [-.58,.58].forEach(z=>{const g=new T.BoxGeometry(SPAN*2,.02,.02);const m=new T.Mesh(g,glowM(0xd8d0ff,.8));m.position.set(0,.05,z);B.add(m);
    const h=new T.Mesh(new T.BoxGeometry(SPAN*2,.12,.12),glowM(0x8a78ff,.1));h.position.copy(m.position);B.add(h);});
  // glow sprites
  const cvs=document.createElement('canvas');cvs.width=cvs.height=64;const g2=cvs.getContext('2d');const gr=g2.createRadialGradient(32,32,0,32,32,32);
  gr.addColorStop(0,'rgba(255,255,255,1)');gr.addColorStop(.25,'rgba(255,255,255,.5)');gr.addColorStop(1,'rgba(255,255,255,0)');g2.fillStyle=gr;g2.fillRect(0,0,64,64);
  const dot=new T.CanvasTexture(cvs);
  const spr=(c,s,p,o=1)=>{const m=new T.Sprite(new T.SpriteMaterial({map:dot,color:c,transparent:true,opacity:o,blending:T.AdditiveBlending,depthWrite:false}));m.scale.set(s,s,1);m.position.copy(p);B.add(m);return m;};
  const beacons=[spr(0xffd27a,.9,new T.Vector3(-TX,TH+.05,0)),spr(0xffd27a,.9,new T.Vector3(TX,TH+.05,0))];
  spr(0x9a8cff,3.2,new T.Vector3(-SPAN,.1,0),.55);spr(0xffd27a,3.2,new T.Vector3(SPAN,.1,0),.45);
  // reflection
  const ref=B.clone();ref.scale.y=-1;ref.position.y=-.9;ref.traverse(o=>{if(o.material){o.material=o.material.clone();o.material.opacity*=.16;}});W.add(ref);
  // floor grid
  const grid=new T.GridHelper(40,40,0x6f66c8,0x4d46a0);grid.position.y=-.45;grid.material.transparent=true;grid.material.opacity=.18;grid.material.depthWrite=false;W.add(grid);
  // flowing data particles: AI (left, violet) -> business (right, gold)
  const N=mobile?70:240,pos=new Float32Array(N*3),col=new Float32Array(N*3),P=[];
  const cA=new T.Color(0xa99bff),cB=new T.Color(0xffd27a),tmp=new T.Color();
  for(let i=0;i<N;i++)P.push({t:Math.random(),v:.035+Math.random()*.05,lane:Math.random()<.3?(Math.random()<.5?0:1):-1,z:(Math.random()-.5)*.9,y:.08+Math.random()*.1});
  const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pos,3));pg.setAttribute('color',new T.BufferAttribute(col,3));
  const pts=new T.Points(pg,new T.PointsMaterial({size:mobile?.11:.085,map:dot,vertexColors:true,transparent:true,opacity:.95,blending:T.AdditiveBlending,depthWrite:false,sizeAttenuation:true}));B.add(pts);
  const v3=new T.Vector3();
  function flow(dt){for(let i=0;i<N;i++){const p=P[i];p.t+=p.v*dt;if(p.t>=1)p.t-=1;if(p.t<0)p.t=0;
      if(p.lane>=0){cables[p.lane].getPointAt(p.t,v3);}else v3.set(-SPAN+p.t*SPAN*2,p.y,p.z);
      pos[i*3]=v3.x;pos[i*3+1]=v3.y;pos[i*3+2]=v3.z;const f=Math.sin(Math.PI*p.t);tmp.copy(cA).lerp(cB,p.t).multiplyScalar(.35+.65*f);col[i*3]=tmp.r;col[i*3+1]=tmp.g;col[i*3+2]=tmp.b;}
    pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true;}
  // sizing
  let base=11;function size(){const w=host.clientWidth,h=host.clientHeight;R.setSize(w,h,false);R.domElement.style.width='100%';R.domElement.style.height='100%';C.aspect=w/h;
    const vfov=C.fov*Math.PI/180,hf=2*Math.atan(Math.tan(vfov/2)*C.aspect);base=Math.max(10.5,(SPAN*(C.aspect<1?.8:1.5))/Math.tan(hf/2));C.updateProjectionMatrix();}
  size();addEventListener('resize',size);
  // input + scroll (targets only; smoothing in render loop)
  let mx=0,my=0,sm={x:0,y:0,p:0};
  addEventListener('pointermove',e=>{mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1;},{passive:true});
  const prog=()=>Math.min(1.2,Math.max(0,scrollY/innerHeight));
  let run=true,vis=true,last=performance.now(),t=0;
  new IntersectionObserver(es=>{vis=es[0].isIntersecting;if(vis&&run)loop0();},{threshold:0}).observe(host);
  document.addEventListener('visibilitychange',()=>{run=!document.hidden;if(run&&vis)loop0();});
  let looping=false;function loop0(){if(!looping){looping=true;last=performance.now();requestAnimationFrame(loop);}}
  function loop(now){if(!run||!vis){looping=false;return;}requestAnimationFrame(loop);const dt=Math.max(0,Math.min(.05,(now-last)/1000));last=now;t+=dt;
    const k=1-Math.pow(.0015,dt);sm.x+=(mx-sm.x)*k*.6;sm.y+=(my-sm.y)*k*.6;sm.p+=(prog()-sm.p)*k;
    const p=sm.p,e=p*p*(3-2*p);
    C.position.set(Math.sin(t*.06)*.9+sm.x*.8,1.35-sm.y*.35+e*1.2,base+e*7);C.lookAt(0,(C.aspect<1?3.6:3.9)-e*.6,0);
    W.rotation.y=-.18+Math.sin(t*.05)*.05+e*.75;W.position.y=-e*.6;
    beacons.forEach((b,i)=>{const s=.8+Math.sin(t*1.6+i*2)*.12;b.scale.set(s,s,1);});
    flow(dt);R.render(S,C);}
  loop0();
  return {renderer:R};
}
