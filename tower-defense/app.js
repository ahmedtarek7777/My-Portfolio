(()=>{const G=40,W=18,H=11;const path=[[0,2],[5,2],[5,8],[11,8],[11,3],[17,3]];
const cells=new Set();for(let i=0;i<path.length-1;i++){let[a,b]=path[i],[c,d]=path[i+1];while(a!=c||b!=d){cells.add(a+","+b);a+=Math.sign(c-a);b+=Math.sign(d-b)}}cells.add("17,3");
const pts=path.map(([x,y])=>[x*G+G/2,y*G+G/2]);
const TY={arrow:{n:t("سهم","Arrow"),c:"#ffd36b",cost:50,r:110,dmg:12,rate:.5},cannon:{n:t("مدفع","Cannon"),c:"#ff8a8a",cost:90,r:90,dmg:40,rate:1.3,splash:50},frost:{n:t("ثلج","Frost"),c:"#7fd6ff",cost:70,r:100,dmg:4,rate:.7,slow:.5},sniper:{n:t("قناص","Sniper"),c:"#c5a6ff",cost:130,r:230,dmg:90,rate:1.8}};
app.innerHTML=`<div class="row" id="hud"></div><div class="row" id="shop" style="margin:10px 0"></div>`;const[c,x]=canvas(W*G,H*G);
let gold=150,lives=20,wave=0,towers=[],en=[],bul=[],sel="arrow",spawn=[],st=0,over=false,speed=1,sp,pick=null,fx=[];
$("#shop").innerHTML=Object.entries(TY).map(([k,v])=>`<button data-k="${k}" class="${k==sel?"on":""}">${v.n} · ${v.cost}</button>`).join("")+`<button id="nw" class="primary">${t("ابدأ الموجة","Start wave")}</button><button id="sp">x1</button>`;
$$("#shop [data-k]").forEach(b=>b.onclick=()=>{sel=b.dataset.k;pick=null;$$("#shop [data-k]").forEach(z=>z.classList.toggle("on",z==b))});
$("#sp").onclick=()=>{speed=speed%3+1;$("#sp").textContent="x"+speed};
function startWave(){if(spawn.length||en.length||over)return;wave++;const n=6+wave*3;for(let i=0;i<n;i++)spawn.push({t:i*.7,hp:30+wave*22+(i%5==4?wave*40:0),sp:55+wave*3+(i%7==6?30:0),boss:i%5==4})}
$("#nw").onclick=startWave;
c.onclick=e=>{const r=c.getBoundingClientRect(),gx=Math.floor((e.clientX-r.left)*c.width/r.width/G),gy=Math.floor((e.clientY-r.top)*c.height/r.height/G);const t0=towers.find(z=>z.gx==gx&&z.gy==gy);
if(t0){pick=t0;return}pick=null;if(cells.has(gx+","+gy)||gold<TY[sel].cost)return;gold-=TY[sel].cost;towers.push({k:sel,gx,gy,lv:1,cd:0})};
function up(){if(pick&&gold>=pick.lv*60&&pick.lv<4){gold-=pick.lv*60;pick.lv++}}
addEventListener("keydown",e=>{if(e.key=="u")up()});
function hud(){$("#hud").innerHTML=`<span class="tag">💰 ${gold}</span><span class="tag">❤ ${lives}</span><span class="tag">🌊 ${wave}</span>${pick?`<button onclick="" id="upb">${t("ترقية","Upgrade")} (${pick.lv*60})</button><button id="sell">${t("بيع","Sell")}</button>`:""}`;if(pick){$("#upb").onclick=up;$("#sell").onclick=()=>{gold+=Math.floor(TY[pick.k].cost*.6*pick.lv);towers=towers.filter(z=>z!=pick);pick=null}}}
function pos(e){return{x:e.px,y:e.py}}
const step=dt=>{st+=dt;spawn=spawn.filter(s=>{s.t-=dt;if(s.t<=0){en.push({...s,seg:0,px:pts[0][0],py:pts[0][1],mhp:s.hp,slow:0});return false}return true});
en.forEach(e=>{e.slow=Math.max(0,e.slow-dt);const v=e.sp*(e.slow>0?.5:1)*dt;let d=v;while(d>0&&e.seg<pts.length-1){const[tx,ty]=pts[e.seg+1],dx=tx-e.px,dy=ty-e.py,L=Math.hypot(dx,dy);if(L<=d){e.px=tx;e.py=ty;e.seg++;d-=L}else{e.px+=dx/L*d;e.py+=dy/L*d;d=0}}if(e.seg>=pts.length-1){e.done=1;lives--}});
en=en.filter(e=>!e.done);
towers.forEach(z=>{const T=TY[z.k];z.cd-=dt;const cx=z.gx*G+G/2,cy=z.gy*G+G/2,R=T.r*(1+.1*(z.lv-1));if(z.cd>0)return;const tg=en.filter(e=>Math.hypot(e.px-cx,e.py-cy)<R).sort((a,b)=>b.seg-a.seg||0)[0];if(tg){z.cd=T.rate/(1+.15*(z.lv-1));bul.push({x:cx,y:cy,tg,T,lv:z.lv})}});
bul=bul.filter(b=>{const dx=b.tg.px-b.x,dy=b.tg.py-b.y,L=Math.hypot(dx,dy),v=420*dt;if(L<=v){const dmg=b.T.dmg*(1+.5*(b.lv-1));const hit=e=>{e.hp-=dmg;if(b.T.slow)e.slow=1.5};if(b.T.splash){en.forEach(e=>{if(Math.hypot(e.px-b.tg.px,e.py-b.tg.py)<b.T.splash)hit(e)});fx.push({x:b.tg.px,y:b.tg.py,r:b.T.splash,l:.25})}else hit(b.tg);return false}b.x+=dx/L*v;b.y+=dy/L*v;return true});
en=en.filter(e=>{if(e.hp<=0){gold+=e.boss?25:8;return false}return true});fx=fx.filter(f=>(f.l-=dt)>0);
if(lives<=0)over=true;if(!spawn.length&&!en.length&&wave&&!over)gold+=0};
function draw(){x.fillStyle="#122018";x.fillRect(0,0,c.width,c.height);for(let i=0;i<W;i++)for(let j=0;j<H;j++){x.fillStyle=cells.has(i+","+j)?"#3a2f22":(i+j)%2?"#16281d":"#143023";x.fillRect(i*G,j*G,G,G)}
towers.forEach(z=>{const T=TY[z.k];x.fillStyle=T.c;x.beginPath();x.arc(z.gx*G+G/2,z.gy*G+G/2,12+z.lv*1.5,0,7);x.fill();x.fillStyle="#000a";x.font="12px sans-serif";x.textAlign="center";x.fillText(z.lv,z.gx*G+G/2,z.gy*G+G/2+4);if(z==pick){x.strokeStyle="#fff6";x.beginPath();x.arc(z.gx*G+G/2,z.gy*G+G/2,T.r*(1+.1*(z.lv-1)),0,7);x.stroke()}});
en.forEach(e=>{x.fillStyle=e.boss?"#ff4d6d":e.slow>0?"#7fd6ff":"#f5e663";x.beginPath();x.arc(e.px,e.py,e.boss?12:8,0,7);x.fill();x.fillStyle="#000a";x.fillRect(e.px-10,e.py-16,20,3);x.fillStyle="#6f6";x.fillRect(e.px-10,e.py-16,20*e.hp/e.mhp,3)});
bul.forEach(b=>{x.fillStyle=b.T.c;x.beginPath();x.arc(b.x,b.y,4,0,7);x.fill()});fx.forEach(f=>{x.strokeStyle="#ffb36b";x.beginPath();x.arc(f.x,f.y,f.r*(1-f.l*2),0,7);x.stroke()});
if(over){x.fillStyle="#000b";x.fillRect(0,0,c.width,c.height);x.fillStyle="#fff";x.font="40px sans-serif";x.textAlign="center";x.fillText(t("خسرت عند الموجة ","Lost at wave ")+wave,c.width/2,c.height/2)}}
sp=loop(dt=>{if(!over)for(let i=0;i<speed;i++)step(dt);draw();hud()})})();
