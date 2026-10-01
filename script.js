const track = document.getElementById('track');
const cards = [...track.querySelectorAll('.card')];
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');

let current = 0;

function update() {
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const step = cards[0].offsetWidth + gap;

  track.style.transform = `translateX(${-current * step}px)`;

  cards.forEach((card, i) => card.classList.toggle('active', i === current));

  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === cards.length - 1;
}

function go(direction) {
  const next = current + direction;
  if (next < 0 || next >= cards.length) return;
  current = next;
  update();
}

prevBtn.addEventListener('click', () => go(-1));
nextBtn.addEventListener('click', () => go(1));

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') go(1);
  if (e.key === 'ArrowLeft') go(-1);
  if (e.key === 'Escape') closeLightbox();
});

// click a faded card to bring it into focus
cards.forEach((card, i) => {
  card.addEventListener('click', () => {
    if (i !== current) { current = i; update(); }
  });
});

// touch swipe
let startX = 0;
track.addEventListener('touchstart', (e) => { startX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', (e) => {
  const diff = startX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1);
});

window.addEventListener('resize', update);

// ---------- Lightbox ----------
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
}

cards.forEach((card) => {
  card.querySelector('.expand').addEventListener('click', (e) => {
    e.stopPropagation();
    const img = card.querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
  });
});

document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

update();



// ---------- Sticky navbar + mobile sidebar ----------
// Paste this at the very bottom of your script.js (after update();)

const navbar = document.querySelector('.navbar');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const menuToggle = document.getElementById('menu-toggle');
const sidebarClose = document.getElementById('sidebar-close');

function setMenu(open) {
  sidebar.classList.toggle('open', open);
  overlay.classList.toggle('open', open);
  document.body.classList.toggle('no-scroll', open);
  menuToggle.setAttribute('aria-expanded', String(open));
  sidebar.setAttribute('aria-hidden', String(!open));
}

menuToggle.addEventListener('click', () => setMenu(true));
sidebarClose.addEventListener('click', () => setMenu(false));
overlay.addEventListener('click', () => setMenu(false));
sidebar.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setMenu(false);
});

// close the sidebar if the screen grows to desktop size
window.addEventListener('resize', () => {
  if (window.innerWidth > 900) setMenu(false);
});

// shrink the navbar a little once the page is scrolled
function onScroll() {
  navbar.classList.toggle('scrolled', window.scrollY > 10);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();



// ---------- Portfolio: show all on mobile ----------
const projectsBtn = document.querySelector('.btn-projects');
const portfolioGrid = document.querySelector('.portfolio-grid');

projectsBtn.addEventListener('click', (e) => {
  if (window.innerWidth > 800) return; // desktop: normal link behavior
  e.preventDefault();
  const open = portfolioGrid.classList.toggle('show-all');
  projectsBtn.textContent = open ? '👆 Show less' : '👀 See all projects';
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 800) {
    portfolioGrid.classList.remove('show-all');
    projectsBtn.textContent = '👀 See all projects';
  }
});
