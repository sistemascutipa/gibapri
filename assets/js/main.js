(function () {
  'use strict';

  const navToggle = document.querySelector('.mobile-nav-toggle');
  const nav = document.querySelector('#navmenu');
  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(open));
      navToggle.innerHTML = open ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });
    nav.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        nav.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.innerHTML = '<i class="bi bi-list"></i>';
      });
    });
  }

  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const dots = Array.from(document.querySelectorAll('.slider-dots button'));
  let current = 0;
  let timer;
  function showSlide(index) {
    if (!slides.length) return;
    current = (index + slides.length) % slides.length;
    slides.forEach(function (slide, i) { slide.classList.toggle('is-active', i === current); });
    dots.forEach(function (dot, i) { dot.classList.toggle('is-active', i === current); });
  }
  function startSlider() { if (slides.length > 1) timer = window.setInterval(function () { showSlide(current + 1); }, 6500); }
  function resetSlider() { window.clearInterval(timer); startSlider(); }
  const previous = document.querySelector('.slider-prev');
  const next = document.querySelector('.slider-next');
  if (previous) previous.addEventListener('click', function () { showSlide(current - 1); resetSlider(); });
  if (next) next.addEventListener('click', function () { showSlide(current + 1); resetSlider(); });
  dots.forEach(function (dot, i) { dot.addEventListener('click', function () { showSlide(i); resetSlider(); }); });
  startSlider();

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(function (item) { observer.observe(item); });

  document.querySelectorAll('[data-year]').forEach(function (item) { item.textContent = new Date().getFullYear(); });

  document.querySelectorAll('.wa-form').forEach(function (form) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const business = String(data.get('business') || '').trim();
      const message = String(data.get('message') || '').trim();
      if (!name || !email || !message) {
        const status = form.querySelector('.form-status');
        if (status) status.textContent = 'Completa los campos requeridos antes de continuar.';
        return;
      }
      const title = form.dataset.formTitle || 'Consulta comercial';
      const text = `${title}%0A%0ANombre o empresa: ${encodeURIComponent(name)}%0ACorreo: ${encodeURIComponent(email)}${business ? `%0ATipo de negocio: ${encodeURIComponent(business)}` : ''}%0AMensaje: ${encodeURIComponent(message)}`;
      const url = `https://wa.me/51971942477?text=${text}`;
      window.open(url, '_blank', 'noopener');
      const status = form.querySelector('.form-status');
      if (status) status.textContent = 'Se abrió WhatsApp con tu solicitud lista para enviar.';
      form.reset();
    });
  });
})();
