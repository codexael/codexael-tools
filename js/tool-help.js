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
    }
};

function getCurrentToolHelp() {
    const filename = location.pathname.split("/").pop() || "index.html";
    return TOOL_HELP[filename] || null;
}
