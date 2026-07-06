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
    
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-button');
    if (themeBtn) {
        themeBtn.addEventListener('click', function() {
            document.body.classList.toggle('light-mode');
            document.documentElement.classList.toggle('light-mode');
            const icon = this.querySelector('i');
            if (document.body.classList.contains('light-mode')) {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
        });
    }
});