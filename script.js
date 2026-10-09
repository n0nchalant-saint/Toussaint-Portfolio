const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = [...document.querySelectorAll('[data-nav-link]')];
const sectionLinks = [...document.querySelectorAll('[data-section-link]')];
let navGlideTarget = null;

const moveNavGlide = (link = navMenu?.querySelector('[aria-current]')) => {
  const glide = navMenu?.querySelector('.nav-glide');
  if (!glide || !link) {
    glide?.style.setProperty('--nav-glide-opacity', '0');
    return;
  }

  const menuBounds = navMenu.getBoundingClientRect();
  const linkBounds = link.getBoundingClientRect();
  glide.style.setProperty('--nav-glide-x', `${linkBounds.left - menuBounds.left - navMenu.clientLeft}px`);
  glide.style.setProperty('--nav-glide-y', `${linkBounds.top - menuBounds.top - navMenu.clientTop}px`);
  glide.style.setProperty('--nav-glide-width', `${linkBounds.width}px`);
  glide.style.setProperty('--nav-glide-height', `${linkBounds.height}px`);
  glide.style.setProperty('--nav-glide-opacity', '1');
};

navMenu?.addEventListener('pointerover', (event) => {
  const link = event.target.closest('a[data-section-link]');
  if (!link || !navMenu.contains(link)) return;
  navGlideTarget = link;
  moveNavGlide(link);
});

navMenu?.addEventListener('pointerleave', () => {
  navGlideTarget = null;
  moveNavGlide();
});

navMenu?.addEventListener('focusin', (event) => {
  const link = event.target.closest('a[data-section-link]');
  if (!link || !navMenu.contains(link)) return;
  navGlideTarget = link;
  moveNavGlide(link);
});

navMenu?.addEventListener('focusout', (event) => {
  if (event.relatedTarget && navMenu.contains(event.relatedTarget)) return;
  navGlideTarget = null;
  moveNavGlide();
});

const setMenu = (isOpen) => {
  if (!menuToggle || !navMenu) return;

  navMenu.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
};

menuToggle?.addEventListener('click', () => {
  setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') setMenu(false);
});

document.addEventListener('click', (event) => {
  if (!navMenu?.classList.contains('is-open')) return;
  if (!navMenu.contains(event.target) && !menuToggle?.contains(event.target)) setMenu(false);
});

const updateActiveSection = () => {
  const activePosition = window.scrollY + Math.min(240, window.innerHeight * 0.35);
  const sections = sectionLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean)
    .sort((first, second) => first.getBoundingClientRect().top - second.getBoundingClientRect().top);
  let activeSection = sections[0];

  sections.forEach((section) => {
    if (section.getBoundingClientRect().top + window.scrollY <= activePosition) {
      activeSection = section;
    }
  });

  sectionLinks.forEach((link) => {
    const isActive = activeSection && link.getAttribute('href') === `#${activeSection.id}`;
    if (isActive) {
      link.setAttribute('aria-current', activeSection.id === 'top' ? 'page' : 'location');
    } else {
      link.removeAttribute('aria-current');
    }
  });

  moveNavGlide(navGlideTarget || navMenu?.querySelector('[aria-current]'));
};

let activeSectionFrame = 0;
window.addEventListener('scroll', () => {
  if (activeSectionFrame) return;
  activeSectionFrame = window.requestAnimationFrame(() => {
    updateActiveSection();
    activeSectionFrame = 0;
  });
}, { passive: true });
window.addEventListener('resize', updateActiveSection);
updateActiveSection();

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  revealItems.forEach((item, index) => {
    item.style.setProperty('--reveal-delay', String(Math.min(index * 90, 360)) + 'ms');
  });

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

const currentYear = String(new Date().getFullYear());
document.querySelectorAll('#year').forEach((element) => {
  element.textContent = currentYear;
});

const contactForm = document.querySelector('#contact-form');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = String(formData.get('name') || '').trim();
  const email = String(formData.get('email') || '').trim();
  const message = String(formData.get('message') || '').trim();
  const recipient = contactForm.dataset.recipient;
  const status = document.querySelector('#form-status');

  if (!recipient || !status) {
    throw new Error('Contact form is missing its recipient or status element.');
  }

  const subject = `Project inquiry from ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\nProject details:\n${message}`;
  window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Your email app is opening with your message ready to send.';
  status.classList.remove('is-error');
  status.classList.add('is-ready');
});
