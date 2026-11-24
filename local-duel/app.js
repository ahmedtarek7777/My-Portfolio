(()=>{const[c,x]=canvas(800,480);const K=keys();app.insertAdjacentHTML("afterbegin",`<div class="row" id="hud"></div>`);let sc=[0,0],P,B,w=[],st="go",tm=0;
const mkp=(X,Y,col,h)=>({x:X,y:Y,h,col,hp:3,cd:0,v:0});
function reset(){P=[mkp(80,240,"#6fc3ff",0),mkp(720,240,"#ff8a8a",Math.PI)];B=[];w=[];for(let i=0;i<7;i++)w.push({x:ri(200,560),y:ri(30,420),w:ri(24,60),h:ri(24,90)});w=w.filter(r=>!P.some(p=>Math.abs(p.x-r.x)<80&&Math.abs(p.y-r.y)<80));st="go"}
const hit=(o,r,s=10)=>o.x>r.x-s&&o.x<r.x+r.w+s&&o.y>r.y-s&&o.y<r.y+r.h+s;
function step(dt){if(st!="go"){tm-=dt;if(tm<=0)reset();return}
const ctl=[{u:"KeyW",d:"KeyS",l:"KeyA",r:"KeyD",f:"KeyF"},{u:"ArrowUp",d:"ArrowDown",l:"ArrowLeft",r:"ArrowRight",f:"Enter"}];
P.forEach((p,i)=>{const k=ctl[i];p.h+=((K[k.r]?1:0)-(K[k.l]?1:0))*3*dt;const v=((K[k.u]?1:0)-(K[k.d]?.6:0))*150;const nx=p.x+Math.cos(p.h)*v*dt,ny=p.y+Math.sin(p.h)*v*dt;if(nx>12&&nx<788&&ny>12&&ny<468&&!w.some(r=>hit({x:nx,y:ny},r,12))){p.x=nx;p.y=ny}p.cd-=dt;if(K[k.f]&&p.cd<=0){p.cd=.45;B.push({x:p.x+Math.cos(p.h)*20,y:p.y+Math.sin(p.h)*20,vx:Math.cos(p.h)*380,vy:Math.sin(p.h)*380,o:i,b:0})}});
B=B.filter(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;if(b.x<0||b.x>800){b.vx*=-1;b.b++}if(b.y<0||b.y>480){b.vy*=-1;b.b++}for(const r of w)if(hit(b,r,3)){const px=b.x-b.vx*dt,py=b.y-b.vy*dt;if(!hit({x:px,y:b.y},r,3))b.vx*=-1;else b.vy*=-1;b.x+=b.vx*dt;b.y+=b.vy*dt;b.b++;break}
const q=P[1-b.o];if(Math.hypot(b.x-q.x,b.y-q.y)<14){q.hp--;if(q.hp<=0){sc[b.o]++;st="over";tm=2}return false}return b.b<3});}
function draw(){x.fillStyle="#12261c";x.fillRect(0,0,800,480);x.fillStyle="#5a4a38";w.forEach(r=>x.fillRect(r.x,r.y,r.w,r.h));P.forEach(p=>{x.save();x.translate(p.x,p.y);x.rotate(p.h);x.fillStyle=p.col;x.fillRect(-13,-11,26,22);x.fillRect(0,-3,22,6);x.restore();for(let i=0;i<3;i++){x.fillStyle=i<p.hp?"#fff":"#fff3";x.fillRect(p.x-14+i*10,p.y-22,8,4)}});x.fillStyle="#ffd36b";B.forEach(b=>{x.beginPath();x.arc(b.x,b.y,4,0,7);x.fill()});
if(st!="go"){x.fillStyle="#000a";x.fillRect(0,0,800,480);x.fillStyle="#fff";x.font="38px sans-serif";x.textAlign="center";x.fillText(t("لاعب ","Player ")+(sc[0]+sc[1]&&P[0].hp>0?1:2)+t(" كسب الجولة"," wins the round"),400,250)}
$("#hud").innerHTML=`<span class="tag" style="background:#6fc3ff55">${t("لاعب ١","P1")} ${sc[0]}</span><span class="tag" style="background:#ff8a8a55">${t("لاعب ٢","P2")} ${sc[1]}</span><span class="small">P1: WASD + F · P2: ${t("الأسهم","Arrows")} + Enter</span>`}
reset();loop(dt=>{step(dt);draw()})})();
