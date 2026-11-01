// LOADER
addEventListener('load',()=> setTimeout(()=> document.getElementById('loader').classList.add('hide'), 900));

// CUSTOM CURSOR
const cursor=document.getElementById('cursor'), sparkle=document.getElementById('cursor-sparkle');
let mx=0,my=0,cx=0,cy=0,sx=0,sy=0;
addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  // sparkle burst on move occasionally
  if(Math.random()<.08) createSparkle(e.clientX,e.clientY);
});
(function loop(){
  cx+=(mx-cx)*.18; cy+=(my-cy)*.18;
  sx+=(mx-sx)*.26; sy+=(my-sy)*.26;
  cursor.style.left=cx+'px'; cursor.style.top=cy+'px';
  sparkle.style.left=sx+'px'; sparkle.style.top=sy+'px';
  requestAnimationFrame(loop);
})();
document.querySelectorAll('a,button,.garden-flower,.gallery-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>cursor.classList.add('hover'));
  el.addEventListener('mouseleave',()=>cursor.classList.remove('hover'));
});
function createSparkle(x,y){
  const s=document.createElement('div'); s.className='sparkle-dot';
  s.style.left=x+'px'; s.style.top=y+'px';
  document.getElementById('sparkleContainer').appendChild(s);
  setTimeout(()=>s.remove(),700);
}
document.addEventListener('click',e=>{ for(let i=0;i<6;i++) setTimeout(()=>createSparkle(e.clientX+(Math.random()-.5)*30,e.clientY+(Math.random()-.5)*30),i*40); });

// GALLERY: hide placeholder when real photo loads (handle cached images too)
document.querySelectorAll('.gallery-item img').forEach(img=>{
  const ph=img.nextElementSibling;
  const hide=()=>{ if(ph) ph.style.display='none'; };
  const show=()=>{ if(ph) ph.style.display='flex'; };
  if(img.complete && img.naturalWidth>0){ hide(); }
  else if(img.complete && img.naturalWidth===0){ show(); }
  img.addEventListener('load',hide);
  img.addEventListener('error',show);
});

// NAV SCROLL
const nav=document.getElementById('navbar');
addEventListener('scroll',()=> nav.classList.toggle('scrolled',scrollY>20));
document.getElementById('hamburger').onclick=()=> document.querySelector('.nav-links').classList.toggle('open');

// REVEAL ON SCROLL
const obs=new IntersectionObserver(es=>es.forEach(en=>{ if(en.isIntersecting) en.target.classList.add('in'); }),{threshold:.15});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// PARTICLE CANVAS — disabled on mobile for performance
const canvas=document.getElementById('particleCanvas'), ctx=canvas.getContext('2d');
let W,H,particles=[];
const isMobile=()=> window.innerWidth<=860;
function resize(){ W=canvas.width=innerWidth; H=canvas.height=innerHeight; }
resize(); addEventListener('resize',resize);
if(!isMobile()){
  const count=Math.min(70, Math.floor(innerWidth/14));
  for(let i=0;i<count;i++) particles.push({
    x:Math.random()*W, y:Math.random()*H,
    r:Math.random()*2.2+.6, o:Math.random()*.5+.15,
    vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
    tw:Math.random()*Math.PI*2, col: Math.random()>.5 ? '167,216,245' : '255,214,231'
  });
  (function draw(){
    ctx.clearRect(0,0,W,H);
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy; p.tw+=.02;
      if(p.x<0||p.x>W) p.vx*=-1;
      if(p.y<0||p.y>H) p.vy*=-1;
      const a=p.o + Math.sin(p.tw)*.2;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.col},${a})`; ctx.shadowBlur=6; ctx.shadowColor=`rgba(${p.col},.6)`; ctx.fill(); ctx.shadowBlur=0;
    });
    requestAnimationFrame(draw);
  })();
}

// PETALS — fewer on mobile
const petals=['❀','✿','♡','✧','⋆','❋'];
const petalContainer=document.getElementById('petalContainer');
const petalInterval=isMobile() ? 3000 : 900;
setInterval(()=>{
  const el=document.createElement('span'); el.className='petal-el';
  el.textContent=petals[Math.floor(Math.random()*petals.length)];
  el.style.left=Math.random()*100+'vw'; el.style.top='-20px';
  el.style.color=Math.random()>.5 ? '#A7D8F5' : '#FFD6E7';
  el.style.fontSize=(12+Math.random()*10)+'px';
  el.style.animationDuration=(7+Math.random()*6)+'s';
  el.style.opacity=.7;
  petalContainer.appendChild(el);
  setTimeout(()=>el.remove(),13000);
},petalInterval);

// GARDEN
const messages=[
  {icon:'🌸',label:'sayang',hint:'tap me ♡',msg:'Yunn, tiap kali kamu ngabarin duluan, hari aku langsung jadi lebih baik ♡'},
  {icon:'🩵',label:'tiap malam',hint:'tap me ✧',msg:'telponan sama kamu tiap malam itu hal yang paling aku tunggu-tunggu sekarang'},
  {icon:'✿',label:'nggak resmi',hint:'tap me',msg:'belum resmi tapi rasanya udah kayak orang pacaran — dan aku suka banget itu'},
  {icon:'🌙',label:'midnight call',hint:'tap me ♡',msg:'suara kamu pas malam-malam itu bikin aku susah tidur karena senyum-senyum sendiri'},
  {icon:'☁️',label:'kangen',hint:'tap me',msg:'aku bisa kangen sama kamu padahal baru beberapa jam nggak ngobrol — itu serius'},
  {icon:'💌',label:'jujur aja',hint:'tap me ✧',msg:'jujur, kamu udah jadi orang yang paling sering aku pikirin belakangan ini, Yunn'},
  {icon:'⋆',label:'perasaan ini',hint:'tap me ♡',msg:'entah ini namanya apa, tapi rasanya hangat banget — dan aku nggak mau kehilangan itu ♡'},
  {icon:'🎀',label:'buat kamu',hint:'tap me',msg:'halaman ini aku bikin cuma buat satu orang, dan itu kamu, Yunn Marta Salsabila ♡'},
];
const grid=document.getElementById('gardenGrid');
messages.forEach((m,i)=>{
  const d=document.createElement('button'); d.className='garden-flower';
  d.style.animationDelay=(i*.08)+'s';
  d.innerHTML=`<span class="gf-icon">${m.icon}</span><span class="gf-label">${m.label}</span><span class="gf-hint">${m.hint}</span>`;
  d.onclick=()=>{
    document.querySelectorAll('.garden-flower').forEach(x=>x.classList.remove('bloomed'));
    d.classList.add('bloomed'); d.style.transform='scale(.93)'; setTimeout(()=>d.style.transform='',160);
    const box=document.getElementById('gardenMessage');
    const txt=document.getElementById('gardenText');
    const overlay=document.getElementById('gardenOverlay');
    txt.textContent=m.msg;
    box.classList.add('visible');
    overlay.classList.add('visible');
    box.classList.add('pop'); setTimeout(()=>box.classList.remove('pop'),400);
    for(let k=0;k<10;k++) setTimeout(()=>createSparkle(d.getBoundingClientRect().left+d.offsetWidth/2+(Math.random()-.5)*60, d.getBoundingClientRect().top+20),k*50);
  };
  grid.appendChild(d);
});

// Close garden popup
function closeGarden(){
  document.getElementById('gardenMessage').classList.remove('visible');
  document.getElementById('gardenOverlay').classList.remove('visible');
}
document.getElementById('gardenClose').onclick=closeGarden;
document.getElementById('gardenOverlay').onclick=closeGarden;

// COPY & SHARE — removed (letter section deleted)
function toast(msg){
  let el=document.createElement('div');
  el.textContent=msg; el.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#4A7CA8;color:white;padding:10px 22px;border-radius:99px;font-family:Nunito,sans-serif;font-weight:700;font-size:13px;z-index:9999;box-shadow:0 8px 24px rgba(0,0,0,.15)';
  document.body.appendChild(el); setTimeout(()=>{el.style.opacity='0';el.style.transition='opacity .5s'},1600); setTimeout(()=>el.remove(),2200);
}

// LIGHTBOX — support real photos
document.querySelectorAll('.gallery-item').forEach(it=>{
  it.onclick=()=>{
    const img=it.querySelector('img');
    const hasImg=img && img.src && img.style.display!=='none' && img.complete && img.naturalWidth>0;
    const lb=document.getElementById('lightbox');
    const cap=document.getElementById('lightboxCaption');
    // inject image preview
    let preview=lb.querySelector('.lightbox-img');
    if(!preview){ preview=document.createElement('img'); preview.className='lightbox-img'; lb.querySelector('.lightbox-content').prepend(preview); }
    if(hasImg){ preview.src=img.src; preview.style.display='block'; }
    else { preview.style.display='none'; }
    cap.textContent='“ '+it.dataset.caption+' ”  ✧';
    lb.classList.add('open');
  };
});
document.getElementById('lightboxClose').onclick=()=> document.getElementById('lightbox').classList.remove('open');
document.getElementById('lightbox').onclick=e=>{ if(e.target.id==='lightbox') e.currentTarget.classList.remove('open'); };

// FLOATING MUSIC PLAYER
const audio=document.getElementById('mainAudio');
const disc=document.getElementById('musicDisc');
const playBtn=document.getElementById('playPauseBtn');
const prevBtn=document.getElementById('prevBtn');
const nextBtn=document.getElementById('nextBtn');
const titleEl=document.getElementById('musicTitle');
const artistEl=document.getElementById('musicArtist');
const curEl=document.getElementById('curTime');
const durEl=document.getElementById('durTime');
const fill=document.getElementById('progressFill');
const bar=document.getElementById('progressBar');
const vol=document.getElementById('volumeSlider');
const playlistItems=[...document.querySelectorAll('.playlist-item')];
let curIdx=0;

// NAV sound button → toggle floating player & play
function loadTrack(i){
  curIdx=(i+playlistItems.length)%playlistItems.length;
  const it=playlistItems[curIdx];
  audio.src=it.dataset.src;
  titleEl.textContent=it.dataset.title;
  artistEl.textContent=it.dataset.artist;
  playlistItems.forEach(x=>x.classList.remove('active'));
  it.classList.add('active');
}
function togglePlay(){
  if(audio.paused){
    audio.play().then(()=>{ playBtn.textContent='⏸'; disc.classList.add('playing'); }).catch(()=> toast('file lagu belum ditemukan — taruh mp3 di folder music/ ♡'));
  } else { audio.pause(); playBtn.textContent='▶'; disc.classList.remove('playing'); }
}
playBtn.onclick=togglePlay;
prevBtn.onclick=()=>{ loadTrack(curIdx-1); audio.play().then(()=>{playBtn.textContent='⏸';disc.classList.add('playing')}).catch(()=>{}); };
nextBtn.onclick=()=>{ loadTrack(curIdx+1); audio.play().then(()=>{playBtn.textContent='⏸';disc.classList.add('playing')}).catch(()=>{}); };
playlistItems.forEach((it,i)=> it.onclick=()=>{ loadTrack(i); audio.play().then(()=>{playBtn.textContent='⏸';disc.classList.add('playing')}).catch(()=>toast('file tidak ditemukan: '+it.dataset.src)); });
function fmt(s){ if(isNaN(s)) return '0:00'; const m=Math.floor(s/60), sc=Math.floor(s%60); return m+':'+String(sc).padStart(2,'0'); }
audio.addEventListener('timeupdate',()=>{ const p=audio.duration? (audio.currentTime/audio.duration*100):0; fill.style.width=p+'%'; curEl.textContent=fmt(audio.currentTime); });
audio.addEventListener('loadedmetadata',()=> durEl.textContent=fmt(audio.duration));
audio.addEventListener('ended',()=>{ disc.classList.remove('playing'); playBtn.textContent='▶'; nextBtn.click(); });
audio.addEventListener('pause',()=>{ disc.classList.remove('playing'); playBtn.textContent='▶'; });
audio.addEventListener('play',()=>{ disc.classList.add('playing'); playBtn.textContent='⏸'; });
audio.addEventListener('error',()=> toast('lagu tidak ketemu — cek path: '+audio.src.split('/').slice(-2).join('/')));
bar.onclick=e=>{ const r=bar.getBoundingClientRect(); const pct=(e.clientX-r.left)/r.width; if(audio.duration) audio.currentTime=pct*audio.duration; };
vol.oninput=()=> audio.volume=vol.value;
audio.volume=.7;
if(playlistItems.length) loadTrack(0);
// Init floating music — sembunyikan panel dari awal supaya tidak block klik
(()=>{
  const fm = document.getElementById('floatingMusic');
  fm.querySelector('.fm-panel').style.display = 'none';
  fm.querySelector('.fm-playlist').style.display = 'none';
})();

// Toggle floating panel open/close
document.getElementById('fmTab').onclick=()=>{
  const fm = document.getElementById('floatingMusic');
  const panel = fm.querySelector('.fm-panel');
  const playlist = fm.querySelector('.fm-playlist');
  const isCollapsed = fm.classList.contains('collapsed');

  if(isCollapsed){
    // Buka: tampilkan dulu baru animate
    panel.style.display = 'flex';
    playlist.style.display = 'flex';
    requestAnimationFrame(()=>{
      requestAnimationFrame(()=>{ fm.classList.remove('collapsed'); });
    });
  } else {
    // Tutup: animate dulu baru sembunyikan
    fm.classList.add('collapsed');
    setTimeout(()=>{
      panel.style.display = 'none';
      playlist.style.display = 'none';
    }, 350);
  }
};

// NAV sound button → toggle floating player & play
document.getElementById('musicBtn').onclick=()=>{
  const fmTab = document.getElementById('fmTab');
  fmTab.click(); // pakai logic toggle yang sama
  setTimeout(()=>{ if(audio.paused) togglePlay(); },300);
};

// PARALLAX on mouse — desktop only
let px=0,py=0;
if(!isMobile()){
  addEventListener('mousemove',e=>{
    const rx=(e.clientX/innerWidth-.5)*2, ry=(e.clientY/innerHeight-.5)*2;
    px+=(rx-px)*.04; py+=(ry-py)*.04;
    document.querySelectorAll('.flower-cluster').forEach((el,i)=>{
      el.style.transform=`translate(${px*(6+i*4)}px,${py*(6+i*4)}px) rotate(${px*3}deg)`;
    });
  });
}
