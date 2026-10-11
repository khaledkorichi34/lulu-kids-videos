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
