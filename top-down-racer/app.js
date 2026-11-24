(()=>{const[c,x]=canvas(760,480);const K=keys();app.insertAdjacentHTML("afterbegin",`<div class="row" id="hud"></div>`);
const cx=380,cy=240,rx=300,ry=170,tw=70;let best=S.get("best",0),lap=0,lt=0,state="ready",cd=0;
const pathAt=a=>[cx+Math.cos(a)*(rx),cy+Math.sin(a)*ry];
const on=(px,py)=>{const d=Math.hypot((px-cx)/(rx),(py-cy)/(ry));return Math.abs(d-1)<tw/ry*.95};
const mk=(a,col,ai)=>({x:cx+rx-18*(ai?1:-1)*0-(ai?-20:20),y:cy+(ai?-14:14)*0+ai*0+0,a:-Math.PI/2*0,v:0,col,ai,ang:0,prog:0,laps:0,last:0,ph:0});
let me,bots;function reset(){me={x:cx+rx,y:cy+20,h:-Math.PI/2,v:0,laps:0,pa:0,q:0};bots=[0,1,2].map(i=>({x:cx+rx,y:cy-20-i*22,h:-Math.PI/2,v:0,laps:0,pa:0,q:0,sk:.82+i*.06,col:["#ff8a8a","#7fe0a0","#ffd36b"][i]}));lap=0;lt=0;state="count";cd=3;cur=0}
let cur=0;const ang=o=>Math.atan2((o.y-cy)/ry,(o.x-cx)/rx);
function adv(o,dt){const a=ang(o);let d=a-o.pa;if(d>Math.PI)d-=2*Math.PI;if(d<-Math.PI)d+=2*Math.PI;o.pa=a;o.q+=d;o.laps=Math.floor(o.q/(2*Math.PI))}
function step(dt){if(state=="count"){cd-=dt;if(cd<=0){state="go";me.pa=ang(me);bots.forEach(b=>b.pa=ang(b))}return}if(state!="go")return;lt+=dt;
const acc=(K.ArrowUp||K.KeyW?1:0)-(K.ArrowDown||K.KeyS?.6:0);const st=(K.ArrowRight||K.KeyD?1:0)-(K.ArrowLeft||K.KeyA?1:0);me.v+=acc*260*dt;me.v*=on(me.x,me.y)?.992:.95;me.h+=st*2.6*dt*clamp(me.v/80,-1,1);me.x+=Math.cos(me.h)*me.v*dt;me.y+=Math.sin(me.h)*me.v*dt;adv(me,dt);
bots.forEach(b=>{const a=ang(b)+.25,tx=cx+Math.cos(a)*rx,ty=cy+Math.sin(a)*ry;let want=Math.atan2(ty-b.y,tx-b.x),dh=want-b.h;while(dh>Math.PI)dh-=2*Math.PI;while(dh<-Math.PI)dh+=2*Math.PI;b.h+=clamp(dh,-2.4*dt,2.4*dt);b.v+=(190*b.sk-b.v)*dt*2;b.x+=Math.cos(b.h)*b.v*dt;b.y+=Math.sin(b.h)*b.v*dt;adv(b,dt)});
if(me.laps>lap){if(lap>=0&&lt>3){best=best?Math.min(best,lt):lt;S.set("best",best)}lap=me.laps;lt=0;if(lap>=3)state="done"}}
function draw(){x.fillStyle="#193a1e";x.fillRect(0,0,760,480);x.lineWidth=tw*2;x.strokeStyle="#3a3a42";x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,7);x.stroke();x.lineWidth=3;x.setLineDash([12,14]);x.strokeStyle="#fff6";x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,7);x.stroke();x.setLineDash([]);x.fillStyle="#fff";x.fillRect(cx+rx-tw,cy-3,tw*2,6);
const car=(o,col)=>{x.save();x.translate(o.x,o.y);x.rotate(o.h);x.fillStyle=col;x.fillRect(-12,-7,24,14);x.fillStyle="#0008";x.fillRect(2,-5,6,10);x.restore()};bots.forEach(b=>car(b,b.col));car(me,"#6fc3ff");
const pos=1+bots.filter(b=>b.q>me.q).length;
if(state=="count"){x.fillStyle="#fff";x.font="70px sans-serif";x.textAlign="center";x.fillText(Math.ceil(cd),380,260)}if(state=="done"){x.fillStyle="#000b";x.fillRect(0,0,760,480);x.fillStyle="#fff";x.font="40px sans-serif";x.textAlign="center";x.fillText(t("المركز ","Position ")+pos+" · R",380,250)}
$("#hud").innerHTML=`<span class="tag">${t("لفة","Lap")} ${Math.min(lap+1,3)}/3</span><span class="tag">${t("المركز","Pos")} ${pos}/4</span><span class="tag">⏱ ${lt.toFixed(1)}s</span><span class="tag">${t("أفضل لفة","Best lap")}: ${best?best.toFixed(1)+"s":"-"}</span><span class="small">${t("الأسهم أو WASD، R لإعادة السباق","Arrows/WASD, R restarts")}</span>`}
addEventListener("keydown",e=>{if(e.code=="KeyR")reset()});reset();loop(dt=>{step(dt);draw()})})();
