/* =========================================================
   Muhammad Adnan — Portfolio
   Projects are rendered from assets/data/projects.json,
   which is managed through admin.html.
   ========================================================= */
(function () {
  'use strict';

  const DATA_URL = 'assets/data/projects.json';
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const esc = (value) =>
    String(value ?? '').replace(/[&<>"']/g, (c) => (
      { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
    ));

  /* ---------------------------------------------------------
     Theme
     --------------------------------------------------------- */
  const Theme = {
    init() {
      const stored = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.apply(stored || (prefersDark ? 'dark' : 'light'));

      const btn = $('#theme-toggle');
      if (btn) {
        btn.addEventListener('click', () => {
          const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
          this.apply(next);
          localStorage.setItem('theme', next);
        });
      }
    },
    apply(mode) {
      document.documentElement.dataset.theme = mode;
      const btn = $('#theme-toggle');
      if (btn) btn.setAttribute('aria-label', mode === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
  };

  /* ---------------------------------------------------------
     Navigation: mobile menu, scroll state, scroll spy
     --------------------------------------------------------- */
  const Nav = {
    init() {
      const header = $('.site-header');
      const nav = $('#nav');
      const toggle = $('#nav-toggle');

      if (toggle && nav) {
        toggle.addEventListener('click', () => {
          const open = nav.classList.toggle('is-open');
          toggle.setAttribute('aria-expanded', String(open));
        });
        nav.addEventListener('click', (e) => {
          if (e.target.closest('a')) {
            nav.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', 'false');
          }
        });
      }

      const onScroll = () => {
        if (header) header.classList.toggle('is-scrolled', window.scrollY > 8);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      const links = $$('.nav a[href^="#"]');
      const sections = links
        .map((a) => document.getElementById(a.getAttribute('href').slice(1)))
        .filter(Boolean);

      if (sections.length && 'IntersectionObserver' in window) {
        const spy = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            links.forEach((a) =>
              a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id)
            );
          });
        }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
        sections.forEach((s) => spy.observe(s));
      }
    }
  };

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  const Reveal = {
    observer: null,
    init() {
      if (!('IntersectionObserver' in window)) {
        $$('.reveal').forEach((el) => el.classList.add('is-visible'));
        return;
      }
      this.observer = new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        });
      }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
      this.scan();
    },
    scan() {
      if (!this.observer) return;
      $$('.reveal:not(.is-visible)').forEach((el) => this.observer.observe(el));
    }
  };

  /* ---------------------------------------------------------
     Work: grid, filters, detail modal
     --------------------------------------------------------- */
  const Work = {
    projects: [],
    gallery: { images: [], index: 0, project: null },
    lastFocused: null,

    async init() {
      const grid = $('#work-grid');
      if (!grid) return;

      try {
        const res = await fetch(DATA_URL, { cache: 'no-cache' });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const data = await res.json();
        this.projects = Array.isArray(data) ? data : (data.projects || []);
      } catch (err) {
        console.error('Could not load projects:', err);
        grid.innerHTML =
          '<div class="empty-state">Projects could not be loaded.<br>' +
          'If you opened this file directly, serve it over HTTP instead — ' +
          '<code>python -m http.server</code> — then visit <code>localhost:8000</code>.</div>';
        return;
      }

      this.render();
      this.bindModal();
      this.openFromHash();
    },

    /* A project can be linked directly: index.html#project-farm-to-home */
    openFromHash() {
      const hash = decodeURIComponent(window.location.hash || '');
      if (!hash.startsWith('#project-')) return;
      const id = hash.slice('#project-'.length);
      const match = this.projects.find((p) => p.id === id);
      if (match) this.open(match);
    },

    render() {
      const grid = $('#work-grid');

      const count = $('#work-count');
      if (count) {
        count.textContent = `${this.projects.length} project${this.projects.length === 1 ? '' : 's'}`;
      }

      if (!this.projects.length) {
        grid.innerHTML = '<div class="empty-state">No projects added yet.</div>';
        return;
      }

      grid.innerHTML = this.projects.map((p, i) => this.cardHTML(p, i)).join('');

      $$('.card', grid).forEach((card) => {
        card.addEventListener('click', (e) => {
          if (e.target.closest('a')) return; // let live/repo links through
          this.open(this.projects[Number(card.dataset.index)]);
        });
      });

      Reveal.scan();
    },

    cardHTML(p, index) {
      const images = (p.images || []).filter(Boolean);
      const cover = images[0];
      const featured = Boolean(p.featured) && index === 0;

      const media = cover
        ? `<img src="${esc(cover)}" alt="${esc(p.title)} screenshot" loading="lazy" decoding="async">`
        : `<div class="empty">No screenshot yet</div>`;

      const statusBadge = p.featured
        ? '<span class="badge accent">Featured</span>'
        : (p.status && p.status !== 'live' ? `<span class="badge">${esc(p.status)}</span>` : '');

      const shots = images.length > 1
        ? `<span class="shot-count">${images.length} shots</span>` : '';

      const arrow =
        '<svg class="link-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" ' +
        'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        '<path d="M7 17 17 7"/><path d="M8.5 7H17v8.5"/></svg>';

      const links = [
        p.live ? `<a href="${esc(p.live)}" target="_blank" rel="noopener noreferrer">Live site ${arrow}</a>` : '',
        p.repo ? `<a href="${esc(p.repo)}" target="_blank" rel="noopener noreferrer">Code ${arrow}</a>` : ''
      ].filter(Boolean).join('');

      return `
        <article class="card reveal${featured ? ' is-featured' : ''}" data-index="${index}" tabindex="0" role="button"
                 aria-label="View details for ${esc(p.title)}">
          <div class="card-media">${media}${statusBadge}${shots}</div>
          <div class="card-body">
            <div class="card-title-row">
              <h3>${esc(p.title)}</h3>
            </div>
            <p>${esc(p.tagline || p.description || '')}</p>
            ${links ? `<div class="card-links">${links}</div>` : ''}
          </div>
        </article>`;
    },

    /* -------- modal -------- */
    bindModal() {
      const modal = $('#project-modal');
      if (!modal) return;

      $('#modal-close').addEventListener('click', () => this.close());
      $('#modal-backdrop').addEventListener('click', () => this.close());
      $('#gallery-prev').addEventListener('click', () => this.step(-1));
      $('#gallery-next').addEventListener('click', () => this.step(1));

      document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('is-open')) return;
        if (e.key === 'Escape') this.close();
        if (e.key === 'ArrowLeft') this.step(-1);
        if (e.key === 'ArrowRight') this.step(1);
      });

      // Keyboard activation of cards
      document.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const card = document.activeElement && document.activeElement.closest('.card');
        if (!card) return;
        e.preventDefault();
        this.open(this.filtered[Number(card.dataset.index)]);
      });
    },

    open(project) {
      if (!project) return;
      const modal = $('#project-modal');
      this.lastFocused = document.activeElement;
      this.gallery.project = project;
      this.gallery.images = (project.images || []).filter(Boolean);
      this.gallery.index = 0;

      $('#modal-title').textContent = project.title || '';
      $('#modal-tagline').textContent = project.tagline || '';
      $('#modal-description').textContent =
        project.description || 'No description added yet.';

      const meta = [
        project.role || '',
        project.status ? project.status.toUpperCase() : ''
      ].filter(Boolean);
      $('#modal-meta').innerHTML = meta.map((m) => `<span>${esc(m)}</span>`).join('');

      const highlights = (project.highlights || []).filter(Boolean);
      const hl = $('#modal-highlights');
      hl.innerHTML = highlights.map((h) => `<li>${esc(h)}</li>`).join('');
      hl.hidden = !highlights.length;

      const live = $('#modal-live');
      const repo = $('#modal-repo');
      live.href = project.live || '#';
      live.hidden = !project.live;
      repo.href = project.repo || '#';
      repo.hidden = !project.repo;
      $('#modal-foot').hidden = !project.live && !project.repo;

      this.renderGallery();

      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      $('#modal-close').focus();

      if (project.id) {
        history.replaceState(null, '', '#project-' + encodeURIComponent(project.id));
      }
    },

    renderGallery() {
      const { images, index } = this.gallery;
      const wrap = $('#gallery');
      const img = $('#gallery-img');

      if (!images.length) {
        wrap.hidden = true;
        return;
      }
      wrap.hidden = false;
      img.src = images[index];
      img.alt = `${this.gallery.project.title} screenshot ${index + 1} of ${images.length}`;

      const multi = images.length > 1;
      $('#gallery-prev').hidden = !multi;
      $('#gallery-next').hidden = !multi;

      const dots = $('#gallery-dots');
      dots.hidden = !multi;
      dots.innerHTML = images
        .map((_, i) => `<button type="button" class="${i === index ? 'is-active' : ''}" aria-label="Screenshot ${i + 1}"></button>`)
        .join('');
      $$('button', dots).forEach((b, i) =>
        b.addEventListener('click', () => { this.gallery.index = i; this.renderGallery(); })
      );
    },

    step(delta) {
      const total = this.gallery.images.length;
      if (total < 2) return;
      this.gallery.index = (this.gallery.index + delta + total) % total;
      this.renderGallery();
    },

    close() {
      const modal = $('#project-modal');
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (window.location.hash.startsWith('#project-')) {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
      if (this.lastFocused) this.lastFocused.focus();
    }
  };

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', () => {
    Theme.init();
    Nav.init();
    Reveal.init();
    Work.init();

    const year = $('#year');
    if (year) year.textContent = new Date().getFullYear();
  });

  // Theme must apply before paint to avoid a flash — handled inline in index.html too.
  Theme.apply(
    localStorage.getItem('theme') ||
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  );
})();
