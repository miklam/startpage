// ==========================================================================
// main.js
// Handles link population, greeting updates, mobile touch navigation & page dots.
// ==========================================================================

/**
 * Populates link boxes based on the global 'cards' configuration object in config.js.
 */
function populateLinkBoxes() {
    if (typeof cards === 'undefined') {
        console.error("Link configuration ('cards' variable) is missing or not loaded before main.js.");
        return;
    }

    cards.forEach(card => {
        const boxId = `box-${card.name.toLowerCase().replace(/\s*&\s*|\s+/g, '-')}`;
        const linkBox = document.getElementById(boxId);

        if (!linkBox) return;

        const ul = linkBox.querySelector("ul");
        if (!ul) return;

        ul.innerHTML = '';

        if (!card.bookmarks || typeof card.bookmarks !== 'object') return;

        Object.entries(card.bookmarks).forEach(([siteName, siteUrl]) => {
            const li = document.createElement("li");

            // Handle divider format: '--- Divider Text ---': null
            if (siteUrl === null && siteName.startsWith('---') && siteName.endsWith('---')) {
                li.classList.add("sub-category-divider");
                li.textContent = siteName.substring(3, siteName.length - 3).trim();
            } else if (siteUrl !== null) { // Standard Bookmark Link
                const a = document.createElement("a");
                a.textContent = siteName;
                a.href = siteUrl;
                a.target = "_blank";
                a.rel = "noopener noreferrer"; // Security best practice
                li.appendChild(a);
            }

            if (li.hasChildNodes() || li.classList.contains('sub-category-divider')) {
                ul.appendChild(li);
            }
        });
    });
}

/**
 * Updates the time-based greeting element on the page.
 */
function updateDateTime() {
    const now = new Date();
    const hour = now.getHours();
    const greetingEl = document.getElementById('greeting');

    if (greetingEl) {
        let greetingText = "Hello!";

        if (hour < 5) {
            greetingText = "Good night!";
        } else if (hour < 12) {
            greetingText = "Good morning!";
        } else if (hour < 18) {
            greetingText = "Good afternoon!";
        } else {
            greetingText = "Good evening!";
        }
        greetingEl.textContent = greetingText;
    }
}

/**
 * Syncs active tab title highlighting and page indicator dots based on horizontal scroll position.
 */
function syncTabsOnScroll() {
    const contentGrid = document.querySelector('.content-grid');
    const tabButtons = document.querySelectorAll('.tab-button');
    const linkBoxes = document.querySelectorAll('.link-box');
    const dots = document.querySelectorAll('.dot');

    if (!contentGrid || !linkBoxes.length) return;

    const cardWidth = contentGrid.clientWidth;
    if (cardWidth === 0) return;

    // Calculate active category index from scroll position
    const activeIndex = Math.round(contentGrid.scrollLeft / cardWidth);

    if (linkBoxes[activeIndex]) {
        const activeId = linkBoxes[activeIndex].id;

        // Update active tab button text
        tabButtons.forEach(button => {
            const isMatch = button.dataset.target === activeId;
            button.classList.toggle('active', isMatch);
            button.setAttribute('aria-selected', isMatch ? 'true' : 'false');
        });

        // Update active page dot indicator
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === activeIndex);
        });
    }
}

/**
 * Handles explicit tab clicks on desktop/tablet to scroll to category
 */
function handleMobileTabClick(event) {
    const clickedButton = event.target.closest('.tab-button');
    if (!clickedButton) return;

    const targetId = clickedButton.dataset.target;
    const targetBox = document.getElementById(targetId);
    
    if (targetBox) {
        targetBox.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
}

// ==========================================================================
// Initialization
// ==========================================================================

function initializeApp() {
    populateLinkBoxes();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Tab Clicks Listener
    const tabContainer = document.querySelector('.tabs-mobile');
    if (tabContainer) {
        tabContainer.addEventListener('click', handleMobileTabClick);
    }

    // Scroll Sync Listener (Mobile Gestures)
    const contentGrid = document.querySelector('.content-grid');
    if (contentGrid) {
        contentGrid.addEventListener('scroll', syncTabsOnScroll, { passive: true });
        syncTabsOnScroll(); // Run initially on load
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);

// ==========================================================================
// End of main.js
// ==========================================================================
