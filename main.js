// ==========================================================================
// main.js - Native Horizontal Scroll, Tab Sync & Chevron Bounds Control
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
 * Sync active tab highlighting & toggle left/right chevron visibility bounds
 */
function syncTabsOnScroll() {
    const contentGrid = document.querySelector('.content-grid');
    const tabContainer = document.querySelector('.tabs-mobile');
    const tabButtons = document.querySelectorAll('.tab-button');
    const linkBoxes = document.querySelectorAll('.link-box');

    if (!contentGrid || !linkBoxes.length) return;

    const cardWidth = contentGrid.clientWidth;
    if (cardWidth === 0) return;

    const activeIndex = Math.round(contentGrid.scrollLeft / cardWidth);

    if (linkBoxes[activeIndex]) {
        const activeId = linkBoxes[activeIndex].id;

        tabButtons.forEach(button => {
            const isMatch = button.dataset.target === activeId;
            button.classList.toggle('active', isMatch);
        });

        // Hide left arrow on first item, hide right arrow on last item
        if (tabContainer) {
            tabContainer.classList.toggle('at-start', activeIndex === 0);
            tabContainer.classList.toggle('at-end', activeIndex === linkBoxes.length - 1);
        }
    }
}

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
        // Initial check on page load
        syncTabsOnScroll();
    }
}

document.addEventListener('DOMContentLoaded', initializeApp);
