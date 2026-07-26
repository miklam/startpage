// ==========================================================================
// main.js - Minimalist Kanban & Command-Line Search Logic
// ==========================================================================

function populateKanban() {
    if (typeof cards === 'undefined') return;

    cards.forEach(card => {
        const boxId = `box-${card.name.toLowerCase().replace(/\s*&\s*|\s+/g, '-')}`;
        const lane = document.getElementById(boxId);
        if (!lane) return;

        const ul = lane.querySelector("ul");
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
                a.dataset.name = siteName.toLowerCase();
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

function updateGreeting() {
    const hour = new Date().getHours();
    const greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;

    let text = "Good night!";
    if (hour >= 5 && hour < 12) text = "Good morning!";
    else if (hour >= 12 && hour < 18) text = "Good afternoon!";
    else if (hour >= 18) text = "Good evening!";

    greetingEl.textContent = text;
}

/**
 * Handle Command Input (Filtering & CLI Engine Prefixes)
 */
function setupCommandInput() {
    const input = document.getElementById('command-input');
    if (!input) return;

    // Hotkey listener for '/' or 'Ctrl+K'
    document.addEventListener('keydown', (e) => {
        if (e.key === '/' && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
            input.select();
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            input.focus();
            input.select();
        }
    });

    input.addEventListener('input', () => {
        const query = input.value.trim().toLowerCase();
        filterLinks(query);
    });

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            executeCommand(input.value.trim());
        }
    });
}

/**
 * Filter links visually as user types
 */
function filterLinks(query) {
    const allLinks = document.querySelectorAll('.kanban-lane a');
    const allListItems = document.querySelectorAll('.kanban-lane li');
    
    // Clear previous selected highlights
    allLinks.forEach(link => link.classList.remove('selected'));

    if (!query || query.startsWith('g ') || query.startsWith('yt ') || query.startsWith('r ')) {
        // Reset view if input is empty or using search prefixes
        allListItems.forEach(li => li.classList.remove('hidden'));
        return;
    }

    let firstMatch = null;

    allLinks.forEach(link => {
        const name = link.dataset.name;
        const li = link.closest('li');

        if (name && name.includes(query)) {
            li.classList.remove('hidden');
            if (!firstMatch) {
                firstMatch = link;
            }
        } else if (li && !li.classList.contains('sub-category-divider')) {
            li.classList.add('hidden');
        }
    });

    // Automatically highlight first matching result
    if (firstMatch) {
        firstMatch.classList.add('selected');
    }
}

/**
 * Executes action on 'Enter' key press
 */
function executeCommand(rawQuery) {
    if (!rawQuery) return;

    // 1. Google Search Prefix: "g <query>"
    if (rawQuery.startsWith('g ')) {
        const searchTerm = rawQuery.substring(2).trim();
        window.open(`https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`, '_blank');
        return;
    }

    // 2. YouTube Search Prefix: "yt <query>"
    if (rawQuery.startsWith('yt ')) {
        const searchTerm = rawQuery.substring(3).trim();
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(searchTerm)}`, '_blank');
        return;
    }

    // 3. Reddit Subreddit Prefix: "r <subreddit>"
    if (rawQuery.startsWith('r ')) {
        const subreddit = rawQuery.substring(2).trim();
        window.open(`https://www.reddit.com/r/${encodeURIComponent(subreddit)}`, '_blank');
        return;
    }

    // 4. Fallback: Open currently selected/top-matching filtered link
    const selectedLink = document.querySelector('.kanban-lane a.selected');
    if (selectedLink) {
        window.open(selectedLink.href, '_blank');
    } else {
        // Standard Google Search fallback
        window.open(`https://www.google.com/search?q=${encodeURIComponent(rawQuery)}`, '_blank');
    }
}

// ==========================================================================
// Initializer
// ==========================================================================
function initializeApp() {
    populateKanban();
    updateGreeting();
    setupCommandInput();
}

document.addEventListener('DOMContentLoaded', initializeApp);
