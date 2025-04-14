// ==========================================================================
// main.js
// Handles link population, date/time updates, mobile tab switching, and scrollbar visibility.
// Last updated: April 14, 2025
// ==========================================================================

// --- Global Variables & Constants ---
// (Assuming 'cards' is loaded globally from config.js before this script runs)

// ==========================================================================
// Core Functions
// ==========================================================================

/**
 * Populates link boxes based on the global 'cards' configuration object.
 * Assumes 'cards' is defined in config.js and loaded beforehand.
 */
function populateLinkBoxes() {
    if (typeof cards === 'undefined') {
        console.error("Link configuration ('cards' variable) is missing or not loaded before main.js.");
        return; // Exit if config is missing
    }

    cards.forEach(card => {
        // Derive box ID from card name (e.g., "Web-Apps" -> "box-web-apps")
        const boxId = `box-${card.name.toLowerCase().replace(/\s*&\s*|\s+/g, '-')}`; // Handles spaces, ampersands, hyphens
        const linkBox = document.getElementById(boxId);

        if (!linkBox) {
            // This is expected if config.js has categories not present in index.html
            // console.warn(`HTML element with ID #${boxId} not found for category "${card.name}".`);
            return; // Skip this card if corresponding HTML element doesn't exist
        }

        const ul = linkBox.querySelector("ul");
        if (!ul) {
            console.error(`Could not find <ul> element inside #${boxId}.`);
            return; // Skip if list element is missing
        }

        ul.innerHTML = ''; // Clear existing list items

        // Check if the card has bookmarks defined
        if (!card.bookmarks || typeof card.bookmarks !== 'object') {
            console.warn(`No bookmarks found or bookmarks format is incorrect for category "${card.name}" in config.js`);
            return; // Skip if no bookmarks or invalid format
        }

        // Populate list with bookmarks
        Object.entries(card.bookmarks).forEach(([siteName, siteUrl]) => {
            const li = document.createElement("li");

            // Check for divider format: '--- Divider Text ---': null
            if (siteUrl === null && siteName.startsWith('---') && siteName.endsWith('---')) {
                // Style dividers if needed via this class in CSS
                li.classList.add("sub-category-divider");
                li.textContent = siteName.substring(3, siteName.length - 3).trim(); // Extract text
            } else if (siteUrl !== null) { // Regular link
                const a = document.createElement("a");
                a.textContent = siteName; // Use textContent for plain text
                a.href = siteUrl;
                a.target = "_blank"; // Open links in new tab
                a.rel = "noopener noreferrer"; // Security best practice for target="_blank"
                li.appendChild(a);
            }

            // Append the list item only if it's a valid link or a divider
            if (li.hasChildNodes() || li.classList.contains('sub-category-divider')) {
                ul.appendChild(li);
            }
        });
    });
} // [cite: 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]

/**
 * Updates the time, date, and greeting elements on the page.
 */
function updateDateTime() {
    const now = new Date();
    const hour = now.getHours(); // [cite: 27]

    const timeEl = document.getElementById('time'); // [cite: 27]
    const dateEl = document.getElementById('date'); // [cite: 27]
    const greetingEl = document.getElementById('greeting'); // [cite: 27]

    // --- Update Time ---
    if (timeEl) {
        try {
            // Using sv-SE locale for HH:MM:SS format
            timeEl.textContent = now.toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit', second: '2-digit' }); // [cite: 29]
        } catch (e) {
            console.error("Error formatting time:", e);
            // Basic fallback format
            timeEl.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`; // [cite: 30]
        }
    } // [cite: 28]

    // --- Update Date ---
    if (dateEl) {
        try {
            // Using en-GB locale for "Weekday, DD Month YYYY" format
            const dateOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            dateEl.textContent = now.toLocaleDateString('en-GB', dateOptions); // [cite: 31]
        } catch (e) {
            console.error("Error formatting date:", e);
            // Basic fallback format
            dateEl.textContent = now.toDateString(); // [cite: 32]
        }
    } // [cite: 30]

    // --- Update Greeting ---
    if (greetingEl) {
        let greetingText = "Hello!"; // Default
        if (hour < 5) { greetingText = "Good night!"; } // [cite: 33]
        else if (hour < 12) { greetingText = "Good morning!"; } // [cite: 34]
        else if (hour < 18) { greetingText = "Good afternoon!"; } // [cite: 35]
        else { greetingText = "Good evening!"; } // [cite: 36]
        greetingEl.textContent = greetingText; // [cite: 37]
    } // [cite: 32]
} // [cite: 26]

/**
 * Temporarily adds a class to show a custom scrollbar on scroll, then hides it.
 * @param {Event} e - The scroll event object.
 */
function handleScrollbarVisibility(e) {
    const targetElement = e.target;
    if (!targetElement.classList.contains("visible-scrollbar")) {
        targetElement.classList.add("visible-scrollbar"); // [cite: 38]

        // Clear existing timeout if user scrolls again quickly
        if (targetElement._scrollbarTimeout) {
            clearTimeout(targetElement._scrollbarTimeout); // [cite: 38]
        }

        // Set a timeout to remove the class after a delay
        targetElement._scrollbarTimeout = setTimeout(() => {
            targetElement.classList.remove("visible-scrollbar");
        }, 1500); // [cite: 39]
    }
} // [cite: 37]

/**
 * Handles clicks within the mobile tab container to switch active tab and content box.
 * @param {Event} event - The click event object.
 */
function handleMobileTabClick(event) {
    const clickedButton = event.target.closest('.tab-button'); // Ensure click is on button or child [cite: 4]

    if (!clickedButton) {
        return; // Exit if the click was not on a tab button [cite: 5]
    }

    const targetId = clickedButton.dataset.target; // Get target box ID from data attribute [cite: 6]
    if (!targetId) {
        console.error("Clicked tab button is missing 'data-target' attribute.");
        return;
    }

    const tabContainer = clickedButton.closest('.tabs-mobile');
    if (!tabContainer) return; // Should not happen if initial check passed, but safe check

    const allTabButtons = tabContainer.querySelectorAll('.tab-button');
    const contentGrid = document.querySelector('.content-grid'); // Adjust selector if needed
    if (!contentGrid) {
        console.error("Cannot find '.content-grid' element.");
        return;
    }
    const allLinkBoxes = contentGrid.querySelectorAll('.link-box');

    // Remove 'active' class from all tabs and boxes
    allTabButtons.forEach(button => button.classList.remove('active')); // [cite: 7]
    allLinkBoxes.forEach(box => box.classList.remove('active')); // [cite: 7]

    // Add 'active' class to the clicked tab
    clickedButton.classList.add('active'); // [cite: 8]

    // Add 'active' class to the corresponding content box
    const targetBox = document.getElementById(targetId); // [cite: 9]
    if (targetBox) {
        targetBox.classList.add('active'); // [cite: 10]
    } else {
        console.error(`Target content box with ID #${targetId} not found.`); // [cite: 11]
    }
}

// ==========================================================================
// Initialization and Event Listeners Setup
// ==========================================================================

/**
 * Initializes the application after the DOM is fully loaded.
 */
function initializeApp() {
    // --- Populate Links ---
    populateLinkBoxes(); // [cite: 2]

    // --- Initialize and Update Date/Time/Greeting ---
    updateDateTime(); // Call immediately on load [cite: 2]
    setInterval(updateDateTime, 1000); // Update every second [cite: 2]

    // --- Setup Scrollbar Visibility Listeners ---
    const scrollableElements = document.querySelectorAll('.link-box'); // [cite: 2]
    scrollableElements.forEach(element => {
        // Using 'true' for capture phase, though often not necessary here
        element.addEventListener("scroll", handleScrollbarVisibility, true); // [cite: 2]
    });

    // --- Setup Mobile Tab Switching Logic ---
    const tabContainer = document.querySelector('.tabs-mobile'); // [cite: 3]
    if (tabContainer) {
        // Check if corresponding elements exist before adding listener
        const linkBoxes = document.querySelectorAll('.content-grid .link-box'); // [cite: 3]
        const tabButtons = tabContainer.querySelectorAll('.tab-button'); // [cite: 3]

        if (linkBoxes.length > 0 && tabButtons.length > 0) {
            tabContainer.addEventListener('click', handleMobileTabClick); // [cite: 4]
        } else {
             console.log("Mobile tab buttons or link boxes not found, skipping tab listener setup."); // [cite: 12]
        }
    } else {
        // console.log("Mobile tab container '.tabs-mobile' not found."); // [cite: 12]
    }

    // --- Other Initializations (Removed/Commented Out) ---
    // Note: Username population removed earlier
    // Note: Dark mode toggle removed earlier (assuming single theme) [cite: 12]
}

// --- Wait for DOM Load before Initializing ---
// Ensures elements exist before scripts try to access them.
document.addEventListener('DOMContentLoaded', initializeApp); // [cite: 2]

// ==========================================================================
// End of main.js
// ==========================================================================
