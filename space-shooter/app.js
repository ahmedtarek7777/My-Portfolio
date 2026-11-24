(()=>{const W=540,H=680;const[c,x]=canvas(W,H);c.style.cssText="max-width:100%;height:auto;background:#06070f;border-radius:14px;touch-action:none";let k=keys();
app.insertAdjacentHTML("beforeend",`<p class=small>${t("الأسهم للحركة، المسافة للنار. اجمع الأيقونات الملونة. اللمس: اسحب بصباعك.","Arrows to move, Space to fire. Collect colored pickups. Touch: drag.")}</p>`);
let st,stars=Array.from({length:90},()=>({x:rnd(0,W),y:rnd(0,H),s:rnd(.5,2.5)}));
const reset=()=>st={p:{x:W/2,y:H-70,hp:5,pw:1,cd:0,inv:0},b:[],e:[],eb:[],pu:[],fx:[],sc:0,wave:0,wt:2,over:false,hi:S.get("hi",0)};reset();
c.onpointermove=e=>{if(e.buttons||e.pointerType=="touch"){const r=c.getBoundingClientRect();st.p.x=(e.clientX-r.left)*W/r.width;st.p.y=Math.min(H-30,(e.clientY-r.top)*H/r.height-40)}};c.onpointerdown=e=>{if(st.over)reset()};
const boom=(a,b,col,n=14)=>{for(let i=0;i<n;i++)st.fx.push({x:a,y:b,vx:rnd(-160,160),vy:rnd(-160,160),l:rnd(.3,.8),col})};
function spawn(){st.wave++;const n=4+st.wave*2;for(let i=0;i<n;i++)st.e.push({x:rnd(40,W-40),y:-30-i*45,vy:rnd(40,70)+st.wave*4,hp:st.wave>3&&Math.random()<.25?3:1,ph:rnd(0,6),sh:rnd(1,3),big:0});if(st.wave%4==0)st.e.push({x:W/2,y:-80,vy:25,hp:40+st.wave*5,ph:0,sh:.6,big:1})}
loop(dt=>{const s=st;stars.forEach(a=>{a.y+=a.s*40*dt;if(a.y>H){a.y=0;a.x=rnd(0,W)}});if(!s.over){const p=s.p,v=300;if(k.ArrowLeft||k.KeyA)p.x-=v*dt;if(k.ArrowRight||k.KeyD)p.x+=v*dt;if(k.ArrowUp||k.KeyW)p.y-=v*dt;if(k.ArrowDown||k.KeyS)p.y+=v*dt;p.x=clamp(p.x,20,W-20);p.y=clamp(p.y,40,H-30);p.cd-=dt;p.inv-=dt;
if((k.Space||c.matches(":active"))&&p.cd<=0){p.cd=.2;for(let i=0;i<p.pw;i++)s.b.push({x:p.x+(i-(p.pw-1)/2)*12,y:p.y-18,vx:(i-(p.pw-1)/2)*30})}
s.wt-=dt;if(!s.e.length&&s.wt<=0){spawn();s.wt=1.5}
s.b.forEach(b=>{b.y-=620*dt;b.x+=b.vx*dt});s.b=s.b.filter(b=>b.y>-10);
for(const e of s.e){e.y+=e.vy*dt;e.x+=Math.sin(e.y/50+e.ph)*60*dt;e.sh-=dt;if(e.sh<0&&e.y>0&&e.y<H-200){e.sh=e.big?.5:rnd(1.5,3.5);const a=Math.atan2(p.y-e.y,p.x-e.x);s.eb.push({x:e.x,y:e.y,vx:Math.cos(a)*170,vy:Math.sin(a)*170})}
for(const b of s.b)if(Math.abs(b.x-e.x)<(e.big?45:16)&&Math.abs(b.y-e.y)<(e.big?35:14)){b.y=-99;e.hp--;boom(b.x,b.y,"#ffd36e",3);if(e.hp<=0){e.dead=1;s.sc+=e.big?500:100;boom(e.x,e.y,e.big?"#ff6e6e":"#8ef",e.big?60:16);if(Math.random()<.25)s.pu.push({x:e.x,y:e.y,t:pick(["w","h"])})}}
if(Math.abs(p.x-e.x)<18&&Math.abs(p.y-e.y)<18&&p.inv<=0&&!e.big){e.dead=1;p.hp--;p.inv=1.5;boom(p.x,p.y,"#f66",24)}}
s.e=s.e.filter(e=>!e.dead&&e.y<H+40);s.eb.forEach(b=>{b.x+=b.vx*dt;b.y+=b.vy*dt;if(Math.hypot(b.x-p.x,b.y-p.y)<9&&p.inv<=0){b.y=9999;p.hp--;p.inv=1.5;boom(p.x,p.y,"#f66",24)}});s.eb=s.eb.filter(b=>b.y<H&&b.y>-10&&b.x>0&&b.x<W);
s.pu.forEach(u=>{u.y+=70*dt;if(Math.hypot(u.x-p.x,u.y-p.y)<22){u.y=9999;if(u.t=="w")p.pw=Math.min(4,p.pw+1);else p.hp=Math.min(6,p.hp+1);s.sc+=50}});s.pu=s.pu.filter(u=>u.y<H);
if(p.hp<=0){s.over=true;if(s.sc>s.hi){s.hi=s.sc;S.set("hi",s.sc)}boom(p.x,p.y,"#fa4",50)}}
s.fx.forEach(f=>{f.x+=f.vx*dt;f.y+=f.vy*dt;f.l-=dt});s.fx=s.fx.filter(f=>f.l>0);
x.fillStyle="#06070f";x.fillRect(0,0,W,H);x.fillStyle="#fff";stars.forEach(a=>{x.globalAlpha=a.s/3;x.fillRect(a.x,a.y,a.s,a.s)});x.globalAlpha=1;
if(!s.over&&(s.p.inv<=0||Math.floor(s.p.inv*10)%2)){x.fillStyle="#7ee2ff";x.beginPath();x.moveTo(s.p.x,s.p.y-20);x.lineTo(s.p.x+16,s.p.y+14);x.lineTo(s.p.x,s.p.y+6);x.lineTo(s.p.x-16,s.p.y+14);x.fill();x.fillStyle="#ff9d4d";x.fillRect(s.p.x-3,s.p.y+8,6,6+Math.random()*6)}
x.fillStyle="#ffe27a";s.b.forEach(b=>x.fillRect(b.x-2,b.y-8,4,12));s.e.forEach(e=>{x.fillStyle=e.big?"#c44":e.hp>1?"#e27aff":"#ff7a8a";if(e.big){x.fillRect(e.x-45,e.y-25,90,50);x.fillStyle="#fff";x.fillRect(e.x-40,e.y-32,Math.max(0,80*e.hp/(40+s.wave*5)),4)}else{x.beginPath();x.moveTo(e.x,e.y+14);x.lineTo(e.x+16,e.y-10);x.lineTo(e.x-16,e.y-10);x.fill()}});
x.fillStyle="#ff5577";s.eb.forEach(b=>{x.beginPath();x.arc(b.x,b.y,5,0,7);x.fill()});s.pu.forEach(u=>{x.fillStyle=u.t=="w"?"#ffd24d":"#5dff9c";x.beginPath();x.arc(u.x,u.y,10,0,7);x.fill();x.fillStyle="#000";x.fillText(u.t=="w"?"W":"+",u.x-4,u.y+4)});s.fx.forEach(f=>{x.globalAlpha=Math.min(1,f.l*2);x.fillStyle=f.col;x.fillRect(f.x,f.y,3,3)});x.globalAlpha=1;
x.fillStyle="#fff";x.font="16px sans-serif";x.textAlign="left";x.fillText(t("النقاط ","Score ")+s.sc+"   "+t("موجة ","Wave ")+s.wave+"   ♥".repeat(Math.max(0,s.p.hp)),12,24);x.fillText(t("الأفضل ","Best ")+s.hi,W-110,24);
if(s.over){x.fillStyle="#000a";x.fillRect(0,0,W,H);x.fillStyle="#fff";x.textAlign="center";x.font="32px sans-serif";x.fillText(t("انتهت اللعبة","Game over"),W/2,H/2-10);x.font="16px sans-serif";x.fillText(t("اضغط Enter أو المس الشاشة للعب تاني","Press Enter or tap to play again"),W/2,H/2+24);if(k.Enter)reset()}});})();
