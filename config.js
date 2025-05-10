// ==========================================================================
// config.js
// Configuration file for the start page.
// Defines the username and the structure of link categories (cards).
// Last updated: April 14, 2025 (based on original file comment)
// ==========================================================================

const userName = "Mikael"; // Used potentially elsewhere, though not seen in main.js [cite: 1]

const cards = [
    {
        name: "Social",
        bookmarks: {
            "Facebook": "https://facebook.com", // [cite: 2]
            "Instagram": "https://instagram.com/?theme=dark", // [cite: 2]
            "Reddit": "https://reddit.com", // [cite: 2]
            "Facebook Messenger": "https://messenger.com", // [cite: 2]
            "Google Messages": "https://messages.google.com/web/conversations", // [cite: 2]
            "WhatsApp": "https://web.whatsapp.com" // [cite: 2]
        }
    },
    {
        name: "Fun", // Combined: Streaming, Gaming, Entertainment, Health/Fitness, AI [cite: 3]
        bookmarks: {
            // --- Streaming ---
            "YouTube": "https://www.youtube.com/feed/subscriptions", // [cite: 3]
            "SVT Play": "https://www.svtplay.se/", // [cite: 3]
            "Crunchyroll": "https://crunchyroll.com", // [cite: 3]
            "Netflix": "https://www.netflix.com/browse", // [cite: 3]
            // --- Gaming ---
            "Foundry": "http://83.251.196.97:30000/join", // [cite: 3]
            "D&D Beyond": "https://www.dndbeyond.com/campaigns/4780663", // [cite: 3]
            "Nexus Mods": "https://www.nexusmods.com/", // [cite: 3]
            // --- Entertainment ---
            "Last FM": "https://www.last.fm", // [cite: 3]
            "The StoryGraph": "https://app.thestorygraph.com/", // [cite: 3]
            // --- Health/Fitness ---
            "Garmin Connect": "https://connect.garmin.com/modern/", // [cite: 3]
            "Strava": "https://www.strava.com/dashboard", // [cite: 3]
            "Smashrun": "https://smashrun.com/miklam", // [cite: 4]
            // --- AI Tools ---
            "Gemini": "https://gemini.google.com/app", // [cite: 4]
            "ChatGPT": "https://chatgpt.com/", // [cite: 4]
            "Claude": "https://claude.ai/new", // [cite: 4]
            "Mistral": "https://chat.mistral.ai/chat" // [cite: 4]
        }
    },
    {
        name: "Web-Apps", // Combined: Email/Cloud and Google Core Apps [cite: 4]
        bookmarks: {
            // --- Email/Cloud ---
            "Proton Mail": "https://mail.proton.me", // [cite: 4]
            "Gmail": "https://mail.google.com", // [cite: 4]
            "OneDrive": "https://onedrive.com", // [cite: 4]
            "SimpleLogin": "https://app.simplelogin.io/dashboard/", // [cite: 5]
            "Temp Mail": "https://temp-mail.org/en", // [cite: 5]
            // --- Google Apps ---
            "Google Calendar": "https://calendar.google.com/calendar/", // [cite: 5]
            "Google Drive": "https://drive.google.com", // [cite: 5]
            "Google Keep": "https://keep.google.com/", // [cite: 5]
            "Google Maps": "https://www.google.se/maps", // [cite: 5]
            "Google Photos": "https://photos.google.com/" // [cite: 5]
        }
    },
    {
        name: "Finances", // Kept Finances separate [cite: 5]
        bookmarks: {
            "Swedbank": "https://online.swedbank.se/app/ib/logga-in", // [cite: 5]
            "Budget 2025": "https://docs.google.com/spreadsheets/d/1ysoJcr2J0Tx0bMlGVVw5fr_dCdHJiI5YBNpFZSsGIc8/edit?resourcekey=&gid=586151987#gid=586151987", // [cite: 5]
            "Budget Input 2025": "https://forms.gle/8okiuta8zQXnFEAs5", // [cite: 6]
            "Folksam": "https://www.folksam.se/", // [cite: 6]
            "Vattenfall": "https://www.vattenfall.se/", // [cite: 6]
            "Mediateknik": "https://portal.mediateknik.net/authorization/index?username=&password=", // [cite: 6]
            "Försäkringskassan": "https://www.forsakringskassan.se/logga-in#/" // [cite: 6]
            // Note: Original comment mentioned moving some items; kept structure as found [cite: 6]
        }
    },
    {
        name: "Other", // Combined: Services, Shopping, Utility [cite: 6]
        bookmarks: {
            // --- Services ---
            "Kivra": "https://accounts.kivra.com/?locale=sv", // [cite: 6]
            "Marks Kommun Login": "https://home2.mark.se/", // [cite: 6]
            "Vklass": "https://auth.vklass.se/", // [cite: 6]
            "SchoolSoft": "https://sms.schoolsoft.se/letebo/jsp/Login.jsp", // [cite: 7]
            // --- Shopping ---
            "Prisjakt": "https://www.prisjakt.nu/", // [cite: 7]
            "Pricerunner": "https://www.pricerunner.se/", // [cite: 7]
            "Blocket": "https://www.blocket.se/", // [cite: 7]
            "Tradera": "https://www.tradera.com/", // [cite: 7]
            "Inet": "https://www.inet.se/", // [cite: 7]
            // --- Utility / Misc ---
            "GitHub": "https://github.com" // [cite: 7]
        }
    }
]; // End of cards array

// ==========================================================================
// End of config.js
// ==========================================================================
