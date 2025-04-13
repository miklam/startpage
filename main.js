// GetStarted - A simple responsive Startpage
// Author: MrAlpha786 (github.con/MrAlpha786)
// Modified based on user request.

// --- Initialization Function ---
// Ensures the DOM is loaded before we manipulate it.
document.addEventListener('DOMContentLoaded', () => {
    // --- Display Username ---
    // Assumes 'userName' is defined globally, likely in config.js
    if (typeof userName !== 'undefined' && document.getElementById("username")) {
        document.getElementById("username").innerHTML = userName;
    }

    // --- Load Links into Boxes ---
    populateLinkBoxes();

    // --- Initialize Date, Time, and Greeting ---
    updateDateTime(); // Call once immediately
    setInterval(updateDateTime, 1000); // Update time every second, greeting less critical but updates too

    // --- Dark Mode Check ---
    // Check if dark-mode preference is stored
    // NOTE: This assumes your CSS uses a .dark-mode class on the body.
    // If you're *only* using Catppuccin dark theme now, you might not need this toggle.
    // Consider if the toggleMode function is still needed.
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }

    // --- Add Scrollbar Visibility Listeners ---
    // Kept this feature, but might be less necessary with the new layout.
    const scrollableElements = document.querySelectorAll('.link-box'); // Apply to link boxes
    scrollableElements.forEach(el => {
         el.addEventListener("scroll", showScrollbar, true);
    });
});

// --- Populate Link Boxes ---
function populateLinkBoxes() {
    // Assumes 'cards' is defined globally, likely in config.js
    // Assumes the order in 'cards' matches the order of '.link-box' divs in index.html
    // OR that the boxes have IDs like id="box-social", id="box-fun" etc. corresponding to card names.

    if (typeof cards === 'undefined') {
        console.error("Link configuration ('cards' variable) is missing.");
        return;
    }

    // Select all link boxes. It's safer if they have specific IDs or data-attributes.
    // Using IDs like 'box-social', 'box-fun' based on the HTML provided earlier.
    cards.forEach(card => {
        // Construct the ID selector, assuming card names match IDs (e.g., "Social" -> "#box-social")
        // Make sure the names in config.js match these IDs (case-sensitive).
        const boxId = `box-${card.name.toLowerCase()}`;
        const linkBox = document.getElementById(boxId);

        if (linkBox) {
            const ul = linkBox.querySelector("ul");
            if (ul) {
                ul.innerHTML = ''; // Clear any existing placeholder content

                const sites = Object.keys(card.bookmarks);
                sites.forEach(siteName => {
                    const siteUrl = card.bookmarks[siteName];

                    const li = document.createElement("li");
                    const a = document.createElement("a");

                    a.innerHTML = siteName;
                    a.href = siteUrl;
                    a.target = "_blank"; // Open links in new tab

                    li.appendChild(a);
                    ul.appendChild(li);
                });
            } else {
                console.error(`Could not find <ul> inside #${boxId}`);
            }
        } else {
            console.error(`Could not find link box with ID #${boxId} for category "${card.name}"`);
        }
    });
}


// --- Update Date, Time, and Greeting ---
function updateDateTime() {
    const now = new Date();
    const hour = now.getHours();
    const timeEl = document.getElementById('time');
    const dateEl = document.getElementById('date');
    const greetingEl = document.getElementById('greeting');

    // --- Time ---
    if (timeEl) {
        // Using Sweden locale (sv-SE) for formatting might be good.
        // Or let the browser decide based on its settings using undefined locale.
        try {
            timeEl.textContent = now.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' });
             // timeEl.textContent = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' }); // Example for Swedish format
        } catch (e) { // Fallback for older browsers
            timeEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
    }

    // --- Date ---
    if (dateEl) {
         try {
            dateEl.textContent = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
             // dateEl.textContent = now.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }); // Example for Swedish format
         } catch (e) { // Fallback
             dateEl.textContent = now.toDateString();
         }
    }

    // --- Greeting ---
    if (greetingEl) {
        let greetingText = "Hello!";
        // Current time reference: Sunday ~9:09 PM
        if (hour < 5) { // Approx 12am to 5am
            greetingText = "Good night!";
        } else if (hour < 12) { // Approx 5am to 12pm
            greetingText = "Good morning!";
        } else if (hour < 18) { // Approx 12pm to 6pm
            greetingText = "Good afternoon!";
        } else { // Approx 6pm to 12am
            greetingText = "Good evening!";
        }
        greetingEl.textContent = greetingText;
    }
}


// --- Scrollbar Visibility ---
// Show Scrollbar on scrolling within designated elements
function showScrollbar(e) {
    if (!e.target.classList.contains("visible-scrollbar")) {
        e.target.classList.add("visible-scrollbar");
        // Hide Scrollbar after 1.5s of no scrolling in that element
        // Clear existing timer if scroll happens again
        if (e.target._scrollbarTimeout) {
            clearTimeout(e.target._scrollbarTimeout);
        }
        e.target._scrollbarTimeout = setTimeout(() => {
            e.target.classList.remove("visible-scrollbar");
        }, 1500);
    }
}
// NOTE: The old implementation applied this globally. Now it's applied to .link-box elements via the DOMContentLoaded listener.


// --- Dark Mode Toggle ---
// Toggle dark-mode class on body (if CSS is set up for it)
// Consider removing if you *only* want the Catppuccin dark theme.
function toggleMode() {
    document.body.classList.toggle("dark-mode"); // Assumes .dark-mode class exists in CSS

    // Save mode preference to local storage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}


// --- Footer Info Toggle ---
// Hide / Show DIV for footer info
function buttonClicked() {
    const hideDiv = document.getElementById('hideDiv');
    if (hideDiv) {
        // Simple toggle display style
        hideDiv.style.display = (hideDiv.style.display === 'none' || hideDiv.style.display === '') ? 'block' : 'none';
    }
    // NOTE: The original used jQuery toggle: $("#hideDiv").toggle();
    // This is a vanilla JS equivalent. If you are still loading jQuery for some reason,
    // the original toggle would work, but it's best to avoid jQuery if only used for this.
}


// --- REMOVED CODE ---
// - InputBoxReset (search suggestions)
// - Old tab switching logic
// - Old Date/Time interval and formatting (replaced by updateDateTime)
// - Old Greeting logic (replaced by updateDateTime)
