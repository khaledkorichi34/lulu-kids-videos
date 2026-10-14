/* Lulu's Little Pond - shared drawing library (1280x720 stage, ground line y=520, caption bar y=606..698) */
const svg=document.getElementById('s');
const clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x));
const lerp=(a,b,u)=>a+(b-a)*u;
const prog=(t,a,b)=>clamp((t-a)/(b-a));
const eio=u=>u<.5?2*u*u:1-Math.pow(-2*u+2,2)/2;
const eout=u=>1-Math.pow(1-u,3);
const back=u=>{const c1=1.70158,c3=c1+1;return 1+c3*Math.pow(u-1,3)+c1*Math.pow(u-1,2);};
const hex=c=>[1,3,5].map(i=>parseInt(c.substr(i,2),16));
const mix=(a,b,u)=>{const A=hex(a),B=hex(b);return 'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*u)).join(',')+')';};
const blink=(t,off)=>((t+off)%3.4)<.13?.12:1;

function jump(lt,t0,dur,h){
  const u=(lt-t0)/dur;
  if(u<=0||u>=1.25) return null;
  if(u<1){const a=4*u*(1-u);return {y:-h*a,sx:1-.08*a,sy:1+.12*a};}
  const s=Math.sin(Math.PI*(u-1)/.25)*.14;return {y:0,sx:1+s,sy:1-s};
}
function jumps(lt,times,dur,h){
  for(const t0 of times){const j=jump(lt,t0,dur,h);if(j)return j;}
  return {y:0,sx:1,sy:1};
}
function place(x,y,inner,o={}){
  const s=o.s||1;
  return `<g transform="translate(${x},${y}) rotate(${o.rot||0}) scale(${s*(o.sx||1)*(o.flip?-1:1)},${s*(o.sy||1)})">${inner}</g>`;
}
function shadow(x,y,w,lift=0){
  const k=1-clamp(lift/260)*.5;
  return `<ellipse cx="${x}" cy="${y}" rx="${w*k}" ry="${w*.2*k}" fill="#1c4d1c" opacity="${.22*k}"/>`;
}

/* ---------- characters (origin at feet) ---------- */
function duck(o={}){
  const wing=o.wing||0, e=o.eye==null?1:o.eye;
  const eye=o.asleep
    ?`<path d="M47,-119 Q56,-110 65,-119" stroke="#3a2a1a" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
    :`<g transform="translate(56,-120) scale(1,${e})"><circle r="8.5" fill="#2b1d12"/><circle cx="2.8" cy="-3" r="3" fill="#fff"/></g>`;
  return `
  <ellipse cx="-16" cy="-5" rx="17" ry="8" fill="#FF8C1A"/><ellipse cx="18" cy="-5" rx="17" ry="8" fill="#FF8C1A"/>
  <path d="M-48,-82 Q-98,-108 -74,-50 Z" fill="#FFD23F"/>
  <ellipse cx="0" cy="-56" rx="62" ry="50" fill="#FFD23F"/>
  <ellipse cx="8" cy="-40" rx="40" ry="28" fill="#FFE785" opacity=".75"/>
  <path d="M34,-150 Q28,-174 45,-160 Q52,-178 56,-152 Z" fill="#FFD23F"/>
  <circle cx="42" cy="-114" r="40" fill="#FFD23F"/>
  <g transform="rotate(${wing} 14 -66)"><ellipse cx="-10" cy="-56" rx="30" ry="21" fill="#F5B301"/></g>
  <ellipse cx="88" cy="-104" rx="21" ry="10" fill="#FF8C1A"/>
  <path d="M70,-104 Q88,-98 107,-104" stroke="#D96B00" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="38" cy="-95" r="9" fill="#FF9AA2" opacity=".75"/>
  ${eye}`;
}
function frog(o={}){
  const e=o.eye==null?1:o.eye;
  const eye=x=>`<g transform="translate(${x},-85) scale(1,${e})"><circle r="7.5" fill="#1f2d1f"/><circle cx="2" cy="-2.5" r="2.6" fill="#fff"/></g>`;
  return `
  <ellipse cx="-48" cy="-10" rx="26" ry="13" fill="#3FA34D"/><ellipse cx="48" cy="-10" rx="26" ry="13" fill="#3FA34D"/>
  <ellipse cx="0" cy="-44" rx="60" ry="44" fill="#5CC85C"/>
  <ellipse cx="0" cy="-25" rx="36" ry="21" fill="#C9F2A6"/>
  <circle cx="-28" cy="-86" r="21" fill="#5CC85C"/><circle cx="28" cy="-86" r="21" fill="#5CC85C"/>
  <circle cx="-28" cy="-86" r="14" fill="#fff"/><circle cx="28" cy="-86" r="14" fill="#fff"/>
  ${eye(-30)}${eye(26)}
  <path d="M-24,-64 Q0,-45 24,-64" stroke="#1f5d2a" stroke-width="4.5" fill="none" stroke-linecap="round"/>
  <circle cx="-42" cy="-58" r="8" fill="#FF9AA2" opacity=".7"/><circle cx="42" cy="-58" r="8" fill="#FF9AA2" opacity=".7"/>`;
}
function bunny(o={}){
  const e=o.eye==null?1:o.eye, ear=o.ear||0;
  const eye=x=>`<g transform="translate(${x},-118) scale(1,${e})"><circle r="6.5" fill="#3a2a3a"/><circle cx="2" cy="-2.2" r="2.3" fill="#fff"/></g>`;
  const earG=(x,r)=>`<g transform="rotate(${r} ${x} -140)"><ellipse cx="${x}" cy="-184" rx="15" ry="46" fill="#fff"/><ellipse cx="${x}" cy="-182" rx="7" ry="32" fill="#FFB3C7"/></g>`;
  return `
  <circle cx="46" cy="-30" r="15" fill="#fff"/>
  <ellipse cx="-22" cy="-5" rx="21" ry="9" fill="#E9DDF5"/><ellipse cx="22" cy="-5" rx="21" ry="9" fill="#E9DDF5"/>
  ${earG(-17,-8-ear)}${earG(17,8+ear)}
  <ellipse cx="0" cy="-48" rx="46" ry="48" fill="#fff"/>
  <ellipse cx="0" cy="-38" rx="26" ry="27" fill="#FFE3EC"/>
  <circle cx="0" cy="-112" r="40" fill="#fff"/>
  ${eye(-15)}${eye(15)}
  <ellipse cx="0" cy="-104" rx="6" ry="4.5" fill="#FF7FA5"/>
  <path d="M0,-100 Q-6,-92 -12,-97 M0,-100 Q6,-92 12,-97" stroke="#8a6a8a" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="-27" cy="-102" r="8" fill="#FF9AA2" opacity=".7"/><circle cx="27" cy="-102" r="8" fill="#FF9AA2" opacity=".7"/>`;
}
function bee(o={}){
  const f=o.flap||0;
  const wing=(x,r)=>`<g transform="translate(${x},-26) rotate(${r})"><ellipse cx="0" cy="-22" rx="17" ry="27" fill="#fff" opacity=".9" stroke="#BFE3F5" stroke-width="2"/></g>`;
  return `
  ${wing(2,-22+f*26)}${wing(18,22-f*26)}
  <path d="M43,-4 L64,-2 L44,10 Z" fill="#3a2a1a"/>
  <ellipse rx="46" ry="34" fill="#FFC928"/>
  <g clip-path="url(#beeclip)"><rect x="-6" y="-40" width="14" height="80" fill="#3a2a1a"/><rect x="21" y="-40" width="13" height="80" fill="#3a2a1a"/></g>
  <path d="M-30,-26 Q-36,-50 -48,-50 M-18,-31 Q-18,-54 -30,-58" stroke="#3a2a1a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="-48" cy="-50" r="4.5" fill="#3a2a1a"/><circle cx="-30" cy="-58" r="4.5" fill="#3a2a1a"/>
  <circle cx="-26" cy="-6" r="6.5" fill="#2b1d12"/><circle cx="-24" cy="-8.5" r="2.3" fill="#fff"/>
  <path d="M-38,8 Q-30,17 -21,9" stroke="#3a2a1a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="-13" cy="8" r="7" fill="#FF9AA2" opacity=".8"/>`;
}
function butterfly(x,y,f){
  const w=.25+.75*f;
  return `<g transform="translate(${x},${y}) rotate(-15)"><g transform="scale(${w},1)">
  <ellipse cx="-14" cy="-8" rx="14" ry="12" fill="#FF7FB0"/><ellipse cx="14" cy="-8" rx="14" ry="12" fill="#FF7FB0"/>
  <ellipse cx="-10" cy="10" rx="10" ry="9" fill="#FFB347"/><ellipse cx="10" cy="10" rx="10" ry="9" fill="#FFB347"/></g>
  <ellipse rx="3" ry="14" fill="#5a3b2a"/></g>`;
}
function heart(x,y,s,c,o){
  return `<path transform="translate(${x},${y}) scale(${s*2.2})" d="M0,7 C-14,-5 -7,-17 0,-8 C7,-17 14,-5 0,7Z" fill="${c}" opacity="${o}"/>`;
}
function flower(x,y,h,col,t,i,s=1,center='#FFB703'){
  let p='';
  for(let k=0;k<6;k++){const a=k*Math.PI/3;p+=`<circle cx="${Math.cos(a)*22}" cy="${-h+Math.sin(a)*22}" r="17" fill="${col}"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${Math.sin(t*1.4+i*1.9)*3.5})">
  <path d="M0,0 Q10,${-h/2} 0,${-h}" stroke="#2F9E44" stroke-width="8" fill="none" stroke-linecap="round"/>
  <ellipse cx="18" cy="${-h*.38}" rx="18" ry="8" fill="#2F9E44" transform="rotate(-25 18 ${-h*.38})"/>
  ${p}<circle cx="0" cy="${-h}" r="15" fill="${center}"/></g>`;
}
function carrot(x,y,s){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <ellipse cx="-12" cy="-78" rx="8" ry="20" fill="#3FA34D" transform="rotate(-25 -12 -78)"/>
  <ellipse cx="0" cy="-84" rx="8" ry="22" fill="#4CB85A"/>
  <ellipse cx="12" cy="-78" rx="8" ry="20" fill="#3FA34D" transform="rotate(25 12 -78)"/>
  <path d="M-18,-62 Q0,-74 18,-62 L5,-6 Q0,2 -5,-6 Z" fill="#FF8C1A"/>
  <path d="M-8,-46 L4,-46 M-4,-30 L6,-30" stroke="#D96B00" stroke-width="3" stroke-linecap="round"/></g>`;
}

// bird({eye,wing,col,dark,belly}): small round bird facing right (blue unless colours are given)
function bird(o={}){
  const e=o.eye==null?1:o.eye, wing=o.wing||0, c=o.col||'#2979E8', d=o.dark||'#1B5FC4', b=o.belly||'#CFE6FF';
  return `
  <rect x="-19" y="-30" width="7" height="27" rx="3" fill="#FF8C1A"/><rect x="11" y="-30" width="7" height="27" rx="3" fill="#FF8C1A"/>
  <ellipse cx="-11" cy="-4" rx="15" ry="6.5" fill="#FF8C1A"/><ellipse cx="19" cy="-4" rx="15" ry="6.5" fill="#FF8C1A"/>
  <path d="M-44,-94 Q-106,-114 -98,-62 Q-74,-52 -48,-56 Z" fill="${d}"/>
  <ellipse cx="0" cy="-72" rx="58" ry="50" fill="${c}"/>
  <ellipse cx="10" cy="-56" rx="36" ry="27" fill="${b}"/>
  <path d="M26,-158 Q20,-184 37,-170 Q44,-188 48,-160 Z" fill="${c}"/>
  <circle cx="34" cy="-126" r="38" fill="${c}"/>
  <g transform="rotate(${wing} 12 -80)"><ellipse cx="-14" cy="-72" rx="30" ry="20" fill="${d}"/></g>
  <path d="M68,-133 Q100,-124 100,-120 Q100,-116 68,-107 Z" fill="#FF9F1C"/>
  <circle cx="34" cy="-106" r="8.5" fill="#FFA3B1" opacity=".95"/>
  <g transform="translate(50,-132) scale(1,${e})"><circle r="8" fill="#14213d"/><circle cx="2.6" cy="-2.8" r="2.8" fill="#fff"/></g>`;
}
// apple(x,y,s): red apple standing on the ground (about 150 tall with its stalk)
function apple(x,y,s){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M2,-108 Q4,-134 18,-146" stroke="#7A4B21" stroke-width="8" fill="none" stroke-linecap="round"/>
  <ellipse cx="38" cy="-134" rx="24" ry="11" fill="#3FA34D" transform="rotate(-22 38 -134)"/>
  <ellipse cx="-25" cy="-62" rx="50" ry="58" fill="#E63946"/><ellipse cx="25" cy="-62" rx="50" ry="58" fill="#E63946"/>
  <ellipse cx="-42" cy="-84" rx="10" ry="19" fill="#fff" opacity=".35" transform="rotate(22 -42 -84)"/></g>`;
}

/* ---------- background ---------- */
const STARS=[];(function(){let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647;for(let i=0;i<46;i++)STARS.push([r()*1280,r()*350+12,1.6+r()*2.8,r()*6.28]);})();
function sun(t,x,y){
  let r='';for(let i=0;i<12;i++)r+=`<line x1="0" y1="-70" x2="0" y2="-88" stroke="#FFC400" stroke-width="9" stroke-linecap="round" transform="rotate(${i*30+t*12})"/>`;
  return `<g transform="translate(${x},${y})">${r}<circle r="58" fill="#FFD93B"/>
  <circle cx="-20" cy="-8" r="6" fill="#7a4b00"/><circle cx="20" cy="-8" r="6" fill="#7a4b00"/>
  <path d="M-20,14 Q0,34 20,14" stroke="#7a4b00" stroke-width="5" fill="none" stroke-linecap="round"/>
  <circle cx="-36" cy="12" r="9" fill="#FF9A6B" opacity=".7"/><circle cx="36" cy="12" r="9" fill="#FF9A6B" opacity=".7"/></g>`;
}
function moon(x,y){
  return `<g transform="translate(${x},${y})"><circle r="84" fill="#FFF3B8" opacity=".14"/><circle r="54" fill="#FFF3B8"/>
  <circle cx="-22" cy="-24" r="9" fill="#F0DD8E"/><circle cx="26" cy="-30" r="6" fill="#F0DD8E"/><circle cx="30" cy="26" r="8" fill="#F0DD8E"/>
  <path d="M-24,-2 Q-16,6 -8,-2 M8,-2 Q16,6 24,-2" stroke="#8a7430" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M-10,16 Q0,24 10,16" stroke="#8a7430" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
}
function cloud(x,y,s,o){
  return `<g transform="translate(${x},${y}) scale(${s})" opacity="${o}" fill="#fff"><ellipse cx="0" cy="10" rx="70" ry="24"/><circle cx="-30" cy="-2" r="26"/><circle cx="6" cy="-16" r="34"/><circle cx="40" cy="0" r="24"/></g>`;
}
// bg(t, night 0..1, extra drawn behind the hills, {noSun, noFlowers, noClouds})
function bg(t,n,behind='',o={}){
  let s=`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix('#5EC2FF','#14153F',n)}"/><stop offset="1" stop-color="${mix('#DDF5FF','#4A4FA3',n)}"/></linearGradient><clipPath id="beeclip"><ellipse rx="46" ry="34"/></clipPath></defs>`;
  s+=`<rect width="1280" height="720" fill="url(#sky)"/>`;
  if(n>0) STARS.forEach((p,i)=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="#FFF8D6" opacity="${n*(.55+.45*Math.sin(t*3+p[3]))}"/>`;});
  if(!o.noSun)s+=sun(t,1150,100+n*560);
  if(n>0) s+=moon(1150,660-n*560);
  const co=1-n*.75;
  if(!o.noClouds)s+=cloud(((200+t*14)%1500)-110,120,1.1,co)+cloud(((760+t*9)%1500)-110,74,.8,co)+cloud(((1180+t*11)%1500)-110,200,.9,co);
  s+=behind;
  s+=`<path d="M0,440 Q300,330 640,410 T1280,400 L1280,720 L0,720Z" fill="${mix('#9ADB6F','#3E6B5A',n)}"/>`;
  s+=`<path d="M0,500 Q380,440 760,490 T1280,470 L1280,720 L0,720Z" fill="${mix('#6CC24A','#2F5A4C',n)}"/>`;
  if(!o.noFlowers)s+=flower(70,590,90,'#FF7FB0',t,0,.55)+flower(150,570,90,'#FFFFFF',t,1,.45)+flower(1215,585,90,'#FFD23F',t,2,.55,'#FF8C1A')+flower(1160,600,90,'#B58CFF',t,3,.42);
  return s;
}

/* ---------- text ---------- */
function caption(txt,lt,t0){
  const u=prog(lt,t0,t0+.4);if(u<=0)return '';
  const s=lerp(.7,1,back(u)), w=txt.length*30+120;
  return `<g transform="translate(640,652) scale(${s})" opacity="${Math.min(1,u*2.5)}"><rect x="${-w/2}" y="-46" width="${w}" height="92" rx="46" fill="#fff" stroke="#FFD23F" stroke-width="6"/><text y="18" text-anchor="middle" font-size="50" fill="#2D2A6E">${txt}</text></g>`;
}
function pop(txt,x,y,size,fill,lt,t0,rot=0,stroke='#fff'){
  const u=prog(lt,t0,t0+.4);if(u<=0)return '';
  const s=back(u)*(1+.03*Math.sin((lt-t0)*5));
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><text text-anchor="middle" font-size="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${size*.17}" stroke-linejoin="round" paint-order="stroke">${txt}</text></g>`;
}


/* ---------- static text + small helpers ---------- */
const CLIP='<clipPath id="beeclip"><ellipse rx="46" ry="34"/></clipPath>';
const skyGrad=(id,a,b)=>`<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;
// label(): text with a thick outline that does not animate (use pop() for animated words)
function label(txt,x,y,size,fill,rot=0,stroke='#fff',sw=.17){
  return `<g transform="translate(${x},${y}) rotate(${rot})"><text text-anchor="middle" font-size="${size}" fill="${fill}" stroke="${stroke}" stroke-width="${size*sw}" stroke-linejoin="round" paint-order="stroke">${txt}</text></g>`;
}
const LULU='<tspan fill="#FF5D8F">L</tspan><tspan fill="#FF9F1C">u</tspan><tspan fill="#19B8A6">l</tspan><tspan fill="#7B5CFF">u</tspan>';
// sceneAt(): which scene is on screen at time t, and the time since that scene started
function sceneAt(t,SC){let i=0;while(i<SC.length-2&&t>=SC[i+1])i++;return [i,t-SC[i]];}
// fades(): cream flash between scenes, fade-in at the start, fade to night blue at the end
function fades(t,SC,DUR){
  let f=0,fc='#FFF8E7';
  for(let k=1;k<SC.length-1;k++)f=Math.max(f,1-Math.abs(t-SC[k])/.3);
  f=Math.max(f,1-t/.5);
  if(t>DUR-.8){f=(t-(DUR-.8))/.8;fc='#14153F';}
  return f>0?`<rect width="1280" height="720" fill="${fc}" opacity="${clamp(f)}"/>`:'';
}
const nightTint=n=>n>0?`<rect width="1280" height="720" fill="#14153F" opacity="${n*.28}"/>`:'';

/* ---------- snail and bush (episode 5) ---------- */
// snail({eye, look, noHead}): garden snail facing right, origin at its feet (about 170 tall with eye stalks).
// look = small wiggle of the eye stalks (-1..1); noHead = only the shell (for peeking over a bush)
const SNAIL_SPIRAL=(function(){let d='';const N=60,T=4.2*Math.PI;for(let k=0;k<=N;k++){const a=T*k/N, r=4+50*k/N;d+=(k?'L':'M')+(-15+Math.cos(-a-1.2)*r).toFixed(1)+','+(-80+Math.sin(-a-1.2)*r).toFixed(1)+' ';}return d;})();
function snail(o={}){
  const e=o.eye==null?1:o.eye, lk=o.look||0;
  const shell=`<circle cx="-15" cy="-80" r="72" fill="#F4A261"/><circle cx="-26" cy="-92" r="52" fill="#F7B983" opacity=".55"/>
  <path d="${SNAIL_SPIRAL}" stroke="#C8693A" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`;
  if(o.noHead)return shell;
  const stalk=(bx,tx,ty)=>`<path d="M${bx},-92 Q${(bx+tx)/2},-120 ${tx},${ty}" stroke="#EBCB9C" stroke-width="10" fill="none" stroke-linecap="round"/><circle cx="${tx}" cy="${ty}" r="11" fill="#EBCB9C"/>
  <g transform="translate(${tx+2},${ty}) scale(1,${e})"><circle r="7" fill="#2b1d12"/><circle cx="2.3" cy="-2.4" r="2.4" fill="#fff"/></g>`;
  return `
  <path d="M-120,0 Q-128,-14 -104,-20 L80,-26 L132,-22 Q150,-10 138,0 Z" fill="#D4AE7C"/>
  ${stalk(94,84+lk*6,-160)}${stalk(114,128+lk*6,-156)}
  <ellipse cx="108" cy="-62" rx="34" ry="44" fill="#EBCB9C"/>
  <path d="M124,-74 Q138,-80 146,-70" stroke="#EBCB9C" stroke-width="8" fill="none" stroke-linecap="round"/>
  <path d="M110,-52 Q121,-42 132,-54" stroke="#7A5230" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="98" cy="-50" r="7" fill="#FF9AA2" opacity=".8"/>
  ${shell}`;
}
// bush(x,y,s): round green bush standing on the ground, about 320 wide and 150 tall
function bush(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <circle cx="-110" cy="-50" r="52" fill="#3E9E3E"/><circle cx="110" cy="-50" r="52" fill="#3E9E3E"/>
  <circle cx="-55" cy="-78" r="64" fill="#47AD47"/><circle cx="55" cy="-78" r="64" fill="#47AD47"/>
  <circle cx="0" cy="-80" r="70" fill="#52BA52"/>
  <rect x="-150" y="-50" width="300" height="50" rx="20" fill="#3E9E3E"/>
  <circle cx="-60" cy="-96" r="14" fill="#6FCF6F" opacity=".7"/><circle cx="40" cy="-118" r="12" fill="#6FCF6F" opacity=".7"/></g>`;
}
// sparkle(x,y,s,opacity): small four-point twinkle
function sparkle(x,y,s,o=1){
  return `<path transform="translate(${x},${y}) scale(${s})" d="M0,-14 Q2,-2 14,0 Q2,2 0,14 Q-2,2 -14,0 Q-2,-2 0,-14Z" fill="#FFFFFF" opacity="${o}"/>`;
}

/* ---------- kitten, ball and pond (episode 6) ---------- */
// kitten({eye, tail, asleep, tilt}): little orange kitten facing the viewer, origin at its feet (about 200 tall).
// tail = sway of the tail (-1..1), tilt = head tilt in degrees, asleep = closed eyes
function kitten(o={}){
  const e=o.eye==null?1:o.eye, tl=o.tail||0, tilt=o.tilt||0;
  const C='#FFA552', D='#E9822F', L='#FFE2C2';
  const eye=x=>o.asleep
    ?`<path d="M${x-8},-122 Q${x},-114 ${x+8},-122" stroke="#3a2a1a" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
    :`<g transform="translate(${x},-122) scale(1,${e})"><circle r="7.5" fill="#2b1d12"/><circle cx="2.4" cy="-2.6" r="2.6" fill="#fff"/></g>`;
  return `
  <g transform="rotate(${tl*14} 34 -26)"><path d="M34,-26 Q84,-34 80,-84 Q78,-112 96,-120" stroke="${C}" stroke-width="16" fill="none" stroke-linecap="round"/>
  <circle cx="96" cy="-120" r="9" fill="${D}"/></g>
  <ellipse cx="-22" cy="-6" rx="20" ry="10" fill="${C}"/><ellipse cx="22" cy="-6" rx="20" ry="10" fill="${C}"/>
  <ellipse cx="0" cy="-46" rx="46" ry="44" fill="${C}"/>
  <ellipse cx="0" cy="-36" rx="27" ry="27" fill="${L}"/>
  <g transform="rotate(${tilt} 0 -80)">
  <path d="M-46,-136 L-40,-190 L-6,-156 Z" fill="${C}"/><path d="M46,-136 L40,-190 L6,-156 Z" fill="${C}"/>
  <path d="M-38,-148 L-36,-176 L-17,-157 Z" fill="#FFB3C7"/><path d="M38,-148 L36,-176 L17,-157 Z" fill="#FFB3C7"/>
  <ellipse cx="0" cy="-116" rx="50" ry="44" fill="${C}"/>
  <path d="M-10,-158 L-7,-142 M0,-160 L0,-143 M10,-158 L7,-142" stroke="${D}" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="0" cy="-100" rx="24" ry="16" fill="${L}"/>
  ${eye(-19)}${eye(19)}
  <path d="M-6,-108 L6,-108 L0,-101 Z" fill="#FF7FA5"/>
  <path d="M0,-101 Q-5,-94 -10,-97 M0,-101 Q5,-94 10,-97" stroke="#8a5a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
  <path d="M-28,-104 L-52,-108 M-28,-98 L-52,-94 M28,-104 L52,-108 M28,-98 L52,-94" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".9"/>
  <circle cx="-31" cy="-106" r="8" fill="#FF9AA2" opacity=".75"/><circle cx="31" cy="-106" r="8" fill="#FF9AA2" opacity=".75"/>
  </g>`;
}
// ball(x,y,r,rot): red ball with a yellow stripe resting on the ground at (x,y); rot = rolling angle in degrees
function ball(x,y,r=34,rot=0){
  return `<g transform="translate(${x},${y-r}) rotate(${rot})">
  <circle r="${r}" fill="#E63946"/>
  <path d="M${-r*.97},${-r*.22} Q0,${r*.32} ${r*.97},${-r*.22}" stroke="#FFD23F" stroke-width="${r*.3}" fill="none"/>
  <circle cx="${-r*.36}" cy="${-r*.42}" r="${r*.2}" fill="#fff" opacity=".55"/></g>`;
}
// pond(x,y,w): flat blue pond centred at (x,y), w = half width
function pond(x,y,w=230){
  return `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${w*.165}" fill="#4DB8F0"/><ellipse cx="${x}" cy="${y-3}" rx="${w*.89}" ry="${w*.126}" fill="#7DD3FA"/>`;
}
// lilyPad(x,y): green lily pad lying on the water
function lilyPad(x,y){
  return `<ellipse cx="${x}" cy="${y+3}" rx="90" ry="17" fill="#3FA34D"/><ellipse cx="${x}" cy="${y}" rx="90" ry="15" fill="#58C063"/>
  <path d="M${x},${y} L${x+70},${y-6} L${x+80},${y+6} Z" fill="#7DD3FA"/>`;
}

/* ---------- sing-along (nursery rhymes, see toolkit/rhymes.js) ---------- */
// rhymeTimes(RHYMES.twinkle, start, repeat, gapBeats, bpm) -> lines [{t0,t1,verse,index,words:[{txt,t0,t1}]}]
// Uses exactly the same timing as audio.py, so the lit-up words follow the music.
function rhymeTimes(r,start,repeat=1,gap=4,bpm){
  const spb=60/(bpm||r.bpm);let t=start;const out=[];
  for(let k=0;k<repeat;k++){
    r.lines.forEach((line,li)=>{const L={t0:t,words:[],verse:k,index:li};
      line.forEach(([txt,note,b])=>{L.words.push({txt,t0:t,t1:t+b*spb});t+=b*spb;});
      L.t1=t;out.push(L);});
    if(k<repeat-1)t+=gap*spb;
  }
  return out;
}
const rhymeEnd=lines=>lines[lines.length-1].t1;
// index of the line being sung at time t (-1 before the first one)
function currentLine(lines,t){let i=-1;lines.forEach((L,k)=>{if(t>=L.t0-.15)i=k;});return i;}
// 1 right when a syllable starts, fading to 0: use it to make things bounce with the music
function beatPulse(lines,t){let last=-1e9;for(const L of lines)for(const w of L.words)if(w.t0<=t)last=w.t0;return Math.exp(-(t-last)*6);}
// karaoke(lines,t): the current line in the caption bar, sung syllables turn colour
function karaoke(lines,t,col='#FF5D8F'){
  let L=null;for(const l of lines)if(t>=l.t0-.6)L=l;
  if(!L||t>L.t1+1.2)return '';
  let spans='',plain='';
  L.words.forEach((w,k)=>{const join=w.txt.endsWith('-'), txt=join?w.txt.slice(0,-1):w.txt, sp=(join||k===L.words.length-1)?'':' ';
    spans+=`<tspan fill="${t>=w.t0?col:'#2D2A6E'}">${txt}${sp}</tspan>`;plain+=txt+sp;});
  const u=prog(t,L.t0-.6,L.t0-.3), s=lerp(.85,1,back(u)), w=plain.length*30+120;
  return `<g transform="translate(640,652) scale(${s})" opacity="${u}"><rect x="${-w/2}" y="-46" width="${w}" height="92" rx="46" fill="#fff" stroke="#FFD23F" stroke-width="6"/><text y="18" text-anchor="middle" font-size="50" xml:space="preserve">${spans}</text></g>`;
}
// bigStar(x,y,r,colour,rot,face,eye): rounded five-point star, optionally with a sleepy smile
function bigStar(x,y,r,col='#FFD93B',rot=0,face=false,e=1){
  let d='';for(let k=0;k<10;k++){const a=-Math.PI/2+k*Math.PI/5,rr=k%2?r*.5:r;d+=(k?'L':'M')+(Math.cos(a)*rr).toFixed(1)+','+(Math.sin(a)*rr).toFixed(1);}
  const f=face?`<g transform="translate(${-r*.19},${r*.04}) scale(1,${e})"><circle r="${r*.075}" fill="#7a4b00"/></g><g transform="translate(${r*.19},${r*.04}) scale(1,${e})"><circle r="${r*.075}" fill="#7a4b00"/></g>
    <path d="M${-r*.15},${r*.2} Q0,${r*.34} ${r*.15},${r*.2}" stroke="#7a4b00" stroke-width="${r*.055}" fill="none" stroke-linecap="round"/>
    <circle cx="${-r*.34}" cy="${r*.2}" r="${r*.085}" fill="#FF9A6B" opacity=".6"/><circle cx="${r*.34}" cy="${r*.2}" r="${r*.085}" fill="#FF9A6B" opacity=".6"/>`:'';
  return `<g transform="translate(${x},${y}) rotate(${rot})"><path d="${d}Z" fill="${col}" stroke="${col}" stroke-width="${r*.16}" stroke-linejoin="round"/>${f}</g>`;
}

/* ---------- ladybird (episode 8) ---------- */
// ladybird({eye, wiggle}): small red ladybird seen from the side, facing right, origin at its feet
// (about 130 wide and 90 tall, 110 with antennae). wiggle = antenna sway (-1..1)
function ladybird(o={}){
  const e=o.eye==null?1:o.eye, w=o.wiggle||0, D='#2b2b3a';
  const leg=x=>`<path d="M${x},-16 L${x+6},-1" stroke="${D}" stroke-width="6" stroke-linecap="round"/>`;
  return `
  ${leg(-34)}${leg(-6)}${leg(22)}
  <path d="M58,-56 Q${64+w*4},-82 ${78+w*6},-88" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="${78+w*6}" cy="${-88}" r="5" fill="${D}"/>
  <path d="M66,-52 Q${78+w*4},-72 ${92+w*6},-74" stroke="${D}" stroke-width="4" fill="none" stroke-linecap="round"/><circle cx="${92+w*6}" cy="-74" r="5" fill="${D}"/>
  <circle cx="58" cy="-34" r="27" fill="${D}"/>
  <ellipse cx="0" cy="-44" rx="64" ry="46" fill="#E63946"/>
  <circle cx="-34" cy="-56" r="10" fill="${D}"/><circle cx="-4" cy="-72" r="9" fill="${D}"/><circle cx="24" cy="-50" r="10" fill="${D}"/>
  <circle cx="-30" cy="-26" r="8" fill="${D}"/><circle cx="2" cy="-30" r="8" fill="${D}"/>
  <ellipse cx="-24" cy="-74" rx="16" ry="7" fill="#fff" opacity=".35" transform="rotate(-20 -24 -74)"/>
  <circle cx="69" cy="-40" r="9" fill="#fff"/>
  <g transform="translate(71,-40) scale(1,${e})"><circle r="5" fill="#14141f"/><circle cx="1.8" cy="-1.8" r="1.8" fill="#fff"/></g>
  <circle cx="76" cy="-24" r="5.5" fill="#FF9AA2" opacity=".9"/>
  <path d="M64,-22 Q72,-15 80,-21" stroke="#fff" stroke-width="2.8" fill="none" stroke-linecap="round"/>`;
}

/* ---------- tadpole and bubbles (episode 9) ---------- */
// tadpole({eye, wig, legs, tail}): little tadpole facing right, origin at the centre of its body
// (about 150 wide, 70 tall). wig = tail wiggle (-1..1), legs = 0..1 shows two back legs, tail = 0..1 tail length
function tadpole(o={}){
  const e=o.eye==null?1:o.eye, w=o.wig||0, lg=o.legs||0, tl=o.tail==null?1:o.tail;
  const C='#5E8C3A', L='#A9CF7A';
  const tail=tl>0?`<g transform="translate(-26,0) scale(${tl},1)"><path d="M4,-16 Q-40,${-14+w*16} -84,${w*24} Q-40,${14+w*16} 4,16 Z" fill="${C}"/><path d="M0,-6 Q-36,${-4+w*12} -70,${w*20}" stroke="${L}" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/></g>`:'';
  const legs=lg>0?`<g opacity="${lg}"><path d="M-16,20 Q-26,40 -6,46" stroke="${C}" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M10,22 Q4,42 22,46" stroke="${C}" stroke-width="10" fill="none" stroke-linecap="round"/></g>`:'';
  return `${tail}${legs}
  <ellipse cx="0" cy="0" rx="40" ry="32" fill="${C}"/>
  <ellipse cx="6" cy="10" rx="24" ry="14" fill="${L}"/>
  <circle cx="20" cy="-12" r="11" fill="#fff"/>
  <g transform="translate(22,-12) scale(1,${e})"><circle r="6.5" fill="#1f2d1f"/><circle cx="2" cy="-2.3" r="2.3" fill="#fff"/></g>
  <circle cx="26" cy="8" r="6.5" fill="#FF9AA2" opacity=".8"/>
  <path d="M30,0 Q35,5 39,0" stroke="#2c4a1c" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}
// bubble(x,y,r,opacity): round water bubble with a small highlight
function bubble(x,y,r,o=1){
  return `<g opacity="${o}"><circle cx="${x}" cy="${y}" r="${r}" fill="#fff" opacity=".35" stroke="#fff" stroke-width="2.5"/><circle cx="${x-r*.35}" cy="${y-r*.35}" r="${r*.25}" fill="#fff"/></g>`;
}

/* ---------- tree (episode 10) ---------- */
// tree(x,y,s,face): round leafy tree standing on the ground, origin at the foot of the trunk
// (about 300 wide and 410 tall at s=1). Draw small apples on it with apple(x,y,.3): the canopy
// covers roughly x-150..x+150, y-410..y-190. face = true adds a sleepy smiling face to the trunk.
function tree(x,y,s=1,face=false){
  const f=face?`<path d="M-16,-120 Q-10,-114 -4,-120 M4,-120 Q10,-114 16,-120" stroke="#5a3418" stroke-width="4" fill="none" stroke-linecap="round"/>
  <path d="M-8,-104 Q0,-97 8,-104" stroke="#5a3418" stroke-width="4" fill="none" stroke-linecap="round"/>`:'';
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-30,0 Q-22,-110 -24,-230 L24,-230 Q22,-110 30,0 Z" fill="#9C6B3F"/>
  <path d="M-30,0 Q-40,-6 -48,0 M30,0 Q40,-6 48,0" stroke="#9C6B3F" stroke-width="12" stroke-linecap="round"/>
  <ellipse cx="-8" cy="-150" rx="7" ry="12" fill="#7E5230"/>${f}
  <circle cx="-95" cy="-260" r="72" fill="#3E9E3E"/><circle cx="95" cy="-260" r="72" fill="#3E9E3E"/>
  <circle cx="-60" cy="-330" r="80" fill="#47AD47"/><circle cx="60" cy="-330" r="80" fill="#47AD47"/>
  <circle cx="0" cy="-300" r="92" fill="#52BA52"/>
  <circle cx="-70" cy="-352" r="16" fill="#6FCF6F" opacity=".7"/><circle cx="40" cy="-380" r="13" fill="#6FCF6F" opacity=".7"/></g>`;
}

/* ---------- boat, fish, reeds and water (episode 12) ---------- */
// boatBack(x,y) and boatFront(x,y): little rowing boat seen from the side, origin at the waterline
// centre (about 420 wide, 70 tall above the water). Draw boatBack, then the passengers (their feet
// at y-28, they are hidden below the rim), then boatFront.
function boatBack(x,y){
  return `<path d="M${x-196},${y-66} Q${x},${y-80} ${x+196},${y-66} L${x+180},${y-56} L${x-180},${y-56} Z" fill="#B5723C"/>`;
}
function boatFront(x,y){
  return `<g transform="translate(${x},${y})">
  <path d="M-212,-70 L212,-70 Q190,6 120,12 L-120,12 Q-190,6 -212,-70 Z" fill="#E76F51"/>
  <rect x="-214" y="-76" width="428" height="16" rx="8" fill="#F4A261"/>
  <path d="M-192,-34 L192,-34" stroke="#F7C59F" stroke-width="8" stroke-linecap="round" opacity=".8"/>
  <circle cx="-150" cy="-12" r="9" fill="#FFF3D6" opacity=".9"/><circle cx="150" cy="-12" r="9" fill="#FFF3D6" opacity=".9"/></g>`;
}
// oar(px,py,angle): wooden oar turning about the pivot (px,py) on the rim; angle in degrees from
// straight down (positive = blade forward to the right). About 190 long; blade centre 100 from the pivot.
function oar(px,py,a){
  return `<g transform="translate(${px},${py}) rotate(${-a})">
  <rect x="-5" y="-62" width="10" height="170" rx="5" fill="#8A5A2B"/>
  <ellipse cx="0" cy="100" rx="14" ry="28" fill="#A8743F"/><circle cx="0" cy="-62" r="9" fill="#6E4520"/></g>`;
}
// fish({eye, col, tail}): round little fish facing right, origin at its centre (about 130 wide, 80 tall)
function fish(o={}){
  const e=o.eye==null?1:o.eye, c=o.col||'#FF9F1C', w=o.tail||0;
  return `
  <path d="M-40,0 L${-78},${-30+w*8} Q-70,0 ${-78},${30+w*8} Z" fill="${c}"/>
  <path d="M-12,-34 Q6,-56 26,-34 Z" fill="${c}"/>
  <ellipse cx="0" cy="0" rx="50" ry="38" fill="${c}"/>
  <ellipse cx="6" cy="14" rx="30" ry="16" fill="#FFE2B0" opacity=".8"/>
  <path d="M-6,4 Q-18,18 -4,22" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
  <g transform="translate(24,-8) scale(1,${e})"><circle r="7" fill="#1d2433"/><circle cx="2.3" cy="-2.4" r="2.4" fill="#fff"/></g>
  <circle cx="22" cy="12" r="6" fill="#FF9AA2" opacity=".9"/>
  <path d="M38,6 Q44,11 48,5" stroke="#7a3d00" stroke-width="3" fill="none" stroke-linecap="round"/>`;
}
// reed(x,y,h,t,i): cattail reed at the water's edge, sways gently
function reed(x,y,h,t,i){
  return `<g transform="translate(${x},${y}) rotate(${Math.sin(t*1.2+i*2.1)*3})">
  <path d="M0,0 Q4,${-h/2} 0,${-h}" stroke="#4E8F3A" stroke-width="6" fill="none" stroke-linecap="round"/>
  <ellipse cx="2" cy="${-h+26}" rx="8" ry="22" fill="#8A5A2B"/>
  <path d="M-4,0 Q-26,${-h*.4} -30,${-h*.62}" stroke="#5DA544" stroke-width="7" fill="none" stroke-linecap="round"/></g>`;
}
// stream(t,y,n,speed): river from y to the bottom of the stage with ripples drifting left
function stream(t,y,n=0,speed=40){
  let s=`<path d="M0,${y} Q320,${y-8} 640,${y} T1280,${y} L1280,720 L0,720Z" fill="${mix('#4DB8F0','#2B4C8C',n)}"/>`;
  s+=`<rect x="0" y="${y+60}" width="1280" height="${720-y-60}" fill="${mix('#3AA6E3','#24407A',n)}" opacity=".6"/>`;
  for(let k=0;k<14;k++){const x=((k*197+40-t*speed*(1+(k%3)*.25))%1400+1400)%1400-60, yy=y+18+(k*37)%170;
    s+=`<path d="M${x.toFixed(1)},${yy} q18,-8 36,0 q18,8 36,0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity="${(.45-.25*n).toFixed(2)}"/>`;}
  return s;
}

/* ---------- seed, soil, growing flower and rain cloud (episode 13) ---------- */
// seed(x,y,s): small brown seed (about 22 wide, 30 tall) centred at (x,y)
function seed(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse rx="11" ry="15" fill="#8A5A2B"/><ellipse cx="-3" cy="-5" rx="3" ry="5" fill="#B98A5A"/></g>`;
}
// hole(x,y): small dark planting hole in the ground; soil(x,y,u): little brown mound, u = 0..1 how heaped
function hole(x,y){return `<ellipse cx="${x}" cy="${y}" rx="36" ry="9" fill="#5a3418"/>`;}
function soil(x,y,u=1){
  return `<path d="M${x-48},${y+4} Q${x},${y-4-22*u} ${x+48},${y+4} Z" fill="#8A5A2B"/><ellipse cx="${x-10}" cy="${y-6*u}" rx="12" ry="${1.5+2.5*u}" fill="#A8743F" opacity=".8"/>`;
}
// growFlower(x,y,h,open,col,t,o): flower growing from the ground at (x,y). h = stem height (0 = nothing,
// small h = sprout with two leaves), open = 0..1 petals opening (0 shows a green bud once h > 60).
// o = {s, face, asleep}: face adds a smile to the centre, asleep closes its eyes. Head centre at y-h*s.
function growFlower(x,y,h,open,col,t,o={}){
  if(h<=0)return '';
  const s=o.s||1, sw=Math.sin(t*1.3)*2.5, lf=clamp(h/40);
  let head='';
  if(open>0){
    for(let k=0;k<6;k++){const a=k*Math.PI/3+.26, d=12+18*open;
      head+=`<circle cx="${(Math.cos(a)*d).toFixed(1)}" cy="${(-h+Math.sin(a)*d).toFixed(1)}" r="${(8+14*open).toFixed(1)}" fill="${col}"/>`;}
    head+=`<circle cx="0" cy="${-h}" r="${10+9*open}" fill="#FFB703"/>`;
    if(o.face&&open>.5){
      const e=o.asleep?`<path d="M-9,${-h-3} Q-6,${-h} -3,${-h-3} M3,${-h-3} Q6,${-h} 9,${-h-3}" stroke="#7a4b00" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
        :`<circle cx="-6" cy="${-h-3}" r="2.8" fill="#7a4b00"/><circle cx="6" cy="${-h-3}" r="2.8" fill="#7a4b00"/>`;
      head+=e+`<path d="M-6,${-h+5} Q0,${-h+10} 6,${-h+5}" stroke="#7a4b00" stroke-width="2.5" fill="none" stroke-linecap="round"/>`;
    }
  }else if(h>60){
    const b=clamp((h-60)/40);
    head=`<g transform="translate(0,${-h}) scale(${b})"><ellipse cx="0" cy="-4" rx="13" ry="20" fill="${col}"/><path d="M-15,0 Q-14,18 0,20 Q14,18 15,0 Q8,-8 0,4 Q-8,-8 -15,0Z" fill="#3FA34D"/></g>`;
  }
  return `<g transform="translate(${x},${y}) scale(${s}) rotate(${sw})">
  <path d="M0,0 Q8,${-h/2} 0,${-h}" stroke="#2F9E44" stroke-width="8" fill="none" stroke-linecap="round"/>
  <g transform="translate(0,${-Math.min(h*.45,60)}) scale(${lf})"><ellipse cx="17" cy="-6" rx="18" ry="8" fill="#3FA34D" transform="rotate(-28 17 -6)"/><ellipse cx="-17" cy="-6" rx="18" ry="8" fill="#47AD47" transform="rotate(28 -17 -6)"/></g>
  ${head}</g>`;
}
// rainCloud(x,y,s,eye): soft blue-grey cloud with a kind face (about 200 wide, 110 tall at s=1), centred at (x,y)
function rainCloud(x,y,s=1,e=1){
  return `<g transform="translate(${x},${y}) scale(${s})"><g fill="#C9D6E8"><ellipse cx="0" cy="18" rx="96" ry="32"/><circle cx="-44" cy="0" r="38"/><circle cx="8" cy="-22" r="48"/><circle cx="54" cy="2" r="34"/></g>
  <g transform="translate(-18,4) scale(1,${e})"><circle r="6" fill="#3a4a6a"/><circle cx="2" cy="-2" r="2" fill="#fff"/></g><g transform="translate(18,4) scale(1,${e})"><circle r="6" fill="#3a4a6a"/><circle cx="2" cy="-2" r="2" fill="#fff"/></g>
  <path d="M-9,20 Q0,28 9,20" stroke="#3a4a6a" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="-34" cy="18" r="7" fill="#FF9AA2" opacity=".7"/><circle cx="34" cy="18" r="7" fill="#FF9AA2" opacity=".7"/></g>`;
}
// raindrop(x,y,s,opacity): little blue drop, point up, centred near (x,y)
function raindrop(x,y,s=1,o=1){
  return `<path transform="translate(${x},${y}) scale(${s})" d="M0,-14 Q9,0 7,6 Q4,12 0,12 Q-4,12 -7,6 Q-9,0 0,-14Z" fill="#5BB8F5" opacity="${o}"/>`;
}
