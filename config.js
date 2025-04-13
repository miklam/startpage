// Username displayed in greeting.
const userName = "Mikael"; // Changed var to const, good practice

// Cards - Updated Categories (April 13, 2025)
const cards = [
  {
    name: "Social",
    bookmarks: {
      	"Facebook": "https://facebook.com",
      	"Instagram": "https://instagram.com/?theme=dark",
      	"Reddit": "https://reddit.com",
      	"Facebook Messenger": "https://messenger.com",
      	"Google Messages": "https://messages.google.com/web/conversations",
      	"WhatsApp": "https://web.whatsapp.com"
    }
  },
  {
    name: "Streaming",
    bookmarks: {
      	"YouTube": "https://www.youtube.com/feed/subscriptions", // Note: googleusercontent links might change/break
      	"Crunchyroll": "https://crunchyroll.com",
      	"SVT Play": "https://www.svtplay.se/",
      	"Netflix": "https://www.netflix.com/browse"
      	// Add other streaming services like Netflix, HBO, etc. if needed
    }
  },
  {
    name: "Gaming",
    bookmarks: {
      	"D&D Beyond": "https://www.dndbeyond.com/campaigns/4780663",
      	"Foundry": "http://83.251.196.97:30000/join", // Note: IP addresses can change
      	"Nexus Mods": "https://www.nexusmods.com/",
      	// Add other gaming links (platforms, specific games, etc.)
    }
  },
  {
    name: "Entertainment",
    bookmarks: {
      	"Last FM": "https://www.last.fm",
      	"The StoryGraph": "https://app.thestorygraph.com/"
      	// Add other entertainment links (movie databases, music, etc.)
    }
  },
  {
    // NOTE: Use id="box-ai-tools" in index.html
    name: "AI-Tools", // Using hyphenated name for valid ID generation
    bookmarks: {
      	"Gemini": "https://gemini.google.com/app",
      	"ChatGPT": "https://chatgpt.com/"
      	// Add other AI tools
    }
  },
  {
    // NOTE: Use id="box-health-fitness" in index.html
    name: "Health-Fitness", // Using hyphenated name
    bookmarks: {
      	"Garmin Connect": "https://connect.garmin.com/modern/",
      	"Strava": "https://www.strava.com/dashboard",
      	"Smashrun": "https://smashrun.com/miklam"
      	// Add other health/fitness links
    }
  },
  {
    name: "Google",
    bookmarks: {
      	"Google Keep": "https://keep.google.com/",
      	"Google Drive": "https://drive.google.com",
      	"Google Calendar": "https://calendar.google.com/calendar/",
      	"Google Photos": "https://photos.google.com/", // Note: googleusercontent links might change/break
      	"Google Maps": "https://www.google.se/maps"
      	// Add other Google services
    }
  },
  {
    // NOTE: Use id="box-email-cloud" in index.html
    name: "Email-Cloud", // Using hyphenated name
    bookmarks: {
      	"Proton Mail": "https://mail.proton.me",
      	"Gmail": "https://mail.google.com",
      	"OneDrive": "https://onedrive.com",
      	"SimpleLogin": "https://app.simplelogin.io/dashboard/",
      	"Temp Mail": "https://temp-mail.org/en"
      	// Add other cloud storage or email services
    }
  },
  {
    name: "Finances",
    bookmarks: {
      	"Swedbank": "https://online.swedbank.se/app/ib/logga-in",
      	"Budget 2025": "https://docs.google.com/spreadsheets/d/1ysoJcr2J0Tx0bMlGVVw5fr_dCdHJiI5YBNpFZSsGIc8/edit?resourcekey=&gid=586151987#gid=586151987",
      	"Budget Input 2025": "https://forms.gle/8okiuta8zQXnFEAs5",
      	"PayPal": "https://www.paypal.com/se/home",
      	// Add other banks, investment platforms, etc.
    }
  },
  {
    name: "Services", // For Insurance, Internet, Govt, etc.
    bookmarks: {
      	"Folksam": "https://www.folksam.se/", // Insurance
      	"Vattenfall": "https://www.vattenfall.se/", // Electricity provider
      	"Mediateknik": "https://portal.mediateknik.net/authorization/index?username=&password=", // Internet provider?
      	"Försäkringskassan": "https://www.forsakringskassan.se/logga-in#/", // Social Insurance Agency
      	"Kivra": "https://accounts.kivra.com/?locale=sv", // Digital Mailbox
      	"Marks Kommun Login": "https://home2.mark.se/" // Local Govt Login
      	// Add other providers (phone, etc.) or services
    }
  },
  {
    name: "Shopping",
    bookmarks: {
      	"Prisjakt": "https://www.prisjakt.nu/",
      	"Pricerunner": "https://www.pricerunner.se/",
      	"Blocket": "https://www.blocket.se/",
      	"Tradera": "https://www.tradera.com/",
      	"Inet": "https://www.inet.se/"
      	// Add other online stores
    }
  },
  {
    name: "Utility", // Fallback / Misc Tools
    bookmarks: {
      	"GitHub": "https://github.com",
      	"Vklass": "https://auth.vklass.se/", // School platform
      	"SchoolSoft": "https://sms.schoolsoft.se/letebo/jsp/Login.jsp" // School platform
      	// Add other miscellaneous links here
    }
  }
];

// Ensure cards variable is accessible if needed by other scripts (it is by default if not in a function/module)
