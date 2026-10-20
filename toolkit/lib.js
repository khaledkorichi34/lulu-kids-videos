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
  <circle cx="-13" cy="8" r="7" fill="#FF9AA2" opacity=".8"/>${o.pollen?`<circle cx="-6" cy="36" r="${10*o.pollen}" fill="#FF8F00"/><circle cx="20" cy="34" r="${10*o.pollen}" fill="#FF8F00"/>`:''}`;
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
// bg(t, night 0..1, extra drawn behind the hills, {noSun, noFlowers, noClouds, noMoon})
function bg(t,n,behind='',o={}){
  let s=`<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${mix('#5EC2FF','#14153F',n)}"/><stop offset="1" stop-color="${mix('#DDF5FF','#4A4FA3',n)}"/></linearGradient><clipPath id="beeclip"><ellipse rx="46" ry="34"/></clipPath></defs>`;
  s+=`<rect width="1280" height="720" fill="url(#sky)"/>`;
  if(n>0) STARS.forEach((p,i)=>{s+=`<circle cx="${p[0]}" cy="${p[1]}" r="${p[2]}" fill="#FFF8D6" opacity="${n*(.55+.45*Math.sin(t*3+p[3]))}"/>`;});
  if(!o.noSun)s+=sun(t,1150,100+n*560);
  if(n>0&&!o.noMoon) s+=moon(1150,660-n*560);
  const co=1-n*.75;
  if(!o.noClouds)s+=cloud(((200+t*14)%1500)-110,120,1.1,co)+cloud(((760+t*9)%1500)-110,74,.8,co)+cloud(((1180+t*11)%1500)-110,200,.9,co);
  s+=behind;
  s+=`<path d="M0,440 Q300,330 640,410 T1280,400 L1280,720 L0,720Z" fill="${mix('#9ADB6F','#3E6B5A',n)}"/>`;
  s+=`<path d="M0,500 Q380,440 760,490 T1280,470 L1280,720 L0,720Z" fill="${mix('#6CC24A','#2F5A4C',n)}"/>`;
  if(!o.noFlowers)s+=flower(70,590,90,'#FF7FB0',t,0,.55)+flower(150,570,90,'#FFFFFF',t,1,.45)+flower(1215,585,90,'#FFD23F',t,2,.55,'#FF8C1A')+flower(1160,600,90,'#B58CFF',t,3,.42);
  return s;
}

/* ---------- text ---------- */
// caption(txt,lt,t0,plain): plain = the text without markup (pass it when txt contains <tspan> colours, so the bar fits)
function caption(txt,lt,t0,plain){
  const u=prog(lt,t0,t0+.4);if(u<=0)return '';
  const s=lerp(.7,1,back(u)), w=(plain||txt).length*30+120;
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

/* ---------- egg and nest (episode 14) ---------- */
// egg(x,y,s,wobble): cream egg with soft speckles sitting in a little straw nest, origin at the bottom of the nest
// (about 150 tall, 210 wide at s=1); wobble = tilt of the egg in degrees
function egg(x,y,s=1,wob=0){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <ellipse cx="0" cy="-34" rx="104" ry="34" fill="#A8743F"/>
  <g transform="rotate(${wob} 0 -40)">
  <path d="M0,-150 C46,-150 66,-92 62,-62 C58,-30 32,-18 0,-18 C-32,-18 -58,-30 -62,-62 C-66,-92 -46,-150 0,-150Z" fill="#FFF4DC"/>
  <ellipse cx="-24" cy="-106" rx="11" ry="20" fill="#fff" opacity=".7" transform="rotate(20 -24 -106)"/>
  <circle cx="22" cy="-112" r="5" fill="#E8D3A8"/><circle cx="34" cy="-80" r="4" fill="#E8D3A8"/><circle cx="-10" cy="-70" r="4.5" fill="#E8D3A8"/><circle cx="8" cy="-132" r="3.5" fill="#E8D3A8"/></g>
  <path d="M-104,-36 Q-100,0 0,0 Q100,0 104,-36 Q60,-20 0,-22 Q-60,-20 -104,-36Z" fill="#C68B4E"/>
  <path d="M-86,-24 Q-40,-8 -6,-16 M-30,-6 Q20,-2 70,-18 M-70,-12 Q-20,4 40,-6" stroke="#8C5A2B" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
}

/* ---------- butterfly life cycle (episode 15) ---------- */
// leaf(x,y,s,rot,col): big flat leaf lying sideways, centred at (x,y), about 420 wide and 170 tall at s=1, with a stalk on the left
function leaf(x,y,s=1,rot=0,col='#4CB85A'){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
  <path d="M-250,8 Q-232,4 -206,0" stroke="#3B8E3F" stroke-width="10" fill="none" stroke-linecap="round"/>
  <path d="M-210,0 C-140,-96 120,-100 210,0 C120,100 -140,96 -210,0Z" fill="${col}"/>
  <path d="M-205,0 Q0,-8 200,0" stroke="#8FD86E" stroke-width="6" fill="none" stroke-linecap="round"/>
  <path d="M-110,-3 Q-80,-40 -50,-58 M-20,-5 Q10,-44 40,-62 M70,-5 Q100,-36 125,-48 M-110,3 Q-80,40 -50,58 M-20,5 Q10,44 40,62 M70,5 Q100,36 125,48" stroke="#8FD86E" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/></g>`;
}
// tinyEgg(x,y,s,wob): very small pale butterfly egg standing on a leaf, origin at its bottom (about 26 wide, 36 tall at s=1)
function tinyEgg(x,y,s=1,wob=0){
  return `<g transform="translate(${x},${y}) rotate(${wob}) scale(${s})"><ellipse cx="0" cy="-18" rx="13" ry="18" fill="#FFF3B0"/>
  <path d="M-6,-32 Q-8,-18 -6,-4 M0,-35 V-2 M6,-32 Q8,-18 6,-4" stroke="#E9D57A" stroke-width="1.6" fill="none"/>
  <ellipse cx="-4" cy="-25" rx="3" ry="5" fill="#fff" opacity=".8"/></g>`;
}
// caterpillar({eye, wig, munch}): green caterpillar facing right, origin at its feet (about 230 wide, 120 tall
// with antennae). wig = body wave (-1..1, use Math.sin(t*k)), munch = 0..1 mouth open
function caterpillar(o={}){
  const e=o.eye==null?1:o.eye, w=o.wig||0, m=o.munch||0;
  let segs='';
  for(let k=0;k<5;k++){
    const x=-96+k*36, y=-26-Math.max(0,Math.sin(k*1.1+w*2.2))*8;
    segs+=`<ellipse cx="${x}" cy="-3" rx="7" ry="4.5" fill="#2E7D32"/><circle cx="${x}" cy="${y}" r="26" fill="${k%2?'#7ED957':'#66C94A'}"/><circle cx="${x-6}" cy="${y-10}" r="7" fill="#C6F3A6" opacity=".6"/>`;
  }
  const mouth=m>0?`<ellipse cx="96" cy="-34" rx="7" ry="${2+m*6}" fill="#2a3a1a"/>`:`<path d="M88,-36 Q95,-29 102,-36" stroke="#2a3a1a" stroke-width="3.5" fill="none" stroke-linecap="round"/>`;
  return `${segs}
  <path d="M60,-82 Q56,-104 46,-112 M78,-84 Q84,-106 96,-112" stroke="#2a3a1a" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="46" cy="-112" r="5.5" fill="#FF8C1A"/><circle cx="96" cy="-112" r="5.5" fill="#FF8C1A"/>
  <ellipse cx="72" cy="-4" rx="8" ry="4.5" fill="#2E7D32"/>
  <circle cx="74" cy="-50" r="36" fill="#8BE063"/>
  <g transform="translate(84,-58) scale(1,${e})"><circle r="7.5" fill="#1f2d1f"/><circle cx="2.4" cy="-2.6" r="2.6" fill="#fff"/></g>
  <circle cx="64" cy="-40" r="8" fill="#FF9AA2" opacity=".8"/>
  ${mouth}`;
}
// chrysalis(x,y,s,wob,sleepy): green chrysalis hanging from a twig; (x,y) is the point where it hangs.
// About 70 wide and 150 long at s=1. wob = swing in degrees; sleepy = small closed eyes and smile
function chrysalis(x,y,s=1,wob=0,sleepy=true){
  const face=sleepy?`<path d="M-15,62 Q-10,67 -5,62 M5,62 Q10,67 15,62" stroke="#2E6B2E" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M-5,76 Q0,80 5,76" stroke="#2E6B2E" stroke-width="2.6" fill="none" stroke-linecap="round"/><circle cx="-20" cy="72" r="5" fill="#FF9AA2" opacity=".7"/><circle cx="20" cy="72" r="5" fill="#FF9AA2" opacity=".7"/>`:'';
  return `<g transform="translate(${x},${y}) rotate(${wob}) scale(${s})">
  <rect x="-5" y="-2" width="10" height="16" rx="4" fill="#3B5E2B"/>
  <path d="M0,10 C30,14 40,52 36,84 C32,120 14,146 0,152 C-14,146 -32,120 -36,84 C-40,52 -30,14 0,10Z" fill="#7FCF6A"/>
  <path d="M-22,40 Q0,30 22,40" stroke="#E7B93A" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="-14" cy="104" r="3.5" fill="#E7B93A"/><circle cx="0" cy="110" r="3.5" fill="#E7B93A"/><circle cx="14" cy="104" r="3.5" fill="#E7B93A"/>
  <ellipse cx="-16" cy="80" rx="6" ry="22" fill="#B9EBA6" opacity=".6"/>
  ${face}</g>`;
}
// twig(x0,x1,y): thin brown branch from x0 to x1 at height y, with two small leaves
function twig(x0,x1,y){
  return `<path d="M${x0},${y} Q${(x0+x1)/2},${y-10} ${x1},${y+4}" stroke="#8B5A2B" stroke-width="14" fill="none" stroke-linecap="round"/>
  <ellipse cx="${x0+40}" cy="${y-18}" rx="26" ry="11" fill="#4CB85A" transform="rotate(-30 ${x0+40} ${y-18})"/>
  <ellipse cx="${x1-50}" cy="${y-16}" rx="26" ry="11" fill="#4CB85A" transform="rotate(25 ${x1-50} ${y-16})"/>`;
}
// bigButterfly({flap, eye, col, col2}): friendly butterfly seen from the front, origin at the centre of its body
// (about 230 wide and 200 tall with antennae at flap 1). flap = 0..1 how open the wings are (0 = closed, edge on).
// The mouth is at (0,-36): draw a sipping tongue from there.
function bigButterfly(o={}){
  const e=o.eye==null?1:o.eye, f=o.flap==null?1:o.flap, w=.12+.88*f, c=o.col||'#FF8C42', c2=o.col2||'#FFC94D';
  const wings=`<g transform="scale(${w},1)">
  <ellipse cx="-52" cy="-18" rx="56" ry="44" fill="${c}" transform="rotate(-18 -52 -18)"/><ellipse cx="52" cy="-18" rx="56" ry="44" fill="${c}" transform="rotate(18 52 -18)"/>
  <ellipse cx="-40" cy="36" rx="36" ry="32" fill="${c2}"/><ellipse cx="40" cy="36" rx="36" ry="32" fill="${c2}"/>
  <circle cx="-62" cy="-24" r="16" fill="#fff" opacity=".55"/><circle cx="62" cy="-24" r="16" fill="#fff" opacity=".55"/>
  <circle cx="-44" cy="40" r="10" fill="#fff" opacity=".5"/><circle cx="44" cy="40" r="10" fill="#fff" opacity=".5"/></g>`;
  return `${wings}
  <path d="M-8,-64 Q-16,-92 -30,-100 M8,-64 Q16,-92 30,-100" stroke="#4a3328" stroke-width="4" fill="none" stroke-linecap="round"/>
  <circle cx="-30" cy="-100" r="6" fill="#4a3328"/><circle cx="30" cy="-100" r="6" fill="#4a3328"/>
  <ellipse cx="0" cy="12" rx="13" ry="52" fill="#6B4A3A"/>
  <circle cx="0" cy="-48" r="24" fill="#7A5644"/>
  <g transform="translate(-9,-52) scale(1,${e})"><circle r="5.5" fill="#1a1010"/><circle cx="1.8" cy="-1.9" r="1.9" fill="#fff"/></g>
  <g transform="translate(9,-52) scale(1,${e})"><circle r="5.5" fill="#1a1010"/><circle cx="1.8" cy="-1.9" r="1.9" fill="#fff"/></g>
  <circle cx="-15" cy="-40" r="5" fill="#FF9AA2" opacity=".85"/><circle cx="15" cy="-40" r="5" fill="#FF9AA2" opacity=".85"/>
  <path d="M-6,-38 Q0,-33 6,-38" stroke="#2a1a14" stroke-width="2.6" fill="none" stroke-linecap="round"/>`;
}

/* ---------- turtle (episode 16) ---------- */
// turtle({eye, step, hide, asleep}): little green turtle facing right, origin at its feet
// (about 120 tall and 190 wide at s=1). step = walking phase in radians (legs shuffle),
// hide = 0..1 head and legs go into the shell, asleep = closed eye.
function turtle(o={}){
  const e=o.eye==null?1:o.eye, h=clamp(o.hide||0), st=o.step||0;
  const leg=(x,ph,col)=>`<ellipse cx="${x+7*Math.sin(st+ph)*(1-h)}" cy="${-9+5*h}" rx="${17*(1-h*.4)}" ry="${13*(1-h*.85)}" fill="${col}"/>`;
  const eye=o.asleep
    ?`<path d="M94,-62 Q101,-55 108,-62" stroke="#1f2d1f" stroke-width="4" fill="none" stroke-linecap="round"/>`
    :`<g transform="translate(101,-62) scale(1,${e})"><circle r="7.5" fill="#1f2d1f"/><circle cx="2.4" cy="-2.6" r="2.6" fill="#fff"/></g>`;
  return `${leg(-36,Math.PI,'#5FAE48')}${leg(40,0,'#5FAE48')}
  <path d="M-70,-22 L-92,-14 L-68,-10 Z" fill="#7CCB5E" transform="translate(${18*h},0)"/>
  <g transform="translate(${-52*h},${10*h}) scale(${1-.3*h})">
    <ellipse cx="66" cy="-40" rx="22" ry="15" fill="#7CCB5E"/>
    <circle cx="92" cy="-54" r="28" fill="#7CCB5E"/>
    ${eye}
    <circle cx="86" cy="-42" r="7" fill="#FF9AA2" opacity=".8"/>
    <path d="M102,-44 Q110,-38 117,-46" stroke="#1f2d1f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  </g>
  ${leg(-54,0,'#7CCB5E')}${leg(24,Math.PI,'#7CCB5E')}
  <ellipse cx="-4" cy="-16" rx="76" ry="13" fill="#E9C46A"/>
  <path d="M-74,-18 Q-72,-108 -4,-110 Q64,-108 68,-18 Z" fill="#2FA37A"/>
  <ellipse cx="-4" cy="-72" rx="24" ry="20" fill="#6FD3A0"/>
  <ellipse cx="-46" cy="-46" rx="15" ry="14" fill="#6FD3A0"/><ellipse cx="38" cy="-46" rx="15" ry="14" fill="#6FD3A0"/>
  <ellipse cx="-34" cy="-90" rx="16" ry="7" fill="#fff" opacity=".35" transform="rotate(-25 -34 -90)"/>`;
}

/* ---------- letters F to J (episode 17) ---------- */
// grapes(x,y,s): purple bunch of grapes resting on the ground, origin at its bottom tip
// (about 130 wide and 200 tall with stalk and leaf at s=1)
function grapes(x,y,s=1){
  const rows=[[0],[-22,22],[-44,0,44],[-60,-20,20,60]];   // bottom row first
  let g='';
  for(let k=rows.length-1;k>=0;k--)rows[k].forEach((cx,m)=>{   // top rows first, so lower grapes sit in front
    g+=`<circle cx="${cx}" cy="${-24-k*30}" r="24" fill="${(k+m)%2?'#6A4BE0':'#7B5CFF'}"/><circle cx="${cx-8}" cy="${-32-k*30}" r="6" fill="#fff" opacity=".4"/>`;});
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M4,-128 Q6,-160 20,-176" stroke="#7A4B21" stroke-width="9" fill="none" stroke-linecap="round"/>
  <ellipse cx="46" cy="-160" rx="32" ry="15" fill="#3FA34D" transform="rotate(-24 46 -160)"/>
  ${g}</g>`;
}
// hat(x,y,s): round sun hat (coral with a yellow band and a little flower), origin at the centre of the brim.
// About 150 wide and 70 tall at s=1. On Lulu (inside her place()): hat(42,-142,.72) sits on her head.
function hat(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <ellipse cx="0" cy="0" rx="76" ry="16" fill="#E8556F"/>
  <path d="M-46,-2 Q-48,-62 0,-64 Q48,-62 46,-2 Z" fill="#FF7A90"/>
  <path d="M-46,-12 Q0,-2 46,-12 L46,-24 Q0,-14 -46,-24 Z" fill="#FFD23F"/>
  <circle cx="30" cy="-20" r="9" fill="#fff"/><circle cx="30" cy="-20" r="4" fill="#FF9F1C"/>
  <ellipse cx="-22" cy="-46" rx="10" ry="5" fill="#fff" opacity=".35" transform="rotate(-30 -22 -46)"/></g>`;
}
// juice(x,y,s): glass of orange juice with a striped straw and an orange slice, standing on the ground
// (origin at the bottom of the glass, about 120 wide and 230 tall with the straw at s=1)
function juice(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M10,-120 L34,-224 L46,-222 L22,-118 Z" fill="#fff"/>
  <path d="M15,-140 L19,-158 L31,-156 L27,-138 Z M24,-180 L28,-198 L40,-196 L36,-178 Z" fill="#FF5D8F"/>
  <path d="M-52,-170 L52,-170 L42,-4 Q41,0 36,0 L-36,0 Q-41,0 -42,-4 Z" fill="#DFF4FF" opacity=".75"/>
  <path d="M-49,-130 L49,-130 L42,-6 Q41,-2 36,-2 L-36,-2 Q-41,-2 -42,-6 Z" fill="#FFA62B"/>
  <path d="M-49,-130 L49,-130 L48,-118 L-48,-118 Z" fill="#FFC15E"/>
  <path d="M-34,-110 L-28,-20" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".45"/>
  <path d="M-62,-170 A30,30 0 0 1 -2,-170 Z" fill="#FF9F1C"/><path d="M-56,-170 A24,24 0 0 1 -8,-170 Z" fill="#FFD27A"/>
  <path d="M-32,-170 L-32,-190 M-32,-170 L-47,-182 M-32,-170 L-17,-182" stroke="#FF9F1C" stroke-width="2.5"/></g>`;
}

/* ---------- bell (episode 18) ---------- */
// bell(x,y,s,rot,col): little golden bell hanging from a short cord, origin at the top of the cord
// (about 80 wide and 115 long at s=1). rot = swing in degrees about the hanging point.
function bell(x,y,s=1,rot=0,col='#FFC928'){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
  <path d="M0,0 L0,24" stroke="#8B5A2B" stroke-width="5" stroke-linecap="round"/>
  <circle cx="0" cy="104" r="11" fill="#E39B1A"/>
  <path d="M-12,32 Q-14,24 0,22 Q14,24 12,32 Q36,40 34,74 Q34,90 44,98 L-44,98 Q-34,90 -34,74 Q-36,40 -12,32 Z" fill="${col}"/>
  <path d="M-44,98 L44,98 Q46,106 38,106 L-38,106 Q-46,106 -44,98 Z" fill="#F0A81E"/>
  <path d="M-18,46 Q-24,64 -22,84" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".5"/></g>`;
}

/* ---------- autumn leaves (episode 19) ---------- */
// autumnLeaf(x,y,s,rot,col): small falling leaf centred at (x,y), about 46 wide and 30 tall at s=1,
// with a short stem on the left. Colours used: '#E63946' red, '#F28C28' orange, '#F6C026' yellow.
function autumnLeaf(x,y,s=1,rot=0,col='#F28C28'){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
  <path d="M-26,2 L-18,0" stroke="#8B5A2B" stroke-width="3.5" stroke-linecap="round"/>
  <path d="M-19,0 C-10,-17 12,-18 23,0 C12,18 -10,17 -19,0Z" fill="${col}"/>
  <path d="M-17,0 Q2,-1 20,0" stroke="#fff" stroke-width="2.4" fill="none" stroke-linecap="round" opacity=".45"/></g>`;
}
const AUTUMN=['#E63946','#F28C28','#F6C026'];
// autumnTree(x,y,s): the round tree of episode 10 with orange, red and yellow autumn leaves,
// origin at the foot of the trunk (canopy covers about x-150..x+150, y-410..y-190 at s=1).
function autumnTree(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-30,0 Q-22,-110 -24,-230 L24,-230 Q22,-110 30,0 Z" fill="#9C6B3F"/>
  <path d="M-30,0 Q-40,-6 -48,0 M30,0 Q40,-6 48,0" stroke="#9C6B3F" stroke-width="12" stroke-linecap="round"/>
  <ellipse cx="-8" cy="-150" rx="7" ry="12" fill="#7E5230"/>
  <circle cx="-95" cy="-260" r="72" fill="#E8742A"/><circle cx="95" cy="-260" r="72" fill="#D9482E"/>
  <circle cx="-60" cy="-330" r="80" fill="#F5A623"/><circle cx="60" cy="-330" r="80" fill="#EE8A2A"/>
  <circle cx="0" cy="-300" r="92" fill="#F6B830"/>
  <circle cx="-70" cy="-352" r="16" fill="#FFD66B" opacity=".8"/><circle cx="40" cy="-380" r="13" fill="#FFD66B" opacity=".8"/>
  <circle cx="-110" cy="-250" r="12" fill="#FFC14D" opacity=".7"/><circle cx="100" cy="-230" r="11" fill="#F27E4E" opacity=".8"/></g>`;
}
// leafPile(x,y,u,s): heap of autumn leaves on the ground, origin at the bottom centre.
// u = 0..1 how big it has grown (full size about 300 wide and 110 tall at s=1).
function leafPile(x,y,u=1,s=1){
  if(u<=0)return '';
  let p=`<path d="M-150,0 Q-120,-100 0,-104 Q120,-100 150,0 Z" fill="#E8742A"/>`;
  let k=11;const r=()=>(k=(k*16807)%2147483647)/2147483647;
  for(let i=0;i<34;i++){const a=r()*Math.PI, d=Math.sqrt(r());
    const lx=Math.cos(a)*138*d, ly=-Math.sin(a)*96*d-6;
    p+=autumnLeaf(lx,ly,1.05,r()*360,AUTUMN[i%3]);}
  return `<g transform="translate(${x},${y}) scale(${s*(.3+.7*u)},${s*u})">${p}</g>`;
}

/* ---------- letters K to O (episode 20) ---------- */
// kite(x,y,s,sway): diamond kite in four colours with a wavy tail of little bows, origin at the centre of the kite
// (about 130 wide and 170 tall at s=1, the tail hangs about 150 below). sway = -1..1 waves the tail.
// The string starts at kiteStringPoint (0,85) below the centre (scaled by s).
function kite(x,y,s=1,rot=0,sway=0){
  let tail=`M0,85`;const bows=[];
  for(let k=1;k<=4;k++){const ty=85+k*36, tx=Math.sin(k*1.3+sway*2)*14*k/2;tail+=` Q${tx-12},${ty-18} ${tx},${ty}`;bows.push([tx,ty]);}
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
  <path d="${tail}" stroke="#2D2A6E" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${bows.map(([bx,by],k)=>`<path d="M${bx},${by} L${bx-12},${by-8} L${bx-12},${by+8} Z M${bx},${by} L${bx+12},${by-8} L${bx+12},${by+8} Z" fill="${['#FF5D8F','#FFD23F','#19B8A6','#7B5CFF'][k]}"/>`).join('')}
  <path d="M0,-85 L-65,-15 L0,0 Z" fill="#FF5D8F"/><path d="M0,-85 L65,-15 L0,0 Z" fill="#FFD23F"/>
  <path d="M-65,-15 L0,85 L0,0 Z" fill="#19B8A6"/><path d="M65,-15 L0,85 L0,0 Z" fill="#7B5CFF"/>
  <path d="M0,-85 L0,85 M-65,-15 L65,-15" stroke="#fff" stroke-width="3" opacity=".6"/>
  <ellipse cx="-24" cy="-40" rx="8" ry="14" fill="#fff" opacity=".35" transform="rotate(40 -24 -40)"/></g>`;
}
// nestBack(x,y,s) / nestFront(x,y,s): a straw nest in two layers, origin at the bottom of the nest
// (about 210 wide and 40 tall at s=1). Draw nestBack, then what sits in the nest, then nestFront.
function nestBack(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})"><ellipse cx="0" cy="-34" rx="104" ry="30" fill="#8C5A2B"/><ellipse cx="0" cy="-36" rx="88" ry="20" fill="#6E4420"/></g>`;
}
function nestFront(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-106,-36 Q-100,0 0,0 Q100,0 106,-36 Q60,-20 0,-22 Q-60,-20 -106,-36Z" fill="#C68B4E"/>
  <path d="M-88,-24 Q-40,-8 -6,-16 M-30,-6 Q20,-2 70,-18 M-70,-12 Q-20,4 40,-6 M-100,-34 Q-60,-22 -20,-24 M20,-24 Q60,-22 100,-34" stroke="#8C5A2B" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
}
// orange(x,y,s): round orange fruit with a little green leaf, standing on the ground,
// origin at its bottom (about 140 wide and 165 tall with the leaf at s=1)
function orange(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <circle cx="0" cy="-70" r="70" fill="#FF9F1C"/>
  <circle cx="10" cy="-60" r="56" fill="#FFAA33" opacity=".5"/>
  <ellipse cx="-30" cy="-100" rx="13" ry="22" fill="#fff" opacity=".35" transform="rotate(35 -30 -100)"/>
  <circle cx="22" cy="-50" r="2.5" fill="#E8850F"/><circle cx="36" cy="-76" r="2.5" fill="#E8850F"/><circle cx="8" cy="-28" r="2.5" fill="#E8850F"/><circle cx="-20" cy="-40" r="2.5" fill="#E8850F"/>
  <circle cx="0" cy="-138" r="6" fill="#7A4B21"/>
  <ellipse cx="24" cy="-150" rx="24" ry="10" fill="#3FA34D" transform="rotate(-24 24 -150)"/>
  <path d="M6,-142 Q24,-152 42,-158" stroke="#2E8A3C" stroke-width="2.5" fill="none" stroke-linecap="round"/></g>`;
}

/* ---------- beehive and honeycomb (episode 21) ---------- */
// bee({pollen: 0..1}) also draws two little yellow pollen balls under the bee (episode 21).
// hive(x,y,s): round straw beehive (skep) sitting on a tree stump, origin at the foot of the stump
// (about 230 wide and 260 tall at s=1). The dark door is at (x, y-86*s): bees fly in and out there.
function hive(x,y,s=1){
  let bands='';
  const B=[[-80,108],[-118,104],[-154,94],[-188,78],[-218,56],[-240,30]];
  B.forEach(([cy,rx],k)=>{bands+=`<ellipse cx="0" cy="${cy}" rx="${rx}" ry="${26-k*1.5}" fill="${k%2?'#F2B33D':'#F7C559'}"/>`;});
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-62,0 L-56,-62 L56,-62 L62,0 Z" fill="#9C6B3F"/><ellipse cx="0" cy="-62" rx="56" ry="12" fill="#C99A63"/>
  <ellipse cx="0" cy="-62" rx="38" ry="7" fill="none" stroke="#9C6B3F" stroke-width="3"/>
  <ellipse cx="0" cy="-70" rx="112" ry="14" fill="#D9982A"/>
  ${bands}
  <ellipse cx="-50" cy="-150" rx="10" ry="34" fill="#fff" opacity=".18" transform="rotate(25 -50 -150)"/>
  <path d="M-24,-74 Q-24,-102 0,-102 Q24,-102 24,-74 Z" fill="#5a3418"/></g>`;
}
// honeycomb(x,y,s,fill,t): a little patch of seven wax cells centred at (x,y) (about 190 wide at s=1).
// fill = 0..1 how full of honey the cells are (they fill one after another).
function honeycomb(x,y,s=1,fill=1){
  const r=34, hx=(cx,cy)=>{let d='';for(let k=0;k<6;k++){const a=Math.PI/3*k;d+=(k?'L':'M')+(cx+r*Math.cos(a)).toFixed(1)+','+(cy+r*Math.sin(a)).toFixed(1);}return d+'Z';};
  const C=[[0,0],[0,-59],[51,-29.5],[51,29.5],[0,59],[-51,29.5],[-51,-29.5]];
  let g='';
  C.forEach(([cx,cy],k)=>{const u=clamp(fill*7-k);
    g+=`<path d="${hx(cx,cy)}" fill="#FFE8A3" stroke="#E0A526" stroke-width="7" stroke-linejoin="round"/>`;
    if(u>0)g+=`<g transform="translate(${cx},${cy}) scale(${.82*u})"><path d="${hx(0,0)}" fill="#F5A623"/><circle cx="-10" cy="-12" r="7" fill="#fff" opacity=".45"/></g>`;});
  return `<g transform="translate(${x},${y}) scale(${s})">${g}</g>`;
}

/* ---------- owl, branch and stump (episode 22) ---------- */
// owl({eye, wing, asleep, tilt}): little brown owl facing the viewer, origin at its feet (about 175 tall,
// 110 wide, 150 wide with the wings open). wing = 0..60 degrees each wing lifts outwards (flap with
// 30+30*Math.sin(t*k)), tilt = head tilt in degrees, asleep = closed eyes.
function owl(o={}){
  const e=o.eye==null?1:o.eye, w=o.wing||0, tilt=o.tilt||0;
  const C='#A9784F', D='#86593A', L='#F3DDB5', F='#FBEFD6';
  const eye=x=>o.asleep
    ?`<path d="M${x-9},-132 Q${x},-124 ${x+9},-132" stroke="#3a2a1a" stroke-width="4.5" fill="none" stroke-linecap="round"/>`
    :`<g transform="translate(${x},-131) scale(1,${e})"><circle r="9" fill="#2b1d12"/><circle cx="3" cy="-3.2" r="3.2" fill="#fff"/></g>`;
  return `
  <ellipse cx="-17" cy="-5" rx="14" ry="7" fill="#FF9F1C"/><ellipse cx="17" cy="-5" rx="14" ry="7" fill="#FF9F1C"/>
  <g transform="rotate(${w} -44 -98)"><ellipse cx="-50" cy="-60" rx="17" ry="40" fill="${D}"/></g>
  <g transform="rotate(${-w} 44 -98)"><ellipse cx="50" cy="-60" rx="17" ry="40" fill="${D}"/></g>
  <ellipse cx="0" cy="-58" rx="50" ry="56" fill="${C}"/>
  <ellipse cx="0" cy="-46" rx="33" ry="38" fill="${L}"/>
  <path d="M-14,-62 l7,7 l7,-7 M0,-62 l7,7 l7,-7 M-7,-44 l7,7 l7,-7 M-21,-44 l7,7 l7,-7 M7,-44 l7,7 l7,-7" stroke="#D9BC8C" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <g transform="rotate(${tilt} 0 -110)">
  <path d="M-42,-150 L-40,-186 L-14,-164 Z" fill="${C}"/><path d="M42,-150 L40,-186 L14,-164 Z" fill="${C}"/>
  <ellipse cx="0" cy="-128" rx="50" ry="44" fill="${C}"/>
  <circle cx="-20" cy="-130" r="20" fill="${F}"/><circle cx="20" cy="-130" r="20" fill="${F}"/>
  ${eye(-20)}${eye(20)}
  <path d="M-7,-118 L7,-118 L0,-104 Z" fill="#FF9F1C"/>
  <circle cx="-38" cy="-108" r="7.5" fill="#FF9AA2" opacity=".8"/><circle cx="38" cy="-108" r="7.5" fill="#FF9AA2" opacity=".8"/>
  </g>`;
}
// branch(x0,y0,x1,y1): thick brown branch from (x0,y0) (put it inside a tree canopy) to (x1,y1),
// with two small leaves near the tip. A character sitting on it stands at about (x, y-6).
function branch(x0,y0,x1,y1){
  const mx=(x0+x1)/2, my=(y0+y1)/2+8;
  return `<path d="M${x0},${y0} Q${mx},${my} ${x1},${y1}" stroke="#8A5A33" stroke-width="18" fill="none" stroke-linecap="round"/>
  <ellipse cx="${x1+14}" cy="${y1-14}" rx="20" ry="9" fill="#3E9E3E" transform="rotate(-35 ${x1+14} ${y1-14})"/>
  <ellipse cx="${x1-30}" cy="${y1+14}" rx="18" ry="8" fill="#47AD47" transform="rotate(25 ${x1-30} ${y1+14})"/>`;
}
// stump(x,y,s): short tree stump standing on the ground, origin at its foot; its flat top is at y-72*s
// (about 130 wide at s=1). A character sitting on it stands at (x, y-72*s).
function stump(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-58,0 Q-70,-4 -76,2 L76,2 Q70,-4 58,0 L52,-72 L-52,-72 Z" fill="#9C6B3F"/>
  <path d="M-30,-10 Q-26,-40 -32,-62 M20,-8 Q26,-36 22,-60" stroke="#7E5230" stroke-width="4" fill="none" stroke-linecap="round"/>
  <ellipse cx="0" cy="-72" rx="52" ry="13" fill="#D9AE78"/>
  <ellipse cx="0" cy="-72" rx="32" ry="7" fill="none" stroke="#B8875A" stroke-width="3"/></g>`;
}

/* ---------- buns and a little table (episode 24) ---------- */
// bun(x,y,s,steam): round golden bun with a white cross on top, origin at the middle of its base
// (about 84 wide and 52 tall at s=1). steam 0..1 draws soft wavy steam above it (t-free: pass a phase in o.ph).
function bun(x,y,s=1,steam=0,ph=0){
  let st='';
  if(steam>0)for(let k=0;k<2;k++){const q=((ph*.55+k*.5)%1), sx=(k?14:-14);
    st+=`<path d="M${sx},${-60-q*40} q-8,-10 0,-20 q8,-10 0,-20" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity="${(steam*Math.sin(Math.PI*q)*.8).toFixed(2)}"/>`;}
  return `<g transform="translate(${x},${y}) scale(${s})">${st}
  <path d="M-42,0 Q-46,-50 0,-52 Q46,-50 42,0 Z" fill="#D9892E"/>
  <path d="M-34,-6 Q-36,-44 0,-46 Q36,-44 34,-6 Z" fill="#E9A447"/>
  <ellipse cx="-16" cy="-36" rx="12" ry="6" fill="#fff" opacity=".35" transform="rotate(-20 -16 -36)"/>
  <path d="M-30,-30 Q0,-24 30,-30 M0,-50 Q4,-26 0,-4" stroke="#FFF6E0" stroke-width="8" fill="none" stroke-linecap="round"/></g>`;
}
// table(x,y,w): small wooden table standing on the ground at (x,y) with a pink checked cloth,
// w = half width. The top surface is at y-92 (put things on it there).
function table(x,y,w=170){
  let checks='';for(let i=0;i<Math.floor(w/20);i++)checks+=`<rect x="${-w+12+i*40}" y="-86" width="20" height="40" fill="#FF8FB1"/>`;
  return `<g transform="translate(${x},${y})">
  <rect x="${-w+22}" y="-60" width="16" height="60" rx="5" fill="#9C6B3F"/><rect x="${w-38}" y="-60" width="16" height="60" rx="5" fill="#9C6B3F"/>
  <rect x="${-w}" y="-96" width="${2*w}" height="14" rx="6" fill="#B8875A"/>
  <path d="M${-w+4},-86 L${w-4},-86 L${w-12},-46 Q0,-38 ${-w+12},-46 Z" fill="#FFD1DF"/>
  ${checks}
  <path d="M${-w+4},-46 Q0,-38 ${w-4},-46" stroke="#FFD1DF" stroke-width="6" fill="none"/></g>`;
}
// tray(x,y,w): flat round-ended baking tray lying on a surface at (x,y), w = half width
function tray(x,y,w=130){
  return `<rect x="${x-w}" y="${y-10}" width="${2*w}" height="12" rx="6" fill="#B8C4CC"/><rect x="${x-w+8}" y="${y-12}" width="${2*w-16}" height="5" rx="2.5" fill="#DCE4EA"/>`;
}

/* ---------- firefly (episode 25) ---------- */
// firefly({glow, flap, eye}): friendly little firefly flying to the right, origin at the centre of its body
// (about 90 wide and 60 tall at s=1, the glow halo reaches about 55 around the tail at (-24,8)).
// glow = 0..1 how bright the tail shines, flap = 0..1 wing beat (use .5+.5*Math.sin(t*k)).
// Draw fireflies AFTER nightTint() so their light is not dimmed (keep them away from text).
function firefly(o={}){
  const g=o.glow==null?1:o.glow, f=o.flap==null?.5:o.flap, e=o.eye==null?1:o.eye;
  return `<circle cx="-24" cy="8" r="55" fill="#FFF27A" opacity="${(.14*g).toFixed(3)}"/>
  <circle cx="-24" cy="8" r="36" fill="#FFF27A" opacity="${(.24*g).toFixed(3)}"/>
  <circle cx="-24" cy="8" r="24" fill="#FFF7A8" opacity="${(.40*g).toFixed(3)}"/>
  <path d="M8,14 l-4,12 M16,14 l2,12" stroke="#5B3A29" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="-20" cy="6" rx="22" ry="15" fill="${mix('#C9B458','#FFF27A',g)}"/>
  <ellipse cx="2" cy="0" rx="16" ry="15" fill="#6B4A3A"/>
  <g transform="rotate(${-10-35*f} 0 -10)"><ellipse cx="-14" cy="-20" rx="20" ry="10" fill="#EAF6FF" opacity=".8"/></g>
  <g transform="rotate(${5-25*f} 4 -10)"><ellipse cx="-8" cy="-18" rx="17" ry="8" fill="#FFFFFF" opacity=".75"/></g>
  <path d="M28,-12 Q36,-30 44,-32 M24,-14 Q28,-32 34,-38" stroke="#5B3A29" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="44" cy="-32" r="3" fill="#5B3A29"/><circle cx="34" cy="-38" r="3" fill="#5B3A29"/>
  <circle cx="24" cy="0" r="16" fill="#F4A259"/>
  <g transform="translate(29,-3) scale(1,${e})"><circle r="4.5" fill="#2b1d12"/><circle cx="1.5" cy="-1.6" r="1.6" fill="#fff"/></g>
  <circle cx="24" cy="7" r="4.5" fill="#FF9AA2" opacity=".8"/>
  <path d="M30,7 Q34,10 37,6" stroke="#2b1d12" stroke-width="2" fill="none" stroke-linecap="round"/>`;
}

// pear(x,y,s): green-yellow pear standing on the ground with a little stalk and leaf, origin at its bottom
// (about 140 wide and 200 tall with the leaf at s=1)
function pear(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M0,-176 C-26,-176 -34,-150 -38,-120 C-42,-92 -70,-78 -70,-44 C-70,-12 -40,0 0,0 C40,0 70,-12 70,-44 C70,-78 42,-92 38,-120 C34,-150 26,-176 0,-176 Z" fill="#B5D33D"/>
  <path d="M12,-160 C30,-150 28,-118 34,-100 C46,-80 62,-66 60,-40 C58,-18 38,-8 14,-6 C40,-20 46,-50 30,-80 C18,-104 22,-140 12,-160 Z" fill="#9BBF2A" opacity=".6"/>
  <ellipse cx="-36" cy="-56" rx="12" ry="22" fill="#fff" opacity=".35" transform="rotate(20 -36 -56)"/>
  <path d="M0,-172 Q2,-188 10,-198" stroke="#7A4B21" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="30" cy="-192" rx="22" ry="9" fill="#3FA34D" transform="rotate(-20 30 -192)"/></g>`;
}
// rainbow(x,y,r,u,o): soft rainbow arch standing on the ground at (x,y) with outer radius r (bands 18 wide),
// u = 0..1 how much of the arch is drawn (it grows from the left foot over the top), o = opacity.
// Draw it in bg()'s `behind` so its feet go behind the hills.
function rainbow(x,y,r=260,u=1,o=1){
  const C=['#FF5D5D','#FF9F1C','#FFD93B','#5CC85A','#3FA9F5','#7B5CFF'];let s='';
  C.forEach((c,k)=>{const R=r-9-k*18, L=Math.PI*R;if(R<30)return;
    s+=`<path d="M${x-R},${y} A${R},${R} 0 0 1 ${x+R},${y}" stroke="${c}" stroke-width="19" fill="none" stroke-dasharray="${L} ${L}" stroke-dashoffset="${L*(1-clamp(u))}"/>`;});
  return `<g opacity="${o}">${s}</g>`;
}
// speech(x,y,w,h,tx,ty,txt,size,col): white round speech bubble centred at (x,y), w/h = half sizes,
// with a small tail pointing to (tx,ty) and the text txt inside
function speech(x,y,w,h,tx,ty,txt,size=60,col='#2D2A6E'){
  const a=Math.atan2(ty-y,tx-x), bx=x+Math.cos(a)*w*.7, by=y+Math.sin(a)*h*.7, px=-Math.sin(a)*22, py=Math.cos(a)*22;
  return `<path d="M${bx+px},${by+py} L${tx},${ty} L${bx-px},${by-py} Z" fill="#fff"/>
  <ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="#fff"/>
  <text x="${x}" y="${y+size*.35}" text-anchor="middle" font-size="${size}" fill="${col}">${txt}</text>`;
}

/* ---------- Mary and her little lamb (episode 27) ---------- */
// mary({eye, wave, sway, asleep}): little girl in a blue dress with brown pigtails, facing the viewer,
// origin at her feet (about 210 tall, 110 wide). wave = 0..1 lifts her right arm (viewer's right) to wave,
// sway = head tilt in degrees, asleep = closed eyes.
function mary(o={}){
  const e=o.eye==null?1:o.eye, wv=clamp(o.wave||0), sw=o.sway||0;
  const SK='#FFD8B5', HR='#8B5A2B', DR='#5B8DEF', DD='#4673D6';
  const eye=x=>o.asleep
    ?`<path d="M${x-7},-152 Q${x},-145 ${x+7},-152" stroke="#3a2a1a" stroke-width="4" fill="none" stroke-linecap="round"/>`
    :`<g transform="translate(${x},-153) scale(1,${e})"><circle r="6.5" fill="#2b1d12"/><circle cx="2.2" cy="-2.3" r="2.3" fill="#fff"/></g>`;
  const armR=lerp(20,-130,wv);
  return `
  <rect x="-20" y="-44" width="11" height="40" rx="5" fill="${SK}"/><rect x="9" y="-44" width="11" height="40" rx="5" fill="${SK}"/>
  <ellipse cx="-16" cy="-5" rx="15" ry="8" fill="#C2185B"/><ellipse cx="16" cy="-5" rx="15" ry="8" fill="#C2185B"/>
  <g transform="rotate(-20 -26 -108)"><rect x="-33" y="-110" width="13" height="52" rx="6.5" fill="${SK}"/></g>
  <g transform="rotate(${armR} 26 -108)"><rect x="20" y="-110" width="13" height="52" rx="6.5" fill="${SK}"/><circle cx="26.5" cy="-58" r="8" fill="${SK}"/></g>
  <path d="M-24,-118 Q0,-126 24,-118 L50,-44 Q0,-30 -50,-44 Z" fill="${DR}"/>
  <path d="M-48,-48 Q0,-36 48,-48 L50,-44 Q0,-30 -50,-44 Z" fill="${DD}"/>
  <circle cx="-12" cy="-74" r="4" fill="#fff" opacity=".8"/><circle cx="14" cy="-62" r="4" fill="#fff" opacity=".8"/><circle cx="2" cy="-90" r="4" fill="#fff" opacity=".8"/>
  <path d="M-16,-121 Q0,-108 16,-121 Q0,-112 -16,-121 Z" fill="#fff"/><ellipse cx="0" cy="-119" rx="18" ry="6" fill="#fff"/>
  <g transform="rotate(${sw} 0 -125)">
  <circle cx="-46" cy="-150" r="16" fill="${HR}"/><circle cx="46" cy="-150" r="16" fill="${HR}"/>
  <circle cx="-36" cy="-164" r="7" fill="#FF7FB0"/><circle cx="36" cy="-164" r="7" fill="#FF7FB0"/>
  <circle cx="0" cy="-158" r="42" fill="${SK}"/>
  <path d="M-43,-160 Q-44,-206 0,-204 Q44,-206 43,-160 Q30,-186 8,-180 Q-2,-192 -10,-180 Q-30,-186 -43,-160 Z" fill="${HR}"/>
  ${eye(-15)}${eye(15)}
  <path d="M-9,-136 Q0,-128 9,-136" stroke="#B5523B" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="-26" cy="-140" r="7.5" fill="#FF9AA2" opacity=".75"/><circle cx="26" cy="-140" r="7.5" fill="#FF9AA2" opacity=".75"/>
  </g>`;
}
// lamb({eye, asleep, fluff, ear}): fluffy white lamb facing right, origin at its feet (about 150 tall,
// 170 wide). fluff = 0..1 puffs the fleece out a little (use it for a happy shake), ear = ear flick in degrees.
function lamb(o={}){
  const e=o.eye==null?1:o.eye, f=1+.06*(o.fluff||0), er=o.ear||0;
  const W='#FFFFFF', S='#EFE9E1', FC='#F4DCC8', LG='#7A6670';
  const puff=[[-50,-70,24],[-26,-92,26],[4,-98,26],[32,-88,24],[48,-64,22],[30,-40,24],[0,-36,26],[-30,-40,24],[-56,-48,20],[-4,-66,34]];
  let fl='';puff.forEach(([x,y,r])=>{fl+=`<circle cx="${x}" cy="${y}" r="${r+3}" fill="${S}"/>`;});
  puff.forEach(([x,y,r])=>{fl+=`<circle cx="${x}" cy="${y-2}" r="${r}" fill="${W}"/>`;});
  const eye=o.asleep
    ?`<path d="M64,-116 Q71,-110 78,-116" stroke="#3a2a1a" stroke-width="4" fill="none" stroke-linecap="round"/>`
    :`<g transform="translate(71,-117) scale(1,${e})"><circle r="6.5" fill="#2b1d12"/><circle cx="2.2" cy="-2.3" r="2.3" fill="#fff"/></g>`;
  return `
  <rect x="-40" y="-40" width="12" height="40" rx="6" fill="${LG}"/><rect x="-18" y="-40" width="12" height="40" rx="6" fill="${LG}"/>
  <rect x="14" y="-40" width="12" height="40" rx="6" fill="${LG}"/><rect x="34" y="-40" width="12" height="40" rx="6" fill="${LG}"/>
  <circle cx="-72" cy="-74" r="12" fill="${W}"/>
  <g transform="translate(0,-66) scale(${f}) translate(0,66)">${fl}</g>
  <g transform="rotate(${-er} 44 -112)"><ellipse cx="34" cy="-110" rx="22" ry="10" fill="${FC}" transform="rotate(25 34 -110)"/><ellipse cx="34" cy="-110" rx="13" ry="5" fill="#FFB3C7" transform="rotate(25 34 -110)"/></g>
  <ellipse cx="70" cy="-108" rx="32" ry="30" fill="${FC}"/>
  <circle cx="56" cy="-136" r="13" fill="${W}"/><circle cx="72" cy="-140" r="13" fill="${W}"/><circle cx="86" cy="-132" r="11" fill="${W}"/>
  ${eye}
  <ellipse cx="96" cy="-100" rx="5" ry="3.5" fill="#C98A8A"/>
  <path d="M84,-90 Q90,-85 96,-91" stroke="#9a6a6a" stroke-width="3" fill="none" stroke-linecap="round"/>
  <circle cx="66" cy="-96" r="7" fill="#FF9AA2" opacity=".75"/>`;
}
// snowflake(x,y,s,rot,o): soft six-armed white snowflake centred at (x,y), about 36 wide at s=1
function snowflake(x,y,s=1,rot=0,op=1){
  let d='';for(let k=0;k<6;k++){const a=k*Math.PI/3,c=Math.cos(a),sn=Math.sin(a);
    d+=`M0,0 L${(c*18).toFixed(1)},${(sn*18).toFixed(1)} M${(c*10-sn*5).toFixed(1)},${(sn*10+c*5).toFixed(1)} L${(c*12).toFixed(1)},${(sn*12).toFixed(1)} L${(c*10+sn*5).toFixed(1)},${(sn*10-c*5).toFixed(1)} `;}
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})" opacity="${op}"><path d="${d}" stroke="#8CCBF2" stroke-width="7" stroke-linecap="round" fill="none"/><circle r="6" fill="#8CCBF2"/><path d="${d}" stroke="#fff" stroke-width="3.5" stroke-linecap="round" fill="none"/><circle r="4" fill="#fff"/></g>`;
}

/* ---------- toy blocks (episode 28) ---------- */
// toyBlock(x,y,col,rot,s): wooden toy block, 64 x 64 at s=1, origin at the middle of its bottom edge
// (so a block standing on the ground has y=520). rot turns it around its own centre.
// BLOCKS = six bright block colours.
const BLOCKS=['#FF5D5D','#FF9F1C','#FFD93B','#5CC85A','#3FA9F5','#7B5CFF'];
function toyBlock(x,y,col,rot=0,s=1){
  return `<g transform="translate(${x},${y-32*s}) rotate(${rot}) scale(${s})">
  <rect x="-32" y="-32" width="64" height="64" rx="10" fill="${mix(col,'#000000',.18)}"/>
  <rect x="-32" y="-32" width="64" height="58" rx="10" fill="${col}"/>
  <circle r="15" fill="#fff" opacity=".45"/><circle r="8" fill="#fff" opacity=".7"/>
  <rect x="-24" y="-26" width="18" height="6" rx="3" fill="#fff" opacity=".45"/></g>`;
}

/* ---------- letters U to Z (episode 29) ---------- */
// umbrella(x,y,s,open,rot): red and white striped umbrella, origin at the bottom of its curved handle
// (about 250 wide and 250 tall at s=1, open 1). The canopy top is at y-250*s, its rim at about y-170*s.
// open = 0..1 how far the canopy is spread. rot tilts it in degrees about the handle.
// Held by Lulu (scale .85 at x): umbrella(x+30, 520-62, .95, 1) puts the canopy just over her head.
function umbrella(x,y,s=1,op=1,rot=0){
  const w=lerp(30,125,clamp(op)), cy=-170, top=-250, q=w/2;
  let D=`M${-w},${cy} Q${-w},${top} 0,${top} Q${w},${top} ${w},${cy}`;
  for(let k=0;k<4;k++){const x0=w-k*q;D+=` Q${x0-q/2},${cy-18} ${x0-q},${cy}`;}
  D+=' Z';
  const wedge=(a,b)=>`<path d="M0,${top-10} L${a},${cy+10} L${b},${cy+10} Z" fill="#fff"/>`;
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})">
  <path d="M0,${cy} L0,-14 Q0,0 -14,0 Q-26,0 -26,-12" stroke="#7A4B21" stroke-width="8" fill="none" stroke-linecap="round"/>
  <clipPath id="umbclip"><path d="${D}"/></clipPath>
  <path d="${D}" fill="#E63946"/>
  <g clip-path="url(#umbclip)">${wedge(-w,-q)}${wedge(0,q)}</g>
  <circle cx="0" cy="${top-6}" r="8" fill="#FFD23F"/>
  <ellipse cx="${-w*.5}" cy="${top+36}" rx="${w*.1+2}" ry="7" fill="#fff" opacity=".35" transform="rotate(-35 ${-w*.5} ${top+36})"/></g>`;
}
// vase(x,y,s,t): round blue vase with three flowers in it, standing on the ground, origin at its bottom
// (about 140 wide and 270 tall with the flowers at s=1; the vase alone is 130 tall)
function vase(x,y,s=1,t=0){
  return `<g transform="translate(${x},${y}) scale(${s})">
  ${flower(-26,-110,120,'#FF7FB0',t,0,.8)}${flower(28,-110,130,'#FFD23F',t,1,.8,'#FF8C1A')}${flower(0,-116,165,'#B58CFF',t,2,.8)}
  <path d="M-28,-130 L28,-130 L24,-104 Q66,-80 64,-42 Q60,0 0,0 Q-60,0 -64,-42 Q-66,-80 -24,-104 Z" fill="#5B8DEF"/>
  <ellipse cx="0" cy="-130" rx="32" ry="8" fill="#4673D6"/>
  <path d="M-58,-54 Q0,-36 58,-54" stroke="#FFD23F" stroke-width="9" fill="none" stroke-linecap="round"/>
  <ellipse cx="-36" cy="-74" rx="9" ry="20" fill="#fff" opacity=".35" transform="rotate(25 -36 -74)"/></g>`;
}
// watermelon(x,y,s): big half-moon slice of watermelon standing on its flat edge, origin at the middle of
// the flat edge (about 260 wide and 135 tall at s=1). Dark seeds, green rind.
function watermelon(x,y,s=1){
  const seeds=[[-62,-40],[-30,-70],[0,-48],[30,-70],[62,-40],[-14,-92],[16,-92]];
  let sd='';seeds.forEach(([a,b])=>{sd+=`<ellipse cx="${a}" cy="${b}" rx="5" ry="9" fill="#2b1d12" transform="rotate(${a*.5} ${a} ${b})"/>`;});
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-130,0 A130,130 0 0 1 130,0 Z" fill="#3FA34D"/>
  <path d="M-118,0 A118,118 0 0 1 118,0 Z" fill="#E8F5C8"/>
  <path d="M-108,0 A108,108 0 0 1 108,0 Z" fill="#FF5D6C"/>
  <rect x="-130" y="-8" width="260" height="8" fill="#E04A5A"/>
  ${sd}<ellipse cx="-56" cy="-76" rx="10" ry="22" fill="#fff" opacity=".3" transform="rotate(-40 -56 -76)"/></g>`;
}
// xylophone(x,y,s,hit,t): toy xylophone with six rainbow bars on a wooden frame, standing on the ground,
// origin at the middle of its bottom (about 330 wide and 110 tall at s=1). hit = index of the bar
// that is bouncing (or -1), t = time since it was hit (seconds). The bar centres are at
// x + (-125 + k*50)*s, y - 72*s. xyloMallet(x,y,s,rot) draws a little mallet whose head is at (x,y).
function xylophone(x,y,s=1,hit=-1,ht=0){
  let b='';
  BLOCKS.forEach((c,k)=>{const h=110-k*12, bx=-125+k*50, d=k===hit?-10*Math.exp(-ht*7)*Math.cos(ht*30):0;
    b+=`<g transform="translate(0,${d})"><rect x="${bx-20}" y="${-72-h/2}" width="40" height="${h}" rx="10" fill="${c}"/>
    <circle cx="${bx}" cy="${-72-h/2+12}" r="4.5" fill="#fff" opacity=".8"/><circle cx="${bx}" cy="${-72+h/2-12}" r="4.5" fill="#fff" opacity=".8"/>
    <rect x="${bx-13}" y="${-72-h/2+22}" width="7" height="${h-44}" rx="3.5" fill="#fff" opacity=".35"/></g>`;});
  return `<g transform="translate(${x},${y}) scale(${s})">
  <rect x="-155" y="-28" width="16" height="28" rx="6" fill="#A8672E"/><rect x="139" y="-28" width="16" height="28" rx="6" fill="#A8672E"/>
  <path d="M-160,-100 L160,-86 L160,-74 L-160,-86 Z" fill="#C98545"/>
  <path d="M-160,-58 L160,-64 L160,-52 L-160,-46 Z" fill="#C98545"/>
  <rect x="-165" y="-40" width="330" height="16" rx="8" fill="#A8672E"/>
  ${b}</g>`;
}
function xyloMallet(x,y,s=1,rot=0){
  return `<g transform="translate(${x},${y}) rotate(${rot}) scale(${s})"><rect x="-5" y="0" width="10" height="110" rx="5" fill="#C98545"/><circle cx="0" cy="0" r="16" fill="#FF5D8F"/><circle cx="-5" cy="-5" r="5" fill="#fff" opacity=".5"/></g>`;
}
// yogurt(x,y,s): pot of pink strawberry yogurt with a spoon and a strawberry on top, standing on the
// ground, origin at the bottom of the pot (about 150 wide and 220 tall with the spoon at s=1)
function yogurt(x,y,s=1){
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M20,-120 L52,-214" stroke="#B8C4D6" stroke-width="10" stroke-linecap="round"/><ellipse cx="56" cy="-222" rx="13" ry="18" fill="#B8C4D6" transform="rotate(20 56 -222)"/>
  <path d="M-62,-130 Q-64,-160 -30,-162 Q0,-178 30,-162 Q64,-160 62,-130 Z" fill="#FFC2D4"/>
  <path d="M-12,-166 Q-24,-150 -4,-140 Q16,-150 6,-166 Z" fill="#E63946"/><path d="M-12,-166 Q-4,-176 6,-166 Q-2,-170 -12,-166Z" fill="#3FA34D"/>
  <circle cx="-6" cy="-156" r="1.8" fill="#FFE785"/><circle cx="2" cy="-150" r="1.8" fill="#FFE785"/>
  <path d="M-66,-132 L66,-132 L52,-6 Q51,0 44,0 L-44,0 Q-51,0 -52,-6 Z" fill="#fff"/>
  <path d="M-70,-140 L70,-140 L68,-126 L-68,-126 Z" fill="#FF7FB0"/>
  <path d="M-60,-76 L60,-76 L57,-44 L-57,-44 Z" fill="#FF7FB0"/>
  <circle cx="-22" cy="-60" r="7" fill="#fff"/><circle cx="0" cy="-60" r="7" fill="#fff"/><circle cx="22" cy="-60" r="7" fill="#fff"/>
  <rect x="-44" y="-118" width="10" height="34" rx="5" fill="#EDE7F0"/></g>`;
}
// stripe patterns for zebra({v}): every zebra has its own stripes, so pass a different v for each zebra on screen
const ZEBRA_STRIPES=[
  '<path d="M-70,-160 Q-80,-120 -64,-74"/><path d="M-40,-160 Q-50,-120 -36,-86"/><path d="M-10,-160 Q-20,-124 -8,-92"/><path d="M20,-160 Q12,-126 22,-96"/><path d="M48,-160 Q40,-130 50,-104"/>',
  '<path d="M-74,-160 Q-62,-118 -76,-76"/><path d="M-46,-160 Q-34,-124 -48,-88"/><path d="M-16,-162 Q-6,-130 -20,-104"/><path d="M-4,-70 Q4,-84 -2,-96"/><path d="M26,-160 Q36,-130 24,-100"/><path d="M54,-158 Q60,-136 52,-112"/>',
  '<path d="M-66,-160 Q-84,-124 -60,-78"/><path d="M-30,-160 Q-44,-124 -28,-84"/><path d="M4,-162 Q-10,-128 6,-90"/><path d="M36,-160 Q28,-134 40,-106"/><path d="M-50,-74 Q-46,-90 -52,-100"/>'
];
// zebra({eye, step, tail, nod, v}): friendly little zebra facing right, origin at its feet (about 210 tall
// to the ears and 200 wide at s=1). step = walking phase in radians (legs swing), tail = -1..1 tail swish,
// nod = head nod in degrees, v = stripe pattern (0, 1 or 2).
function zebra(o={}){
  const e=o.eye==null?1:o.eye, st=o.step||0, tl=o.tail||0, nd=o.nod||0;
  const W='#FFFFFF', K='#2D2A3A';
  const leg=(lx,ph)=>{const a=st?10*Math.sin(st+ph):0;
    return `<g transform="rotate(${a} ${lx} -78)"><rect x="${lx-9}" y="-84" width="18" height="78" rx="8" fill="${W}"/>
    <rect x="${lx-9}" y="-50" width="18" height="7" fill="${K}"/><rect x="${lx-9}" y="-30" width="18" height="6" fill="${K}"/>
    <rect x="${lx-10}" y="-14" width="20" height="14" rx="5" fill="${K}"/></g>`;};
  const eye=`<g transform="translate(104,-176) scale(1,${e})"><circle r="7" fill="#2b1d12"/><circle cx="2.4" cy="-2.5" r="2.5" fill="#fff"/></g>`;
  return `
  ${leg(-52,Math.PI)}${leg(34,0)}
  <g transform="rotate(${tl*14} -82 -112)"><path d="M-82,-112 Q-104,-96 -104,-66" stroke="${W}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="-104" cy="-58" rx="9" ry="15" fill="${K}"/></g>
  <clipPath id="zbody"><ellipse cx="-8" cy="-110" rx="84" ry="46"/></clipPath>
  <ellipse cx="-8" cy="-110" rx="84" ry="46" fill="${W}"/>
  <g clip-path="url(#zbody)" stroke="${K}" stroke-width="11" fill="none" stroke-linecap="round">${ZEBRA_STRIPES[(o.v||0)%ZEBRA_STRIPES.length]}</g>
  ${leg(-34,0)}${leg(52,Math.PI)}
  <g transform="rotate(${nd} 54 -130)">
  <path d="M40,-140 Q50,-196 82,-196 L96,-160 Q74,-136 70,-110 Z" fill="${W}"/>
  <path d="M52,-150 L66,-156 M50,-132 L66,-136 M58,-170 L72,-172" stroke="${K}" stroke-width="9" stroke-linecap="round"/>
  <path d="M44,-150 Q40,-196 76,-210 Q66,-190 64,-176 Q56,-166 52,-140 Z" fill="${K}"/>
  <ellipse cx="78" cy="-222" rx="8" ry="18" fill="${W}" transform="rotate(-20 78 -222)"/><ellipse cx="78" cy="-221" rx="3.5" ry="10" fill="#FFB3C7" transform="rotate(-20 78 -221)"/>
  <ellipse cx="104" cy="-178" rx="34" ry="30" fill="${W}"/>
  <path d="M86,-202 Q96,-196 98,-186 M110,-206 Q114,-200 114,-192" stroke="${K}" stroke-width="7" fill="none" stroke-linecap="round"/>
  <ellipse cx="134" cy="-160" rx="22" ry="18" fill="#7A6E86"/>
  <ellipse cx="142" cy="-164" rx="3.5" ry="2.5" fill="#2b1d12"/>
  <path d="M124,-148 Q132,-144 140,-149" stroke="#2b1d12" stroke-width="3" fill="none" stroke-linecap="round"/>
  ${eye}<circle cx="104" cy="-160" r="7" fill="#FF9AA2" opacity=".75"/></g>`;
}

/* ---------- picnic (episode 31) ---------- */
// picnicBlanket(x,y,u): red and white checked blanket lying on the grass, seen in perspective.
// (x,y) = middle of its front edge; back edge 100 higher. About 960 wide at the front, 840 at the back.
// u = 0..1 unfolds it sideways from the middle (1 = fully open). Characters stand on it at y=520.
function picnicBlanket(x,y,u=1){
  if(u<=0)return '';
  const R=4,C=10,fw=480*u,bw=420*u,h=100;let s='';
  const pt=(c,r)=>{const v=r/R, hw=lerp(bw,fw,v);return [x-hw+2*hw*c/C, y-h+h*v];};
  s+=`<path d="M${x-fw},${y} L${x-bw},${y-h} L${x+bw},${y-h} L${x+fw},${y} Z" fill="#FFF6EC"/>`;
  for(let r=0;r<R;r++)for(let c=0;c<C;c++){if((r+c)%2)continue;
    const a=pt(c,r),b=pt(c+1,r),d=pt(c+1,r+1),e=pt(c,r+1);
    s+=`<path d="M${a[0]},${a[1]} L${b[0]},${b[1]} L${d[0]},${d[1]} L${e[0]},${e[1]} Z" fill="#F0535E"/>`;}
  s+=`<path d="M${x-fw},${y} L${x+fw},${y} L${x+fw-4},${y+10} L${x-fw+4},${y+10} Z" fill="#C93C4A"/>`;
  return s;
}
// picnicBasket(x,y,s,lid): woven picnic basket with a handle, origin at the middle of its bottom
// (about 150 wide and 140 tall with the handle at s=1). lid = 0..1 how far the lid is lifted open.
function picnicBasket(x,y,s=1,lid=0){
  let weave='';for(let k=0;k<4;k++)weave+=`<path d="M-66,${-16-k*16} L66,${-16-k*16}" stroke="#B9783A" stroke-width="4"/>`;
  for(let k=-2;k<=2;k++)weave+=`<path d="M${k*26},-4 L${k*28},-68" stroke="#B9783A" stroke-width="3" opacity=".7"/>`;
  return `<g transform="translate(${x},${y}) scale(${s})">
  <path d="M-52,-72 Q0,-150 52,-72" stroke="#A86A30" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M-74,-72 L74,-72 L62,-4 Q60,0 54,0 L-54,0 Q-60,0 -62,-4 Z" fill="#D9984F"/>
  ${weave}
  <g transform="rotate(${-40*lid} -76 -72)"><rect x="-78" y="-84" width="156" height="16" rx="7" fill="#C2803F"/>
  <path d="M-60,-84 L-30,-84 L-30,-68 L-60,-68 Z M0,-84 L30,-84 L30,-68 L0,-68 Z" fill="#F0535E"/></g></g>`;
}
