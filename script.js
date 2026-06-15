const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('open');
  document.body.classList.remove('menu-open');
}

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  navigation.classList.toggle('open', !open);
  document.body.classList.toggle('menu-open', !open);
});
navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));

const carousel = document.querySelector('.carousel');
const track = carousel.querySelector('.carousel-track');
const slides = [...carousel.querySelectorAll('.wardrobe-slide')];
const dotsContainer = carousel.querySelector('.carousel-dots');
const count = carousel.querySelector('.carousel-count strong');
let currentSlide = 0;
let autoplay;
let touchStart = 0;

slides.forEach((slide, index) => {
  const dot = document.createElement('button');
  dot.type = 'button';
  dot.className = 'carousel-dot';
  dot.setAttribute('aria-label', `Show wardrobe photo ${index + 1}`);
  dot.addEventListener('click', () => { showSlide(index); restartAutoplay(); });
  dotsContainer.appendChild(dot);
});
const dots = [...dotsContainer.children];

function showSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  const gap = parseFloat(getComputedStyle(track).gap) || 0;
  track.style.transform = `translateX(-${currentSlide * (slides[0].getBoundingClientRect().width + gap)}px)`;
  slides.forEach((slide, i) => slide.classList.toggle('active', i === currentSlide));
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  count.textContent = String(currentSlide + 1).padStart(2, '0');
}

function restartAutoplay() {
  clearInterval(autoplay);
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    autoplay = setInterval(() => showSlide(currentSlide + 1), 5000);
  }
}

carousel.querySelector('.prev').addEventListener('click', () => { showSlide(currentSlide - 1); restartAutoplay(); });
carousel.querySelector('.next').addEventListener('click', () => { showSlide(currentSlide + 1); restartAutoplay(); });
carousel.addEventListener('mouseenter', () => clearInterval(autoplay));
carousel.addEventListener('mouseleave', restartAutoplay);
carousel.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') showSlide(currentSlide - 1);
  if (event.key === 'ArrowRight') showSlide(currentSlide + 1);
});
carousel.addEventListener('touchstart', (event) => { touchStart = event.touches[0].clientX; }, { passive: true });
carousel.addEventListener('touchend', (event) => {
  const distance = event.changedTouches[0].clientX - touchStart;
  if (Math.abs(distance) > 45) showSlide(currentSlide + (distance < 0 ? 1 : -1));
  restartAutoplay();
}, { passive: true });
window.addEventListener('resize', () => showSlide(currentSlide));
showSlide(0);
restartAutoplay();

document.querySelector('#quote-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  const subject = encodeURIComponent(`Free quote request from ${data.get('name')}`);
  const body = encodeURIComponent(`Name: ${data.get('name')}\nPhone: ${data.get('phone')}\n\nJob details:\n${data.get('message')}`);
  location.href = `mailto:Glassandwardroves@gmail.com?subject=${subject}&body=${body}`;
});
document.querySelector('#year').textContent = new Date().getFullYear();
