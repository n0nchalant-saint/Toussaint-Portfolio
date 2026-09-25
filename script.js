const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

menuToggle?.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav-menu a').forEach((link) => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const revealItems = document.querySelectorAll('.reveal');
document.querySelectorAll('section').forEach((section) => {
  section.querySelectorAll('.reveal').forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${Math.min(index * 90, 360)}ms`);
  });
});

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealItems.forEach((item) => revealObserver.observe(item));

document.querySelector('#year').textContent = new Date().getFullYear();

const form = document.querySelector('#contact-form');
const status = document.querySelector('#form-status');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const data = new FormData(form);
  const inquiry = `Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\nProject details:\n${data.get('message')}`;

  try {
    await navigator.clipboard.writeText(inquiry);
    status.textContent = 'Your inquiry was copied. You can now paste it into your preferred email or messaging app.';
    form.reset();
  } catch {
    status.textContent = 'Could not access the clipboard. Your details remain in the form so you can copy and send them manually.';
  }
});
