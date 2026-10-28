// Per-tool instructions shown by the floating info button. Keyed by the page's HTML filename.

const TOOL_HELP = {
    "json_formatter.html": {
        title: "JSON Formatter",
        icon: "bi-filetype-json",
        items: [
            "Paste or type JSON into the left editor, click \"Upload Data\" to load a .json file, or click \"Load Dummy Data\" for a sample.",
            "Click \"Format / Beautify\" to pretty-print with 2 or 4 space indentation, or \"Minify / Compact\" to remove whitespace.",
            "Click \"Validate\" to check the JSON for syntax errors.",
            "Click \"Compare\" to diff two JSON snippets (\"Ignore order in collections\" is on by default, treating differently-ordered arrays/objects as equal); the comparison result has its own Clear and Fullscreen controls.",
            "Use Collapse/Expand to fold or unfold nested structures.",
            "Download, Copy, Print, Fullscreen and Clear are available on both editor panels."
        ]
    },
    "xml_formatter.html": {
        title: "XML Formatter",
        icon: "bi-filetype-xml",
        items: [
            "Paste or type XML into the left editor, click \"Upload Data\" to load a .xml file, or click \"Load Dummy Data\" for a sample.",
            "Click \"Format / Beautify\" to pretty-print with 2 or 4 space indentation, or \"Minify / Compact\" to remove whitespace.",
            "Click \"Validate\" to check the XML is well-formed.",
            "Click \"Compare\" to diff two XML snippets (\"Ignore order in collections\" is on by default, treating differently-ordered elements as equal); the comparison result has its own Clear and Fullscreen controls.",
            "Use Collapse/Expand to fold or unfold nested structures.",
            "Download, Copy, Print, Fullscreen and Clear are available on both editor panels."
        ]
    },
    "html_formatter.html": {
        title: "HTML Formatter & Viewer",
        icon: "bi-filetype-html",
        items: [
            "Paste or type HTML into the left editor, click \"Upload Data\" to load a .html/.htm file, or click \"Load Dummy Data\" for a sample.",
            "Use Collapse/Expand to fold or unfold code blocks.",
            "Click \"Format / Beautify\" to pretty-print with 2 or 4 space indentation, or \"Minify / Compact\" to remove whitespace.",
            "Enable \"Ignore escape sequences\" if your HTML contains escaped characters that should stay untouched.",
            "Click \"Preview\" on the output panel to switch from code view to a rendered live view (it reverts to code view after Format, Minify or Clear).",
            "Download, Copy, Print, Fullscreen and Clear are available on the input and output editors."
        ]
    },
    "qr_generator.html": {
        title: "QR Generator",
        icon: "bi-qr-code",
        items: [
            "Type or paste the text, URL or data to encode; the QR code updates live.",
            "Choose the QR type (Encoded or Plain), set the Error Correction level (L/M/Q/H), Border width and Size.",
            "Pick custom Foreground and Background colors.",
            "Use the slider under the generated code to resize the displayed image (25-100%); this only changes how it's shown, not the downloaded size.",
            "Download the QR code as PNG or JPEG.",
            "Click \"Scan QR Code\" to upload an image and decode an existing QR code.",
            "The input panel offers Download, Copy, Print, Fullscreen and Clear; the output panel offers Download, Print, Fullscreen and Clear."
        ]
    },
    "barcode_generator.html": {
        title: "Barcode Generator",
        icon: "bi-upc",
        items: [
            "Type or paste the value to encode; the barcode updates live.",
            "Choose the symbology: Code-128 or Code-39.",
            "Pick custom Foreground and Background colors.",
            "Download the barcode as PNG or JPEG.",
            "Click \"Scan Barcode\" to upload an image and decode an existing barcode.",
            "The input panel offers Download, Copy, Print, Fullscreen and Clear; the output panel offers Download, Print, Fullscreen and Clear."
        ]
    },
    "checksum_generator.html": {
        title: "Checksum Generator",
        icon: "bi-shield-check",
        items: [
            "Type or paste text, click \"Upload File\" / \"Upload Text\", or drag & drop a file onto the input panel.",
            "Click the × on the file badge to remove an uploaded file and go back to typing text.",
            "Choose the output encoding: Hex or Base64.",
            "Select one or more algorithms to compute at once: MD5, SHA-1, SHA-256, SHA-384, SHA-512.",
            "Click \"Generate\" to compute the checksums — they're not calculated automatically as you type.",
            "Paste a hash into \"Verify\" and click it to check the hash matches the generated checksum.",
            "Download, Copy, Print, Fullscreen and Clear are available on both panels."
        ]
    },
    "uuid_generator.html": {
        title: "UUID Generator",
        icon: "bi-fingerprint",
        items: [
            "Choose a UUID version: v1 (time-based), v4 (random) or v7 (time-ordered).",
            "Set the Quantity to generate (1-1000) by typing a number or using the +/- stepper buttons.",
            "Toggle formatting options: Uppercase, No Hyphens, Braces {}, urn:uuid: Prefix.",
            "Click \"Generate\" to create the UUIDs.",
            "Paste a UUID into \"Validate UUID\" and press Enter or click \"Validate\" to check it and see its version and variant.",
            "Download, Copy, Print, Fullscreen and Clear are available on the output panel."
        ]
    },
    "color_picker.html": {
        title: "Color Picker",
        icon: "bi-eyedropper",
        items: [
            "Click \"Use your image\" to upload an image (drag & drop or paste also work), or \"Pick from Screen\" to sample any pixel on screen (where supported).",
            "Click on the image to pick a color; the Hex, RGB and HSL fields update instantly, and you can also type a value into any of them and press Enter to set a color manually.",
            "Click \"View color details\" to reveal HSV, CMYK and the complementary color, each with its own Copy button.",
            "Click the previous-color swatch to restore the last picked color.",
            "Adjust the palette size with the +/- buttons; click any palette swatch to load it as the current color.",
            "Click \"Download palette\" to save it as an image, or \"Save palette\" to add it to Saved Palettes, where each entry can be loaded or deleted.",
            "\"Reset colors\" clears just the picked colors/palette; \"Clear\" on the image panel also removes the loaded image.",
            "Download the image, or use Fullscreen on either panel."
        ]
    },
    "base64_text_converter.html": {
        title: "Base64 Text Converter",
        icon: "bi-code-slash",
        items: [
            "Type or paste text into the left editor, or click \"Upload Data\" to load a file.",
            "Choose the character Encoding: UTF-8 or ASCII.",
            "Click \"Encode\" to Base64-encode the input, or \"Decode\" to turn Base64 back into text.",
            "Download, Copy, Print, Fullscreen and Clear are available on both panels."
        ]
    },
    "base64_image_converter.html": {
        title: "Base64 Image Converter",
        icon: "bi-image",
        items: [
            "Click \"Upload Image\" (or drag & drop / click to browse) to load an image, or click \"Upload Base64\" to load an existing Base64 string.",
            "Choose the Base64 Format: Raw or Data URL.",
            "Click \"Encode\" to convert the image to Base64, or \"Decode\" to turn a Base64 string back into an image.",
            "Clear on either panel resets both the image and the Base64 text together.",
            "Download, Print and Fullscreen are available on the image panel; Download, Copy, Print, Fullscreen and Clear are available on the Base64 panel."
        ]
    },
    "data_converter.html": {
        title: "Data Converter",
        icon: "bi-translate",
        items: [
            "Choose the Input and Output formats (JSON or XML) from the dropdowns above each editor.",
            "Paste or type data, or upload a file.",
            "Click \"Convert (Beautify)\" to convert and pretty-print with 2 or 4 space indentation, or \"Convert (Minify)\" to convert and remove whitespace — conversion doesn't happen automatically.",
            "Click \"Validate\" to check the data.",
            "Use Collapse/Expand to fold or unfold nested structures.",
            "Download, Copy, Print, Fullscreen and Clear are available on both editors."
        ]
    },
    "base64_text_converter.html": {
        title: "Base64 Text Converter",
        icon: "bi-code-slash",
        items: [
            "Type or paste text into the left editor, or click \"Upload Data\" to load a file.",
            "Choose the character encoding: UTF-8 or ASCII.",
            "Click \"Encode\" to turn the input into Base64, or \"Decode\" to turn Base64 input back into text; the result appears in the right editor.",
            "Find & replace text in the input, and find text in the read-only output, with Ctrl+F / Ctrl+H.",
            "Download, Copy, Print, Fullscreen and Clear are available on both editor panels."
        ]
    },
    "base64_image_converter.html": {
        title: "Base64 Image Converter",
        icon: "bi-image",
        items: [
            "Click \"Upload Image\" to load an image; a preview appears in the left panel.",
            "Choose the output format: Raw Base64 or a full Data URL (data:image/...;base64,...).",
            "Click \"Encode\" to convert the image into Base64 in the right editor.",
            "To go the other way, paste Base64 or a Data URL into the right editor, or click \"Upload Base64\" to load a .txt or .b64 file, then click \"Decode\" to preview the image.",
            "Download or print the image from the left panel, and download, copy or print the Base64 from the right panel."
        ]
    },
    "hash_calculator.html": {
        title: "Hash Calculator",
        icon: "bi-hash",
        items: [
            "Type or paste text, or upload a file.",
            "Choose the output encoding: Hex or Base64.",
            "Select one or more algorithms to compute at once: MD5, SHA-1, SHA-256, SHA-512 (all four are on by default).",
            "Check \"Mode\" under HMAC and enter a Secret key to generate a keyed HMAC hash instead of a plain hash; use the eye icon to show or hide the key.",
            "Download, Copy, Print, Fullscreen and Clear are available on both panels."
        ]
    },
    "docx_converter.html": {
        title: "Doc/PDF to MD",
        icon: "bi-file-word",
        items: [
            "Drag & drop a .docx or .pdf file, or click to browse.",
            "Click \"Convert\" to turn the document into Markdown.",
            "Download the Markdown, Copy it, Print it, use Fullscreen, or Clear the input/output."
        ]
    },
    "text_editor.html": {
        title: "Text Editor",
        icon: "bi-pencil-square",
        items: [
            "Switch between four modes at the top: Replace, Case Converter, Sort Lines and Difference.",
            "Replace: find text with optional Case sensitive / Whole word / Regex / Multiline options (a live match count shows as you type), then click \"Replace All\".",
            "Case Converter: convert to Sentence, lower, UPPER, Title, camelCase, PascalCase, snake_case, CONSTANT_CASE, kebab-case, COBOL-CASE, Train-Case, aLtErNaTiNg or iNvErSe — or click \"Original\" to revert.",
            "Sort Lines: alphabetize, sort by last word (or reverse either), reverse line order, randomize, remove duplicates, trim whitespace, or remove empty lines; toggle \"Ignore blank lines\" (on by default).",
            "Difference: upload a modified file to compare against the input, view as Split or Unified, and toggle Ignore whitespace / Ignore case.",
            "Upload Data, Download, Copy, Print, Fullscreen and Clear are available throughout."
        ]
    },
    "regex_tester.html": {
        title: "Regex Tester",
        icon: "bi-regex",
        items: [
            "Type or paste test text into the input editor, or click \"Load Dummy Data\" for a sample.",
            "Pick a ready-made pattern from the \"Pattern Library\" dropdown, or type your own regex in \"Pattern\".",
            "Toggle flags: g (global), m (multiline), i (insensitive), s (dot-all), u (unicode).",
            "Use the Builder to insert common pieces without memorizing syntax: Anchors (^ $ \\b \\B), Character Classes (. \\d \\w \\s and custom [abc] / [^abc]), Quantifiers (* + ? {n,m}), and Groups ( ) (?: ) (?<name>) | (?= ) (?! ).",
            "Matches highlight live in the input; click a match in the Matches list to jump to it.",
            "Switch to the \"Code Snippet\" tab and choose a language (JavaScript, Python, Java, C#, PHP, Go) to get ready-to-use code for your regex.",
            "Download, Copy, Print, Fullscreen and Clear are available on both panels — Clear on the input wipes the text, pattern and flags, while Clear on the output only resets the pattern and flags."
        ]
    },
    "markdown_editor.html": {
        title: "Markdown Editor",
        icon: "bi-markdown",
        items: [
            "Type or paste Markdown, click \"Load Dummy Data\" for a sample, or upload a .md/.markdown/.txt file.",
            "Use Collapse/Expand to fold or unfold the source editor.",
            "Use the toolbar to insert a Heading (H1-H6), Bold, Italic, Strikethrough, Inline Code, Blockquote, Code Block, Horizontal Rule, Table, lists (unordered/ordered/task), Links and Images.",
            "The right panel renders a live preview of your Markdown.",
            "Download as .md or as rendered HTML, Print the preview, and use Fullscreen.",
            "Copy, Download, Print, Fullscreen and Clear are available on the input editor too."
        ]
    },
    "notes.html": {
        title: "Notes",
        icon: "bi-journal-text",
        items: [
            "Click the \"+\" button to create a new note; notes save automatically in your browser as you type.",
            "Search your notes using the search box above the notes list; click its × to clear the search.",
            "Click a note in the list to select it, then edit its title and content.",
            "Copy, Download, Print or Delete the selected note, and use Fullscreen."
        ]
    },
    "todo_list.html": {
        title: "Todo List",
        icon: "bi-check2-square",
        items: [
            "Type a task in \"Add a new task...\" and press Enter or click \"Add\".",
            "Check items off as you complete them, or double-click a task to edit its text in place (Enter saves, Escape cancels).",
            "Drag a task by its handle to reorder the list.",
            "Delete a single task with its own delete button, or click \"Clear all tasks\" to remove everything.",
            "Filter the list by All, Active or Completed.",
            "Copy the list, Download it as .txt, Print it, or use Fullscreen."
        ]
    },
    "scrum_poker.html": {
        title: "Scrum Poker",
        icon: "bi-suit-spade-fill",
        items: [
            "Enter your name, choose your role (DEV, QA or BA), pick a card deck (Fibonacci, Modified Fibonacci, T-Shirt or Powers of 2) and click \"Create Room\" to get a 6-digit room code.",
            "Teammates enter a different name, choose a role and enter the code, then click \"Join Room\"; share the code, or copy the invite link so the code is filled in for them.",
            "Only DEV and QA members vote; BA members and anyone who turns on \"Join as observer\" watch without voting.",
            "Only the room creator can set the story, change the card deck, reveal the cards and start a new round; everyone else sees these update live.",
            "Pick a card to vote, and click it again to take the vote back; others only see that you voted until the cards are revealed.",
            "After the reveal, the results show the DEV average, the QA average, the total average and the vote spread.",
            "Finished rounds are kept in History; copy or download the results at any time.",
            "Click \"Leave room\" to go; if the room creator leaves, the room closes for everyone."
        ]
    },
    "unit_converter.html": {
        title: "Unit Converter",
        icon: "bi-rulers",
        items: [
            "Choose a Category (length, weight, temperature and more) from the dropdown.",
            "Select the From and To units, then enter a value in either field (or use the +/- stepper buttons) to convert instantly.",
            "Click the swap button to reverse the From/To units.",
            "Copy the result, or Clear to reset."
        ]
    },
    "currency_converter.html": {
        title: "Currency Converter",
        icon: "bi-currency-exchange",
        items: [
            "Enter an Amount (typing or using the +/- stepper buttons) and choose the From and To currencies from the searchable dropdowns.",
            "The converted result updates instantly using the latest daily reference rates from Frankfurter, which are cached for an hour.",
            "Click the refresh button to load the latest rates again, or the swap button to reverse the From/To currencies.",
            "Open \"Customize rates\" to override individual rates, save your changes, or reset them back to the latest rates.",
            "Copy the result."
        ]
    },
    "timestamp_converter.html": {
        title: "Timestamp Converter",
        icon: "bi-clock-history",
        items: [
            "\"Current Time\" shows a live clock for any region you pick from the searchable dropdown; click \"Use below\" to send its current timestamp into the converter.",
            "\"Timestamp → Date & Time\": enter a Unix timestamp (or click \"Now\"), choose Seconds or Milliseconds, and pick two timezones to compare side by side — click the swap icon to flip them.",
            "Results include both zones' local time and offset/DST status, plus UTC, ISO 8601, RFC 2822 and a relative (\"x ago\" / \"in x\") reading — all update live as you type.",
            "\"Date & Time → Timestamp\": enter Year, Month, Day, Hour, Minutes, Seconds and Milliseconds (or click \"Now\"), pick the timezone the values are in, and get the Unix timestamp in seconds and milliseconds instantly.",
            "Copy any individual value with its inline copy icon, or Clear to reset the converter fields."
        ]
    },
    "date_difference_calculator.html": {
        title: "Date Difference Calculator",
        icon: "bi-calendar2-range",
        items: [
            "Enter a From and To date (Year, Month, Day), or click \"Today\" on either side to load the current date.",
            "Enable \"Include time of day\" to add Hour, Minute and Second fields for a more precise duration.",
            "The result updates live: a calendar-aware breakdown (years, months, days and, if enabled, time), plus total days, weeks, hours, minutes, seconds, and weekday/weekend day counts.",
            "If \"To\" is earlier than \"From\", the absolute difference is shown along with a note.",
            "Click the swap button to reverse From/To.",
            "Copy any individual value with its inline copy icon, or Clear to reset both dates."
        ]
    },
    "calculator.html": {
        title: "Calculator",
        icon: "bi-calculator",
        items: [
            "Use the keypad, or your keyboard (digits, operators, Enter/=, Backspace, Escape, %), for arithmetic: +, −, ×, ÷, %, and decimal point.",
            "Use Backspace to remove the last digit, or C to clear the current entry.",
            "Use MC / MR / M+ / M- to clear, recall, add to, or subtract from memory.",
            "Click a History entry to reload that result; click the trash icon to clear the whole history.",
            "Copy the result, or Clear the calculator."
        ]
    },
    "percentage_calculator.html": {
        title: "Percentage Calculator",
        icon: "bi-percent",
        items: [
            "Choose a mode: \"X% of Y\", \"X is % of Y\", \"% Change\", or \"Increase/Decrease\".",
            "Enter the relevant values for the selected mode (typing or using the +/- stepper buttons) to see the result instantly.",
            "In \"Increase/Decrease\" mode, also choose whether to Increase or Decrease the value.",
            "Copy the result, or Clear to reset all fields."
        ]
    },
    "ip_address_lookup.html": {
        title: "IP Address Lookup",
        icon: "bi-globe2",
        items: [
            "Type an IPv4 or IPv6 address to see its type (public, private, loopback and more), class, decimal, hex, binary and reverse DNS name.",
            "Add a prefix such as /24 or /64 to see the network, netmask, wildcard, broadcast, host range and address count.",
            "These details are worked out in your browser and never leave it.",
            "Click \"Look up\" (or press Enter) to get a public address's country, city, timezone, ISP and ASN, or click \"My IP\" to look up your own address; both send the address to ipwho.is.",
            "Your own IP is looked up once when the page opens, so it is sent to ipwho.is then too.",
            "Copy one value with its copy icon, copy every detail from the header, or Clear to reset."
        ]
    },
    "query_formatter.html": {
        title: "Query Formatter",
        icon: "bi-filetype-sql",
        items: [
            "Pick the query language first: PostgreSQL, MS SQL Server, MySQL, SQLite or Couchbase N1QL (the default); your choice is remembered.",
            "Changing the language clears the input, output and parameter values; click Undo in the toast within 5 seconds to bring back the old language and data.",
            "Paste or upload a query, then click \"Format / Beautify\" to lay it out, or \"Minify / Compact\" to put it on one line.",
            "Choose UPPER, lower or kept keyword case and an indent of 2 spaces, 4 spaces or a tab; both choices are remembered.",
            "Minify drops plain comments but keeps optimizer hints such as /*+ INDEX(...) */.",
            "If the query cannot be read, the error names the line and column and the cursor jumps there.",
            "Parameters are listed with a value box: $1 in PostgreSQL, @name in SQL Server, ? in MySQL, ?, ?1, :name, @name and $name in SQLite, and $name, @name, $1 and ? in Couchbase.",
            "Click \"Fill Parameters\" to write the query with your values to the output; in SQL, numbers, NULL, TRUE and FALSE stay as typed and other text is quoted, while in Couchbase values are read as JSON.",
            "Tables (or Couchbase keyspaces) after FROM, JOIN, INTO, UPDATE, MERGE, CREATE / ALTER / DROP TABLE, REFERENCES and CREATE INDEX ON are listed with their parts and marked in the input; click one to select where it is used.",
            "The formatter only lays out the query; it does not check that the query will run on your database."
        ]
    },
    "cron_parser.html": {
        title: "Cron Parser",
        icon: "bi-alarm",
        items: [
            "Type a 5-field cron expression (minute hour day-of-month month day-of-week), or 6 fields with seconds first, or a macro such as @daily.",
            "You can use *, lists (1,15), ranges (1-5), steps (*/15) and names such as MON-FRI or JAN.",
            "Or use the Builder: for each field choose Every, Every N, Range or Specific, and the expression is written for you.",
            "In Specific mode click as many values as you like, or use a quick pick such as Weekdays or Work hours.",
            "Turn on \"Include seconds\" to add a seconds field; typing an expression also updates the Builder.",
            "The sentence under the input explains the schedule, and the Fields panel lists what each field matches.",
            "When both day fields are set, the job runs on days that match either one, as in classic cron.",
            "Next runs lists the next 10 times, in your local time zone or in UTC; your choice is saved.",
            "Click an example to try it, copy one run time with its copy icon, copy every detail from the header, or Clear to reset."
        ]
    },
    "cat_facts.html": {
        title: "Cat Facts",
        icon: "bi-emoji-smile",
        items: [
            "A cat fact and a random cat photo load when the page opens, and both appear at the same moment once both are ready.",
            "Click \"New cat\" or the refresh icon to get another fact and photo.",
            "If either the fact or the photo fails to load, the current fact and photo stay on screen and a message says what went wrong.",
            "Click \"Copy fact\" to copy the fact, \"Share\" to send it with your device's share menu, or \"Open photo\" to see the full-size photo in a new tab.",
            "On devices without a share menu, \"Share\" copies the fact with a link to this page.",
            "\"Facts seen this visit\" counts the facts shown since you opened the page.",
            "Facts come from catfact.ninja and photos from TheCatAPI, two free public APIs."
        ]
    },
    "dog_facts.html": {
        title: "Dog Facts",
        icon: "bi-image",
        items: [
            "A dog fact and a random dog photo load when the page opens, and both appear at the same moment once both are ready.",
            "Click \"New dog\" or the refresh icon to get another fact and photo.",
            "If either the fact or the photo fails to load, the current fact and photo stay on screen and a message says what went wrong.",
            "Click \"Copy fact\" to copy the fact, \"Share\" to send it with your device's share menu, or \"Open photo\" to see the full-size photo in a new tab.",
            "\"Facts seen this visit\" counts the facts shown since you opened the page.",
            "Facts come from dogapi.dog and photos from random.dog, two free public APIs."
        ]
    },
    "trivia_quiz.html": {
        title: "Trivia Quiz",
        icon: "bi-patch-question",
        items: [
            "Choose a Category, Difficulty, Question type and number of Questions; your choices are saved for next time.",
            "Click \"Start quiz\" to load every question at once, so the quiz keeps working even if your connection drops.",
            "Click an answer or press 1–4 to answer; the correct answer turns green and a wrong pick turns red.",
            "Click \"Next question\" or press Enter to move on, or click Quit to go back to the options.",
            "The results show your score, every question with your answer, and your best score saved in this browser.",
            "Click \"Share score\" to challenge friends, \"Play again\" for a new quiz with the same options, or \"Change options\" to pick new ones.",
            "The question service allows one quiz every 5 seconds, so the page counts down when you start quizzes quickly.",
            "Questions come from the free Open Trivia Database."
        ]
    },
    "advice_slip.html": {
        title: "Advice Slip",
        icon: "bi-lightbulb",
        items: [
            "A random piece of advice loads when the page opens, with its slip number.",
            "Click \"New advice\" or the refresh icon to get another one.",
            "The service can repeat the same advice for 2 seconds, so the page waits briefly and asks again when that happens.",
            "Click \"Copy\" to copy the advice, or \"Share\" to send it with your device's share menu.",
            "\"Advice seen this visit\" counts the advice shown since you opened the page.",
            "Advice comes from the free Advice Slip API."
        ]
    },
    "useless_facts.html": {
        title: "Useless Facts",
        icon: "bi-emoji-dizzy",
        items: [
            "A random useless fact loads when the page opens.",
            "Click \"Random fact\" or the refresh icon for another one, or \"Fact of the day\" for today's fact, which is the same for everyone.",
            "Each fact shows where it originally came from.",
            "Click \"Copy\" to copy the fact, or \"Share\" to send it with your device's share menu.",
            "\"Facts seen this visit\" counts the facts shown since you opened the page.",
            "Facts come from the free Useless Facts API."
        ]
    },
    "random_masterpiece.html": {
        title: "Random Masterpiece",
        icon: "bi-palette",
        items: [
            "A random artwork from The Met's highlights loads when the page opens, with its title, artist, date, culture, medium and size.",
            "The details and the image appear at the same moment once both are ready, and the frame fits each artwork's shape.",
            "Click \"New artwork\" or the refresh icon to discover another one.",
            "Click \"View at The Met\" for the museum's own page, or \"Full size\" for the full-resolution image.",
            "Copy the details from the header, or click \"Share\" to send the artwork to friends.",
            "If an artwork's image will not load, the page quietly picks another artwork.",
            "Artworks come from The Metropolitan Museum of Art's free Collection API."
        ]
    },
    "postal_code_lookup.html": {
        title: "ZIP / PIN Code Lookup",
        icon: "bi-mailbox",
        items: [
            "Choose a Country (your choice is saved), type a ZIP, PIN or postal code, and click \"Look up\" or press Enter.",
            "The result shows every place that uses the code, with its state and map coordinates.",
            "For the UK, Canada and the Netherlands only the first part of the code is used; the hint under the form explains the format.",
            "Click the pin icon to see a place on OpenStreetMap, or the copy icon to copy one place.",
            "Copy every place from the header, or click the bin icon to clear the lookup.",
            "If no place is found, check the code and the country; if you are offline, the lookup runs when your connection comes back.",
            "Places come from the free Zippopotam.us API, and only the country and code you look up are sent."
        ]
    },
    "ifsc_code_finder.html": {
        title: "IFSC Code Finder",
        icon: "bi-bank",
        items: [
            "Type or paste an 11-character IFSC code and click \"Find branch\" or press Enter; spaces, dashes and lower case are fixed for you.",
            "The code is split into its bank part, the fixed zero and the branch part as you type.",
            "The result shows the bank, branch, address, city, district, state, MICR, SWIFT and contact number.",
            "The chips show whether the branch supports UPI, NEFT, RTGS and IMPS.",
            "Click a copy icon to copy one detail, the pin icon to search the branch on a map, or \"Copy all details\" and \"Share\" for everything.",
            "Details come from Razorpay's free IFSC API built from RBI data, so always confirm with your bank before sending money."
        ]
    },
    "gold_silver_price.html": {
        title: "Gold & Silver Price Today",
        icon: "bi-coin",
        items: [
            "Live spot prices for gold, silver, platinum and palladium load when the page opens and refresh every minute while it is open.",
            "Choose a Currency (including INR, AED and SAR) and a Weight (gram, 10 grams, kilogram or troy ounce); your choices are saved.",
            "The gold card also lists 24K, 22K, 18K and 14K prices by purity.",
            "These are international spot prices without import duty, GST, VAT or making charges, so jewellers will charge more.",
            "Click \"Refresh prices\" for the latest prices, copy them from the header, or click \"Share\".",
            "Prices come from Gold API and are converted with daily rates from ExchangeRate-API."
        ]
    },
    "riddle_of_the_day.html": {
        title: "Riddle of the Day",
        icon: "bi-puzzle",
        items: [
            "Today's riddle loads when the page opens and stays the same all day in this browser.",
            "Think it over, then click \"Reveal answer\" to see if you were right.",
            "Click \"Another riddle\" for a bonus riddle, and \"Today's riddle\" to go back.",
            "Click \"Challenge a friend\" to share the riddle without its answer.",
            "Copy the riddle from the header; the answer is copied too once you have revealed it.",
            "Riddles come from the free Riddles API."
        ]
    },
    "wikipedia_today.html": {
        title: "Wikipedia Today",
        icon: "bi-wikipedia",
        items: [
            "See Wikipedia's featured article, picture of the day, news, most-read articles, on this day and did you know, all on one page.",
            "Use the arrows to step to earlier days, and the calendar button to come back to today.",
            "Click any \"Read more\" or article link to open it on Wikipedia.",
            "The most-read list covers the day before the date shown, because Wikipedia counts a full day of views first.",
            "Click the share icon to send today's featured article to friends.",
            "Content comes from Wikipedia's free Feed API under its Creative Commons licences."
        ]
    },
    "wildlife_near_you.html": {
        title: "Wildlife Spotted Near You",
        icon: "bi-binoculars",
        items: [
            "Click \"Near me\" to see wildlife spotted within 25 km of you, or search for a city, park or region and pick it from the list.",
            "Choose a group such as Birds, Insects or Plants to narrow the sightings.",
            "Each card shows the species, its scientific name, when and where it was seen, and who took the photo.",
            "Click \"Show more sightings\" for older ones, or \"See on iNaturalist\" for the full record.",
            "Your last location is saved so the page opens on it next time; \"Near me\" rounds your position to about 1 km.",
            "Sightings come from iNaturalist, where the community has confirmed each identification."
        ]
    },
    "imposter.html": {
        title: "Imposter",
        icon: "bi-incognito",
        items: [
            "Enter your name and click \"Create Room\" to get a 6-digit code, or enter a friend's code and click \"Join Room\"; the invite link fills the code in for them.",
            "The room creator is the referee: they pick the word pack, one or two imposters (two needs 6 or more players) and one or two clue rounds, then click \"Start round\".",
            "Everyone sees the same secret word except the imposter, who only sees the category; click \"Hide\" to cover your card if someone is looking at your screen.",
            "Players take turns giving a short clue; a clue cannot contain the secret word, and a player who runs out of time is skipped.",
            "Then everyone votes for the player they think is the imposter; you can change your vote until everyone has voted, and a tie means nobody is caught.",
            "A caught imposter gets one last chance to guess the secret word.",
            "Crew members score 1 point for voting for an imposter; an imposter scores 2 points for escaping, or for guessing the word after being caught.",
            "Players who join during a round watch until the next one; if the room creator leaves, the room closes for everyone.",
            "Click \"Share result\" or the copy icon to share how the round went."
        ]
    },
    "draw_and_guess.html": {
        title: "Draw & Guess",
        icon: "bi-brush",
        items: [
            "Enter your name and click \"Create Room\" to get a 6-digit room code, or enter a friend's code and click \"Join Room\"; the invite link fills the code in for you.",
            "Draw & Guess needs 3 to 12 players; only the room creator can pick the number of rounds and the draw time, and start the game.",
            "Everyone takes turns as the drawer; the drawer picks one of three secret words, and a word is picked for them after 10 seconds.",
            "Draw on the canvas with your mouse, finger or pen; pick a colour, a brush size or the eraser, and use undo or clear to fix mistakes.",
            "Everyone else types guesses in the chat; a right guess is hidden from the others, and only you are told when a guess is one letter off.",
            "The word pattern shows how many letters there are, and one or two letters are revealed as time runs out.",
            "Early guesses score up to 100 points, and the drawer gets 20 points for every player who guesses the word.",
            "The turn ends when everyone has guessed or the time is up; then the word is shown and the next player draws.",
            "Players who join during a game can guess from the next turn and get their own drawing turns later in the game; if the room creator leaves, the room closes for everyone."
        ]
    },
    "emoji_charades.html": {
        title: "Emoji Charades",
        icon: "bi-emoji-laughing",
        items: [
            "Enter your name and click \"Create Room\" to get a 6-digit room code, or enter a friend's code and click \"Join Room\"; the invite link fills the code in for you.",
            "Emoji Charades needs 2 to 12 players; only the room creator can pick the pack (Movies, Songs & bands, Phrases & idioms, Food, Places or Mixed), the time per turn and the number of rounds.",
            "Everyone takes turns as the clue giver, who gets a secret phrase and describes it using only emoji.",
            "Tap emoji on the keyboard, or type them with your device keyboard; letters and numbers are removed, and \"Space\" separates ideas.",
            "The clue appears live for everyone, along with the category and the number of words in the phrase.",
            "If you do not know your phrase, click \"New phrase\" once per turn before you add any emoji.",
            "Everyone else types guesses in the chat; small typos are forgiven, and a right guess is hidden from the others.",
            "Early guesses score up to 100 points, and the clue giver gets 20 points for every player who guesses the phrase.",
            "Players who join during a game can guess from the next turn and get their own clue turns later in the game; if the room creator leaves, the room closes for everyone."
        ]
    },
    "quiz_battle.html": {
        title: "Quiz Battle",
        icon: "bi-trophy",
        items: [
            "Enter your name and click \"Create Room\" to get a 6-digit room code, then share the code or copy the invite link; friends enter a different name and the code, then click \"Join Room\".",
            "The room creator chooses where questions come from: Built-in (a mixed pack on General, Science, Geography, Tech, Movies & Music, Sports and India), Open Trivia DB, or Custom.",
            "For Custom, paste one question per line as \"Question | Right answer | Wrong 1 | Wrong 2 | Wrong 3\"; any bad lines are listed so you can fix them, and your questions are saved in this browser.",
            "The room creator also picks the number of questions (5, 10, 15 or 20) and the time per question (10, 15, 20 or 30 seconds), then clicks \"Start quiz\".",
            "Click an answer or press 1–4; your answer locks at once, and the others only see that you have answered, not what you picked.",
            "A right answer earns 500 to 1000 points depending on how fast you were, plus 100 bonus points for each right answer in a row, up to 500.",
            "After each question you see the right answer, how many players picked each option, and a short leaderboard; the room creator can click Next to skip ahead.",
            "The final screen shows a podium and all scores; click \"Share result\" to share your place, or the room creator clicks \"Play again\" or \"Change settings\".",
            "If Open Trivia DB cannot be reached or you are offline, the game uses the built-in questions instead; players who join during a game watch until the next one."
        ]
    },
    "word_spy.html": {
        title: "Word Spy",
        icon: "bi-grid-3x3-gap-fill",
        items: [
            "Enter your name and click \"Create Room\" to get a 6-digit room code; friends enter a different name and the code, then click \"Join Room\", or open your invite link so the code is filled in.",
            "Pick the Red or Blue team yourself; the room creator can also click \"Shuffle teams\" to split everyone at random.",
            "Each team needs one spymaster and at least two players; click \"Be spymaster\" to take the seat, or the room creator can click \"Random spymasters\".",
            "The starting team has 9 agents and the other team 8, plus 7 bystanders and 1 assassin; only the spymasters see which word is which.",
            "On their turn the spymaster types a one-word clue that is not a word on the board and picks a number from 0 to 9 or ∞; the team then gets that many guesses plus one.",
            "Teammates tap a card to point at it, and a card opens when most of the team points at the same card; tap it again to take your pick back.",
            "Opening the other team's agent or a bystander ends your turn, and opening the assassin loses the game at once; after one guess you can vote to end the turn.",
            "The first team to find all their agents wins; the clue log, the agents left for each team and an optional turn timer keep everyone on track.",
            "After the game the full key is shown; the room creator can click \"Play again\" to keep the teams and let the other team start, and anyone can share the result."
        ]
    },
    "two_truths_lie.html": {
        title: "Two Truths and a Lie",
        icon: "bi-chat-quote",
        items: [
            "Enter your name and click \"Create Room\" to get a 6-digit room code, then share the code or invite link; you need at least 3 players.",
            "The room creator sets the writing time (2, 3 or 5 minutes, or no timer) and the voting time (30, 45 or 60 seconds), then clicks \"Start writing\".",
            "Write three statements about yourself (up to 120 characters each), click \"Mark as lie\" on the false one, and click Ready; click \"Edit my statements\" to change them.",
            "Stuck? Click \"Need ideas?\" for random prompts; only you see them.",
            "The room creator starts guessing once at least 3 players are ready; players who are not ready can still vote.",
            "One player at a time is in the spotlight with their statements shuffled; everyone else votes for the lie and can change their vote until everyone has voted.",
            "The reveal shows the lie and who voted for what: guessers get 1 point for finding the lie, and the author gets 1 point for each player fooled.",
            "The final scores name the Best liar (fooled the most) and the Lie detector (found the most lies); click \"Share result\" to share how you did.",
            "If the player in the spotlight leaves, their turn is skipped; players who join during a game watch until the next one."
        ]
    },
    "would_you_rather.html": {
        title: "Would You Rather",
        icon: "bi-signpost-split",
        items: [
            "Enter your name and click \"Create Room\" to get a 6-digit room code, then share the code or copy the invite link so friends can join.",
            "The room creator picks a mode: \"Would you rather\" with two options, or \"Hot takes\" with a statement to agree or disagree with.",
            "Choose a pack (Work & tech, Food, Superpowers, Travel, Silly or Mixed), or Custom to paste your own lines: \"Option A | Option B\", or one statement per line for Hot takes.",
            "Set the number of questions (5, 10, 15 or 20) and the time to choose (15, 20 or 30 seconds, or host-paced).",
            "For each question, pick your side and also guess which side most players will pick; you can change both until the reveal.",
            "You get 1 point when your guess matches the majority; a tie means nobody scores that question.",
            "The reveal shows a split bar with percentages and the names on each side, and tells you if you sided with the majority or were a rebel.",
            "The room creator can click \"Reveal now\" or Next at any time; in host-paced mode the game waits for these clicks.",
            "The final scores name the Crowd reader (most right guesses) and the Rebel (most often in the minority); click \"Share result\" to share how you did."
        ]
    },
    "board_games.html": {
        title: "Board Game Duel",
        icon: "bi-grid-3x3",
        items: [
            "Enter your name and click \"Create Room\" to get a 6-digit room code; friends enter a different name and the code, then click \"Join Room\", or open your invite link so the code is filled in.",
            "The room creator picks the game: Tic-Tac-Toe, Connect Four or Dots & Boxes with a 3×3, 4×4 or 5×5 board, and an optional 15 or 30 second turn timer.",
            "Everyone joins the queue when they enter; the first two in the queue play while everyone else watches the board live.",
            "Click \"Leave the queue and watch\" to sit out, or \"Join the queue\" to get back in line.",
            "Click a cell or a column, or use Tab and Enter, to move; in Dots & Boxes, closing a box gives you another move.",
            "When the timer runs out, Tic-Tac-Toe and Connect Four make a random move for you, and Dots & Boxes passes the turn.",
            "The winner stays on and the loser goes to the back of the queue; after a draw both players go to the back.",
            "Click \"Resign\" twice to give up a match; leaving the room during a match gives the win to the other player.",
            "The match history and the win count for each player stay for the whole session; share your result or copy it at any time."
        ]
    },
    "reaction_race.html": {
        title: "Reaction Race",
        icon: "bi-lightning-charge-fill",
        items: [
            "Enter your name and click \"Create Room\" to get a 6-digit room code, or enter a code and click \"Join Room\"; share the code or copy the invite link.",
            "Only the room creator can choose the number of rounds (3, 5 or 10) and start the game; the game needs 2 to 16 players.",
            "Each round the pad shows red, then turns green after a random wait; tap, click, or press Space or Enter as fast as you can.",
            "Tapping while the pad is still red is a false start: the round counts as 1000 ms and earns no points.",
            "Your reaction time is measured on your own device, so a slow network does not make you slower.",
            "The fastest player in a round gets one point per player, the next one point less, and so on; a false start or no tap gets nothing.",
            "After each round the times show for a few seconds and the next round starts by itself; the final results show points, average time and best time.",
            "Click \"Practice\" in the lobby to train alone while you wait; practice is only on your device, and your best time is saved in your browser.",
            "Players who join during a game watch until the next one; if the room creator leaves, the room closes for everyone."
        ]
    },
    "typing_race.html": {
        title: "Typing Race",
        icon: "bi-keyboard-fill",
        items: [
            "Enter your name and click \"Create Room\" to get a 6-digit room code, or enter a code and click \"Join Room\"; share the code or copy the invite link.",
            "Only the room creator can choose the text length (Short, Medium or Long) and the text type (Quotes & proverbs, Tech & code-ish, or Common words) and start the race.",
            "After a 3-2-1 countdown everyone gets the same text; type it word by word in the box below the text.",
            "A wrong letter turns red and you must fix it before you can move on; paste is turned off.",
            "Your time, speed (WPM) and accuracy are measured on your own device, so a slow network does not slow you down.",
            "Every player has a lane with a car that moves as they type, with their progress and live speed.",
            "The race ends when everyone finishes, 90 seconds after the first player finishes, or after 5 minutes at most.",
            "The winner gets one point per racer, the next one point less, and so on; anyone who does not finish gets no points; the room creator clicks \"Next race\" to keep going.",
            "Your best WPM is saved in your browser; players who join during a race watch until the next one."
        ]
    }
};

function getCurrentToolHelp() {
    const filename = location.pathname.split("/").pop() || "index.html";
    return TOOL_HELP[filename] || null;
}
