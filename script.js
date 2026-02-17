// Lightweight gallery population + lightbox + contact form stub
const galleryEl = document.getElementById('gallery');
const images = [];
for(let i=1;i<=9;i++) images.push(`assets/thumb-${i}.jpg`);

function createThumb(src, i){
  const div = document.createElement('div');
  div.className='thumb';
  const img = document.createElement('img');
  img.src = src; img.alt = `Sesja ${i}`;
  div.appendChild(img);
  div.addEventListener('click',()=>openLightbox(src));
  return div;
}

function openLightbox(src){
  const lb = document.createElement('div'); lb.className='lightbox';
  const img = document.createElement('img'); img.src=src; img.alt='Zdjęcie';
  const btn = document.createElement('button'); btn.className='close'; btn.innerText='✕';
  btn.addEventListener('click',()=>lb.remove());
  lb.appendChild(img); lb.appendChild(btn); document.body.appendChild(lb);
}

images.forEach((src,i)=> galleryEl.appendChild(createThumb(src,i+1)));

// Contact form - frontend only
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
form.addEventListener('submit',async (e)=>{
  e.preventDefault();
  status.innerText = 'Wysyłanie...';
  // TODO: connect to backend endpoint
  await new Promise(r=>setTimeout(r,900));
  status.innerText = 'Wiadomość wysłana!';
  form.reset();
});
