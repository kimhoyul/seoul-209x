/* SEOUL 209X — LAST LIGHT / Canvas 2D. Original procedural pixel artwork.
   No network assets, WebGL, libraries, telemetry, or external services. */
'use strict';
(()=>{
const $=id=>document.getElementById(id),canvas=$('world'),ctx=canvas.getContext('2d',{alpha:false});
if(!ctx){document.body.textContent='이 브라우저에서 Canvas 2D를 실행할 수 없습니다.';return;}
const TAU=Math.PI*2,clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),lerp=(a,b,t)=>a+(b-a)*t;
function random(seed){let s=seed>>>0;return()=>((s=Math.imul(s,1664525)+1013904223>>>0)/4294967296);}
let rnd=random(2097);const pick=a=>a[Math.floor(rnd()*a.length)];
const project=(u,v,z=0)=>({x:(u-v)*20,y:(u+v)*10-z});
let C=ctx;
function poly(points,col,stroke){C.beginPath();points.forEach((p,i)=>i?C.lineTo(p.x??p[0],p.y??p[1]):C.moveTo(p.x??p[0],p.y??p[1]));C.closePath();C.fillStyle=col;C.fill();if(stroke){C.strokeStyle=stroke;C.lineWidth=1;C.stroke();}}
function rect(x,y,w,h,col){C.fillStyle=col;C.fillRect(Math.round(x),Math.round(y),Math.ceil(w),Math.ceil(h));}
function line(points,col,width=1){C.beginPath();points.forEach((p,i)=>i?C.lineTo(p.x??p[0],p.y??p[1]):C.moveTo(p.x??p[0],p.y??p[1]));C.strokeStyle=col;C.lineWidth=width;C.lineCap='round';C.lineJoin='round';C.stroke();}
function ellipse(x,y,rx,ry,col){C.fillStyle=col;C.beginPath();C.ellipse(x,y,rx,ry,0,0,TAU);C.fill();}
function text(t,x,y,size,col,align='left'){C.fillStyle=col;C.font=`bold ${size}px monospace`;C.textAlign=align;C.fillText(t,x,y);}
function box(u,v,z,w,d,h,p=['#8a827e','#595864','#6a6470'],edge='#302f4166'){
 const a=project(u,v,z+h),b=project(u+w,v,z+h),c=project(u+w,v+d,z+h),e=project(u,v+d,z+h),bb=project(u+w,v,z),cc=project(u+w,v+d,z),ee=project(u,v+d,z);
 poly([e,c,cc,ee],p[1],edge);poly([b,c,cc,bb],p[2],edge);poly([a,b,c,e],p[0],edge);return {a,b,c,e};
}
const pal={wood:['#b38b68','#70504a','#88624e'],iron:['#858a86','#444e5b','#626773'],dark:['#50586b','#283547','#3a4456'],pot:['#ae7459','#624b49','#825343'],moss:['#819069','#485c4f','#60745c'],stone:['#9a8b8f','#66616e','#7c7380'],cloth:['#c49b83','#947c7a','#ae8c81'],blue:['#8faaa9','#4d737b','#6e9399']};
function isoPlane(u,v,z,w,d,col){poly([project(u,v,z),project(u+w,v,z),project(u+w,v+d,z),project(u,v+d,z)],col);}
function beam(u,v,z,uu,vv,zz,col,width=2){line([project(u,v,z),project(uu,vv,zz)],col,width);}
function plants(u,v,z=0,n=17,scale=1){const q=project(u,v,z);for(let j=0;j<n;j++){const x=q.x+(rnd()-.5)*19*scale,y=q.y-rnd()*20*scale;line([[q.x,q.y],[x,y]],'#475b50');poly([[x,y-3],[x+4,y],[x+2,y+3],[x-3,y+1]],pick(['#859061','#56745c','#a1a379','#6c865b']));}}
function lamp(u,v,z=0){const q=project(u,v,z);rect(q.x-3,q.y-9,6,9,'#393a49');rect(q.x-2,q.y-7,4,6,'#ecc183');rect(q.x-1,q.y-6,2,4,'#ffe6b1');line([[q.x-2,q.y-10],[q.x-2,q.y-13],[q.x+2,q.y-13],[q.x+2,q.y-10]],'#37384a');}
function crate(u,v,w=1,d=.8,z=0){box(u,v,z,w,d,12,pal.wood);for(let j=1;j<4;j++)beam(u,v+d,z+j*3,u+w,v+d,z+j*3,'#392f3e66');beam(u+.10,v+d,z,u+.10,v+d,z+12,'#d0a57b',2);beam(u+w-.12,v+d,z,u+w-.12,v+d,z+12,'#543d3d',2);}
function tank(u,v,z,r=.8,h=29){const q=project(u,v,z);rect(q.x-r*20,q.y-h,r*40,h,'#617783');ellipse(q.x,q.y,r*20,r*9,'#4d6272');ellipse(q.x,q.y-h,r*20,r*9,'#a1a9a4');for(let j=1;j<3;j++){C.beginPath();C.ellipse(q.x,q.y-h+j*h/3,r*20,r*9,0,0,Math.PI);C.strokeStyle='#36475c';C.lineWidth=2;C.stroke();}line([[q.x-r*10,q.y-h+4],[q.x-r*10,q.y-4]],'#9caaa744',3);ellipse(q.x,q.y-h-1,r*5,r*2,'#576574');}
function windowIso(u,v,z,w,h,side,lit=false){const q=(x,y)=>side?project(u,v+x,z+y):project(u+x,v,z+y);poly([q(0,0),q(w,0),q(w,h),q(0,h)],'#30394c');poly([q(.07,1),q(w-.07,1),q(w-.07,h-1),q(.07,h-1)],lit?'#d0a68a':'#53667b');line([q(w/2,0),q(w/2,h)],'#32394e',1);line([q(0,h/2),q(w,h/2)],'#353b4a',1);}
function sprite(draw,seed){rnd=random(seed);const a=document.createElement('canvas');a.width=640;a.height=440;C=a.getContext('2d');C.translate(280,300);draw();
// Sparse pigment variation on occupied pixels gives the props painted, worn surfaces.
C.save();C.globalCompositeOperation='source-atop';for(let k=0;k<260;k++){const x=(rnd()-.5)*260,y=-100+rnd()*165;rect(x,y,1+rnd()*2,1,pick(['#e6ccb311','#192b3b13','#cfa48512']));}C.restore();
C.setTransform(1,0,0,1,0,0);const data=C.getImageData(0,0,640,440).data;let minX=640,minY=440,maxX=0,maxY=0;for(let y=0;y<440;y++)for(let x=0;x<640;x++){if(data[(y*640+x)*4+3]){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);}}const b=document.createElement('canvas');b.width=maxX-minX+3;b.height=maxY-minY+3;b.getContext('2d').drawImage(a,minX-1,minY-1,b.width,b.height,0,0,b.width,b.height);C=ctx;return{canvas:b,x:minX-281,y:minY-301};}
function renderProp(type){switch(type){
 case 'shack':{
 box(0,0,0,4.3,3,63,['#8c8290','#777180','#666f7b']);
 for(let i=0;i<85;i++){const u=rnd()*4.3,z=rnd()*59;beam(u,3.01,z,u+.13+rnd()*.22,3.01,z,pick(['#bbb0a159','#55596d','#969098']),1);}
 box(0,-.05,63,4.45,3.16,5,pal.stone);
 // Door, window, faded graffiti, ladder and roof tank.
 windowIso(.35,3.02,8,1.13,36,false);windowIso(2.1,3.02,30,1.38,18,false,true);
 let q=project(.35,3.04,46);text('출입금지',q.x,q.y,6,'#dec3a1');q=project(2.25,3.03,17);text('아직, 여기',q.x,q.y,6,'#d2bbb0');q=project(1.36,3.1,24);rect(q.x,q.y,2,2,'#e4caa0');
 beam(4.32,.3,0,4.32,.3,67,'#383f53',2);beam(4.32,1.0,0,4.32,1.0,67,'#383f53',2);for(let y=4;y<66;y+=6)beam(4.32,.3,y,4.32,1.0,y,'#90999e',2);
 tank(1.45,1.3,69,.95,35);box(3.0,.5,69,.75,.8,9,pal.dark);
 beam(3.6,2,69,3.6,2,114,'#343f53');beam(3.0,2,105,4.1,2,105,'#64758b');beam(3.2,2,112,3.9,2,112,'#64758b');
 for(let i=0;i<7;i++)plants(.2+rnd()*.6,2.9,10+rnd()*50,7,.6);break;}
 case 'desk':{
 for(const u of [.1,3.7])for(const v of [.1,1.5])box(u,v,0,.13,.15,22,pal.dark);box(0,0,22,4,1.8,4,pal.wood);
 box(2.9,.35,0,.9,1.3,20,pal.wood);for(let z=5;z<20;z+=6){beam(3,1.67,z,3.7,1.67,z,'#523d3f');beam(3.25,1.69,z+3,3.5,1.69,z+3,'#d4b58b',2);}
 // monitor with pixel terminal, keyboard, PC tower, headphones, books, coffee.
 box(.55,.3,26,.75,.5,2,pal.dark);box(.8,.46,28,.12,.12,7,pal.iron);box(.05,.36,33,1.9,.14,23,pal.dark);
 const a=project(.15,.515,35),b=project(1.85,.515,35),e=project(.15,.515,54),d=project(1.85,.515,54);poly([a,b,d,e],'#263e50','#82b0b0');
 for(let k=0;k<7;k++)beam(.27,.53,51-k*2,1.0+(k%3)*.26,.53,51-k*2,k%3===0?'#c3af8b':'#83b9ae',1);
 box(.1,1.0,26,1.3,.5,1.5,pal.iron);for(let i=0;i<6;i++)for(let j=0;j<3;j++)isoPlane(.18+i*.17,1.05+j*.12,28,.11,.07,'#ccd0bb');
 box(2.16,.16,26,.6,.6,18,pal.dark);for(let z=29;z<40;z+=3)beam(2.26,.77,z,2.66,.77,z,'#6a868d');let q=project(2.36,.79,41);rect(q.x,q.y,2,2,'#9cd6b5');
 for(let k=0;k<4;k++)box(3.1,1,26+k*2,.72,.47,2,k%2?pal.moss:pal.cloth);q=project(2.0,1.4,26);rect(q.x-3,q.y-6,5,6,'#d5b698');ellipse(q.x,q.y-6,3,1,'#765953');lamp(3.6,.3,26);break;}
 case 'shelf':{
 for(let u of [0,2.45])box(u,0,0,.09,.8,49,pal.dark);for(let z of [9,25,43]){box(0,0,z,2.5,.85,2,pal.wood);for(let j=0;j<6;j++)box(.18+j*.33,.18,z+2,.20,.4,9+rnd()*5,[pal.wood,pal.cloth,pal.blue,pal.moss][j%4]);}plants(1.9,.35,45,15,.8);break;}
 case 'canopy':{
 for(let u of [0,5.8])for(let v of [0,4])beam(u,v,0,u,v,66,'#4b3c44',2);
 poly([project(-.2,-.2,68),project(6,-.2,68),project(6,2.0,59),project(-.2,2,60)],'#b3917dcc','#dfb293');
 poly([project(-.2,2,60),project(6,2,59),project(6,4.1,62),project(-.2,4.1,65)],'#867681aa','#c19b85');
 for(let j=0;j<6;j++)beam(j,-.2,68,j,4.1,64,'#ceb49a33');break;}
 case 'chair':{
 box(0,0,0,.16,.16,13,pal.dark);box(.8,0,0,.14,.14,13,pal.dark);box(0,.8,0,.16,.16,13,pal.dark);box(.8,.8,0,.14,.14,13,pal.dark);box(-.05,-.05,12,1.05,1.1,4,pal.moss);box(-.05,.82,16,1.05,.13,15,pal.moss);break;}
 case 'generator':{
 box(0,0,3,2,1.3,20,pal.moss);box(-.08,-.06,24,2.16,1.42,3,pal.iron);
 for(let k=0;k<6;k++)beam(.14,1.32,9+k*2,1.38,1.32,9+k*2,'#283d47',1.5);
 let q=project(1.71,1.33,17);ellipse(q.x,q.y,4,4,'#282f3e');ellipse(q.x,q.y,2,2,'#c69878');beam(.3,.3,28,.3,.3,39,'#3e4352',3);beam(.3,.3,39,.75,.3,39,'#3e4352',3);
 for(let u of [.3,1.7]){q=project(u,1.05,1);ellipse(q.x,q.y,5,5,'#303747');ellipse(q.x,q.y,2,2,'#898579');}
 box(2.15,.05,0,.6,.6,13,pal.pot);lamp(2.45,1,0);break;}
 case 'supply':{box(0,0,0,1.8,1.4,16,pal.blue);box(-.04,-.04,16,1.88,1.48,3,pal.iron);for(let u of [.25,1.4])box(u,-.08,0,.10,1.6,19,pal.dark);let q=project(.88,1.44,13);rect(q.x-3,q.y-3,6,5,'#d5bd82');crate(-1.1,.45,.8,.8);crate(-.8,-.65,.8,.65);break;}
 case 'antenna':{
 box(0,0,0,1.4,1.4,7,pal.iron);for(let u of [.2,1.2])beam(u,.7,5,.7,.7,74,'#a0a9a0',2);beam(.7,.7,7,.7,.7,99,'#46536a',2);for(let h=12;h<65;h+=13)beam(.24,.7,h,1.2,.7,h+10,'#596a78');
 let q=project(.7,.7,76);ellipse(q.x-4,q.y,19,11,'#405567');ellipse(q.x-5,q.y-2,17,9,'#b5b9ac');ellipse(q.x-6,q.y-2,12,6,'#98a8a2');line([[q.x-5,q.y-2],[q.x-21,q.y-18]],'#c8c7ad',2);rect(q.x-23,q.y-20,4,4,'#575f6e');
 for(let z of [87,98])beam(.15,.7,z,1.4,.7,z,'#8d959e');box(1.4,.7,0,.8,.6,12,pal.dark);break;}
 case 'bed':{
 box(0,0,0,3.6,1.8,7,pal.wood);for(let u=.15;u<3.6;u+=.35)beam(u,0,8,u,1.8,8,'#d1a582',1);
 box(.15,.12,8,3.3,1.57,6,pal.cloth);box(.2,.20,14,.75,1.30,4,['#e2cbb4','#a79698','#c3b4ac']);box(1.08,.12,14,2.36,1.57,2,pal.blue);
 for(let u=1.15;u<3.45;u+=.33)beam(u,.15,17,u,1.65,17,'#afc3b25c');for(let v=.18;v<1.65;v+=.34)beam(1.1,v,17,3.4,v,17,'#445f7488');
 crate(3.9,.1,.8,.8);lamp(4.25,.5,14);break;}
 case 'planter':{
 box(0,0,0,2.2,1,9,pal.wood);isoPlane(.1,.1,10,2,.8,'#474b47');for(let u=.25;u<2;u+=.5)plants(u,.5,10,12,.75);for(let j=0;j<7;j++){const q=project(rnd()*2.1,.2+rnd()*.6,17);rect(q.x,q.y,2,2,pick(['#dda38a','#d4ab72','#9a635e']));}break;}
 case 'solar':{
 box(0,0,0,3.4,2,8,pal.dark);isoPlane(.07,.04,9,3.28,1.92,'#465c77');for(let u=.15;u<3.4;u+=.55)beam(u,.1,10,u,1.9,10,'#98a9b1');for(let v=.15;v<2;v+=.38)beam(.1,v,10,3.3,v,10,'#8e99a5');break;}
 case 'barrels':tank(.5,.5,0,.55,24);tank(1.6,.3,0,.48,20);plants(.5,1.5,0,23,.8);break;
 case 'pot':box(0,0,0,.55,.55,8,pal.pot);plants(.28,.28,9,24,.9);break;
 case 'crate':crate(0,0,1.1,.85);crate(.2,.15,.8,.65,12);break;
 case 'stool':box(0,0,0,.8,.8,11,pal.wood);box(-.07,-.07,11,.94,.94,2,pal.wood);lamp(.4,.4,13);break;
 case 'radio':box(0,0,0,1.3,1,18,pal.wood);box(.1,.14,18,1,.52,9,pal.dark);let q=project(.57,.69,23);ellipse(q.x,q.y,4,3,'#7e9593');beam(1,.2,25,1.2,.2,39,'#b5b9ae');break;
 case 'tank':tank(.8,.8,0,.8,29);break;
}}
const objects=[];
function add(type,u,v,w,d,solid=true,id=''){const o={type,u,v,w,d,solid,id,seed:2090+objects.length*51};o.art=sprite(()=>renderProp(type),o.seed);objects.push(o);return o;}
add('shack',1,1,4.3,3);add('shelf',6.4,1.4,2.5,.85);add('desk',7.4,3.2,4,1.8,true,'pc');add('chair',8.8,5.9,1,1,false);add('canopy',6.7,1.7,5.8,4,false);
add('barrels',2,6,2.1,1.0);add('solar',14.2,1.5,3.4,2);add('antenna',20.4,2.4,1.4,1.4,true,'antenna');add('generator',2.5,11.0,2.05,1.3,true,'power');add('supply',10.5,12.5,1.8,1.4,true,'fuse');add('bed',17,15.3,3.6,1.8,true,'bed');add('radio',15,6.6,1.3,1,true,'radio');
add('planter',20.3,7.2,2.2,1,true,'garden');add('planter',20.3,9.3,2.2,1);add('planter',15.8,17.8,2.2,1);add('planter',2.3,17.6,2.2,1);add('tank',1.6,8.3,1.6,1.6);
for(const [u,v] of [[5.8,2],[12,2.5],[21.7,11.7],[22,17.5],[13.8,16.4],[6,16],[2,14.5],[6.2,8.4],[17.6,1.1]])add('pot',u,v,.55,.55,true);
add('crate',6,13.8,1.1,.85);add('crate',1.8,15.4,1.1,.85);add('crate',16,10.4,1.1,.85);add('stool',13.1,5.8,.9,.9);add('stool',19.2,13,.9,.9);add('stool',6.8,10,.9,.9);
function makeBackground(night){const b=document.createElement('canvas');b.width=1000;b.height=650;C=b.getContext('2d');rnd=random(13871);const sky=C.createLinearGradient(0,0,0,460);sky.addColorStop(0,night?'#17243e':'#595e85');sky.addColorStop(.34,night?'#344060':'#ae8599');sky.addColorStop(.60,night?'#56516d':'#e7ac96');sky.addColorStop(1,night?'#35435b':'#7f869c');C.fillStyle=sky;C.fillRect(0,0,1000,650);
 if(night){for(let i=0;i<150;i++)rect(rnd()*1000,rnd()*215,1,1,pick(['#d8c9b5','#667692','#b4b6c7']));ellipse(720,81,21,21,'#e8d9b6');ellipse(729,76,20,21,'#263351');}else{ellipse(690,180,28,28,'#edc1a0');for(let i=0;i<45;i++)rect(rnd()*1000,25+rnd()*157,25+rnd()*145,1+rnd()*3,'#d8b2b126');}
 for(let j=0;j<3;j++){const pts=[[0,350]];for(let x=-20;x<1040;x+=30)pts.push([x,212+j*25+Math.sin(x*.012+j)*22+rnd()*9]);pts.push([1000,440]);poly(pts,night?['#383e5b','#303b56','#2b3a51'][j]:['#908198','#7f7891','#70758c'][j]);}
 // Three layers of damaged apartment blocks, neon signs, and surviving windows.
 for(let layer=0;layer<3;layer++){let x=-20;while(x<1030){let w=12+rnd()*28,h=20+rnd()*93+layer*11,base=300+layer*34,y=base-h;const colors=night?['#2e3851','#28374e','#223349']:['#70758a','#5c677f','#455772'];rect(x,y,w,h,colors[layer]);rect(x+w-5,y,5,h,night?'#273348':'#516179');if(rnd()<.55)rect(x+3,y-4,w*.55,4,colors[layer]);if(rnd()<.16){line([[x+w/2,y],[x+w/2,y-15]],colors[layer]);line([[x+w/2-6,y-10],[x+w/2+5,y-10]],colors[layer]);}for(let wy=y+8;wy<base-2;wy+=8)for(let wx=x+3;wx<x+w-5;wx+=6){rect(wx,wy,2,3,rnd()<(night?.15:.06)?pick(['#cfa789','#e0bb96','#739f9b']):night?'#35435a':'#748094');}if(rnd()<.2)poly([[x+w*.2,y],[x+w*.45,y-4],[x+w*.6,y+8],[x+w*.8,y+5],[x+w,y+14],[x+w,y]],night?'#273750':'#788598');x+=w+3;}}
 // Namsan tower, deliberately readable against the hills rather than buried in random buildings.
 poly([[748,265],[775,227],[803,209],[832,201],[860,219],[883,260]],night?'#3d4a60':'#7d8291');rect(830,133,3,73,night?'#bdaba0':'#bdb3b0');rect(823,141,18,8,'#454d66');rect(826,133,12,18,'#797b8a');rect(831,112,2,23,'#525e75');rect(830,109,3,3,'#e2b78b');
 const water=C.createLinearGradient(0,350,0,650);water.addColorStop(0,night?'#34445c':'#9a96a5');water.addColorStop(1,night?'#172b43':'#4e6a85');C.fillStyle=water;C.fillRect(0,378,1000,272);for(let j=0;j<850;j++)rect(rnd()*1000,380+rnd()*260,2+rnd()*24,1,pick(night?['#89909622','#e6c5ab19','#70879833']:['#f7c6a840','#798ea65c','#4f6d8866']));
 for(let i=0;i<38;i++){if(i===17||i===18||i===29)continue;const x=i*29,y=425+x*.019;rect(x,y,27,5,night?'#26344c':'#465770');if(i%2===0){rect(x+7,y+5,4,51,'#3e556e');line([[x-12,y],[x+9,y-28],[x+28,y]],'#5d6b83');}}C.globalAlpha=.15;rect(0,375,1000,8,'#ffccaa');C.globalAlpha=1;
 // Near silhouettes frame the roof without a distracting horizon cutout.
 for(const [x,y,w,h] of [[-25,387,112,263],[898,338,96,312],[70,529,62,121],[845,537,100,114]]){rect(x,y,w,h,night?'#192b42':'#2e465f');rect(x+w-14,y,14,h,'#273e55');for(let yy=y+12;yy<650;yy+=17)for(let xx=x+7;xx<x+w-19;xx+=13){rect(xx,yy,6,8,rnd()<.12?'#b8947b':'#425f79');}for(let k=0;k<80;k++){const xx=x+rnd()*w,yy=y+rnd()*h;rect(xx,yy,3,3,pick(['#476860','#36505a','#648174']));}}
 C=ctx;return b;}
const backgrounds=[makeBackground(false),makeBackground(true)];
const floor=document.createElement('canvas');floor.width=1120;floor.height=720;C=floor.getContext('2d');C.translate(485,44);rnd=random(49271);
// A complete raised 2D roof: façade, distressed concrete, puddles, rugs and cables.
box(0,0,-102,24,20,102,['#858091','#333e53','#43506b']);
for(let u=.4;u<24;u+=1.2)for(let z=-94;z<-12;z+=23)windowIso(u,20.02,z,.68,12,false,rnd()<.10);
for(let v=.4;v<20;v+=1.2)for(let z=-94;z<-12;z+=23)windowIso(24.02,v,z,.65,12,true,rnd()<.08);
for(let u=0;u<24;u++)for(let v=0;v<20;v++){const col=pick(['#898692','#827f8b','#787d88','#93909b','#7f8390','#8b8490']);isoPlane(u,v,.1,.97,.97,col);beam(u,v,0,u+1,v,0,'#bbaca622');if(rnd()<.40){const q=project(u+rnd(),v+rnd(),.5);rect(q.x,q.y,1+rnd()*3,1,pick(['#596275','#b6aba9','#6a6e7b']));}if(rnd()<.05){beam(u+.2,v,.6,u+.45,v+.4,.6,'#575d72');beam(u+.45,v+.4,.6,u+.9,v+.75,.6,'#656a7c');}}
for(let j=0;j<19;j++){const u=1+rnd()*22,v=1+rnd()*18,q=project(u,v,1);poly([[q.x-17,q.y],[q.x-6,q.y-6],[q.x+14,q.y-4],[q.x+22,q.y+2],[q.x+5,q.y+7],[q.x-9,q.y+5]],'#8fa6ad4d');rect(q.x-9,q.y-2,17,1,'#d9bba460');}
isoPlane(7.1,5.2,1,5.6,3.2,'#615868');isoPlane(7.26,5.36,1.1,5.28,2.88,'#ae806f');isoPlane(7.42,5.52,1.2,4.96,2.56,'#6e6975');for(let u=7.6;u<12.2;u+=.55)for(let v=5.7;v<8;v+=.55){const q=project(u,v,1.3);poly([[q.x,q.y-3],[q.x+5,q.y],[q.x,q.y+3],[q.x-5,q.y]],'#b68c77');}
for(let u=0;u<24;u+=.28){if(rnd()<.32)plants(u,19.8,-rnd()*45,6,.7);}for(let v=0;v<20;v+=.35){if(rnd()<.35)plants(23.9,v,-rnd()*44,7,.8);}
for(const path of [[[3.6,11.4],[5.8,11.0],[6,4.9],[8.8,4.5]],[[3.6,11.4],[5.5,14.5],[14,14],[18.5,6],[21,3.3]]]){line(path.map(p=>project(...p,1)),'#444558',2);line(path.map(p=>project(p[0]-.05,p[1],2)),'#a2938e',.5);}
const qr=project(10,17.5,1);C.save();C.translate(qr.x,qr.y);C.transform(1,.5,-1,.5,0,0);text('오늘도 살아 있다',0,0,9,'#d2c0b38a');C.restore();
// Small scattered debris is painted once, not recomputed every frame.
for(let j=0;j<2100;j++){const u=.5+rnd()*23,v=.5+rnd()*19;if(u>7&&u<13&&v>5&&v<9)continue;let q=project(u,v,1);rect(q.x,q.y,1+rnd()*2,1,pick(['#afb0a255','#4c5c663b','#c6a78c44','#4549563b']));}
for(let i=0;i<55;i++){const u=rnd()*24,z=-rnd()*99;beam(u,20.03,z,u+.12+rnd()*.6,20.03,z,'#9da09722',2);}
// Faded wall painting in the front façade plane.
C.save();let wallText=project(15,20.1,-36);C.translate(wallText.x,wallText.y);C.transform(1,.5,0,1,0,0);text('STILL HERE.',0,0,12,'#c0bbb66b');text('서울은 아직 살아 있다.',0,13,6,'#c5b7aa66');C.restore();
C=ctx;
function fence(front){return sprite(()=>{const draw=(u,v,uu,vv)=>{beam(u,v,1,uu,vv,1,'#bab2aa',3);beam(u,v,12,uu,vv,12,'#606c7c',2);beam(u,v,24,uu,vv,24,'#b5b0a7',2);let count=Math.ceil(Math.hypot(uu-u,vv-v));for(let k=0;k<=count;k+=1.5){const a=k/count;beam(lerp(u,uu,a),lerp(v,vv,a),1,lerp(u,uu,a),lerp(v,vv,a),25,'#798694',1);}};if(front){draw(0,20,24,20);draw(24,0,24,20);}else{draw(0,0,24,0);draw(0,0,0,20);}},888);}
// Long fences are not sprite-cached to avoid cropping a full-map primitive.
function drawFence(front){function seg(u,v,uu,vv){beam(u,v,1,uu,vv,1,'#beb4aa',3);beam(u,v,13,uu,vv,13,'#606b7d',1);beam(u,v,25,uu,vv,25,'#adb1ae',2);const n=Math.hypot(uu-u,vv-v);for(let a=0;a<=n;a+=1.5)beam(lerp(u,uu,a/n),lerp(v,vv,a/n),1,lerp(u,uu,a/n),lerp(v,vv,a/n),26,'#7a8793',1);}if(front){seg(0,20,24,20);seg(24,0,24,20);}else{seg(0,0,24,0);seg(0,0,0,20);}}
// Directional character art drawn in pixels, not flattened 3D boxes.
function drawPerson(p,t,moving,running){const q=project(p.u,p.v),back=p.dy<-.25,side=Math.abs(p.dx)>.72,flip=p.dx<0?-1:1,walk=moving?Math.sin(p.phase):0,bob=moving?Math.abs(walk)*(running?1.4:.8):Math.sin(t*1.9)*.20;C.save();C.translate(Math.round(q.x),Math.round(q.y));ellipse(0,0,8,3,'#25364866');C.translate(0,-bob);C.scale(flip,1);
 // Six-head-height silhouette: far limbs, trousers, boots, coat, face, hair, hands.
 const stride=walk*(running?5:3.5),s1=side?stride:stride*.65;
 line([[-2,-16],[-3-s1,-8],[-3-s1,0]],'#263546',4);line([[2,-16],[2+s1,-8],[3+s1,-1]],'#48596a',4);
 rect(-5-s1,-2,5,3,'#1e2a3d');rect(1+s1,-2,6,3,'#263246');rect(2+s1,0,5,1,'#8c8985');
 line([[-5,-28],[-7,-21],[-7+stride,-16]],'#33444c',3);ellipse(-7+stride,-16,1.5,2,'#b78973');
 poly([[-4,-30],[3,-30],[6,-26],[5,-17],[-5,-17],[-6,-25]],'#273843','#1e2b3c');poly([[-3,-29],[2,-29],[3,-24],[3,-18],[-3,-18]],back?'#59615b':'#586c65');
 rect(-5,-18,10,2,'#303e4c');if(back){poly([[-4,-28],[2,-28],[5,-25],[4,-18],[-4,-19],[-5,-25]],'#ac805d','#4d4d50');rect(-3,-23,6,2,'#d0a779');rect(-2,-19,5,2,'#876650');}else{line([[-3,-29],[-2,-18]],'#bc956c');line([[3,-29],[2,-18]],'#b68a69');rect(-1,-25,3,2,'#ccb08c');rect(-4,-22,3,3,'#435955');}
 line([[5,-27],[6,-21],[6-stride,-15]],'#637469',3);ellipse(6-stride,-15,1.6,2,'#d6a386');rect(4-stride,-18,3,2,'#343f4d');
 rect(-2,-32,4,3,'#ab7c66');poly([[-4,-39],[-2,-41],[2,-41],[5,-38],[5,-33],[2,-30],[-2,-31],[-4,-34]],back?'#2c2e38':'#d2a286');
 if(!back){poly([[-3,-37],[3,-37],[4,-33],[1,-31],[-2,-32]],'#deb197');rect(1,-36,1,1,'#302c34');if(!side)rect(-3,-36,1,1,'#302c34');rect(3,-34,2,1,'#b78875');rect(0,-32,2,1,'#9d6e64');}
 poly([[-4,-34],[-5,-37],[-4,-41],[-1,-43],[3,-42],[5,-39],[3,-37],[0,-38],[-2,-36],[-3,-33]],'#282b35');line([[-3,-40],[0,-41],[3,-40]],'#505058');if(back){rect(-3,-36,6,4,'#30303a');}ellipse(side?4:-4,-34,1,1.5,'#c89579');
 if(moving&&running){rect(-1,-29,5,2,'#bc9476');}C.restore();}
function drawCat(u,v,t){const q=project(u,v);C.save();C.translate(q.x,q.y);ellipse(0,0,8,3,'#29344755');ellipse(0,-4,7,4,'#c7bba3');ellipse(5,-7,4,4,'#c6a583');poly([[2,-9],[2,-13],[5,-10],[8,-13],[9,-9]],'#927567');rect(5,-7,1,1,'#373c49');line([[-5,-3],[-9,-5],[-10,-9+Math.sin(t*2)]],'#9f8068',3);C.restore();}
const SAVE='seoul209x-2d-v1';let saved={};try{saved=JSON.parse(localStorage.getItem(SAVE)||'{}')||{};}catch(e){}
let stage=Number.isInteger(saved.stage)?clamp(saved.stage,0,4):0,night=!!saved.night,started=false,modal=false,overview=false,run=false,sound=false,t=0,zoom=1,tx=0,ty=0,W=0,H=0,scale=1,cam={x:20,y:230},route=[],goal=null,manual={x:0,y:0},last=performance.now(),footstep=0,sendTimer=0;
let memories=new Set(Array.isArray(saved.memories)?saved.memories.filter(x=>['garden','cat','bed'].includes(x)):[]);
const player={u:10,v:8,phase:0,dx:.8,dy:.5,moving:false};
const cat={u:8,v:9};
const hotspots=[
 {id:'fuse',name:'보급 상자',u:11.3,v:13.2,au:11.2,av:15,tag:'01 / SCAVENGE'},
 {id:'power',name:'발전기',u:3.5,v:11.6,au:4,av:13.2,tag:'02 / POWER'},
 {id:'antenna',name:'안테나',u:21,v:3,au:20.1,av:4.9,tag:'03 / FREQUENCY'},
 {id:'pc',name:'컴퓨터',u:9.5,v:4.5,au:9.5,av:6.2,tag:'04 / TRANSMISSION'},
 {id:'garden',name:'텃밭',u:21.4,v:7.8,au:19.3,av:8.3,tag:'SMALL ROUTINES / 01'},
 {id:'bed',name:'침대',u:18.8,v:16.1,au:18.6,av:14.2,tag:'SMALL ROUTINES / 02'},
 {id:'cat',name:'고양이',u:cat.u,v:cat.v,au:8,av:10.1,tag:'SMALL ROUTINES / 03'},
 {id:'radio',name:'라디오',u:15.6,v:7.1,au:15.4,av:8.7,tag:'RADIO / UNKNOWN'}];
const objectives=['보급 상자에서 퓨즈 찾기','발전기에 퓨즈 장착하기','안테나의 주파수 맞추기','컴퓨터에서 구조 신호 보내기','응답 수신 · 당신은 혼자가 아니다'];
function blocked(u,v,r=.27){if(u<.50||u>23.50||v<.50||v>19.50)return true;return objects.some(o=>o.solid&&u>o.u-r&&u<o.u+o.w+r&&v>o.v-r&&v<o.v+o.d+r);}
if(Number.isFinite(saved.u)&&Number.isFinite(saved.v)&&!blocked(saved.u,saved.v)){player.u=saved.u;player.v=saved.v;}
const keys=new Set();
function store(){try{localStorage.setItem(SAVE,JSON.stringify({stage,night,memories:[...memories],u:player.u,v:player.v}));}catch(e){}}
function resetInput(){keys.clear();manual.x=manual.y=0;stickPointer=null;$('knob').style.transform='translate(0,0)';}
function notify(msg){$('toast').textContent=msg;$('toast').classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('toast').classList.remove('show'),3300);}
function updateHud(){$('step').textContent=String(Math.min(4,stage+1)).padStart(2,'0');$('objective').textContent=objectives[stage];$('progress').querySelectorAll('b').forEach((b,i)=>b.classList.toggle('done',i<stage));$('power').textContent=stage>=2?'전력 복구 · 100%':'전력 대기';$('collection').textContent=memories.size+' / 3';$('night').classList.toggle('on',night);$('night').textContent=night?'황혼':'달빛';}
let audioContext;
function beep(freq=420,duration=.09,volume=.025){if(!sound)return;try{audioContext=audioContext||new (window.AudioContext||window.webkitAudioContext)();audioContext.resume();const a=audioContext.createOscillator(),g=audioContext.createGain();a.type='sine';a.frequency.setValueAtTime(freq,audioContext.currentTime);a.frequency.exponentialRampToValueAtTime(freq*.73,audioContext.currentTime+duration);g.gain.setValueAtTime(volume,audioContext.currentTime);g.gain.exponentialRampToValueAtTime(.0001,audioContext.currentTime+duration);a.connect(g);g.connect(audioContext.destination);a.start();a.stop(audioContext.currentTime+duration);}catch(e){}}
function closeDialog(){if(sendTimer)return;modal=false;$('shade').hidden=true;resetInput();$('world').focus();}
function showDialog(tag,title,body,buttons,extra=''){resetInput();route=[];goal=null;modal=true;$('dialogTag').textContent=tag;$('dialogTitle').textContent=title;$('dialogText').textContent=body;$('extra').innerHTML=extra;const row=$('dialogButtons');row.replaceChildren();buttons.forEach((a,i)=>{const b=document.createElement('button');b.textContent=a.text;if(i===0)b.className='primary';b.onclick=a.click;row.appendChild(b);});$('shade').hidden=false;row.querySelector('button')?.focus();}
function next(){stage=Math.min(4,stage+1);store();updateHud();beep(730,.18);closeDialog();notify(objectives[stage]);}
function collect(id,body){memories.add(id);store();updateHud();showDialog('SMALL ROUTINES / '+memories.size+' OF 3',id==='cat'?'곁에 남아 있는 온기':id==='bed'?'오늘도 무사히':'잎사귀가 기억하는 것',body,[{text:'기록해 두기',click:closeDialog}]);beep(600,.10);}
function interact(id){if(!started||modal)return;const s=hotspots.find(x=>x.id===id);if(!s)return;beep(520,.08);
 if(id==='cat'){collect(id,'고양이가 손바닥에 머리를 기댄다.\n“너는 내일도 여기에 있을 거지?”\n작은 골골거림이 옥상을 채운다.');return;}
 if(id==='garden'){collect(id,'마른 흙에 물을 주었다. 작은 잎이 바람에 흔들린다.\n도시의 시간은 멈췄지만, 이것들은 여전히 자란다.');return;}
 if(id==='bed'){collect(id,'낡은 담요를 정리하고 잠깐 숨을 고른다.\n내일도 여기서 아침을 맞을 수 있기를.');return;}
 if(id==='radio'){showDialog(s.tag,'잡음 속의 목소리',stage===4?'“옥상 신호, 확인했습니다. 내일 해 뜰 때 다시 연락하겠습니다.”':'치직… 지지직…\n아직은 대답이 없다. 신호를 보내면 누군가 답해 줄지도 모른다.',[{text:'듣기를 멈추기',click:closeDialog}]);return;}
 const index=['fuse','power','antenna','pc'].indexOf(id);
 if(index<stage){showDialog(s.tag,s.name,id==='pc'?'발신 메시지와 낯선 사람의 응답이 화면에 남아 있다.':'이미 작업을 마쳤다. '+(id==='power'?'발전기가 낮게 울리고 있다.':'다음 일을 계속하자.'),[{text:'확인',click:closeDialog}]);return;}
 if(index!==stage){showDialog(s.tag,s.name,'먼저 '+objectives[stage]+' 작업을 마쳐야 한다.',[{text:'확인',click:closeDialog}]);return;}
 if(id==='fuse'){showDialog(s.tag,'쓸 만한 부품 하나','상자 속, 천 조각으로 감싼 예비 퓨즈를 찾았다.\n먼지를 닦아 내니 접점이 아직 반짝인다.',[{text:'퓨즈 챙기기',click:next},{text:'돌아가기',click:closeDialog}]);}
 if(id==='power'){showDialog(s.tag,'불빛을 되찾는 일','퓨즈를 장착하면 옥상에 전력을 공급할 수 있다.\n아직 연료는 충분하다.',[{text:'퓨즈 장착 · 시동 걸기',click:next},{text:'돌아가기',click:closeDialog}]);}
 if(id==='antenna'){
 showDialog(s.tag,'잡음 너머의 주파수','슬라이더나 − / +로 주파수를 조정하세요.\n목표 주파수: 108.7 MHz. 오차 ±0.1 이내에서 고정할 수 있습니다.',[{text:'주파수 고정',click:()=>{const f=Number($('frequency').value);if(Math.abs(f-108.7)<.111)next();else{$('frequencyHint').textContent='아직 잡음이 강합니다. 108.7 MHz에 맞춰 주세요.';beep(150,.12);}}},{text:'나중에',click:closeDialog}],'<div class="freq"><strong id="freqValue">104.0</strong> <span>MHz</span><input id="frequency" type="range" min="100" max="112" step="0.1" value="104" aria-label="안테나 주파수"><button id="freqDown" aria-label="주파수 감소">−</button> <button id="freqUp" aria-label="주파수 증가">+</button><small id="frequencyHint">신호를 찾는 중…</small></div>');
 const change=()=>{const f=Number($('frequency').value);$('freqValue').textContent=f.toFixed(1);$('frequencyHint').textContent=Math.abs(f-108.7)<.111?'신호 선명 · 주파수를 고정하세요.':'신호 강도 '+Math.round(Math.max(0,100-Math.abs(f-108.7)*22))+'%';};$('frequency').oninput=change;$('freqDown').onclick=()=>{$('frequency').value=Number($('frequency').value)-.1;change();};$('freqUp').onclick=()=>{$('frequency').value=Number($('frequency').value)+.1;change();};
 }
 if(id==='pc'){showDialog(s.tag,'서울 어딘가로','“서울의 한 옥상. 전력과 물이 있습니다.\n이 메시지를 듣는 사람이 있다면 답해주세요.”', [{text:'구조 신호 송신',click:()=>{if(sendTimer)return;sendTimer=2.8;$('dialogButtons').querySelectorAll('button').forEach(b=>b.disabled=true);$('close').disabled=true;$('dialogText').textContent='신호를 보내는 중…';$('extra').innerHTML='<div class="signal">'+Array.from({length:22},()=>'<i></i>').join('')+'</div>';beep(870,.4);}},{text:'돌아가기',click:closeDialog}]);}
}
function finishSignal(){sendTimer=0;stage=4;store();updateHud();$('close').disabled=false;showDialog('INCOMING / 108.7 MHz','당신은 혼자가 아니다.','“들립니다. 뚝섬 쪽입니다. 두 명이 살아 있어요.”\n\n긴 침묵 끝에, 누군가의 목소리가 돌아왔다.\n내일은 오늘과 조금 다를 것이다.',[{text:'이 옥상에 조금 더 머무르기',click:closeDialog}],'<div class="signal">'+Array.from({length:22},()=>'<i></i>').join('')+'</div>');beep(1040,.35);}
function nearest(){return hotspots.reduce((best,o)=>{const d=Math.hypot(player.u-o.u,player.v-o.v);return d<2.55&&(!best||d<best.d)?{o,d}:best;},null)?.o;}
// 0.5-tile A* navigation with diagonal corner-cut prevention and continuous collision sliding.
const GRID=2,GW=48,GH=40,walkable=(x,y)=>x>=1&&x<GW-1&&y>=1&&y<GH-1&&!blocked(x/GRID,y/GRID);
function pathTo(u,v){const sx=Math.round(player.u*GRID),sy=Math.round(player.v*GRID);let ex=Math.round(u*GRID),ey=Math.round(v*GRID),best=null;
 for(let r=0;r<10&&!best;r++)for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){if(Math.max(Math.abs(dx),Math.abs(dy))!==r)continue;let x=ex+dx,y=ey+dy;if(walkable(x,y)&&(!best||dx*dx+dy*dy<best.d))best={x,y,d:dx*dx+dy*dy};}
 if(!best)return[];ex=best.x;ey=best.y;const start=sx+sy*GW,end=ex+ey*GW,dist=new Float64Array(GW*GH).fill(Infinity),prev=new Int32Array(GW*GH).fill(-1),open=[start],closed=new Set();dist[start]=0;
 const heuristic=i=>Math.hypot(i%GW-ex,Math.floor(i/GW)-ey);
 for(let iter=0;open.length&&iter<GW*GH;iter++){let bi=0;for(let i=1;i<open.length;i++)if(dist[open[i]]+heuristic(open[i])<dist[open[bi]]+heuristic(open[bi]))bi=i;const cur=open.splice(bi,1)[0];if(cur===end){const nodes=[];for(let k=end;k!==start&&k!==-1;k=prev[k])nodes.push({u:k%GW/GRID,v:Math.floor(k/GW)/GRID});return nodes.reverse();}if(closed.has(cur))continue;closed.add(cur);let x=cur%GW,y=Math.floor(cur/GW);for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){if(!dx&&!dy)continue;const nx=x+dx,ny=y+dy,n=nx+ny*GW;if(!walkable(nx,ny)||closed.has(n)||dx&&dy&&(!walkable(x+dx,y)||!walkable(x,y+dy)))continue;const cost=dist[cur]+Math.hypot(dx,dy);if(cost<dist[n]){dist[n]=cost;prev[n]=cur;if(!open.includes(n))open.push(n);}}}return[];
}
function navigate(u,v,hot=null){route=pathTo(u,v);goal=hot;if(!route.length){if(hot&&Math.hypot(player.u-hot.u,player.v-hot.v)<2.55)interact(hot.id);else notify('그곳까지 이동할 수 없습니다.');}if(route.length&&overview){overview=false;$('overview').classList.remove('on');}}
function help(){showDialog('FIELD GUIDE / 조작 안내','옥상의 작은 하루','휴대폰: 왼쪽 패드로 이동, 오른쪽 조작 버튼.\nPC: WASD / 방향키 이동, Shift 달리기, E 조작.\n\n바닥을 누르면 그곳으로 자동 이동합니다.\n이름표를 누르면 이동 후 해당 사물을 조작합니다.\n전체: 옥상을 한눈에 보기 · ＋ / −: 확대와 축소.\n\n진행 상황은 이 브라우저에 자동 저장됩니다.',[{text:'계속하기',click:closeDialog},{text:'새 게임',click:()=>showDialog('NEW GAME','처음부터 시작할까요?','이 브라우저에 저장된 2D 게임 진행과 기록만 초기화합니다.',[{text:'초기화하고 시작',click:()=>{stage=0;memories.clear();player.u=10;player.v=8;route=[];goal=null;store();updateHud();closeDialog();}},{text:'취소',click:closeDialog}])}]);}
function begin(){started=true;$('menu').hidden=true;['hud','tools','touch','desktopHint','legend'].forEach(x=>$(x).hidden=false);updateHud();notify(stage?'지난 기록에서 계속합니다.':'목표를 누르면 자동 이동 · 왼쪽 패드 / WASD로 직접 이동');}
$('start').onclick=begin;$('close').onclick=closeDialog;$('night').onclick=()=>{night=!night;store();updateHud();};$('overview').onclick=()=>{overview=!overview;$('overview').classList.toggle('on',overview);};$('zoomIn').onclick=()=>{zoom=clamp(zoom+.2,.6,1.8);overview=false;$('overview').classList.remove('on');};$('zoomOut').onclick=()=>{zoom=clamp(zoom-.2,.6,1.8);};$('audio').onclick=()=>{sound=!sound;$('audio').textContent=sound?'소리 ON':'소리 OFF';$('audio').setAttribute('aria-pressed',String(sound));beep(540);};$('help').onclick=help;$('run').onclick=()=>{run=!run;$('run').classList.toggle('on',run);$('run').setAttribute('aria-pressed',String(run));};$('action').onclick=()=>{const s=nearest();if(s)interact(s.id);else notify('사물 가까이 이동하세요.');};
window.addEventListener('keydown',e=>{if(e.target instanceof HTMLInputElement)return;if(modal){if(e.code==='Escape')closeDialog();if(e.code==='Tab'){const a=[...$('dialog').querySelectorAll('button:not(:disabled),input')];if(!a.length)return;let i=a.indexOf(document.activeElement),n=e.shiftKey?(i-1+a.length)%a.length:(i+1)%a.length;a[n].focus();e.preventDefault();}return;}if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.code);if(e.repeat)return;if(!started&&e.code==='Enter')begin();if(started&&(e.code==='KeyE'||e.code==='Space'))$('action').click();if(e.code==='KeyN')$('night').click();if(e.code==='Escape')help();});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',resetInput);document.addEventListener('visibilitychange',()=>{if(document.hidden){resetInput();route=[];goal=null;store();}last=performance.now();});
let stickPointer=null;const stick=$('stick');function moveStick(e){const b=stick.getBoundingClientRect(),r=b.width*.34;let x=e.clientX-b.left-b.width/2,y=e.clientY-b.top-b.height/2,l=Math.hypot(x,y);if(l>r){x=x/l*r;y=y/l*r;}manual.x=x/r;manual.y=y/r;$('knob').style.transform=`translate(${x}px,${y}px)`;route=[];goal=null;}
stick.addEventListener('pointerdown',e=>{if(stickPointer!==null)return;e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);moveStick(e);});stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)moveStick(e);});for(const type of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(type,e=>{if(e.pointerId===stickPointer)resetInput();});
let downPoint=null,labelHits=[];canvas.addEventListener('pointerdown',e=>{downPoint={x:e.clientX,y:e.clientY};});canvas.addEventListener('pointerup',e=>{if(!started||modal||!downPoint||Math.hypot(e.clientX-downPoint.x,e.clientY-downPoint.y)>12)return;downPoint=null;const x=e.clientX*W/window.innerWidth,y=e.clientY*H/window.innerHeight;const hit=labelHits.find(h=>x>=h.x&&x<=h.x+h.w&&y>=h.y&&y<=h.y+h.h);if(hit){navigate(hit.o.au,hit.o.av,hit.o);return;}const wx=(x-tx)/scale,wy=(y-ty)/scale,u=(wy/10+wx/20)/2,v=(wy/10-wx/20)/2;const h=hotspots.find(h=>Math.hypot(u-h.u,v-h.v)<1.5);if(h)navigate(h.au,h.av,h);else if(u>0&&u<24&&v>0&&v<20)navigate(u,v);});canvas.addEventListener('wheel',e=>{e.preventDefault();zoom=clamp(zoom-e.deltaY*.001,.6,1.8);overview=false;},{passive:false});
function resize(){const pixel=window.innerWidth<600?1.65:2;W=Math.ceil(window.innerWidth/pixel);H=Math.ceil(window.innerHeight/pixel);canvas.width=W;canvas.height=H;ctx.imageSmoothingEnabled=false;}window.addEventListener('resize',resize);resize();
function glow(u,v,z,r,color,strength){const q=project(u,v,z);C.save();C.globalAlpha=strength;const g=C.createRadialGradient(q.x,q.y,0,q.x,q.y,r);g.addColorStop(0,color);g.addColorStop(.24,color+'77');g.addColorStop(1,color+'00');C.fillStyle=g;C.fillRect(q.x-r,q.y-r,r*2,r*2);C.restore();}
const dust=Array.from({length:42},(_,i)=>{const r=random(i*45+91);return{x:r()*940-430,y:r()*470,z:r()*50,s:.3+r()};});
function render(){
 C=ctx;ctx.setTransform(1,0,0,1,0,0);ctx.globalAlpha=1;ctx.imageSmoothingEnabled=false;ctx.drawImage(backgrounds[night?1:0],0,0,W,H);
 let z,focus,cx=W*.5,cy=H*.53;
 if(!started||overview){z=Math.min((W-28)/890,(H-55)/590);focus={x:40,y:215};if(!started&&W>H){cx=W*.65;z*=.98;}cy=H*.55;}else{z=(W<310?.78:clamp((W-25)/850,.66,.98))*zoom;focus=project(player.u,player.v);focus.y+=10;}
 scale=lerp(scale,z,.12);cam.x=lerp(cam.x,focus.x,.12);cam.y=lerp(cam.y,focus.y,.12);tx=Math.round(cx-cam.x*scale);ty=Math.round(cy-cam.y*scale);
 ctx.save();ctx.translate(tx,ty);ctx.scale(scale,scale);ctx.drawImage(floor,-485,-44);drawFence(false);
 // Paint cast shadows before the sorted sprite layer.
 objects.forEach(o=>{if(o.type==='canopy')return;const q=project(o.u+o.w*.5,o.v+o.d*.5);ellipse(q.x+8,q.y+3,(o.w+o.d)*8,(o.w+o.d)*3,'#2434452b');});
 if(route.length&&started&&!modal){for(let i=1;i<route.length;i+=2){const q=project(route[i].u,route[i].v,1);rect(q.x-1,q.y-1,2,2,'#eed0a6b0');}const e=project(route.at(-1).u,route.at(-1).v,1);C.globalAlpha=.4+.2*Math.sin(t*5);line([[e.x,e.y-5],[e.x+10,e.y],[e.x,e.y+5],[e.x-10,e.y],[e.x,e.y-5]],'#ffe1ac',1);C.globalAlpha=1;}
 const sorted=objects.map(o=>({depth:o.u+o.v+(o.w+o.d)*.65,o}));sorted.push({depth:player.u+player.v,person:true},{depth:cat.u+cat.v,cat:true});sorted.sort((a,b)=>a.depth-b.depth);
 const pq=project(player.u,player.v);
 for(const a of sorted){if(a.person){drawPerson(player,t,player.moving,run||keys.has('ShiftLeft')||keys.has('ShiftRight'));continue;}if(a.cat){drawCat(cat.u,cat.v,t);continue;}const o=a.o,q=project(o.u,o.v),s=o.art;const occlude=started&&pq.y>q.y+s.y&&pq.y<q.y+s.y+s.canvas.height&&Math.abs(pq.x-q.x)<(o.w+o.d)*12&&a.depth>player.u+player.v;
 C.globalAlpha=o.type==='canopy'?.50:occlude?.46:1;C.drawImage(s.canvas,Math.round(q.x+s.x),Math.round(q.y+s.y));C.globalAlpha=1;}
 C.globalAlpha=player.u>22||player.v>18?.48:.86;drawFence(true);C.globalAlpha=1;
 // Draped fairy lights, monitor spill, antenna beacon and firefly-sized dust.
 const wire=[];for(let i=0;i<=24;i++){const u=6.7+i/24*6;wire.push(project(u,6,60-Math.sin(i/24*Math.PI)*9));}line(wire,'#394555',1);
 for(let i=0;i<10;i++){const u=6.7+i/9*6,zl=60-Math.sin(i/9*Math.PI)*9,q=project(u,6,zl);line([[q.x,q.y],[q.x,q.y+4]],'#403e4b');ellipse(q.x,q.y+5,1.5,2,stage>=2?'#ffe0a4':'#b99e85');if(stage>=2)glow(u,6,zl-5,9,'#ffc98c',.40);}
 const laundryWire=[project(13,18.8,54),project(16,18.8,48),project(19,18.8,54)];line(laundryWire,'#536170');beam(13,18.8,0,13,18.8,54,'#586577',2);beam(19,18.8,0,19,18.8,54,'#586577',2);
for(let i=0;i<3;i++){const q=project(14+i*1.4,18.8,49);C.save();C.translate(q.x,q.y);const sway=Math.sin(t*1.1+i)*1.2;poly([[-6,0],[-3,-1],[0,1],[3,-1],[7,1],[10,5],[7,8],[5,7],[5+sway,20],[-5+sway,20],[-5,7],[-8,8],[-10,5]],['#526b72','#b3a18b','#6e7583'][i]);line([[-5,4],[-4+sway,18]],'#ccd1c336');rect(-4,-2,2,3,'#c5b495');rect(4,-2,2,3,'#c5b495');C.restore();}
if(night){C.save();C.setTransform(1,0,0,1,0,0);rect(0,0,W,H,'#1223455e');C.restore();}
 for(const [u,v] of [[13.5,6.2],[19.6,13.4],[7.2,10.4]])glow(u,v,19,32,'#ffbd7e',night?.36:.25);
 glow(8.6,4.6,42,34,'#a4e2d7',stage>=2?.33:.13);
 if(stage>=2){glow(9,5.0,26,50,'#ffc38a',night?.20:.12);const q=project(4.2,12.32,17);rect(q.x,q.y,2,2,'#b7d69d');}
 if(stage>=3){const q=project(21.1,3.1,99);rect(q.x-1,q.y,2,2,t%1>.5?'#ffb099':'#788c8b');glow(21.1,3.1,99,8,'#ffb7a2',.28);}
 for(const d of dust){const x=(d.x+t*d.s*2)%940-30,y=d.y+Math.sin(t*d.s+d.x)*4;rect(x,y-d.z,1,1,night?'#e4ce9544':'#f2cbad66');}
 if(stage===4){const q=project(21.1,3.1,40);for(let i=0;i<3;i++){let a=(t*.22+i/3)%1;C.globalAlpha=(1-a)*.45;C.beginPath();C.ellipse(q.x,q.y,a*85,a*42,0,0,TAU);C.strokeStyle='#d9c399';C.lineWidth=1;C.stroke();}C.globalAlpha=1;}
 ctx.restore();labelHits=[];
 if(started&&!modal){const near=nearest(),current=hotspots[stage<4?stage:3];for(const o of hotspots){const main=o===current,isNear=o===near;if(!main&&!isNear&&!overview)continue;const q=project(o.u,o.v),xx=q.x*scale+tx,yy=(q.y-28)*scale+ty;const label=(main?'◆ ':'')+o.name,fs=W<300?7:8;C.font=`bold ${fs}px monospace`;let width=C.measureText(label).width+14,height=16;let x=xx-width/2,y=yy-14;if(x<1||x+width>W-1||y<5||y>H-50)continue;rect(x,y,width,height,main?'#463e36ed':'#203047df');line([[x,y],[x+width,y]],main?'#e9bc87':'#9babb055');text(label,xx,y+11,fs,main?'#ffdcaa':'#c7d1c5','center');labelHits.push({x,y,w:width,h:height,o});}
 $('near').hidden=!near||overview;$('near').textContent=near?near.name+' · '+(window.matchMedia('(pointer:coarse)').matches?'조작 버튼':'E 키로 조작'):'';
 }else $('near').hidden=true;
}
function tick(now){requestAnimationFrame(tick);const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;t+=dt;player.moving=false;
 if(started&&!modal&&!overview){let sx=manual.x+Number(keys.has('KeyD')||keys.has('ArrowRight'))-Number(keys.has('KeyA')||keys.has('ArrowLeft')),sy=manual.y+Number(keys.has('KeyS')||keys.has('ArrowDown'))-Number(keys.has('KeyW')||keys.has('ArrowUp'));let du=0,dv=0;const len=Math.hypot(sx,sy);if(len>.13){route=[];goal=null;sx/=Math.max(1,len);sy/=Math.max(1,len);du=sx+sy;dv=sy-sx;const l=Math.hypot(du,dv);du=du/l*Math.min(1,len);dv=dv/l*Math.min(1,len);}else if(route.length){let r=route[0],dx=r.u-player.u,dy=r.v-player.v,dist=Math.hypot(dx,dy);if(dist<.13){route.shift();}else{du=dx/dist;dv=dy/dist;}}
 const running=run||keys.has('ShiftLeft')||keys.has('ShiftRight'),speed=running?4.4:2.7,oldU=player.u,oldV=player.v;let u=player.u+du*dt*speed,v=player.v+dv*dt*speed;if(!blocked(u,player.v))player.u=u;if(!blocked(player.u,v))player.v=v;const moved=Math.hypot(player.u-oldU,player.v-oldV);if(moved>.001){player.moving=true;player.phase+=moved*(running?5.8:6.6);const vec=project(du,dv),l=Math.hypot(vec.x,vec.y)||1;player.dx=vec.x/l;player.dy=vec.y/l;footstep+=moved;if(footstep>.65){footstep=0;beep(120,.05,.013);}}else if(route.length&&(Math.abs(du)+Math.abs(dv)>.01)){route=[];goal=null;}
 if(!route.length&&goal){const g=goal;goal=null;if(Math.hypot(player.u-g.u,player.v-g.v)<2.6)interact(g.id);}
 }if(sendTimer){sendTimer-=dt;if(sendTimer<=0)finishSignal();}
 if(started&&t-(tick.lastSave||0)>3){tick.lastSave=t;store();}$('clock').textContent=night?'22:17':'18:'+String(42+Math.floor(t/65)%18).padStart(2,'0');render();
}
// Test-only hooks are opt-in and never exposed during a normal visit.
if(new URLSearchParams(location.search).has('test'))window.__game={get state(){return{stage,memories:[...memories],player:{...player},route:[...route],started,night,modal,W,H,scale};},hotspots,objects:objects.map(o=>({type:o.type,u:o.u,v:o.v,w:o.w,d:o.d,solid:o.solid})),blocked,pathTo,navigate,interact,begin,teleport:(u,v)=>{if(blocked(u,v))throw Error('Blocked');player.u=u;player.v=v;},screen:(u,v)=>{const q=project(u,v);return{x:(q.x*scale+tx)*window.innerWidth/W,y:(q.y*scale+ty)*window.innerHeight/H};}};
const objectiveNode=document.querySelector('.task');objectiveNode.style.pointerEvents='auto';objectiveNode.style.cursor='pointer';objectiveNode.setAttribute('role','button');objectiveNode.tabIndex=0;objectiveNode.title='누르면 현재 목표로 자동 이동';objectiveNode.onclick=()=>{if(stage<4&&!modal){const h=hotspots[stage];overview=false;$('overview').classList.remove('on');navigate(h.au,h.av,h);}};objectiveNode.onkeydown=e=>{if(e.key==='Enter')objectiveNode.click();};
if(stage)$('start').firstChild.textContent='지난 기록에서 계속하기 ';updateHud();scale=Math.min((W-28)/890,(H-55)/590);cam={x:40,y:215};requestAnimationFrame(tick);
})();
