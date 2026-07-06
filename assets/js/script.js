// --- 1. CONFIGURATION ---
const CSV_URL = 'assets/projects.csv';

// --- 2. CSV PARSER ---
function parseCSV(csvText) {
    const rows = [];
    let currentRow = [];
    let currentCell = '';
    let inQuotes = false;

    for (let i = 0; i < csvText.length; i++) {
        const char = csvText[i];
        const nextChar = csvText[i + 1];

        if (char === '"') {
            if (inQuotes && nextChar === '"') {
                currentCell += '"';
                i++;
            } else {
                inQuotes = !inQuotes;
            }
        } else if (char === ',' && !inQuotes) {
            currentRow.push(currentCell.trim());
            currentCell = '';
        } else if ((char === '\r' || char === '\n') && !inQuotes) {
            if (currentCell || currentRow.length > 0) {
                currentRow.push(currentCell.trim());
                rows.push(currentRow);
            }
            currentRow = [];
            currentCell = '';
            if (char === '\r' && nextChar === '\n') i++;
        } else {
            currentCell += char;
        }
    }
    if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        rows.push(currentRow);
    }
    return rows;
}

// --- 3. MAIN FETCH FUNCTION ---
async function fetchProjects() {
    const slidesContainer = document.getElementById('project-slides');
    
    try {
        const response = await fetch(CSV_URL);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.text();
        const rows = parseCSV(data);
        const projects = rows.slice(1);
        
        let slidesHtml = '';

        projects.forEach((row) => {
            if (row.length < 6) return;
            const images = row[5] ? row[5].split(';') : [];
            
            images.forEach((img) => {
                const cleanPath = img.trim();
                if (cleanPath) {
                    slidesHtml += `<div class="swiper-slide w-full aspect-video max-h-[600px] max-w-4xl rounded-2xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105"><img src="${cleanPath}" loading="lazy" alt="Project Image" class="w-full h-full object-cover"></div>`;
                }
            });
        });
        
        slidesContainer.innerHTML = slidesHtml;

        // Initialize Swiper
        new Swiper('.projectSwiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            loop: true,
            speed: 800,
            coverflowEffect: {
                rotate: 0,
                stretch: 80,
                depth: 200,
                modifier: 1,
                slideShadows: false,
            },
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
        });

    } catch (error) {
        console.error('Error fetching projects:', error);
        slidesContainer.innerHTML = '<div class="swiper-slide text-center text-red-500 flex items-center justify-center">Failed to load projects.</div>';
    }
}

// --- 4. INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    
    // Fetch and display projects
    fetchProjects();

    // Input field focus effects
    document.querySelectorAll('.input-field input, .input-field textarea').forEach(input => {
        input.addEventListener('focus', function() { this.parentElement.classList.add('focused'); });
        input.addEventListener('blur', function() { if (!this.value) this.parentElement.classList.remove('focused'); });
    });
    
    // Mobile menu toggle
    window.toggleMenu = function() {
        document.getElementById('nav-links').classList.toggle('active');
        document.querySelector('.hamburger').classList.toggle('active');
    }
    
    // Close menu when clicking a link (mobile)
    window.closeMenuOnClick = function() {
        if (window.innerWidth < 768) {
            document.getElementById('nav-links').classList.remove('active');
            document.querySelector('.hamburger').classList.remove('active');
        }
    }
    
    // Active nav link based on scroll (scroll spy)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function updateActiveNav() {
        const scrollPos = window.scrollY + 100;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');
            
            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveNav);
    updateActiveNav();
    
    // Theme toggle (with persistence)
    const themeBtn = document.getElementById('theme-toggle-button');

    function applyTheme(isLight) {
        document.body.classList.toggle('light-mode', isLight);
        document.documentElement.classList.toggle('light-mode', isLight);
        if (themeBtn) {
            const icon = themeBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-sun', isLight);
                icon.classList.toggle('fa-moon', !isLight);
            }
        }
    }

    // Restore saved preference
    try {
        if (localStorage.getItem('theme') === 'light') applyTheme(true);
    } catch (e) { /* storage unavailable */ }

    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            const isLight = !document.body.classList.contains('light-mode');
            applyTheme(isLight);
            try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) {}
        });
    }

    // Scroll progress bar
    const progress = document.getElementById('scroll-progress');
    // Back to top button
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function onScrollUi() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        if (progress) progress.style.width = pct + '%';
        if (backToTop) backToTop.classList.toggle('show', scrollTop > 400);
    }
    window.addEventListener('scroll', onScrollUi, { passive: true });
    onScrollUi();

    // Scroll reveal via IntersectionObserver
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const revealObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        revealEls.forEach(el => revealObserver.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('visible'));
    }

    // Animated stat counters
    const counters = document.querySelectorAll('[data-count]');
    if ('IntersectionObserver' in window && counters.length) {
        const countObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-count'), 10) || 0;
                const suffix = el.getAttribute('data-suffix') || '';
                const duration = 1400;
                const start = performance.now();
                function tick(now) {
                    const p = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - p, 3);
                    el.textContent = Math.round(target * eased) + suffix;
                    if (p < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
                obs.unobserve(el);
            });
        }, { threshold: 0.5 });
        counters.forEach(c => countObserver.observe(c));
    }

    // Role typewriter effect
    const roleEl = document.getElementById('role-typer');
    if (roleEl && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        const roles = ['Software Engineer', '.NET Developer', 'Angular Developer', 'Full-Stack Developer'];
        let roleIdx = 0, charIdx = 0, deleting = false;
        function typeRole() {
            const current = roles[roleIdx];
            if (deleting) {
                charIdx--;
            } else {
                charIdx++;
            }
            roleEl.textContent = current.substring(0, charIdx);
            let delay = deleting ? 45 : 90;
            if (!deleting && charIdx === current.length) {
                delay = 1600; deleting = true;
            } else if (deleting && charIdx === 0) {
                deleting = false; roleIdx = (roleIdx + 1) % roles.length; delay = 400;
            }
            setTimeout(typeRole, delay);
        }
        setTimeout(typeRole, 1200);
    }
});