// ==========================================================================
// main.js - Native Horizontal Scroll & Tab Sync
// ==========================================================================

function populateLinkBoxes() {
    if (typeof cards === 'undefined') return;

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
 * Sync active tab highlighting based on current scroll position
 */
function syncTabsOnScroll() {
    const contentGrid = document.querySelector('.content-grid');
    const tabButtons = document.querySelectorAll('.tab-button');
    const linkBoxes = document.querySelectorAll('.link-box');

    if (!contentGrid || !linkBoxes.length) return;

    // Calculate index based on horizontal scroll position
    const cardWidth = contentGrid.clientWidth;
    if (cardWidth === 0) return;

    const activeIndex = Math.round(contentGrid.scrollLeft / cardWidth);

    if (linkBoxes[activeIndex]) {
        const activeId = linkBoxes[activeIndex].id;

        tabButtons.forEach(button => {
            const isMatch = button.dataset.target === activeId;
            button.classList.toggle('active', isMatch);
            if (isMatch) {
                button.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        });
    }
}

/**
 * Scroll to target box when tapping top tab button
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

function initializeApp() {
    populateLinkBoxes();
    updateDateTime();
    setInterval(updateDateTime, 1000);

    const tabContainer = document.querySelector('.tabs-mobile');
    if (tabContainer) {
        tabContainer.addEventListener('click', handleMobileTabClick);
    }

    const contentGrid = document.querySelector('.content-grid');
    if (contentGrid) {
        contentGrid.addEventListener('scroll', syncTabsOnScroll, { passive: true });
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
