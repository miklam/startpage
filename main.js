// ==========================================================================
// main.js - Direct Tap & Touch Swipe Implementation
// ==========================================================================

// --- Global Variables ---
let currentCategoryIndex = 0;
const categoryIds = ['box-social', 'box-fun', 'box-web-apps', 'box-finances', 'box-other'];

/**
 * Populates link boxes based on the 'cards' object in config.js
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

            if (siteUrl === null && siteName.startsWith('---') && siteName.endsWith('---')) {
                li.classList.add("sub-category-divider");
                li.textContent = siteName.substring(3, siteName.length - 3).trim();
            } else if (siteUrl !== null) {
                const a = document.createElement("a");
                a.textContent = siteName;
                a.href = siteUrl;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                li.appendChild(a);
            }

            if (li.hasChildNodes() || li.classList.contains('sub-category-divider')) {
                ul.appendChild(li);
            }
        });
    });
}

/**
 * Updates greeting based on current time
 */
function updateDateTime() {
    const now = new Date();
    const hour = now.getHours();
    const greetingEl = document.getElementById('greeting');

    if (greetingEl) {
        let greetingText = "Hello!";
        if (hour < 5) greetingText = "Good night!";
        else if (hour < 12) greetingText = "Good morning!";
        else if (hour < 18) greetingText = "Good afternoon!";
        else greetingText = "Good evening!";
        
        greetingEl.textContent = greetingText;
    }
}

/**
 * Switches the active tab and display box by array index
 */
function switchCategoryIndex(index) {
    if (index < 0 || index >= categoryIds.length) return;

    currentCategoryIndex = index;
    const targetId = categoryIds[currentCategoryIndex];

    const tabButtons = document.querySelectorAll('.tab-button');
    const linkBoxes = document.querySelectorAll('.link-box');

    // Update Tab Buttons
    tabButtons.forEach(button => {
        const isMatch = button.dataset.target === targetId;
        button.classList.toggle('active', isMatch);
        if (isMatch) {
            button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    });

    // Update Content Boxes
    linkBoxes.forEach(box => {
        box.classList.toggle('active', box.id === targetId);
    });
}

/**
 * Handles explicit tab button clicks
 */
function handleMobileTabClick(event) {
    const clickedButton = event.target.closest('.tab-button');
    if (!clickedButton) return;

    const targetId = clickedButton.dataset.target;
    const index = categoryIds.indexOf(targetId);

    if (index !== -1) {
        switchCategoryIndex(index);
    }
}

/**
 * Sets up horizontal touch gesture listeners across the content area
 */
function setupTouchSwipe() {
    const contentGrid = document.querySelector('.content-grid');
    if (!contentGrid) return;

    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 50; // minimum swipe distance in pixels

    contentGrid.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    contentGrid.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
    }, { passive: true });

    function handleSwipeGesture() {
        const distance = touchEndX - touchStartX;

        // Swiped Left -> Next Category
        if (distance < -swipeThreshold) {
            if (currentCategoryIndex < categoryIds.length - 1) {
                switchCategoryIndex(currentCategoryIndex + 1);
            }
        }
        // Swiped Right -> Previous Category
        else if (distance > swipeThreshold) {
            if (currentCategoryIndex > 0) {
                switchCategoryIndex(currentCategoryIndex - 1);
            }
        }
    }
}

// ==========================================================================
// Initialization
// ==========================================================================
function initializeApp() {
    populateLinkBoxes();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Setup Tab Clicks
    const tabContainer = document.querySelector('.tabs-mobile');
    if (tabContainer) {
        tabContainer.addEventListener('click', handleMobileTabClick);
    }

    // Setup Touch Gestures
    setupTouchSwipe();

    // Default to first category
    switchCategoryIndex(0);
}

document.addEventListener('DOMContentLoaded', initializeApp);
