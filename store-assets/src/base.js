const LANG=(new URLSearchParams(location.search).get('lang')||'en');
const t=o=>o[LANG]||o.en;
const logo=(s)=>`<svg class="logo" width="${s}" height="${s}" viewBox="0 0 100 100"><rect x="8" y="8" width="84" height="84" rx="26" fill="#14111f" stroke="#a970ff" stroke-width="7"/><polygon points="41,31 71,50 41,69" fill="#ff0033"/></svg>`;
const scaled=(h,w,hh,s,st='')=>`<div style="width:${w*s}px;height:${hh*s}px;${st}"><div style="width:${w}px;height:${hh}px;transform:scale(${s});transform-origin:0 0">${h}</div></div>`;
const player=(fs=16)=>`<div class="player" style="font-size:${fs}px"><div class="scene"></div><div class="sun"></div><div class="m1"></div><div class="m2"></div><div class="lake"></div>
<div class="ctl"><div class="pr"><b></b><u></u></div><div class="bt"><svg viewBox="0 0 24 24"><path d="M7 4l13 8-13 8z"/></svg><svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 4V5L7 9z"/><path d="M15 8a5 5 0 010 8" fill="none" stroke="#fff" stroke-width="2"/></svg><span>3:42 / 12:08</span><span class="sp"></span><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="none" stroke="#fff" stroke-width="2.5"/><circle cx="12" cy="12" r="9" fill="none" stroke="#fff" stroke-width="2.5" stroke-dasharray="4 3.2"/></svg><svg viewBox="0 0 24 24"><path d="M4 4h6v2H6v4H4zM14 4h6v6h-2V6h-4zM4 14h2v4h4v2H4zM18 14h2v6h-6v-2h4z"/></svg></div></div></div>`;
const browser=(w,h,body,ext='')=>`<div class="win" style="width:${w}px;height:${h}px"><div class="tabs"><div class="dots"><i></i><i></i><i></i></div><div class="tab"><i></i><s></s></div></div><div class="tool"><span class="nav"></span><span class="nav"></span><span class="nav"></span><div class="addr"><i style="width:12px;height:12px;border-radius:50%;background:#6c6785"></i><s></s></div><span class="ext"></span>${ext}</div><div style="width:${w}px;height:${h-82}px;overflow:hidden;position:relative">${body}</div></div>`;
const popup=(w,h)=>`<div class="win" style="width:${w}px;height:${h}px"><div class="popbar"><div class="t"><i></i><s></s></div><div class="c"><i></i><i></i><i></i></div></div><div style="width:${w}px;height:${h-36}px">${player(Math.round(w/44))}</div></div>`;
const page=(w=1000,h=600)=>{
 const cols=['#bdb8d2,#a7a1c0','#c9b8d8,#b09cc4','#b8c6d8,#9cb0c4','#d2c3b8,#c4aa9c','#bdb8d2,#a7a1c0','#c9b8d8,#b09cc4'];
 let rec='';for(let i=0;i<6;i++)rec+=`<div class="row" style="left:662px;top:${76+i*100}px"><div class="thumb" style="background:linear-gradient(135deg,${cols[i]})"></div><div class="lines"><s style="width:150px"></s><s style="width:110px"></s><s style="width:70px"></s></div></div>`;
 let com='';for(let i=0;i<4;i++)com+=`<div class="row" style="left:20px;top:${500+i*66}px"><div class="g" style="width:40px;height:40px;border-radius:50%"></div><div class="lines" style="padding-top:2px"><s style="width:${90+i*20}px"></s><s style="width:${400-i*50}px"></s></div></div>`;
 return `<div class="pg" style="width:${w}px;height:${h}px"><div class="hd"><div class="g lg"></div><div class="g sr"></div><div class="g av"></div></div>
<div class="abs" style="left:20px;top:76px;width:620px;height:349px;border-radius:10px;overflow:hidden">${player(14)}</div>
<div class="abs g" style="left:20px;top:440px;width:360px;height:16px"></div>
<div class="abs g" style="left:20px;top:466px;width:220px;height:11px"></div>
${com}${rec}</div>`;};
const checkIcon=`<svg width="48" height="48" viewBox="0 0 44 44"><circle cx="22" cy="22" r="22" fill="#2fd07f"/><path d="M12 23l7 7 14-15" fill="none" stroke="#0b2a1a" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const chip=(txt,bg,fg='#fff')=>`<span class="chip" style="background:${bg};color:${fg}">${txt}</span>`;
const place=(html,x,y,extra='')=>`<div class="abs" style="left:${x}px;top:${y}px;${extra}">${html}</div>`;
const caption=(h,p,hs)=>`<div class="cap"><h1 ${hs?`style="font-size:${hs}px"`:''}>${h}</h1><p>${p}</p></div>`;
const arrowRight=(x,y,s=1)=>place(`<svg width="${70*s}" height="${60*s}" viewBox="0 0 70 60"><path d="M4 30h48M36 8l26 22-26 22" fill="none" stroke="#a970ff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></svg>`,x,y);
const pageWin=(s)=>scaled(browser(1000,682,page()),1000,682,s);
const hdr=(w,h)=>{document.documentElement.style.width=w+'px';document.documentElement.style.height=h+'px';document.body.style.width=w+'px';document.body.style.height=h+'px';};
const mount=(w,h,html)=>document.addEventListener("DOMContentLoaded",()=>{hdr(w,h);document.body.innerHTML=html;});
