/* Main interactions: intro animation, theme toggle, drops, typing reveals, sound effects, GSAP scroll ties */
const root = document.documentElement;
const intro = document.getElementById('intro');
const nPath = document.getElementById('N-path');
const caption = document.querySelector('.intro-caption');
const themeToggle = document.getElementById('themeToggle');
const downloadBtn = document.getElementById('downloadBtn');
const yearSpan = document.getElementById('year');
yearSpan.textContent = new Date().getFullYear();

// audio elements
const sDrop = document.getElementById('s-drop');
const sType = document.getElementById('s-typing');

// theme handling
const savedTheme = localStorage.getItem('site-theme') || 'dark';
if(savedTheme === 'light') document.documentElement.setAttribute('data-theme','light');
if(savedTheme === 'light') themeToggle.setAttribute('aria-checked','true');

themeToggle.addEventListener('click', ()=>{
  const cur = document.documentElement.getAttribute('data-theme') === 'light' ? 'dark':'light';
  document.documentElement.setAttribute('data-theme', cur);
  themeToggle.setAttribute('aria-checked', cur === 'light' ? 'true':'false');
  localStorage.setItem('site-theme', cur);
});

downloadBtn.addEventListener('click', ()=>{
  const blob = new Blob(["Curriculum Vitae - Neboh\n\nPlaceholder CV."], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'Neboh_CV.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

// intro animation (draw neon 'N' and reveal caption)
function animateIntro(){
  const total = nPath.getTotalLength ? nPath.getTotalLength() : 600;
  nPath.style.strokeDasharray = Math.ceil(total);
  nPath.style.strokeDashoffset = Math.ceil(total);
  setTimeout(()=>{ nPath.style.transition = 'stroke-dashoffset 1200ms cubic-bezier(.2,.9,.25,1)'; nPath.style.strokeDashoffset = 0; }, 160);
  setTimeout(()=>{ caption.style.opacity = '1'; caption.style.transform = 'translateZ(0) translateY(0)'; }, 1400);
  setTimeout(()=>{ intro.classList.add('hide'); intro.setAttribute('aria-hidden','true'); }, 3200);
  setTimeout(()=>{ try{ intro.remove(); }catch(e){} document.body.style.overflow = ''; }, 4200);
}

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!prefersReduced){
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', ()=>{ setTimeout(animateIntro, 120); });
} else {
  intro.remove();
}

// scrolling water-drop typing effect & GSAP ScrollTrigger tie-in
const drops = [document.getElementById('drop1'), document.getElementById('drop2'), document.getElementById('drop3')];
const typo = document.getElementById('typo');
let lastSection = null;
const sections = Array.from(document.querySelectorAll('main section'));

function getCurrentSection(){
  const y = window.scrollY + window.innerHeight/3;
  for(const s of sections){
    const r = s.getBoundingClientRect();
    const top = window.scrollY + r.top;
    const bottom = top + r.height;
    if(y >= top && y < bottom) return s;
  }
  return null;
}

function showDrops(){
  drops.forEach((d,i)=>{ setTimeout(()=>d.classList.add('show'), i*100); setTimeout(()=>d.classList.remove('show'), 1000 + i*180); });
  typo.classList.add('on');
  typo.textContent = 'Navigating — forming thoughts...';
  // play subtle water-drop sound
  try{ sDrop.currentTime = 0; sDrop.play(); }catch(e){}
  setTimeout(()=> typo.classList.remove('on'), 1300);
}

// GSAP ScrollTrigger for sections — subtle entrance and sound triggers
window.addEventListener('load', ()=>{
  if(typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined'){
    gsap.registerPlugin(ScrollTrigger);
    gsap.utils.toArray('main .panel').forEach((panel, i)=>{
      gsap.from(panel, {
        y: 40, opacity:0, duration:0.9, ease:'power3.out',
        scrollTrigger: {
          trigger: panel, start: 'top 80%', end: 'bottom 20%',
          onEnter: ()=>{ showDrops(); try{ sType.currentTime = 0; sType.play(); }catch(e){} }
        }
      });
    });
  }
});

// typing reveal for cards when they intersect
const revealObserver = new IntersectionObserver((entries)=>{
  entries.forEach(en=>{
    if(en.isIntersecting){
      const h = en.target.querySelector('h2, h3, .headline');
      if(h && !h.dataset.revealed){
        h.dataset.revealed = '1';
        const text = h.textContent.trim(); h.textContent = '';
        let i=0;
        const step = ()=>{
          if(i<=text.length){ h.textContent = text.slice(0,i); i++; setTimeout(step, 12 + Math.random()*24); }
        };
        step();
      }
    }
  });
}, {threshold:0.25});
document.querySelectorAll('.card').forEach(c=>revealObserver.observe(c));

// keyboard shortcuts
window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase() === 't'){ themeToggle.click(); } if(e.key.toLowerCase() === 'd'){ downloadBtn.click(); } });

// micro parallax on mouse for intro logo
const logo = document.querySelector('.logo-wrap');
if(logo && !prefersReduced){
  window.addEventListener('mousemove', (ev)=>{
    const cx = window.innerWidth/2; const cy = window.innerHeight/2;
    const rx = (ev.clientY - cy)/cy; const ry = (ev.clientX - cx)/cx;
    const rxDeg = Math.max(Math.min(rx*6,8),-8); const ryDeg = Math.max(Math.min(ry*12,12),-12);
    logo.style.transform = `translateZ(40px) rotateX(${8 - rxDeg}deg) rotateY(${18 + ryDeg}deg) scale(1.03)`;
  });
}

// battery aware tweak
if(navigator.getBattery){
  navigator.getBattery().then(b=>{ if(b.level<0.25 || b.saveMode){ document.documentElement.style.setProperty('--transition','200ms'); } });
}

// focus management
document.addEventListener('DOMContentLoaded', ()=>{ setTimeout(()=>{ const m = document.querySelector('main'); if(m) m.setAttribute('tabindex','-1'); }, 4800); });

export default {};
