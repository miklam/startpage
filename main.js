// ==========================================================================
// main.js
// Handles link population, date/time updates, mobile tab swiping, and swipe synchronization.
// ==========================================================================

// ==========================================================================
// Core Functions
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
        // Derive box ID from card name (e.g., "Web-Apps" -> "box-web-apps")
        const boxId = `box-${card.name.toLowerCase().replace(/\s*&\s*|\s+/g, '-')}`;
        const linkBox = document.getElementById(boxId);

        if (!linkBox) {
            return; // Skip if corresponding HTML element doesn't exist
        }

        const ul = linkBox.querySelector("ul");
        if (!ul) {
            console.error(`Could not find <ul> element inside #${boxId}.`);
            return;
        }

        ul.innerHTML = ''; // Clear existing list items

        if (!card.bookmarks || typeof card.bookmarks !== 'object') {
            console.warn(`No bookmarks found or format incorrect for category "${card.name}"`);
            return;
        }

        // Populate list with bookmarks
        Object.entries(card.bookmarks).forEach(([siteName, siteUrl]) => {
            const li = document.createElement("li");

            // Check for divider format: '--- Divider Text ---': null
            if (siteUrl === null && siteName.startsWith('---') && siteName.endsWith('---')) {
                li.classList.add("sub-category-divider");
                li.textContent = siteName.substring(3, siteName.length - 3).trim();
            } else if (siteUrl !== null) { // Regular link
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
 * Updates the greeting element on the page based on time of day.
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
 * Handles clicks on the top mobile tab bar to scroll directly to the selected card.
 * @param {Event} event - The click event object.
 */
function handleMobileTabClick(event) {
    const clickedButton = event.target.closest('.tab-button');
    if (!clickedButton) return;

    const targetId = clickedButton.dataset.target;
    const targetBox = document.getElementById(targetId);
    
    if (targetBox) {
        // Smoothly scroll the content grid container to the target card
        targetBox.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
}

/**
 * Sets up an IntersectionObserver so that physically swiping left/right across cards 
 * automatically highlights and scrolls to the matching tab button at the top.
 */
function setupSwipeObserver() {
    const contentGrid = document.querySelector('.content-grid');
    const linkBoxes = document.querySelectorAll('.link-box');
    const tabButtons = document.querySelectorAll('.tab-button');

    if (!contentGrid || !linkBoxes.length) return;

    const observerOptions = {
        root: contentGrid,
        threshold: 0.6 // Card must be 60% visible to trigger active state switch
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const activeId = entry.target.id;

                // Sync the tab button highlighting and scroll it into view if needed
                tabButtons.forEach(button => {
                    if (button.dataset.target === activeId) {
                        button.classList.add('active');
                        button.setAttribute('aria-selected', 'true');
                        button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
                    } else {
                        button.classList.remove('active');
                        button.setAttribute('aria-selected', 'false');
                    }
                });

                // Toggle active state class on boxes
                linkBoxes.forEach(box => box.classList.toggle('active', box.id === activeId));
            }
        });
    }, observerOptions);

    linkBoxes.forEach(box => observer.observe(box));
}

// ==========================================================================
// Initialization
// ==========================================================================

function initializeApp() {
    // Populate Links from config.js
    populateLinkBoxes();

    // Update greeting initially & setup interval
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Mobile tab click setup
    const tabContainer = document.querySelector('.tabs-mobile');
    if (tabContainer) {
        tabContainer.addEventListener('click', handleMobileTabClick);
    }

    // Touch swipe observer setup
    setupSwipeObserver();
}

// Run initialization after DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// ==========================================================================
// End of main.js
// ==========================================================================
