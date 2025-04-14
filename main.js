// main.js - Including Mobile Tab Functionality (April 14, 2025)

// --- Initialization Function ---
// Ensures the DOM is loaded before we manipulate it.
document.addEventListener('DOMContentLoaded', () => {

    // --- Load Links into Boxes ---
    populateLinkBoxes();

    // --- Initialize Date, Time, and Greeting ---
    updateDateTime(); // Call once immediately
    setInterval(updateDateTime, 1000); // Update time every second

    // --- Add Scrollbar Visibility Listeners ---
    // Applies to link boxes, might be less needed now but kept.
    const scrollableElements = document.querySelectorAll('.link-box');
    scrollableElements.forEach(el => {
         el.addEventListener("scroll", showScrollbar, true);
    });

    // --- Mobile Tab Switching Logic ---
    const tabContainer = document.querySelector('.tabs-mobile');
    const linkBoxes = document.querySelectorAll('.content-grid .link-box');
    const tabButtons = document.querySelectorAll('.tabs-mobile .tab-button');

    if (tabContainer && linkBoxes.length > 0 && tabButtons.length > 0) { // Check elements exist
        tabContainer.addEventListener('click', (event) => {
            const clickedButton = event.target.closest('.tab-button'); // Handle clicks inside button

            if (!clickedButton) return; // Exit if click wasn't on a button

            const targetId = clickedButton.dataset.target; // Get the target box ID (e.g., 'box-social')

            // Remove 'active' from all buttons and boxes
            tabButtons.forEach(button => button.classList.remove('active'));
            linkBoxes.forEach(box => box.classList.remove('active'));

            // Add 'active' to the clicked button
            clickedButton.classList.add('active');

            // Add 'active' to the target box
            const targetBox = document.getElementById(targetId);
            if (targetBox) {
                targetBox.classList.add('active');
            } else {
                console.error('Target box not found for ID:', targetId);
            }
        });
    } else {
        // Optional: Log if mobile tab elements aren't found, helps debugging
        // console.log("Mobile tab elements not found, skipping tab listener setup.");
    }
    // --- End Mobile Tab Switching Logic ---

    // Note: Username population removed earlier
    // Note: Dark mode toggle removed earlier (assuming single theme)

}); // --- End DOMContentLoaded ---


// --- Populate Link Boxes ---
function populateLinkBoxes() {
    // Assumes 'cards' is defined globally in config.js
    if (typeof cards === 'undefined') {
        console.error("Link configuration ('cards' variable) is missing.");
        return;
    }

    cards.forEach(card => {
        // Construct the ID selector (e.g., "Social" -> "box-social", "Web-Apps" -> "box-web-apps")
        // Make sure names in config.js result in IDs matching index.html
        const boxId = `box-${card.name.toLowerCase().replace(/\\s*&\\s*|\\s+/g, '-')}`; // Handle spaces or hyphens in name
        const linkBox = document.getElementById(boxId);

        if (linkBox) {
            const ul = linkBox.querySelector("ul");
            if (ul) {
                ul.innerHTML = ''; // Clear any existing content

                // Check if bookmarks exist for this card
                if (card.bookmarks && typeof card.bookmarks === 'object') {
                    const sites = Object.keys(card.bookmarks);
                    sites.forEach(siteName => {
                        const siteUrl = card.bookmarks[siteName];
                        const li = document.createElement("li");

                        // Check for subheading/divider marker from previous suggestion (optional)
                        if (siteUrl === null && siteName.startsWith('---') && siteName.endsWith('---')) {
                           // If you added dividers in config.js, style them here
                           li.classList.add("sub-category-divider");
                           li.textContent = siteName.substring(3, siteName.length - 3).trim();
                        } else if (siteUrl !== null) { // Ensure it's a valid link
                            // Regular link
                            const a = document.createElement("a");
                            a.innerHTML = siteName;
                            a.href = siteUrl;
                            a.target = "_blank";
                            li.appendChild(a);
                        }

                        // Append the list item if it has content or is a divider
                        if (li.childNodes.length > 0 || li.classList.contains('sub-category-divider')) {
                            ul.appendChild(li);
                        }
                    });
                } else {
                    console.warn(`No bookmarks found for category "${card.name}" in config.js`);
                }
            } else {
                console.error(`Could not find <ul> inside #${boxId}`);
            }
        } else {
            // This error is expected if config.js has categories not present in index.html
            // console.warn(`Could not find link box with ID #${boxId} for category "${card.name}"`);
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

    // Time
    if (timeEl) {
        try {
            // Using 'sv-SE' locale for Swedish time format
            timeEl.textContent = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        } catch (e) { // Fallback
            timeEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        }
    }

    // Date
    if (dateEl) {
         try {
             // Using 'sv-SE' locale for Swedish date format
            dateEl.textContent = now.toLocaleDateString('sv-SE', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
         } catch (e) { // Fallback
             dateEl.textContent = now.toDateString();
         }
    }

    // Greeting (Using current time: Monday 4:44 PM CEST)
    if (greetingEl) {
        let greetingText = "Hello!";
        if (hour < 5) { greetingText = "Good night!"; }
        else if (hour < 12) { greetingText = "Good morning!"; }
        else if (hour < 18) { greetingText = "Good afternoon!"; } // Should show this now
        else { greetingText = "Good evening!"; }
        greetingEl.textContent = greetingText;
    }
}


// --- Scrollbar Visibility ---
function showScrollbar(e) {
    if (!e.target.classList.contains("visible-scrollbar")) {
        e.target.classList.add("visible-scrollbar");
        if (e.target._scrollbarTimeout) { clearTimeout(e.target._scrollbarTimeout); }
        e.target._scrollbarTimeout = setTimeout(() => {
            e.target.classList.remove("visible-scrollbar");
        }, 1500);
    }
}
