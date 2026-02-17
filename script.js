// Improved gallery + accessible lightbox (prev/next/keyboard) + nav + contact validation
const galleryEl = document.getElementById('gallery');
// thumbnails and large images (keep same naming convention in assets)
const thumbs = Array.from({length:9},(_,i)=>`assets/thumb-${i+1}.jpg`);
const full = Array.from({length:9},(_,i)=>`assets/photo-${i+1}.jpg`);

function createThumb(src, i){
  const div = document.createElement('div');
  div.className='thumb';
  div.setAttribute('tabindex','0');
  const img = document.createElement('img');
  img.src = src; img.alt = `Sesja ${i}`; img.loading='lazy';
  div.appendChild(img);
  div.addEventListener('click',()=>openLightbox(i));
  div.addEventListener('keydown',(e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(i); } });
  return div;
}

let lightbox = null;
let currentIndex = 0;
let lastFocused = null;

function buildLightbox(index){
  if(lightbox) lightbox.remove();
  lightbox = document.createElement('div');
  lightbox.className='lightbox';
  lightbox.setAttribute('role','dialog');
  lightbox.setAttribute('aria-modal','true');
  lightbox.setAttribute('aria-label',`Galeria — zdjęcie ${index+1}`);

  const img = document.createElement('img');
  img.src = full[index] || thumbs[index];
  img.alt = `Zdjęcie sesji ${index+1}`;
  img.loading = 'eager';

  const btnClose = document.createElement('button');
  btnClose.className='close'; btnClose.innerText='✕'; btnClose.setAttribute('aria-label','Zamknij');
  btnClose.addEventListener('click', closeLightbox);

  const btnPrev = document.createElement('button');
  btnPrev.className='prev'; btnPrev.innerText='◀'; btnPrev.setAttribute('aria-label','Poprzednie');
  btnPrev.addEventListener('click', ()=>showIndex(currentIndex-1));

  const btnNext = document.createElement('button');
  btnNext.className='next'; btnNext.innerText='▶'; btnNext.setAttribute('aria-label','Następne');
  btnNext.addEventListener('click', ()=>showIndex(currentIndex+1));

  const meta = document.createElement('div'); meta.className='meta'; meta.innerText = `Zdjęcie ${index+1} z ${full.length}`;

  lightbox.appendChild(img);
  lightbox.appendChild(btnClose);
  lightbox.appendChild(btnPrev);
  lightbox.appendChild(btnNext);
  lightbox.appendChild(meta);

  // click outside closes
  lightbox.addEventListener('click',(e)=>{ if(e.target === lightbox) closeLightbox(); });

  document.body.appendChild(lightbox);
  // focus handling
  lastFocused = document.activeElement;
  btnClose.focus();
  // trap basic: prevent focus leaving lightbox via TAB
  document.addEventListener('focus', enforceFocus, true);
}

function enforceFocus(e){
  if(!lightbox) return;
  if(!lightbox.contains(e.target)){
    e.stopPropagation();
    lightbox.querySelector('.close')?.focus();
  }
}

function showIndex(idx){
  if(idx < 0) idx = full.length -1;
  if(idx >= full.length) idx = 0;
  currentIndex = idx;
  // update image src and meta
  const img = lightbox.querySelector('img');
  const meta = lightbox.querySelector('.meta');
  img.src = full[currentIndex] || thumbs[currentIndex];
  meta.innerText = `Zdjęcie ${currentIndex+1} z ${full.length}`;
  lightbox.setAttribute('aria-label',`Galeria — zdjęcie ${currentIndex+1}`);
}

function openLightbox(index){
  currentIndex = index;
  buildLightbox(index);
}

function closeLightbox(){
  if(!lightbox) return;
  lightbox.remove();
  lightbox = null;
  document.removeEventListener('focus', enforceFocus, true);
  lastFocused && lastFocused.focus();
}

// keyboard support
window.addEventListener('keydown',(e)=>{
  if(!lightbox) return;
  if(e.key === 'Escape') closeLightbox();
  if(e.key === 'ArrowLeft') showIndex(currentIndex-1);
  if(e.key === 'ArrowRight') showIndex(currentIndex+1);
});

// populate gallery
thumbs.forEach((src,i)=> galleryEl.appendChild(createThumb(src,i)));

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobileMenu');
if(navToggle){
  navToggle.addEventListener('click',()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){ mobileMenu.hidden = false; mobileMenu.querySelector('a')?.focus(); } else { mobileMenu.hidden = true; }
  });
}

// hide mobile menu when link clicked
document.querySelectorAll('#mobileMenu a').forEach(a=> a.addEventListener('click', ()=>{ mobileMenu.hidden = true; navToggle && navToggle.setAttribute('aria-expanded','false'); }));

// Contact form - improved validation + friendly messages
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
if(form){
  form.addEventListener('submit',async (e)=>{
    e.preventDefault();
    status.innerText = '';
    const fd = new FormData(form);
    const name = (fd.get('name')||'').toString().trim();
    const email = (fd.get('email')||'').toString().trim();
    const message = (fd.get('message')||'').toString().trim();
    if(!name){ status.innerText = 'Podaj imię i nazwisko.'; form.querySelector('#name').focus(); return; }
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){ status.innerText = 'Wprowadź poprawny email.'; form.querySelector('#email').focus(); return; }
    if(!message){ status.innerText = 'Dodaj wiadomość.'; form.querySelector('#message').focus(); return; }
    status.innerText = 'Wysyłanie...';
    // simulate network
    await new Promise(r=>setTimeout(r,900));
    status.innerText = 'Wiadomość wysłana — dziękuję!';
    form.reset();
  });
}

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.length>1){ e.preventDefault(); document.querySelector(href)?.scrollIntoView({behavior:'smooth'}); mobileMenu.hidden = true; navToggle && navToggle.setAttribute('aria-expanded','false'); }
  });
});
