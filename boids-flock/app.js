(()=>{const[c,x]=canvas(900,540);c.style.cssText="max-width:100%;height:auto;background:#07101a;border-radius:14px";
const ctl=document.createElement("div");ctl.className="row";ctl.style.marginBottom="12px";ctl.innerHTML=[["sep",t("ابتعاد","Separation"),1.5],["ali",t("محاذاة","Alignment"),1],["coh",t("تماسك","Cohesion"),.8]].map(a=>`<label>${a[1]} <input type=range id=${a[0]} min=0 max=3 step=.1 value=${a[2]}></label>`).join("")+`<label>${t("العدد","Count")} <input type=range id=cnt min=20 max=400 value=180></label><label><input type=checkbox id=pr checked> ${t("مفترس","Predator")}</label><span class=small>${t("حرّك الماوس: الطيور بتهرب منه","Move the mouse: boids flee from it")}</span>`;app.prepend(ctl);
let F=[],m=null,pr={x:450,y:270,vx:2,vy:1};const W=900,H=540;
const fix=n=>{while(F.length<n)F.push({x:rnd(0,W),y:rnd(0,H),vx:rnd(-2,2),vy:rnd(-2,2)});F.length=n};
c.onpointermove=e=>{const r=c.getBoundingClientRect();m=[(e.clientX-r.left)*W/r.width,(e.clientY-r.top)*H/r.height]};c.onpointerleave=()=>m=null;
loop(()=>{fix(+$("#cnt").value);const s=+$("#sep").value,a=+$("#ali").value,co=+$("#coh").value,V=14,N=F.length;
for(const b of F){let sx=0,sy=0,ax=0,ay=0,cx=0,cy=0,n=0;for(const o of F){if(o==b)continue;const dx=o.x-b.x,dy=o.y-b.y,d=dx*dx+dy*dy;if(d<V*V*9){n++;ax+=o.vx;ay+=o.vy;cx+=o.x;cy+=o.y;if(d<V*V){sx-=dx;sy-=dy}}}
if(n){b.vx+=(ax/n-b.vx)*.05*a+(cx/n-b.x)*.0008*co+sx*.003*s;b.vy+=(ay/n-b.vy)*.05*a+(cy/n-b.y)*.0008*co+sy*.003*s}
const fl=(p,rad,k)=>{const dx=b.x-p.x,dy=b.y-p.y,d=Math.hypot(dx,dy);if(d<rad&&d>0){b.vx+=dx/d*k;b.vy+=dy/d*k}};if(m)fl({x:m[0],y:m[1]},110,.8);if($("#pr").checked)fl(pr,130,.9);
const sp=Math.hypot(b.vx,b.vy)||1,mx=3.6,mn=1.6;const k=sp>mx?mx/sp:sp<mn?mn/sp:1;b.vx*=k;b.vy*=k;b.x=(b.x+b.vx+W)%W;b.y=(b.y+b.vy+H)%H}
if($("#pr").checked){let t0=F[0],bd=1e9;for(const b of F){const d=Math.hypot(b.x-pr.x,b.y-pr.y);if(d<bd){bd=d;t0=b}}pr.vx+=(t0.x-pr.x)*.002;pr.vy+=(t0.y-pr.y)*.002;const sp=Math.hypot(pr.vx,pr.vy)||1;pr.vx*=3.2/sp;pr.vy*=3.2/sp;pr.x=(pr.x+pr.vx+W)%W;pr.y=(pr.y+pr.vy+H)%H}
x.fillStyle="rgba(7,16,26,.35)";x.fillRect(0,0,W,H);for(const b of F){const an=Math.atan2(b.vy,b.vx);x.save();x.translate(b.x,b.y);x.rotate(an);x.fillStyle=`hsl(${(an*57+360)%360},80%,65%)`;x.beginPath();x.moveTo(8,0);x.lineTo(-5,4);x.lineTo(-3,0);x.lineTo(-5,-4);x.fill();x.restore()}
if($("#pr").checked){x.fillStyle="#ff4f6a";x.beginPath();x.arc(pr.x,pr.y,8,0,7);x.fill()}});})();
