// ==========================================================================
// main.js - Minimalist Kanban & Keyboard Navigation
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

let selectedMatchIndex = 0;

/**
 * Live Digital Clock (HH:MM)
 */
function startClock() {
    const clockEl = document.getElementById('live-clock');
    if (!clockEl) return;

    function update() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        clockEl.textContent = `${hours}:${minutes}`;
    }

    update();
    setInterval(update, 1000); // Keeps it synced smoothly every minute
}

/**
 * 2. Fetch Weather via Open-Meteo (No API key needed)
 */
async function fetchWeather() {
    const weatherEl = document.getElementById('weather-widget');
    if (!weatherEl) return;

    // Set coordinates for your location (e.g. Kinna / Gothenburg area approx: lat=57.5, lon=12.69)
    const lat = 57.50; 
    const lon = 12.69;

    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        
        if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            
            // Map basic WMO weather codes to simple icons/labels
            let condition = "🌤️";
            if (code === 0) condition = "☀️"; // Clear
            else if (code >= 1 && code <= 3) condition = "⛅"; // Partly cloudy
            else if (code >= 45 && code <= 48) condition = "🌫️"; // Fog
            else if (code >= 51 && code <= 67) condition = "🌧️"; // Rain/Drizzle
            else if (code >= 71 && code <= 77) condition = "❄️"; // Snow

            weatherEl.textContent = `${condition} ${temp}°C`;
        } else {
            weatherEl.textContent = "--°C";
        }
    } catch (err) {
        weatherEl.textContent = "Weather unavailable";
    }
}

/**
 * Handle Command Input & Keyboard Arrow/Tab Selection
 */
function setupCommandInput() {
    const input = document.getElementById('command-input');
    if (!input) return;

    // Force focus immediately on load
    setTimeout(() => {
        input.focus();
        input.select();
    }, 50);

    // Global Hotkey listener for '/' or 'Ctrl+K'
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

    // Real-time filtering on typing
    input.addEventListener('input', () => {
        selectedMatchIndex = 0; // Reset index on new input
        filterLinks(input.value.trim().toLowerCase());
    });

    // Keyboard navigation (Arrow keys & Enter)
    input.addEventListener('keydown', (e) => {
        const visibleLinks = Array.from(document.querySelectorAll('.kanban-lane a:not(.hidden-link)'));

        if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
            if (visibleLinks.length > 0) {
                e.preventDefault();
                selectedMatchIndex = (selectedMatchIndex + 1) % visibleLinks.length;
                updateSelectedHighlight(visibleLinks);
            }
        } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
            if (visibleLinks.length > 0) {
                e.preventDefault();
                selectedMatchIndex = (selectedMatchIndex - 1 + visibleLinks.length) % visibleLinks.length;
                updateSelectedHighlight(visibleLinks);
            }
        } else if (e.key === 'Enter') {
            executeCommand(input.value.trim(), visibleLinks);
        }
    });
}

/**
 * Filter links visually as user types
 */
function filterLinks(query) {
    const allLinks = document.querySelectorAll('.kanban-lane a');
    
    // Clear previous highlights
    allLinks.forEach(link => {
        link.classList.remove('selected', 'hidden-link', 'match-dimmed');
        const li = link.closest('li');
        if (li) li.classList.remove('hidden');
    });

    if (!query || query.startsWith('g ') || query.startsWith('yt ') || query.startsWith('r ')) {
        return; // Full list visible when query is empty or using search engines
    }

    const visibleLinks = [];

    allLinks.forEach(link => {
        const name = link.dataset.name;
        const li = link.closest('li');

        if (name && name.includes(query)) {
            link.classList.remove('hidden-link');
            visibleLinks.push(link);
        } else if (li && !li.classList.contains('sub-category-divider')) {
            link.classList.add('hidden-link');
            li.classList.add('hidden');
        }
    });

    updateSelectedHighlight(visibleLinks);
}

/**
 * Updates selected state across matching search results cleanly
 */
function updateSelectedHighlight(visibleLinks) {
    const allLinks = document.querySelectorAll('.kanban-lane a');
    allLinks.forEach(link => link.classList.remove('selected', 'match-dimmed'));

    if (visibleLinks.length === 0) return;

    // Boundary check
    if (selectedMatchIndex >= visibleLinks.length) selectedMatchIndex = 0;

    visibleLinks.forEach((link, index) => {
        if (index === selectedMatchIndex) {
            link.classList.add('selected'); // Active focused match
        } else {
            link.classList.add('match-dimmed'); // Secondary matches styled uniformly
        }
    });
}

/**
 * Executes action on 'Enter' key press
 */
function executeCommand(rawQuery, visibleLinks) {
    if (!rawQuery) return;

    if (rawQuery.startsWith('g ')) {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(rawQuery.substring(2).trim())}`, '_blank');
        return;
    }

    if (rawQuery.startsWith('yt ')) {
        window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(rawQuery.substring(3).trim())}`, '_blank');
        return;
    }

    if (rawQuery.startsWith('r ')) {
        window.open(`https://www.reddit.com/r/${encodeURIComponent(rawQuery.substring(2).trim())}`, '_blank');
        return;
    }

    // Open active selected link
    const selectedLink = visibleLinks[selectedMatchIndex] || visibleLinks[0];
    if (selectedLink) {
        window.open(selectedLink.href, '_blank');
    } else {
        window.open(`https://www.google.com/search?q=${encodeURIComponent(rawQuery)}`, '_blank');
    }
}

function initializeApp() {
    populateKanban();
    updateGreeting();
    setupCommandInput();
}

document.addEventListener('DOMContentLoaded', initializeApp);
