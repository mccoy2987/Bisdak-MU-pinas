import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js";
const $=s=>document.querySelector(s), msg=t=>$("#message").textContent=t;
let token=localStorage.getItem("bmu_token"),user=null,character=null,scene,camera,renderer,avatar,socket,keys={},pos={x:0,z:0},clock=new THREE.Clock(),walkPhase=0;
const mat=(color,roughness=.85,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
const M={grass:mat(0x536b3d),stone:mat(0x77766d),darkStone:mat(0x454641),timber:mat(0x49301e),wood:mat(0x704b2c),plaster:mat(0xb5a17b),roof:mat(0x56352b),roof2:mat(0x704334),gold:mat(0xc69a48,.35,.65),steel:mat(0x9ca7b3,.3,.75),steelDark:mat(0x465565,.35,.65),leather:mat(0x493324),cape:mat(0x741f24),skin:mat(0xc9946b),tree:mat(0x294a2b),tree2:mat(0x3b5c32),water:mat(0x568b91,.25,.25),torch: new THREE.MeshStandardMaterial({color:0xffa33d,emissive:0xff6818,emissiveIntensity:2})};
function mesh(g,m,parent,x=0,y=0,z=0){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
function box(p,m,x,y,z,w,h,d){return mesh(new THREE.BoxGeometry(w,h,d),m,p,x,y,z)}
function cylinder(p,m,x,y,z,r1,r2,h,n=8){return mesh(new THREE.CylinderGeometry(r1,r2,h,n),m,p,x,y,z)}
function tree(x,z){const g=new THREE.Group();scene.add(g);g.position.set(x,0,z);cylinder(g,M.wood,0,1,0,.22,.3,2);for(let i=0;i<3;i++){const c=mesh(new THREE.IcosahedronGeometry(1.1-i*.13,1),i===1?M.tree2:M.tree,g,0,2.2+i*.62,0);c.scale.set(1.05,.9,1.05)}}
function house(x,z,scale=1,roofMat=M.roof){const g=new THREE.Group();scene.add(g);g.position.set(x,0,z);const s=scale;box(g,M.plaster,0,1.25,0,4*s,2.5*s,3.3*s);box(g,M.timber,0,.15,1.68*s,4.1*s,.25*s,.18*s);box(g,M.timber,-1.95*s,1.25,0,.18*s,2.55*s,3.45*s);box(g,M.timber,1.95*s,1.25,0,.18*s,2.55*s,3.45*s);
const roof=mesh(new THREE.ConeGeometry(3.05*s,1.8*s,4),roofMat,g,0,3.25*s,0);roof.rotation.y=Math.PI/4;roof.scale.z=.8;
box(g,M.wood,0,.75*s,1.72*s,.85*s,1.5*s,.12*s);const win1=box(g,M.steelDark,-1.25*s,1.55*s,1.73*s,.55*s,.65*s,.1*s);box(g,M.timber,-1.25*s,1.55*s,1.8*s,.08*s,.8*s,.12*s);box(g,M.timber,-1.25*s,1.55*s,1.8*s,.65*s,.08*s,.12*s);
}
function lamp(x,z){const g=new THREE.Group();scene.add(g);g.position.set(x,0,z);cylinder(g,M.darkStone,0,.2,0,.25,.3,.4);cylinder(g,M.timber,0,1.35,0,.08,.1,2);box(g,M.gold,0,2.35,0,.48,.12,.48);const glow=mesh(new THREE.SphereGeometry(.17,8,8),M.torch,g,0,2.1,0);const l=new THREE.PointLight(0xffa34d,1.5,8);l.position.set(0,2.1,0);g.add(l)}
function buildLorencia(){scene.background=new THREE.Color(0x9db5b4);scene.fog=new THREE.Fog(0x9db5b4,38,105);
const ground=mesh(new THREE.PlaneGeometry(180,180),M.grass,scene,0,-.12,0);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;
// town square cobbles
const square=mesh(new THREE.CircleGeometry(15,48),M.stone,scene,0,-.02,0);square.rotation.x=-Math.PI/2;
const ring=mesh(new THREE.TorusGeometry(10,.22,6,64),M.darkStone,scene,0,.015,0);ring.rotation.x=Math.PI/2;
// cobblestone scatter in town
for(let i=0;i<380;i++){const a=Math.random()*Math.PI*2,r=Math.sqrt(Math.random())*14;const p=box(scene,i%4?M.stone:M.darkStone,Math.cos(a)*r,.015,Math.sin(a)*r,.55+Math.random()*.35,.045,.45+Math.random()*.25);p.rotation.y=Math.random()*Math.PI}
// fountain
cylinder(scene,M.darkStone,0,.22,-1,2.4,2.4,.42,12);cylinder(scene,M.stone,0,.48,-1,1.95,2.2,.22,12);const pool=cylinder(scene,M.water,0,.61,-1,1.72,1.72,.08,32);cylinder(scene,M.darkStone,0,1.1,-1,.42,.55,.9,10);cylinder(scene,M.stone,0,1.65,-1,.18,.32,.25,8);const jet=mesh(new THREE.ConeGeometry(.12,.8,8),M.water,scene,0,2.05,-1);
// houses around square
house(-12,-10,1.25,M.roof);house(12,-11,1.15,M.roof2);house(-13,10,1.1,M.roof2);house(13,10,1.3,M.roof);
for(let i=0;i<10;i++){const a=i*Math.PI/5;tree(Math.cos(a)*27,Math.sin(a)*25)}
for(const [x,z] of [[-7,-5],[7,-5],[-7,5],[7,5],[-18,0],[18,0]])lamp(x,z);
// stone road leaving the town to north
for(let i=0;i<15;i++){box(scene,M.stone,0,-.005,-18-i*2,5,.06,1.7)}
// distant low hills
for(let i=0;i<18;i++){const a=i*Math.PI*2/18,r=57;const h=10+Math.random()*9;const hill=mesh(new THREE.ConeGeometry(13,h,7),mat(i%2?0x526a48:0x66734c),scene,Math.cos(a)*r,h/2-1,Math.sin(a)*r);hill.scale.z=.75}
}
// Original low-poly MU-classic-inspired knight; no ripped game files.
function makeKnight(){
  const g=new THREE.Group(), armor=M.steel, dark=M.steelDark, trim=M.gold, skin=M.skin;
  const ell=(p,m,x,y,z,sx,sy,sz)=>{const o=mesh(new THREE.SphereGeometry(1,12,10),m,p,x,y,z);o.scale.set(sx,sy,sz);return o};
  const plate=(p,m,x,y,z,sx,sy,sz)=>ell(p,m,x,y,z,sx,sy,sz);
  // Broad shoulders, powerful chest and tapered waist, following the supplied character reference.
  ell(g,M.leather,0,1.23,0,.43,.43,.27); // waist under the armor
  ell(g,skin,0,1.57,0,.53,.42,.30);     // muscular chest base
  ell(g,skin,-.25,1.58,.015,.30,.32,.28);
  ell(g,skin,.25,1.58,.015,.30,.32,.28);
  ell(g,skin,0,1.19,.015,.34,.29,.23);
  // segmented abdominal silhouette beneath breastplate
  for(let i=0;i<3;i++)for(const x of [-.13,.13])ell(g,skin,x,1.34-i*.105,.225,.115,.065,.045);
  // dark steel breastplate, raised center ridge and gold edging
  plate(g,armor,0,1.57,.245,.48,.34,.105);
  plate(g,dark,0,1.52,.34,.075,.30,.035);
  for(const x of [-.25,.25])plate(g,trim,x,1.55,.315,.035,.25,.025);
  box(g,trim,0,1.22,.245,.40,.075,.06);
  // Neck and closed great helm
  cylinder(g,skin,0,1.98,0,.16,.18,.22,8);
  const helm=mesh(new THREE.SphereGeometry(.31,10,8),armor,g,0,2.20,0);helm.scale.set(1,.95,.92);
  const face=box(g,dark,0,2.13,.275,.20,.25,.055);
  box(g,trim,0,2.23,.315,.24,.045,.025);
  const visor=box(g,M.leather,0,2.12,.31,.19,.035,.035);
  const crest=mesh(new THREE.ConeGeometry(.12,.42,5),M.cape,g,0,2.57,-.015);crest.rotation.z=-.08;
  // Shoulder pivots and articulated arms, broad like the reference physique
  const armL=new THREE.Group(),armR=new THREE.Group();g.add(armL,armR);armL.position.set(-.52,1.76,0);armR.position.set(.52,1.76,0);
  for(const [arm,sign] of [[armL,-1],[armR,1]]){
    ell(arm,skin,sign*.12,-.13,0,.19,.25,.19);
    plate(arm,armor,sign*.02,-.015,0,.27,.20,.24);
    plate(arm,trim,sign*.02,-.12,.19,.19,.035,.035);
    const upper=ell(arm,dark,sign*.12,-.38,0,.14,.25,.14);
    const fore=ell(arm,armor,sign*.13,-.67,.015,.16,.22,.16);
    plate(arm,trim,sign*.13,-.66,.14,.12,.045,.035);
    ell(arm,skin,sign*.13,-.88,.03,.13,.13,.12);
    // small articulated fingers
    for(let f=0;f<3;f++)box(arm,dark,sign*(.07+f*.055),-.99,.06,.035,.12,.045);
  }
  // waist belt and armored fauld
  cylinder(g,dark,0,1.04,0,.34,.38,.18,10);
  box(g,trim,0,1.04,.29,.17,.15,.045);
  for(const x of [-.22,0,.22]){const t=mesh(new THREE.BoxGeometry(.22,.48,.10),armor,g,x,.78,.18);t.rotation.z=x*.28;box(g,dark,x,.56,.19,.19,.055,.12)}
  // articulated thighs, greaves and plated boots
  const legL=new THREE.Group(),legR=new THREE.Group();g.add(legL,legR);legL.position.set(-.21,.88,0);legR.position.set(.21,.88,0);
  for(const [leg,sign] of [[legL,-1],[legR,1]]){
    ell(leg,M.leather,0,-.13,0,.17,.25,.17);
    ell(leg,dark,0,-.35,0,.145,.23,.15);
    plate(leg,armor,0,-.40,.035,.16,.20,.16);
    plate(leg,trim,0,-.43,.17,.11,.035,.025);
    ell(leg,dark,0,-.67,0,.12,.20,.13);
    plate(leg,armor,0,-.69,.025,.14,.19,.14);
    box(leg,dark,0,-.87,.08,.27,.17,.38);
    box(leg,trim,0,-.81,.26,.20,.045,.035);
  }
  // heavy crimson back cape
  const cape=mesh(new THREE.BoxGeometry(.78,1.12,.075),M.cape,g,0,1.18,-.30);cape.rotation.x=-.13;
  // sword held in right hand
  const sword=new THREE.Group();g.add(sword);sword.position.set(.78,.93,.05);sword.rotation.z=-.12;
  cylinder(sword,M.leather,0,0,0,.075,.075,.27,8);
  box(sword,trim,0,.16,0,.40,.075,.10);
  const blade=mesh(new THREE.BoxGeometry(.13,.92,.065),armor,sword,0,.66,0);
  const tip=mesh(new THREE.ConeGeometry(.092,.22,4),armor,sword,0,1.23,0);tip.rotation.z=Math.PI;
  // kite shield on left forearm
  const shield=mesh(new THREE.CylinderGeometry(.34,.42,.12,6),dark,g,-.78,1.20,.16);shield.rotation.z=Math.PI/2;
  plate(g,armor,-.86,1.20,.23,.24,.32,.055);
  const shieldBoss=mesh(new THREE.OctahedronGeometry(.13),trim,g,-.86,1.20,.30);
  g.userData={legs:[legL,legR],arms:[armL,armR],cape,sword,torso:g};
  return g;
}
document.querySelectorAll("[data-tab]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-tab]").forEach(x=>x.classList.toggle("active",x===b));$(".auth:not(.hidden)")?.classList.add("hidden");$("#"+b.dataset.tab).classList.remove("hidden");msg("");});
async function api(url,body){const r=await fetch(url,{method:body?"POST":"GET",headers:{"Content-Type":"application/json",...(token?{Authorization:"Bearer "+token}:{})},body:body?JSON.stringify(body):undefined});const d=await r.json();if(!r.ok)throw Error(d.error||"Request failed");return d;}
$("#login").onsubmit=async e=>{e.preventDefault();try{const f=new FormData(e.target),d=await api("/api/login",{login:f.get("login"),password:f.get("password")});loginDone(d);}catch(x){msg(x.message);}};
$("#register").onsubmit=async e=>{e.preventDefault();try{const f=new FormData(e.target),d=await api("/api/register",{username:f.get("username"),email:f.get("email"),password:f.get("password")});loginDone(d);}catch(x){msg(x.message);}};
function loginDone(d){token=d.token;user=d.user;localStorage.setItem("bmu_token",token);loadAccount();}
async function loadAccount(){try{const d=await api("/api/me");user=d.user;$("#landing").classList.add("hidden");$("#account").classList.remove("hidden");$("#playername").textContent=user.username;$("#characters").innerHTML=d.characters.map(c=>'<div class="character"><b>'+safe(c.name)+'</b> · '+safe(c.class)+' · Lv. '+c.level+' <button data-char="'+c.id+'">PLAY</button></div>').join("")||"<p>No characters yet. Create your first hero.</p>";$("#characters").querySelectorAll("[data-char]").forEach(b=>b.onclick=()=>{character=d.characters.find(c=>c.id==b.dataset.char);enterWorld();});const cs=await api("/api/classes");$("#class-select").innerHTML=cs.classes.map(c=>'<option>'+safe(c)+'</option>').join("");}catch{localStorage.removeItem("bmu_token");token=null;}}
$("#create-character").onsubmit=async e=>{e.preventDefault();try{const f=new FormData(e.target);await api("/api/characters",{name:f.get("name"),characterClass:f.get("characterClass")});loadAccount();}catch(x){alert(x.message);}};
$("#logout").onclick=()=>{localStorage.removeItem("bmu_token");location.reload();};
function safe(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function enterWorld(){$("#account").classList.add("hidden");$("#game").classList.remove("hidden");$("#hero-label").textContent=character?.name||"Warrior";init3D();socket=io();socket.emit("player:join",token);socket.on("world:players",p=>$("#online").textContent="Players: "+p.length);socket.on("world:entered",()=>$("#online").textContent="Player joined");}
function init3D(){scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(52,1,.1,220);renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:"high-performance"});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;$("#world").innerHTML="";$("#world").appendChild(renderer.domElement);scene.add(new THREE.HemisphereLight(0xdceaff,0x45412c,2.1));const sun=new THREE.DirectionalLight(0xffdfb0,2.5);sun.position.set(-18,32,12);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-45;sun.shadow.camera.right=45;sun.shadow.camera.top=45;sun.shadow.camera.bottom=-45;scene.add(sun);buildLorencia();avatar=makeKnight();scene.add(avatar);resize();window.addEventListener("resize",resize);function resize(){const w=$("#world").clientWidth,h=$("#world").clientHeight;renderer.setSize(w,h);camera.aspect=w/h;camera.updateProjectionMatrix();}let last=0;function loop(t){requestAnimationFrame(loop);const dt=Math.min((t-last)/1000,.05);last=t;let dx=0,dz=0;if(keys.w||keys.ArrowUp)dz-=1;if(keys.s||keys.ArrowDown)dz+=1;if(keys.a||keys.ArrowLeft)dx-=1;if(keys.d||keys.ArrowRight)dx+=1;const moving=!!(dx||dz);if(moving){const len=Math.hypot(dx,dz);pos.x+=dx/len*5.2*dt;pos.z+=dz/len*5.2*dt;pos.x=Math.max(-45,Math.min(45,pos.x));pos.z=Math.max(-45,Math.min(45,pos.z));avatar.rotation.y=Math.atan2(dx,dz);walkPhase+=dt*10;avatar.userData.legs[0].rotation.x=Math.sin(walkPhase)*.55;avatar.userData.legs[1].rotation.x=-Math.sin(walkPhase)*.55;avatar.userData.arms[0].rotation.x=-Math.sin(walkPhase)*.3;avatar.userData.arms[1].rotation.x=Math.sin(walkPhase)*.3;}else{avatar.userData.legs.forEach(o=>o.rotation.x*=.8);avatar.userData.arms.forEach(o=>o.rotation.x*=.8);avatar.position.y=.025+Math.sin(t*.002)*.025;}avatar.position.x=pos.x;avatar.position.z=pos.z;socket?.emit("player:move",pos);const target=new THREE.Vector3(pos.x,1,pos.z);const desired=new THREE.Vector3(pos.x+9,7.5,pos.z+11);camera.position.lerp(desired,.09);camera.lookAt(target);renderer.render(scene,camera);}requestAnimationFrame(loop);}
window.addEventListener("keydown",e=>{keys[e.key]=true;if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key))e.preventDefault();});window.addEventListener("keyup",e=>keys[e.key]=false);document.querySelectorAll("[data-move]").forEach(b=>{const map={forward:"w",back:"s",left:"a",right:"d"},k=map[b.dataset.move];b.addEventListener("pointerdown",e=>{e.preventDefault();keys[k]=true;});["pointerup","pointerleave","pointercancel"].forEach(ev=>b.addEventListener(ev,()=>keys[k]=false));});
if(token)loadAccount();
