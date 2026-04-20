// =============================================
//  Ado — Multimodal Remix
//  javascript.js
// =============================================


// ---------- NAVBAR: highlight active link on scroll ----------
const sections  = document.querySelectorAll('section[id], div[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function updateActiveLink() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);
updateActiveLink(); // Run once on load


// ---------- MOBILE MENU TOGGLE ----------
const navToggle = document.getElementById('navToggle');
const navLinksList = document.querySelector('.nav-links');

if (navToggle && navLinksList) {
    navToggle.addEventListener('click', () => {
        navLinksList.classList.toggle('open');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksList.classList.remove('open');
        });
    });
}


// ---------- SLIDESHOW ----------
const slides     = document.querySelectorAll('.slide');
const dots       = document.querySelectorAll('.sdot');
const prevBtn    = document.getElementById('prevSlide');
const nextBtn    = document.getElementById('nextSlide');
let currentSlide = 0;

function goToSlide(index) {
    // Remove active from all slides and dots
    slides.forEach(s  => s.classList.remove('active'));
    dots.forEach(d    => d.classList.remove('active'));

    // Wrap around
    currentSlide = (index + slides.length) % slides.length;

    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
}

if (prevBtn && nextBtn && slides.length > 0) {
    prevBtn.addEventListener('click', () => goToSlide(currentSlide - 1));
    nextBtn.addEventListener('click', () => goToSlide(currentSlide + 1));

    // Clicking dots jumps to that slide
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i));
    });

    // Auto-advance every 5 seconds
    setInterval(() => goToSlide(currentSlide + 1), 5000);
}




// ---------- MUSIC GRID: EXPAND / COLLAPSE ----------
(function () {
    const wrapper   = document.getElementById('musicGridWrapper');
    const btn       = document.getElementById('musicExpandBtn');
    const btnLabel  = btn  ? btn.querySelector('.btn-label') : null;
    const grid      = wrapper ? wrapper.querySelector('.music-grid') : null;

    if (!wrapper || !btn || !grid) return;

    // Calculate the exact pixel height of exactly 2 rows of cards.
    // We measure one card's rendered height, then multiply by 2 and add one gap.
    function getTwoRowHeight() {
        const cards = grid.querySelectorAll('.song-card');
        if (cards.length === 0) return 560; // fallback

        // Find which row the 1st card is on vs which row the 3rd card is on
        // (at 5 cols, row 2 starts at index 5; at 3 cols it starts at index 3, etc.)
        // Instead of guessing columns, use offsetTop to detect when the row changes.
        const firstTop = cards[0].offsetTop;
        let rowCount   = 0;
        let lastRowTop = firstTop;
        let cutoffBottom = 0;

        for (let i = 0; i < cards.length; i++) {
            const cardTop = cards[i].offsetTop;
            if (cardTop > lastRowTop + 4) {        // new row detected (4px tolerance)
                rowCount++;
                lastRowTop = cardTop;
                if (rowCount === 2) {
                    // We want the bottom edge of the 2nd row's cards
                    cutoffBottom = cards[i].offsetTop + cards[i].offsetHeight;
                    break;
                }
            }
            if (rowCount < 2) {
                // Keep updating cutoff as we walk through rows 1 and 2
                cutoffBottom = cards[i].offsetTop + cards[i].offsetHeight;
            }
        }

        // If there are only 1 or 2 rows total, everything fits — hide the button
        if (rowCount < 2) {
            btn.parentElement.style.display = 'none';
            wrapper.classList.remove('collapsed');
            wrapper.querySelector('.music-fade-overlay').style.display = 'none';
            return null;
        }

        // Add a small gap so the 2nd row isn't cut at exactly the card edge
        return cutoffBottom + 16;
    }

    function applyCollapsedHeight() {
        const h = getTwoRowHeight();
        if (h === null) return; // already fully visible, no collapse needed
        wrapper.style.setProperty('--music-two-row-height', h + 'px');
    }

    // Run on load and on resize (columns may change responsively)
    applyCollapsedHeight();
    window.addEventListener('resize', applyCollapsedHeight);

    // Toggle expand / collapse on button click
    let isExpanded = false;

    btn.addEventListener('click', function () {
        isExpanded = !isExpanded;

        if (isExpanded) {
            wrapper.classList.remove('collapsed');
            wrapper.classList.add('expanded');
            btn.classList.add('open');
            btnLabel.textContent = 'Show Less';
        } else {
            wrapper.classList.remove('expanded');
            wrapper.classList.add('collapsed');
            btn.classList.remove('open');
            btnLabel.textContent = 'Show All Songs';

            // Scroll back up to the music section so collapsed state makes sense
            const musicSection = document.getElementById('music');
            if (musicSection) {
                setTimeout(() => {
                    musicSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 100);
            }
        }
    });
})();

// (Most modern browsers handle this via CSS scroll-behavior: smooth,
//  but this adds a fallback for browsers that don't support it.)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
