// ==========================================================================
// main.js - Minimalist CLI / Kanban Startpage Logic
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    populateKanban();
    updateGreeting();
    setupCommandInput();
    startClock();
    fetchWeather();
}

/**
 * 1. Build Kanban Columns and Links from config.js
 */
function populateKanban() {
    if (typeof cards === 'undefined') return;

    cards.forEach(card => {
        const laneId = `box-${card.name.toLowerCase()}`;
        const laneEl = document.getElementById(laneId);
        if (!laneEl) return;

        const ulEl = laneEl.querySelector('ul');
        if (!ulEl) return;

        ulEl.innerHTML = ''; // Clear existing list items

        Object.entries(card.bookmarks).forEach(([label, url]) => {
            const li = document.createElement('li');

            // Handle Sub-Category Dividers (label starts/ends with --- or url is null)
            if (url === null || label.startsWith('---')) {
                li.className = 'sub-category-divider';
                li.textContent = label.replace(/^-+\s*|\s*-+$/g, ''); // Clean dashes
            } else {
                const a = document.createElement('a');
                a.href = url;
                a.textContent = label;
                li.appendChild(a);
            }

            ulEl.appendChild(li);
        });
    });
}

/**
 * 2. Time-based Greeting
 */
function updateGreeting() {
    const greetingEl = document.getElementById('greeting');
    if (!greetingEl) return;

    const hour = new Date().getHours();
    const name = typeof userName !== 'undefined' ? userName : '';
    let greetingText = 'Good day';

    if (hour >= 5 && hour < 12) {
        greetingText = 'Good morning';
    } else if (hour >= 12 && hour < 18) {
        greetingText = 'Good afternoon';
    } else if (hour >= 18 && hour < 22) {
        greetingText = 'Good evening';
    } else {
        greetingText = 'Good night';
    }

    greetingEl.textContent = name ? `${greetingText}, ${name}!` : `${greetingText}!`;
}

/**
 * 3. Live Digital Clock (HH:MM)
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
    setInterval(update, 1000);
}

/**
 * 4. Weather Widget (Open-Meteo API)
 */
async function fetchWeather() {
    const weatherEl = document.getElementById('weather-widget');
    if (!weatherEl) return;

    // Kinna / Västra Götaland coordinates
    const lat = 57.50; 
    const lon = 12.69;

    try {
        const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
        const data = await res.json();
        
        if (data && data.current_weather) {
            const temp = Math.round(data.current_weather.temperature);
            const code = data.current_weather.weathercode;
            
            let condition = "🌤️";
            if (code === 0) condition = "☀️";
            else if (code >= 1 && code <= 3) condition = "⛅";
            else if (code >= 45 && code <= 48) condition = "🌫️";
            else if (code >= 51 && code <= 67) condition = "🌧️";
            else if (code >= 71 && code <= 77) condition = "❄️";

            weatherEl.textContent = `${condition} ${temp}°C`;
        } else {
            weatherEl.textContent = "--°C";
        }
    } catch (err) {
        weatherEl.textContent = "Weather unavailable";
    }
}

/**
 * 5. Spotlight Search Input & Navigation
 */
function setupCommandInput() {
    const input = document.getElementById('command-input');
    if (!input) return;

    let selectedIndex = -1;

    // Global Hotkeys: '/' or 'Ctrl+K' / 'Cmd+K' to focus input
    document.addEventListener('keydown', (e) => {
        if ((e.key === '/' || (e.key.toLowerCase() === 'k' && (e.ctrlKey || e.metaKey))) && document.activeElement !== input) {
            e.preventDefault();
            input.focus();
            input.select();
        }
    });

    // Real-time filtering & Keyboard navigation
    input.addEventListener('input', () => {
        selectedIndex = -1;
        filterBookmarks(input.value.trim().toLowerCase());
    });

    input.addEventListener('keydown', (e) => {
        const matches = Array.from(document.querySelectorAll('.kanban-lane a')).filter(a => {
            const li = a.closest('li');
            return li && !li.classList.contains('hidden');
        });

        if (e.key === 'ArrowDown' || (e.key === 'Tab' && !e.shiftKey)) {
            e.preventDefault();
            if (matches.length > 0) {
                selectedIndex = (selectedIndex + 1) % matches.length;
                updateSelection(matches, selectedIndex);
            }
        } else if (e.key === 'ArrowUp' || (e.key === 'Tab' && e.shiftKey)) {
            e.preventDefault();
            if (matches.length > 0) {
                selectedIndex = (selectedIndex - 1 + matches.length) % matches.length;
                updateSelection(matches, selectedIndex);
            }
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && matches[selectedIndex]) {
                window.location.href = matches[selectedIndex].href;
            } else {
                handleSearch(input.value);
            }
        } else if (e.key === 'Escape') {
            input.value = '';
            filterBookmarks('');
            input.blur();
        }
    });
}

/**
 * Filter Links in Kanban Lanes
 */
function filterBookmarks(query) {
    const links = document.querySelectorAll('.kanban-lane a');

    // Check if user is typing a shortcut prefix ('g ', 'yt ', 'r ')
    const isShortcut = /^(g|yt|r)\s+/i.test(query);

    links.forEach(a => {
        const text = a.textContent.toLowerCase();
        const li = a.closest('li');
        a.classList.remove('selected', 'match-dimmed');

        if (!query) {
            li.classList.remove('hidden');
        } else if (isShortcut) {
            li.classList.add('hidden'); // Hide links when active search prefix is typed
        } else if (text.includes(query)) {
            li.classList.remove('hidden');
            a.classList.add('match-dimmed');
        } else {
            li.classList.add('hidden');
        }
    });
}

/**
 * Highlight Active Selected Link
 */
function updateSelection(matches, index) {
    matches.forEach(a => a.classList.remove('selected'));
    if (index >= 0 && matches[index]) {
        matches[index].classList.add('selected');
        matches[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
}

/**
 * Handle Search Prefixes & Default Fallback Search
 */
function handleSearch(query) {
    const trimmed = query.trim();
    if (!trimmed) return;

    const parts = trimmed.split(' ');
    const prefix = parts[0].toLowerCase();
    const prompt = parts.slice(1).join(' ');

    // 1. Gemini Search Prompt (g <prompt>)
    if (prefix === 'g') {
        const searchPrompt = prompt || trimmed;
        window.location.href = `https://gemini.google.com/app?q=${encodeURIComponent(searchPrompt)}`;
        return;
    }

    // 2. YouTube Search (yt <query>)
    if (prefix === 'yt') {
        const searchPrompt = prompt || trimmed;
        window.location.href = `https://www.youtube.com/results?search_query=${encodeURIComponent(searchPrompt)}`;
        return;
    }

    // 3. Subreddit Jump (r <subreddit>)
    if (prefix === 'r') {
        const sub = prompt || trimmed;
        window.location.href = `https://reddit.com/r/${encodeURIComponent(sub)}`;
        return;
    }

    // 4. Default Fallback -> Google Search
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(trimmed)}`;
}
