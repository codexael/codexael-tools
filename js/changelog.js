// Single source of truth for Toolstack's release history and the welcome / "what's new" popup.
// To ship a release: append one entry to CHANGELOG below.

const CHANGELOG = [
    {
        version: "1.0",
        date: "2026-10-15",
        items: [
            { category: "Formatters", title: "JSON Formatter", desc: "Beautify & validate JSON instantly.", link: "json_formatter.html", icon: "bi-filetype-json" },
            { category: "Formatters", title: "XML Formatter", desc: "Beautify & validate XML instantly.", link: "xml_formatter.html", icon: "bi-filetype-xml" },
            { category: "Formatters", title: "HTML Formatter & Viewer", desc: "Format, beautify and preview HTML content.", link: "html_formatter.html", icon: "bi-filetype-html" },
            { category: "Formatters", title: "Query Formatter", desc: "Format PostgreSQL, SQL Server, MySQL, SQLite & N1QL queries, fill parameters & list tables.", link: "query_formatter.html", icon: "bi-filetype-sql" },

            { category: "Generators", title: "QR Generator", desc: "Generate QR codes instantly.", link: "qr_generator.html", icon: "bi-qr-code" },
            { category: "Generators", title: "Barcode Generator", desc: "Generate Barcodes instantly.", link: "barcode_generator.html", icon: "bi-upc" },
            { category: "Generators", title: "Checksum Generator", desc: "Generate & verify file or text checksums.", link: "checksum_generator.html", icon: "bi-shield-check" },
            { category: "Generators", title: "UUID Generator", desc: "Generate & validate UUIDs/GUIDs (v1, v4, v7).", link: "uuid_generator.html", icon: "bi-fingerprint" },
            { category: "Generators", title: "Color Picker", desc: "Pick colors and extract palettes from any image.", link: "color_picker.html", icon: "bi-eyedropper" },

            { category: "Converters", title: "Base64 Text Converter", desc: "Base64 text encoding/decoding.", link: "base64_text_converter.html", icon: "bi-code-slash" },
            { category: "Converters", title: "Base64 Image Converter", desc: "Base64 image encoding/decoding.", link: "base64_image_converter.html", icon: "bi-image" },
            { category: "Converters", title: "Data Converter", desc: "Convert data formats instantly.", link: "data_converter.html", icon: "bi-translate" },
            { category: "Converters", title: "Hash Calculator", desc: "Generate MD5, SHA & HMAC hashes instantly.", link: "hash_calculator.html", icon: "bi-hash" },
            { category: "Converters", title: "Doc/PDF to MD", desc: "Convert Word documents and PDFs to Markdown.", link: "docx_converter.html", icon: "bi-file-word" },

            { category: "Editors", title: "Text Editor", desc: "Edit, replace, convert, sort & compare text.", link: "text_editor.html", icon: "bi-pencil-square" },
            { category: "Editors", title: "Regex Tester", desc: "Build, test & export regular expressions with live match highlighting.", link: "regex_tester.html", icon: "bi-regex" },
            { category: "Editors", title: "Markdown Editor", desc: "Design Markdown with a full toolbar & preview how it will render.", link: "markdown_editor.html", icon: "bi-markdown" },

            { category: "Productivity", title: "Notes", desc: "Quick notes that save automatically in your browser.", link: "notes.html", icon: "bi-journal-text" },
            { category: "Productivity", title: "Todo List", desc: "Create and track your to-do list with ease.", link: "todo_list.html", icon: "bi-check2-square" },
            { category: "Productivity", title: "Scrum Poker", desc: "Estimate stories together with live planning poker rooms.", link: "scrum_poker.html", icon: "bi-suit-spade-fill" },
            { category: "Productivity", title: "Unit Converter", desc: "Convert length, weight, temperature & more.", link: "unit_converter.html", icon: "bi-rulers" },
            { category: "Productivity", title: "Currency Converter", desc: "Convert between world currencies instantly.", link: "currency_converter.html", icon: "bi-currency-exchange" },
            { category: "Productivity", title: "Timestamp Converter", desc: "Convert Unix timestamps to dates and back, across any timezone.", link: "timestamp_converter.html", icon: "bi-clock-history" },
            { category: "Productivity", title: "Date Difference Calculator", desc: "Find the gap between two dates in years, days, weekdays & more.", link: "date_difference_calculator.html", icon: "bi-calendar2-range" },
            { category: "Productivity", title: "Calculator", desc: "A simple calculator for everyday calculations.", link: "calculator.html", icon: "bi-calculator" },
            { category: "Productivity", title: "Percentage Calculator", desc: "Calculate percentages, increases & discounts.", link: "percentage_calculator.html", icon: "bi-percent" },
            { category: "Productivity", title: "IP Address Lookup", desc: "Analyse IPs & subnets, and look up location & ISP.", link: "ip_address_lookup.html", icon: "bi-globe2" },
            { category: "Productivity", title: "Cron Parser", desc: "Explain cron expressions and see their next run times.", link: "cron_parser.html", icon: "bi-alarm" },
            
            { category: "Fun", title: "Cat Facts", desc: "Get a random cat photo and cat fact together.", link: "cat_facts.html", icon: "bi-emoji-smile" },
            { category: "Fun", title: "Dog Facts", desc: "Get a random dog photo and dog fact together.", link: "dog_facts.html", icon: "bi-image" },
            { category: "Fun", title: "Trivia Quiz", desc: "Test yourself in 24 categories and beat your best score.", link: "trivia_quiz.html", icon: "bi-patch-question" },
            { category: "Fun", title: "Advice Slip", desc: "Get a random piece of life advice to copy and share.", link: "advice_slip.html", icon: "bi-lightbulb" },
            { category: "Fun", title: "Useless Facts", desc: "Get a random useless fact or the fact of the day.", link: "useless_facts.html", icon: "bi-emoji-dizzy" },
            { category: "Fun", title: "Random Masterpiece", desc: "Discover a random masterpiece from The Met with its story.", link: "random_masterpiece.html", icon: "bi-palette" },
            { category: "Fun", title: "ZIP / PIN Code Lookup", desc: "Find the city, area and state for a postal code in about 70 countries.", link: "postal_code_lookup.html", icon: "bi-mailbox" },
            { category: "Fun", title: "IFSC Code Finder", desc: "Find the bank, branch, address and MICR for any IFSC code.", link: "ifsc_code_finder.html", icon: "bi-bank" },
            { category: "Fun", title: "Gold & Silver Price Today", desc: "Live gold, silver and platinum prices with 24K and 22K rates.", link: "gold_silver_price.html", icon: "bi-coin" },
            { category: "Fun", title: "Riddle of the Day", desc: "A new riddle every day with a hidden answer to reveal.", link: "riddle_of_the_day.html", icon: "bi-puzzle" },
            { category: "Fun", title: "Wikipedia Today", desc: "Featured article, picture, news and most-read for any day.", link: "wikipedia_today.html", icon: "bi-wikipedia" },
            { category: "Fun", title: "Wildlife Spotted Near You", desc: "See birds, insects and plants people spotted near you.", link: "wildlife_near_you.html", icon: "bi-binoculars" }
        ]
    },
    {
        version: "1.1",
        date: "2026-10-28",
        items: [
            { category: "Party Games", title: "Draw & Guess", desc: "Draw a secret word while friends race to guess it live.", link: "draw_and_guess.html", icon: "bi-brush" },
            { category: "Party Games", title: "Quiz Battle", desc: "Race friends through live quiz rounds with a leaderboard.", link: "quiz_battle.html", icon: "bi-trophy" },
            { category: "Party Games", title: "Word Spy", desc: "Team word game where one-word clues find your agents.", link: "word_spy.html", icon: "bi-grid-3x3-gap-fill" },
            { category: "Party Games", title: "Imposter", desc: "Find the faker who does not know the secret word.", link: "imposter.html", icon: "bi-incognito" },
            { category: "Party Games", title: "Two Truths and a Lie", desc: "Spot the lie among your teammates' three statements.", link: "two_truths_lie.html", icon: "bi-chat-quote" },
            { category: "Party Games", title: "Emoji Charades", desc: "Describe movies and phrases using only emoji.", link: "emoji_charades.html", icon: "bi-emoji-laughing" },
            { category: "Party Games", title: "Reaction Race", desc: "Tap the moment the pad turns green, and the fastest wins.", link: "reaction_race.html", icon: "bi-lightning-charge-fill" },
            { category: "Party Games", title: "Typing Race", desc: "Type the same passage as your friends and race live.", link: "typing_race.html", icon: "bi-keyboard-fill" },
            { category: "Party Games", title: "Would You Rather", desc: "Pick a side and predict what the room will choose.", link: "would_you_rather.html", icon: "bi-signpost-split" },
            { category: "Party Games", title: "Board Game Duel", desc: "Tic-Tac-Toe, Connect Four and Dots & Boxes, winner stays on.", link: "board_games.html", icon: "bi-grid-3x3" }
        ]
    }
];

// Derived from the last changelog entry so a release only needs one edit.
const APP_VERSION = CHANGELOG[CHANGELOG.length - 1].version;

const CATEGORY_ORDER = ["Formatters", "Generators", "Converters", "Editors", "Productivity", "Fun", "Party Games"];

const LAST_SEEN_VERSION_KEY = "toolstack_last_seen_version";

// Matches version strings like "1.5" or "1.10.2" made only of dot-separated numbers.
function isValidVersion(value) {
    return typeof value === "string" && /^\d+(\.\d+)*$/.test(value);
}

// Compares version strings segment by segment so "1.10" correctly beats "1.9".
function compareVersions(a, b) {
    const partsA = a.split(".").map(Number);
    const partsB = b.split(".").map(Number);
    const len = Math.max(partsA.length, partsB.length);
    for (let i = 0; i < len; i++) {
        const diff = (partsA[i] || 0) - (partsB[i] || 0);
        if (diff !== 0) return diff;
    }
    return 0;
}

// Returns null for a brand-new visitor, or a stored value outside the tracked range, or an invalid stored value; otherwise the stored version.
function getLastSeenVersion() {
    const stored = getStorageString(LAST_SEEN_VERSION_KEY);
    if (!isValidVersion(stored)) return null;

    const baselineVersion = CHANGELOG[0].version;
    if (compareVersions(stored, baselineVersion) < 0) return null;

    // A stored value above the current version comes from the numbering before the reset to 1.0, so it is ignored.
    if (compareVersions(stored, APP_VERSION) > 0) return null;

    return stored;
}

function setLastSeenVersion(version) {
    setStorageString(LAST_SEEN_VERSION_KEY, version);
}

// Null lastSeenVersion (brand-new visitor) returns the entire changelog.
function getEntriesAfter(lastSeenVersion) {
    if (!lastSeenVersion) return CHANGELOG;
    return CHANGELOG.filter(entry => compareVersions(entry.version, lastSeenVersion) > 0);
}

function groupItemsByCategory(entries) {
    const grouped = {};
    entries.forEach(entry => {
        entry.items.forEach(item => {
            if (!grouped[item.category]) grouped[item.category] = [];
            grouped[item.category].push({ ...item, version: entry.version });
        });
    });
    return CATEGORY_ORDER
        .filter(category => grouped[category])
        .map(category => ({ category, items: grouped[category] }));
}
