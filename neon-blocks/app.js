(()=>{const C=10,R=20,Z=28;app.innerHTML=`<div class="row" style="align-items:flex-start;justify-content:center"><canvas id=cv width=${C*Z} height=${R*Z} style="background:#0a0c14;border-radius:12px;margin:0"></canvas><div class=col style="min-width:170px"><div class=card><div class=small>${t("النقاط","Score")}</div><div class=big2 id=sc>0</div><div class=small>${t("المستوى","Level")} <b id=lv>1</b> · ${t("خطوط","Lines")} <b id=ln>0</b></div></div><div class=card><div class=small>${t("التالي","Next")}</div><canvas id=nx width=112 height=84 style="margin:0"></canvas><div class=small>${t("المحفوظ (C)","Hold (C)")}</div><canvas id=hd width=112 height=84 style="margin:0"></canvas></div><button id=rs>${t("لعبة جديدة","New game")}</button><p class=small>${t("الأسهم للحركة، ↑ تدوير، المسافة هبوط، C حفظ","Arrows move, Up rotates, Space drops, C holds")}</p></div></div>`;
const x=$("#cv").getContext("2d"),nx=$("#nx").getContext("2d"),hd=$("#hd").getContext("2d");
const SH={I:[[0,1],[1,1],[2,1],[3,1]],O:[[1,0],[2,0],[1,1],[2,1]],T:[[1,0],[0,1],[1,1],[2,1]],S:[[1,0],[2,0],[0,1],[1,1]],Z:[[0,0],[1,0],[1,1],[2,1]],J:[[0,0],[0,1],[1,1],[2,1]],L:[[2,0],[0,1],[1,1],[2,1]]},CL={I:"#4de3ff",O:"#ffd84d",T:"#c77dff",S:"#5dff9c",Z:"#ff6b7a",J:"#6b8cff",L:"#ffa04d"};
let g,cur,nxt,hold,canHold,sc,lines,lv,acc,over,bag=[];
const nextP=()=>{if(!bag.length)bag=shuffle(Object.keys(SH));return bag.pop()};
const mkp=k=>({k,c:SH[k].map(a=>[...a]),x:3,y:0});
function rot(p){if(p.k=="O")return p;const n=p.k=="I"?4:3,c=p.c.map(([a,b])=>[n-1-b,a]);return{...p,c}}
const ok=(p,dx=0,dy=0)=>p.c.every(([a,b])=>{const X=p.x+a+dx,Y=p.y+b+dy;return X>=0&&X<C&&Y<R&&(Y<0||!g[Y][X])});
function reset(){g=Array.from({length:R},()=>Array(C).fill(0));bag=[];nxt=nextP();hold=null;canHold=true;sc=0;lines=0;lv=1;acc=0;over=false;spawn()}
function spawn(){cur=mkp(nxt);nxt=nextP();canHold=true;if(!ok(cur))over=true}
function lock(){cur.c.forEach(([a,b])=>{if(cur.y+b>=0)g[cur.y+b][cur.x+a]=CL[cur.k]});let n=0;for(let y=R-1;y>=0;y--)if(g[y].every(v=>v)){g.splice(y,1);g.unshift(Array(C).fill(0));n++;y++}if(n){sc+=[0,100,300,500,800][n]*lv;lines+=n;lv=1+Math.floor(lines/10)}spawn()}
function mv(dx,dy){if(ok(cur,dx,dy)){cur.x+=dx;cur.y+=dy;return true}return false}
const drop=()=>{while(mv(0,1))sc+=2;lock()};
addEventListener("keydown",e=>{if(over&&e.code=="Enter")return reset();if(over||/INPUT|TEXTAREA/.test(e.target.tagName))return;const m={ArrowLeft:()=>mv(-1,0),ArrowRight:()=>mv(1,0),ArrowDown:()=>{if(mv(0,1))sc++},ArrowUp:()=>{const r=rot(cur);for(const d of[0,-1,1,-2,2])if(ok(r,d,0)){cur=r;cur.x+=d;break}},Space:drop,KeyC:()=>{if(!canHold)return;const k=cur.k;if(hold){cur=mkp(hold)}else spawn();hold=k;canHold=false}};if(m[e.code]){e.preventDefault();m[e.code]()}});
$("#rs").onclick=reset;
const cell=(c,px,py,col,z=Z)=>{c.fillStyle=col;c.shadowColor=col;c.shadowBlur=8;c.fillRect(px*z+1,py*z+1,z-2,z-2);c.shadowBlur=0};
const mini=(c,k)=>{c.clearRect(0,0,112,84);if(k)SH[k].forEach(([a,b])=>cell(c,a+.2,b+.6,CL[k],22))};
reset();loop(dt=>{if(!over){acc+=dt;if(acc>Math.max(.07,.8-lv*.07)){acc=0;if(!mv(0,1))lock()}}
x.clearRect(0,0,C*Z,R*Z);x.strokeStyle="#ffffff0d";for(let i=0;i<=C;i++){x.beginPath();x.moveTo(i*Z,0);x.lineTo(i*Z,R*Z);x.stroke()}for(let i=0;i<=R;i++){x.beginPath();x.moveTo(0,i*Z);x.lineTo(C*Z,i*Z);x.stroke()}
g.forEach((r,y)=>r.forEach((v,z)=>v&&cell(x,z,y,v)));if(!over){let gy=0;while(ok(cur,0,gy+1))gy++;cur.c.forEach(([a,b])=>{x.strokeStyle=CL[cur.k];x.globalAlpha=.4;x.strokeRect((cur.x+a)*Z+2,(cur.y+b+gy)*Z+2,Z-4,Z-4);x.globalAlpha=1});cur.c.forEach(([a,b])=>cell(x,cur.x+a,cur.y+b,CL[cur.k]))}
mini(nx,nxt);mini(hd,hold);$("#sc").textContent=sc;$("#lv").textContent=lv;$("#ln").textContent=lines;if(over){x.fillStyle="#000b";x.fillRect(0,0,C*Z,R*Z);x.fillStyle="#fff";x.font="26px sans-serif";x.textAlign="center";x.fillText(t("انتهت اللعبة","Game over"),C*Z/2,R*Z/2);x.font="14px sans-serif";x.fillText(t("Enter لإعادة اللعب","Enter to restart"),C*Z/2,R*Z/2+28)}});})();
