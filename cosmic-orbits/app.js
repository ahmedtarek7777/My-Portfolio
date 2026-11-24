(()=>{const[c,x]=canvas(900,560);c.style.cssText="max-width:100%;height:auto;background:#05060c;border-radius:14px;touch-action:none;cursor:crosshair";
const ctl=document.createElement("div");ctl.className="row";ctl.style.marginBottom="12px";ctl.innerHTML=`<button id=clr>${t("مسح","Clear")}</button><button id=sol>${t("نظام شمسي","Solar system")}</button><button id=rn>${t("عشوائي","Random")}</button><label>${t("الجاذبية","Gravity")} <input type=range id=g min=1 max=40 value=12></label><label><input type=checkbox id=tr checked> ${t("أثر","Trails")}</label><span class=tag id=n></span><span class=small>${t("اسحب على اللوحة لإطلاق جرم","Drag on the canvas to launch a body")}</span>`;app.prepend(ctl);
let B=[];const G=()=>$("#g").value/10;const mk=(px,py,vx,vy,m,h)=>({x:px,y:py,vx,vy,m,h:h??ri(0,360),tr:[]});const R=b=>Math.max(2,Math.cbrt(b.m)*1.7);
function sol(){B=[mk(450,280,0,0,2000,45)];for(let i=1;i<=8;i++){const d=45+i*36,v=Math.sqrt(G()*2000/d),a=rnd(0,6.28);B.push(mk(450+Math.cos(a)*d,280+Math.sin(a)*d,-Math.sin(a)*v,Math.cos(a)*v,rnd(2,28)))}}
function rn(){B=[];for(let i=0;i<60;i++)B.push(mk(rnd(50,850),rnd(40,520),rnd(-15,15),rnd(-15,15),rnd(2,14)))}
$("#clr").onclick=()=>B=[];$("#sol").onclick=sol;$("#rn").onclick=rn;sol();
let d0=null,d1=null;const P=e=>{const r=c.getBoundingClientRect();return[(e.clientX-r.left)*900/r.width,(e.clientY-r.top)*560/r.height]};
c.onpointerdown=e=>{d0=P(e);d1=d0};c.onpointermove=e=>{if(d0)d1=P(e)};c.onpointerup=()=>{if(d0)B.push(mk(d0[0],d0[1],(d0[0]-d1[0])*.6,(d0[1]-d1[1])*.6,10));d0=null};
loop(dt=>{const g=G();for(let s=0;s<4;s++){const h=dt/4;for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++){const a=B[i],b=B[j];let dx=b.x-a.x,dy=b.y-a.y,r2=dx*dx+dy*dy+25,r=Math.sqrt(r2),f=g/r2/r;a.vx+=dx*f*b.m*h*60;a.vy+=dy*f*b.m*h*60;b.vx-=dx*f*a.m*h*60;b.vy-=dy*f*a.m*h*60}
for(const b of B){b.x+=b.vx*h;b.y+=b.vy*h}
for(let i=0;i<B.length;i++)for(let j=B.length-1;j>i;j--){const a=B[i],b=B[j];if(!a||!b)continue;if(Math.hypot(a.x-b.x,a.y-b.y)<(R(a)+R(b))*.7){const m=a.m+b.m;a.vx=(a.vx*a.m+b.vx*b.m)/m;a.vy=(a.vy*a.m+b.vy*b.m)/m;a.x=(a.x*a.m+b.x*b.m)/m;a.y=(a.y*a.m+b.y*b.m)/m;if(b.m>a.m)a.h=b.h;a.m=m;B.splice(j,1)}}}
x.fillStyle=$("#tr").checked?"rgba(5,6,12,.18)":"#05060c";x.fillRect(0,0,900,560);
for(const b of B){b.tr.push([b.x,b.y]);if(b.tr.length>60)b.tr.shift();const r=R(b);if($("#tr").checked){x.strokeStyle=`hsla(${b.h},80%,65%,.35)`;x.beginPath();b.tr.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke()}
const gr=x.createRadialGradient(b.x,b.y,0,b.x,b.y,r*(b.m>500?4:1.6));gr.addColorStop(0,`hsl(${b.h},90%,75%)`);gr.addColorStop(.4,`hsl(${b.h},80%,55%)`);gr.addColorStop(1,"transparent");x.fillStyle=gr;x.beginPath();x.arc(b.x,b.y,r*(b.m>500?4:1.6),0,7);x.fill()}
if(d0){x.strokeStyle="#fff8";x.beginPath();x.moveTo(d0[0],d0[1]);x.lineTo(d1[0],d1[1]);x.stroke()}
$("#n").textContent=t("الأجرام: ","Bodies: ")+B.length});})();
