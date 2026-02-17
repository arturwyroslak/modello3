// Gallery population + accessible lightbox + contact form
const galleryEl = document.getElementById('gallery');
const images = [];
for(let i=1;i<=9;i++) images.push(`assets/thumb-${i}.jpg`);

function createThumb(src, i){
  const div = document.createElement('div');
  div.className='thumb';
  div.setAttribute('tabindex','0');
  const img = document.createElement('img');
  img.src = src; img.alt = `Sesja ${i}`;
  div.appendChild(img);
  div.addEventListener('click',()=>openLightbox(src,i));
  div.addEventListener('keydown',(e)=>{ if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLightbox(src,i); } });
  return div;
}

function openLightbox(src, index){
  const lb = document.createElement('div'); lb.className='lightbox'; lb.setAttribute('role','dialog'); lb.setAttribute('aria-modal','true'); lb.setAttribute('aria-label',`Galeria — zdjęcie ${index}`);
  const img = document.createElement('img'); img.src=src; img.alt=`Zdjęcie sesji ${index}`;
  const btn = document.createElement('button'); btn.className='close'; btn.innerText='✕'; btn.setAttribute('aria-label','Zamknij');
  btn.addEventListener('click',()=>{ lb.remove(); lastFocused && lastFocused.focus(); });
  lb.addEventListener('click',(e)=>{ if(e.target === lb) { lb.remove(); lastFocused && lastFocused.focus(); } });
  lb.appendChild(img); lb.appendChild(btn);
  const meta = document.createElement('div'); meta.className='meta'; meta.innerText = `Zdjęcie ${index} z galerii`;
  lb.appendChild(meta);
  document.body.appendChild(lb);
  lastFocused = document.activeElement;
  btn.focus();
}

let lastFocused = null;
images.forEach((src,i)=> galleryEl.appendChild(createThumb(src,i+1)));

// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobileMenu');
if(navToggle){
  navToggle.addEventListener('click',()=>{
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    if(!expanded){ mobileMenu.hidden = false; } else { mobileMenu.hidden = true; }
  });
}

// Contact form - frontend only with validation
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit',async (e)=>{
  e.preventDefault();
  status.innerText = '';
  const formData = new FormData(form);
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');
  if(!name || !email || !message){ status.innerText = 'Uzupełnij wymagane pola.'; return; }
  status.innerText = 'Wysyłanie...';
  await new Promise(r=>setTimeout(r,900));
  status.innerText = 'Wiadomość wysłana — dziękuję!';
  form.reset();
});

// Smooth scroll for internal links
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const href = a.getAttribute('href');
    if(href.length>1){ e.preventDefault(); document.querySelector(href)?.scrollIntoView({behavior:'smooth'}); mobileMenu.hidden = true; navToggle && navToggle.setAttribute('aria-expanded','false'); }
  });
});
