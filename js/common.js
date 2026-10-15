document.addEventListener("DOMContentLoaded", loadCommonLayout);

const TOOL_USAGE_STORAGE_KEY = "toolUsageCounts";
const FAVOURITE_TOOLS_STORAGE_KEY = "favouriteTools";

// Maps an old tool page name to its new name, so saved favourites and visit counts follow a renamed tool.
const RENAMED_TOOL_FILES = { "couchbase_query_formatter.html": "query_formatter.html" };

function loadCommonLayout() {
    migrateRenamedToolFiles();
    loadNavbar();
    loadFooter();
    loadToolHelpButton();
    loadCommandPalette();
    loadKeyboardShortcuts();
    loadClearDataDialog();
    recordToolVisit();
}

const CLEAR_DATA_DONE_SESSION_KEY = "toolstack_data_cleared";

// Returns "Cmd" on Apple devices and "Ctrl" everywhere else.
function getModifierKeyLabel() {
    return /Mac|iPhone|iPad/.test(navigator.platform) ? "Cmd" : "Ctrl";
}

// Checks whether the user is typing in a text field, so single-key shortcuts do not steal their input.
function isTypingTarget(target) {
    return target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

// Checks whether the command palette or any Bootstrap dialog is showing.
function isOverlayOpen() {
    const palette = document.getElementById("commandPalette");
    return (palette && !palette.hidden) || document.querySelector(".modal.show") !== null;
}

// Adds the shortcuts dialog and binds Ctrl+Enter, Ctrl+Shift+C and ? on every page.
function loadKeyboardShortcuts() {
    document.body.insertAdjacentHTML("beforeend", getShortcutsModalMarkup());
    document.getElementById("shortcutsModal").addEventListener("show.bs.modal", renderShortcutsList);
    addShortcutHints();

    // Listens in the capture phase so page handlers and code editors do not also react to the same keys.
    document.addEventListener("keydown", event => {
        if (isOverlayOpen()) return;

        const hasModifier = event.ctrlKey || event.metaKey;
        let handled = false;
        if (hasModifier && !event.shiftKey && !event.altKey && event.key === "Enter") {
            handled = clickShortcutButton("run");
        } else if (hasModifier && event.shiftKey && !event.altKey && event.key.toLowerCase() === "c") {
            handled = clickShortcutButton("copy");
        } else if (event.key === "?" && !hasModifier && !event.altKey && !isTypingTarget(event.target)) {
            bootstrap.Modal.getOrCreateInstance(document.getElementById("shortcutsModal")).show();
            handled = true;
        }

        if (handled) {
            event.preventDefault();
            event.stopPropagation();
        }
    }, true);
}

// Finds the first visible and enabled button tagged for the given shortcut.
function getShortcutButton(kind) {
    return Array.from(document.querySelectorAll(`[data-shortcut="${kind}"]`))
        .find(button => !button.disabled && button.getClientRects().length > 0) || null;
}

// Clicks the button tagged for the shortcut and reports whether one was found.
function clickShortcutButton(kind) {
    const button = getShortcutButton(kind);
    if (!button) return false;
    button.click();
    return true;
}

// Returns a short action name for a tagged button, based on its text or its tooltip.
function getShortcutButtonLabel(button, kind) {
    const label = button.dataset.shortcutLabel || button.textContent.trim() || button.title;
    if (kind === "copy" && (!label || label === "Copy")) return "Copy output";
    return label;
}

// Adds the shortcut to each tagged button's tooltip so users can discover it by hovering.
function addShortcutHints() {
    const modifier = getModifierKeyLabel();
    const keysByKind = { run: `${modifier}+Enter`, copy: `${modifier}+Shift+C` };
    document.querySelectorAll("[data-shortcut]").forEach(button => {
        const keys = keysByKind[button.dataset.shortcut];
        if (!keys) return;
        button.dataset.shortcutLabel = getShortcutButtonLabel(button, button.dataset.shortcut);
        button.title = button.title ? `${button.title} (${keys})` : `Shortcut: ${keys}`;
    });
}

// Fills the shortcuts dialog with the shortcuts that work on the current page right now.
function renderShortcutsList() {
    const modifier = getModifierKeyLabel();
    const row = (keys, description) => `
        <div class="shortcut-row">
            <span class="shortcut-keys">${keys.map(key => `<kbd>${key}</kbd>`).join("")}</span>
            <span>${description}</span>
        </div>`;
    const section = (title, rows) => `<div class="welcome-category-label">${title}</div>${rows.join("")}`;

    const generalRows = [
        row([modifier, "K"], "Open the command palette"),
        row(["?"], "Show keyboard shortcuts"),
        row(["Esc"], "Close a dialog")
    ];
    if (document.getElementById("toolSearch")) generalRows.push(row(["/"], "Focus the tool search"));

    const pageRows = [];
    const runButton = getShortcutButton("run");
    const copyButton = getShortcutButton("copy");
    if (runButton) pageRows.push(row([modifier, "Enter"], escapeHtml(getShortcutButtonLabel(runButton, "run"))));
    if (copyButton) pageRows.push(row([modifier, "Shift", "C"], escapeHtml(getShortcutButtonLabel(copyButton, "copy"))));

    let html = section("General", generalRows);
    if (pageRows.length > 0) html += section("This page", pageRows);
    if (typeof attachFindReplace === "function") {
        html += section("Editors", [
            row([modifier, "F"], "Find in the editor"),
            row([modifier, "H"], "Replace in the editor"),
            row([modifier, "G"], "Go to line in the editor")
        ]);
    }

    document.getElementById("shortcutsModalBody").innerHTML = html;
}

// Escapes text so it can be placed safely inside HTML markup.
function escapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function getShortcutsModalMarkup() {
    return `
        <div class="modal fade" id="shortcutsModal" tabindex="-1" aria-labelledby="shortcutsModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content welcome-modal-content">
                    <div class="modal-header welcome-modal-header">
                        <h5 class="modal-title" id="shortcutsModalLabel"><i class="bi bi-keyboard"></i> Keyboard shortcuts</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body welcome-modal-body" id="shortcutsModalBody"></div>
                </div>
            </div>
        </div>
    `;
}

// Adds the "Clear my data" dialog, which any element with data-bs-target="#clearDataModal" can open.
function loadClearDataDialog() {
    document.body.insertAdjacentHTML("beforeend", getClearDataModalMarkup());
    document.getElementById("clearDataModal").addEventListener("show.bs.modal", renderClearDataList);

    document.getElementById("clearDataConfirmBtn").addEventListener("click", () => {
        clearAllUserData();
        try {
            sessionStorage.setItem(CLEAR_DATA_DONE_SESSION_KEY, "1");
        } catch (error) {
            // Skips the confirmation toast when session storage is blocked.
        }
        // Reloads the page so no tool keeps old data in memory and saves it again.
        location.reload();
    });

    try {
        if (sessionStorage.getItem(CLEAR_DATA_DONE_SESSION_KEY)) {
            sessionStorage.removeItem(CLEAR_DATA_DONE_SESSION_KEY);
            if (typeof showSuccessToast === "function") showSuccessToast("Your Toolstack data was cleared.");
        }
    } catch (error) {
        // Skips the confirmation toast when session storage is blocked.
    }
}

// Lists only the kinds of data this browser has saved, with item counts where they are known.
function renderClearDataList() {
    const storedGroups = USER_DATA_STORAGE_GROUPS.filter(hasStoredData);
    const list = document.getElementById("clearDataList");
    const confirmBtn = document.getElementById("clearDataConfirmBtn");

    if (storedGroups.length === 0) {
        list.innerHTML = `<p class="welcome-intro mb-0">Toolstack has no saved data in this browser.</p>`;
        confirmBtn.disabled = true;
        return;
    }

    list.innerHTML = storedGroups.map(group => {
        const count = group.countKey ? getStoredItemCount(group.countKey) : null;
        const countText = count === null ? "" : ` <span class="clear-data-count">(${count})</span>`;
        return `
            <div class="tool-help-item">
                <i class="bi bi-trash3"></i>
                <span>${group.label}${countText}</span>
            </div>`;
    }).join("");
    confirmBtn.disabled = false;
}

function getClearDataModalMarkup() {
    return `
        <div class="modal fade" id="clearDataModal" tabindex="-1" aria-labelledby="clearDataModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content welcome-modal-content">
                    <div class="modal-header welcome-modal-header">
                        <h5 class="modal-title" id="clearDataModalLabel"><i class="bi bi-trash3"></i> Clear my data</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body welcome-modal-body">
                        <p class="welcome-intro">This permanently deletes the following from this browser. Your theme setting is kept.</p>
                        <div id="clearDataList"></div>
                    </div>
                    <div class="modal-footer welcome-modal-footer">
                        <button type="button" class="welcome-cta-btn" data-bs-dismiss="modal">Cancel</button>
                        <button type="button" class="clear-data-confirm-btn" id="clearDataConfirmBtn">Delete my data</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Builds the command palette and opens it with Ctrl+K, Cmd+K or any navbar search button.
function loadCommandPalette() {
    const tools = getCommandPaletteTools();
    if (tools.length <= 1) return;

    document.body.insertAdjacentHTML("beforeend", getCommandPaletteMarkup());

    const palette = document.getElementById("commandPalette");
    const input = document.getElementById("commandPaletteInput");
    const list = document.getElementById("commandPaletteList");
    const emptyMessage = document.getElementById("commandPaletteEmpty");
    const currentFile = location.pathname.split("/").pop() || "index.html";
    let results = [];
    let activeIndex = 0;
    let previousFocus = null;

    const highlight = () => {
        Array.from(list.children).forEach((item, index) => {
            const isActive = index === activeIndex;
            item.classList.toggle("active", isActive);
            item.setAttribute("aria-selected", String(isActive));
            if (isActive) {
                input.setAttribute("aria-activedescendant", item.id);
                item.scrollIntoView({ block: "nearest" });
            }
        });
        if (results.length === 0) input.removeAttribute("aria-activedescendant");
    };

    const render = () => {
        results = rankCommandPaletteTools(tools, input.value);
        activeIndex = 0;
        list.replaceChildren(...results.map((tool, index) => createCommandPaletteItem(tool, index, currentFile)));
        emptyMessage.hidden = results.length > 0;
        highlight();
    };

    const open = () => {
        if (!palette.hidden) return;
        if (typeof closeAll === "function") closeAll();
        previousFocus = document.activeElement;
        palette.hidden = false;
        document.body.classList.add("command-palette-open");
        input.value = "";
        render();
        input.focus();
    };

    const close = () => {
        if (palette.hidden) return;
        palette.hidden = true;
        document.body.classList.remove("command-palette-open");
        if (previousFocus && document.contains(previousFocus)) previousFocus.focus();
    };

    // Opens the chosen tool, in a new tab when Ctrl or Cmd is held.
    const openTool = (tool, inNewTab) => {
        if (!tool) return;
        if (inNewTab) {
            window.open(tool.file, "_blank");
            close();
        } else {
            window.location.href = tool.file;
        }
    };

    input.addEventListener("input", render);

    input.addEventListener("keydown", event => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            if (results.length === 0) return;
            const step = event.key === "ArrowDown" ? 1 : -1;
            activeIndex = (activeIndex + step + results.length) % results.length;
            highlight();
        } else if (event.key === "Enter") {
            event.preventDefault();
            openTool(results[activeIndex], event.ctrlKey || event.metaKey);
        } else if (event.key === "Escape") {
            event.preventDefault();
            close();
        } else if (event.key === "Tab") {
            // Keeps focus inside the palette because the search box is its only focusable control.
            event.preventDefault();
        }
    });

    // Uses mousemove instead of mouseenter so scrolling the list with arrow keys does not steal the highlight.
    list.addEventListener("mousemove", event => {
        const item = event.target.closest(".command-palette-item");
        if (!item) return;
        const index = Array.from(list.children).indexOf(item);
        if (index !== activeIndex) {
            activeIndex = index;
            highlight();
        }
    });

    palette.addEventListener("mousedown", event => {
        if (event.target === palette) close();
    });

    document.querySelectorAll("[data-command-palette-open]").forEach(trigger => {
        trigger.addEventListener("click", event => {
            event.preventDefault();
            open();
        });
    });

    // Listens in the capture phase so code editors on the page cannot swallow the shortcut.
    document.addEventListener("keydown", event => {
        const isShortcut = (event.ctrlKey || event.metaKey) && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "k";
        if (!isShortcut) return;
        event.preventDefault();
        if (!palette.hidden) {
            close();
        } else if (!document.querySelector(".modal.show")) {
            open();
        }
    }, true);
}

// Reads every tool link from the navbar menus so the palette never needs its own copy of the tool list.
function getCommandPaletteTools() {
    const tools = [{ file: "index.html", name: "Home", category: "Toolstack", icon: "bi-house" }];
    document.querySelectorAll("#navbar-container .mega-grid").forEach(grid => {
        const label = grid.querySelector(".mega-label");
        const category = label ? label.textContent.trim() : "";
        grid.querySelectorAll("a.menu-item").forEach(link => {
            const iconEl = link.querySelector("i.bi");
            const icon = iconEl ? Array.from(iconEl.classList).find(name => name.startsWith("bi-")) : "bi-tools";
            tools.push({ file: link.getAttribute("href"), name: link.textContent.trim(), category, icon });
        });
    });
    return tools;
}

// Sorts matching tools by match quality, then favourites, then visit count, then navbar order.
function rankCommandPaletteTools(tools, query) {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    const favourites = getFavouriteTools();
    const counts = getToolUsageCounts();

    return tools
        .map((tool, order) => ({
            tool,
            order,
            score: getCommandPaletteScore(tool, terms),
            isFavourite: favourites.includes(tool.file),
            uses: counts[tool.file] || 0
        }))
        .filter(entry => entry.score > 0)
        .sort((a, b) => b.score - a.score || b.isFavourite - a.isFavourite || b.uses - a.uses || a.order - b.order)
        .map(entry => ({ ...entry.tool, isFavourite: entry.isFavourite }));
}

// Scores one tool against the search terms and returns 0 when any term does not match.
function getCommandPaletteScore(tool, terms) {
    if (terms.length === 0) return 1;

    const name = tool.name.toLowerCase();
    const words = name.split(/[^a-z0-9]+/).filter(Boolean);
    const acronym = words.map(word => word[0]).join("");
    const searchable = `${name} ${tool.category.toLowerCase()}`;
    let score = 0;

    for (const term of terms) {
        if (name.startsWith(term)) score += 5;
        else if (words.some(word => word.startsWith(term))) score += 4;
        else if (searchable.includes(term)) score += 3;
        else if (term.length > 1 && acronym.startsWith(term)) score += 2;
        else if (isSubsequence(term, name)) score += 1;
        else return 0;
    }
    return score;
}

// Checks whether all characters of the term appear in the text in the same order.
function isSubsequence(term, text) {
    let position = 0;
    for (const char of text) {
        if (char === term[position]) position++;
        if (position === term.length) return true;
    }
    return false;
}

// Creates one result row as a real link so middle-click and Ctrl+click open a new tab.
function createCommandPaletteItem(tool, index, currentFile) {
    const item = document.createElement("a");
    item.href = tool.file;
    item.id = `commandPaletteItem${index}`;
    item.className = "command-palette-item";
    item.tabIndex = -1;
    item.setAttribute("role", "option");

    const iconWrap = document.createElement("span");
    iconWrap.className = "icon-wrap";
    const icon = document.createElement("i");
    icon.className = `bi ${tool.icon}`;
    iconWrap.appendChild(icon);

    const name = document.createElement("span");
    name.className = "command-palette-name";
    name.textContent = tool.name;

    const meta = document.createElement("span");
    meta.className = "command-palette-meta";
    if (tool.file === currentFile) {
        const badge = document.createElement("span");
        badge.className = "command-palette-badge";
        badge.textContent = "Current";
        meta.appendChild(badge);
    }
    if (tool.isFavourite) {
        const star = document.createElement("i");
        star.className = "bi bi-star-fill command-palette-star";
        star.setAttribute("aria-label", "Favourite");
        meta.appendChild(star);
    }
    const category = document.createElement("span");
    category.textContent = tool.category;
    meta.appendChild(category);

    item.append(iconWrap, name, meta);
    return item;
}

// Returns the shortcut label for the viewer's platform.
function getCommandPaletteShortcutLabel() {
    return /Mac|iPhone|iPad/.test(navigator.platform) ? "⌘ K" : "Ctrl K";
}

function getCommandPaletteMarkup() {
    return `
        <div class="command-palette" id="commandPalette" hidden>
            <div class="command-palette-dialog" role="dialog" aria-modal="true" aria-label="Search tools">
                <div class="command-palette-search">
                    <i class="bi bi-search" aria-hidden="true"></i>
                    <input type="text" id="commandPaletteInput" class="command-palette-input" placeholder="Search tools..." autocomplete="off" spellcheck="false"
                        role="combobox" aria-expanded="true" aria-controls="commandPaletteList" aria-autocomplete="list">
                    <kbd>Esc</kbd>
                </div>
                <div class="command-palette-list" id="commandPaletteList" role="listbox" aria-label="Tools"></div>
                <p class="command-palette-empty" id="commandPaletteEmpty" hidden>No tools match your search.</p>
                <div class="command-palette-footer">
                    <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
                    <span><kbd>Enter</kbd> Open</span>
                    <span><kbd>Ctrl</kbd><kbd>Enter</kbd> New tab</span>
                    <span><kbd>Esc</kbd> Close</span>
                </div>
            </div>
        </div>
    `;
}

// Increments the visit count for the current tool page in local storage, skipping the home page and unknown addresses.
function recordToolVisit() {
    const filename = location.pathname.split("/").pop();
    if (!filename || filename === "index.html") return;
    if (!getCommandPaletteTools().some(tool => tool.file === filename)) return;

    const counts = getToolUsageCounts();
    counts[filename] = (counts[filename] || 0) + 1;
    setStorageItem(TOOL_USAGE_STORAGE_KEY, counts);
}

// Reads the stored tool visit counts, keyed by page filename.
function getToolUsageCounts() {
    return getStorageItem(TOOL_USAGE_STORAGE_KEY, {});
}

// Reads the stored favourite tool filenames as an array.
function getFavouriteTools() {
    const favourites = getStorageItem(FAVOURITE_TOOLS_STORAGE_KEY, []);
    return Array.isArray(favourites) ? favourites : [];
}

// Moves favourites and visit counts saved under an old tool page name to the tool's new page name.
function migrateRenamedToolFiles() {
    try {
        const favourites = getFavouriteTools();
        const counts = getToolUsageCounts();
        let favouritesChanged = false;
        let countsChanged = false;
        Object.entries(RENAMED_TOOL_FILES).forEach(([oldFile, newFile]) => {
            if (favourites.includes(oldFile)) {
                favourites.splice(favourites.indexOf(oldFile), 1, ...(favourites.includes(newFile) ? [] : [newFile]));
                favouritesChanged = true;
            }
            if (oldFile in counts) {
                counts[newFile] = (counts[newFile] || 0) + counts[oldFile];
                delete counts[oldFile];
                countsChanged = true;
            }
        });
        if (favouritesChanged) setStorageItem(FAVOURITE_TOOLS_STORAGE_KEY, favourites);
        if (countsChanged) setStorageItem(TOOL_USAGE_STORAGE_KEY, counts);
    } catch (error) {
        // Ignores blocked storage because there is nothing to move.
    }
}

// Adds or removes a tool filename from the favourites and returns its new favourite state.
function toggleFavouriteTool(filename) {
    const favourites = getFavouriteTools();
    const isFavourite = favourites.includes(filename);
    const updated = isFavourite ? favourites.filter(name => name !== filename) : [...favourites, filename];
    setStorageItem(FAVOURITE_TOOLS_STORAGE_KEY, updated);
    return !isFavourite;
}

function loadToolHelpButton() {
    if (typeof getCurrentToolHelp !== "function") return;

    const help = getCurrentToolHelp();
    if (!help) return;

    document.body.insertAdjacentHTML("beforeend", getToolHelpMarkup(help));

    const toolHelpBtn = document.getElementById("toolHelpBtn");
    const toolHelpModal = document.getElementById("toolHelpModal");
    toolHelpModal.addEventListener("show.bs.modal", () => { toolHelpBtn.classList.add("d-none"); });
    toolHelpModal.addEventListener("hidden.bs.modal", () => { toolHelpBtn.classList.remove("d-none"); });
}

function getToolHelpMarkup(help) {
    const itemsHtml = help.items.map(item => `
                        <div class="tool-help-item">
                            <i class="bi bi-check-circle-fill"></i>
                            <span>${item}</span>
                        </div>`).join("");

    return `
        <button type="button" class="tool-help-btn" id="toolHelpBtn" title="How to use this tool" aria-label="How to use this tool" data-bs-toggle="modal" data-bs-target="#toolHelpModal">
            <i class="bi bi-question-lg"></i>
        </button>

        <div class="modal fade" id="toolHelpModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content welcome-modal-content tool-help-modal-content">
                    <div class="modal-header welcome-modal-header">
                        <h5 class="modal-title"><i class="bi ${help.icon}"></i> ${help.title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body welcome-modal-body">
                        <p class="welcome-intro">Here's what you can do on this page:</p>
                        ${itemsHtml}
                        <button type="button" class="tool-help-shortcuts-btn" data-bs-toggle="modal" data-bs-target="#shortcutsModal">
                            <i class="bi bi-keyboard"></i> Keyboard shortcuts <kbd>?</kbd>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function loadNavbar() {
    const navbarContainer = document.getElementById('navbar-container');
    if (!navbarContainer) return;
    navbarContainer.innerHTML = getNavbar();
}

function loadFooter() {
    const footerContainer = document.getElementById('footer-container');
    if (!footerContainer) return;
    footerContainer.innerHTML = getFooter();
}

function getFeedbackMailtoLink() {
    const subject = "Toolstack Suggestion";
    const body = [
        "Hi,",
        "",
        "I have a suggestion for Toolstack:",
        "[ ] Feedback on an existing tool",
        "[ ] Idea for a new tool",
        "",
        "Tool name:",
        "Details:",
    ].join("\r\n");
    return `mailto:contact@codexael.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function getNavbar() {
    return `
        <!-- Navbar -->
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark shadow-sm">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold navbar-title" href="index.html">Toolstack</a>
                <ul class="nav-links">
                    <li class="has-dropdown" id="formattersMenu">
                        <a href="#" class="nav-link" onclick="toggleMenu(event,'formattersMenu')">Formatters <i class="bi bi-chevron-down chevron"></i></a>
                        <div class="mega-menu">
                            <div class="mega-grid">
                                <div class="mega-label">Formatters</div>
                                <a href="json_formatter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-filetype-json"></i></span> JSON Formatter</a>
                                <a href="xml_formatter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-filetype-xml"></i></span> XML Formatter</a>
                                <a href="html_formatter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-filetype-html"></i></span> HTML Formatter</a>
                                <a href="query_formatter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-filetype-sql"></i></span> Query Formatter</a>
                            </div>
                            <div class="mega-footer"><a href="index.html">See all features →</a></div>
                        </div>
                    </li>

                    <li class="has-dropdown" id="generatorsMenu">
                        <a href="#" class="nav-link" onclick="toggleMenu(event,'generatorsMenu')">Generators <i class="bi bi-chevron-down chevron"></i></a>
                        <div class="mega-menu">
                            <div class="mega-grid">
                                <div class="mega-label">Generators</div>
                                <a href="qr_generator.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-qr-code"></i></span> QR Generator</a>
                                <a href="barcode_generator.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-upc"></i></span> Barcode Generator</a>
                                <a href="checksum_generator.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-shield-check"></i></span> Checksum Generator</a>
                                <a href="uuid_generator.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-fingerprint"></i></span> UUID Generator</a>
                                <a href="color_picker.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-eyedropper"></i></span> Color Picker</a>
                            </div>
                            <div class="mega-footer"><a href="index.html">See all features →</a></div>
                        </div>
                    </li>

                    <li class="has-dropdown" id="convertersMenu">
                        <a href="#" class="nav-link" onclick="toggleMenu(event,'convertersMenu')">Converters <i class="bi bi-chevron-down chevron"></i></a>
                        <div class="mega-menu">
                            <div class="mega-grid">
                                <div class="mega-label">Converters</div>
                                <a href="base64_text_converter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-code-slash"></i></span> Base64 Text Converter</a>
                                <a href="base64_image_converter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-image"></i></span> Base64 Image Converter</a>
                                <a href="data_converter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-translate"></i></span> Data Converter</a>
                                <a href="hash_calculator.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-hash"></i></span> Hash Calculator</a>
                                <a href="docx_converter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-file-word"></i></span> Doc/PDF to MD</a>
                            </div>
                            <div class="mega-footer"><a href="index.html">See all features →</a></div>
                        </div>
                    </li>

                    <li class="has-dropdown" id="editorsMenu">
                        <a href="#" class="nav-link" onclick="toggleMenu(event,'editorsMenu')">Editors <i class="bi bi-chevron-down chevron"></i></a>
                        <div class="mega-menu">
                            <div class="mega-grid">
                                <div class="mega-label">Editors</div>
                                <a href="text_editor.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-pencil-square"></i></span> Text Editor</a>
                                <a href="regex_tester.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-regex"></i></span> Regex Tester</a>
                                <a href="markdown_editor.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-markdown"></i></span> Markdown Editor</a>
                            </div>
                            <div class="mega-footer"><a href="index.html">See all features →</a></div>
                        </div>
                    </li>

                    <li class="has-dropdown" id="productivityMenu">
                        <a href="#" class="nav-link" onclick="toggleMenu(event,'productivityMenu')">Productivity <i class="bi bi-chevron-down chevron"></i></a>
                        <div class="mega-menu">
                            <div class="mega-grid">
                                <div class="mega-label">Productivity</div>
                                <a href="notes.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-journal-text"></i></span> Notes</a>
                                <a href="todo_list.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-check2-square"></i></span> Todo List</a>
                                <a href="scrum_poker.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-suit-spade-fill"></i></span> Scrum Poker</a>
                                <a href="unit_converter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-rulers"></i></span> Unit Converter</a>
                                <a href="currency_converter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-currency-exchange"></i></span> Currency Converter</a>
                                <a href="timestamp_converter.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-clock-history"></i></span> Timestamp Converter</a>
                                <a href="date_difference_calculator.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-calendar2-range"></i></span> Date Difference Calculator</a>
                                <a href="calculator.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-calculator"></i></span> Calculator</a>
                                <a href="percentage_calculator.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-percent"></i></span> Percentage Calculator</a>
                                <a href="ip_address_lookup.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-globe2"></i></span> IP Address Lookup</a>
                                <a href="cron_parser.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-alarm"></i></span> Cron Parser</a>                            </div>
                            <div class="mega-footer"><a href="index.html">See all features →</a></div>
                        </div>
                    </li>

                    <li class="has-dropdown" id="funMenu">
                        <a href="#" class="nav-link" onclick="toggleMenu(event,'funMenu')">Fun <i class="bi bi-chevron-down chevron"></i></a>
                        <div class="mega-menu">
                            <div class="mega-grid">
                                <div class="mega-label">Fun</div>
                                <a href="cat_facts.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-emoji-smile"></i></span> Cat Facts</a>
                                <a href="dog_facts.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-image"></i></span> Dog Facts</a>
                                <a href="trivia_quiz.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-patch-question"></i></span> Trivia Quiz</a>
                                <a href="advice_slip.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-lightbulb"></i></span> Advice Slip</a>
                                <a href="useless_facts.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-emoji-dizzy"></i></span> Useless Facts</a>
                                <a href="random_masterpiece.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-palette"></i></span> Random Masterpiece</a>
                                <a href="postal_code_lookup.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-mailbox"></i></span> ZIP / PIN Code Lookup</a>
                                <a href="ifsc_code_finder.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-bank"></i></span> IFSC Code Finder</a>
                                <a href="gold_silver_price.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-coin"></i></span> Gold &amp; Silver Price Today</a>
                                <a href="riddle_of_the_day.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-puzzle"></i></span> Riddle of the Day</a>
                                <a href="wikipedia_today.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-wikipedia"></i></span> Wikipedia Today</a>
                                <a href="wildlife_near_you.html" class="menu-item"><span class="icon-wrap"><i class="bi bi-binoculars"></i></span> Wildlife Spotted Near You</a>
                            </div>
                            <div class="mega-footer"><a href="index.html">See all features →</a></div>
                        </div>
                    </li>

                    <!-- <li class="has-dropdown" id="enterpriseMenu">
                        <a href="#" onclick="toggleMenu(event,'enterpriseMenu')">Enterprise <i class="bi bi-chevron-down chevron"></i></a>
                        <div class="mega-menu simple-dropdown">
                            <ul class="simple-list">
                                <li><a href="#">Enterprise overview</a></li>
                                <li><a href="#">Security &amp; compliance</a></li>
                                <li><a href="#">SSO &amp; admin controls</a></li>
                                <li><a href="#">Dedicated support</a></li>
                                <li><a href="#">Contact sales</a></li>
                            </ul>
                        </div>
                    </li> -->

                    <!-- <li><a href="#" class="plain-link">Pricing</a></li> -->

                    <li>
                        <button type="button" class="command-palette-trigger" data-command-palette-open aria-label="Search tools">
                            <i class="bi bi-search"></i> Search <kbd>${getCommandPaletteShortcutLabel()}</kbd>
                        </button>
                    </li>

                    <li><a href="${getFeedbackMailtoLink()}" class="plain-link"><i class="bi bi-chat-dots"></i> Feedback</a></li>

                    <div class="theme-toggle-container">
                        <input type="checkbox" class="form-check-input d-none theme-toggle" id="themeToggle">
                        <label for="themeToggle" class="nav-link no-vertical-padding center-xy">
                            <div class="toggle-track">
                                <div class="toggle-icons light right-aligned">☀️</div>
                                <div class="toggle-icons dark">🌙</div>
                                <div class="toggle-thumb"></div>
                            </div>
                        </label>
                    </div>
                </ul>

                <button class="hamburger" id="hamburger" onclick="toggleMobile()" aria-label="Open menu">
                    <i class="bi bi-list" id="hamburgerIcon"></i>
                </button>
            </div>
        </nav>

        <div class="overlay" id="overlay" onclick="closeAll()"></div>

        <div class="mobile-menu" id="mobileMenu">
            <a href="#" class="mobile-link" data-command-palette-open><i class="bi bi-search"></i> Search tools</a>

            <div class="mobile-section-title">Formatters</div>
            <a href="json_formatter.html" class="mobile-link"><i class="bi bi-filetype-json"></i> JSON Formatter</a>
            <a href="xml_formatter.html" class="mobile-link"><i class="bi bi-filetype-xml"></i> XML Formatter</a>
            <a href="html_formatter.html" class="mobile-link"><i class="bi bi-filetype-html"></i> HTML Formatter</a>
            <a href="query_formatter.html" class="mobile-link"><i class="bi bi-filetype-sql"></i> Query Formatter</a>

            <div class="mobile-section-title">Generators</div>
            <a href="qr_generator.html" class="mobile-link"><i class="bi bi-qr-code"></i> QR Generator</a>
            <a href="barcode_generator.html" class="mobile-link"><i class="bi bi-upc"></i> Barcode Generator</a>
            <a href="checksum_generator.html" class="mobile-link"><i class="bi bi-shield-check"></i> Checksum Generator</a>
            <a href="uuid_generator.html" class="mobile-link"><i class="bi bi-fingerprint"></i> UUID Generator</a>
            <a href="color_picker.html" class="mobile-link"><i class="bi bi-eyedropper"></i> Color Picker</a>

            <div class="mobile-section-title">Converters</div>
            <a href="base64_text_converter.html" class="mobile-link"><i class="bi bi-code-slash"></i> Base64 Text Converter</a>
            <a href="base64_image_converter.html" class="mobile-link"><i class="bi bi-image"></i> Base64 Image Converter</a>
            <a href="data_converter.html" class="mobile-link"><i class="bi bi-translate"></i> Data Converter</a>
            <a href="hash_calculator.html" class="mobile-link"><i class="bi bi-hash"></i> Hash Calculator</a>
            <a href="docx_converter.html" class="mobile-link"><i class="bi bi-file-word"></i> Doc/PDF to MD</a>

            <div class="mobile-section-title">Editors</div>
            <a href="text_editor.html" class="mobile-link"><i class="bi bi-pencil-square"></i> Text Editor</a>
            <a href="regex_tester.html" class="mobile-link"><i class="bi bi-regex"></i> Regex Tester</a>
            <a href="markdown_editor.html" class="mobile-link"><i class="bi bi-markdown"></i> Markdown Editor</a>

            <div class="mobile-section-title">Productivity</div>
            <a href="notes.html" class="mobile-link"><i class="bi bi-journal-text"></i> Notes</a>
            <a href="todo_list.html" class="mobile-link"><i class="bi bi-check2-square"></i> Todo List</a>
            <a href="scrum_poker.html" class="mobile-link"><i class="bi bi-suit-spade-fill"></i> Scrum Poker</a>
            <a href="unit_converter.html" class="mobile-link"><i class="bi bi-rulers"></i> Unit Converter</a>
            <a href="currency_converter.html" class="mobile-link"><i class="bi bi-currency-exchange"></i> Currency Converter</a>
            <a href="timestamp_converter.html" class="mobile-link"><i class="bi bi-clock-history"></i> Timestamp Converter</a>
            <a href="date_difference_calculator.html" class="mobile-link"><i class="bi bi-calendar2-range"></i> Date Difference Calculator</a>
            <a href="calculator.html" class="mobile-link"><i class="bi bi-calculator"></i> Calculator</a>
            <a href="percentage_calculator.html" class="mobile-link"><i class="bi bi-percent"></i> Percentage Calculator</a>
            <a href="ip_address_lookup.html" class="mobile-link"><i class="bi bi-globe2"></i> IP Address Lookup</a>
            <a href="cron_parser.html" class="mobile-link"><i class="bi bi-alarm"></i> Cron Parser</a>
            <div class="mobile-section-title">Fun</div>
            <a href="cat_facts.html" class="mobile-link"><i class="bi bi-emoji-smile"></i> Cat Facts</a>
            <a href="dog_facts.html" class="mobile-link"><i class="bi bi-image"></i> Dog Facts</a>
            <a href="trivia_quiz.html" class="mobile-link"><i class="bi bi-patch-question"></i> Trivia Quiz</a>
            <a href="advice_slip.html" class="mobile-link"><i class="bi bi-lightbulb"></i> Advice Slip</a>
            <a href="useless_facts.html" class="mobile-link"><i class="bi bi-emoji-dizzy"></i> Useless Facts</a>
            <a href="random_masterpiece.html" class="mobile-link"><i class="bi bi-palette"></i> Random Masterpiece</a>
            <a href="postal_code_lookup.html" class="mobile-link"><i class="bi bi-mailbox"></i> ZIP / PIN Code Lookup</a>
            <a href="ifsc_code_finder.html" class="mobile-link"><i class="bi bi-bank"></i> IFSC Code Finder</a>
            <a href="gold_silver_price.html" class="mobile-link"><i class="bi bi-coin"></i> Gold &amp; Silver Price Today</a>
            <a href="riddle_of_the_day.html" class="mobile-link"><i class="bi bi-puzzle"></i> Riddle of the Day</a>
            <a href="wikipedia_today.html" class="mobile-link"><i class="bi bi-wikipedia"></i> Wikipedia Today</a>
            <a href="wildlife_near_you.html" class="mobile-link"><i class="bi bi-binoculars"></i> Wildlife Spotted Near You</a>

            <!-- <div class="mobile-section-title">Company</div>
            <a href="#" class="mobile-link"><i class="bi bi-building"></i> Enterprise</a>
            <a href="#" class="mobile-link"><i class="bi bi-tag"></i> Pricing</a> -->

            <a href="${getFeedbackMailtoLink()}" class="mobile-link"><i class="bi bi-chat-dots"></i> Feedback</a>

            <div class="mobile-section-title">Theme</div>
            <input type="checkbox" class="form-check-input d-none theme-toggle" id="mobileThemeToggle">
            <label for="mobileThemeToggle" class="nav-link no-vertical-padding center-xy">
                <div class="toggle-track">
                    <div class="toggle-icons light right-aligned">☀️</div>
                    <div class="toggle-icons dark">🌙</div>
                    <div class="toggle-thumb"></div>
                </div>
            </label>
        </div>
    `;
}

// Keep this list in sync with THIRD_PARTY_NOTICES.md and the files in the licenses folder.
const THIRD_PARTY_LIBRARIES = [
    { name: "Bootstrap", license: "MIT", url: "https://getbootstrap.com/", file: "licenses/bootstrap-LICENSE.txt" },
    { name: "Bootstrap Icons", license: "MIT", url: "https://icons.getbootstrap.com/", file: "licenses/bootstrap-icons-LICENSE.txt" },
    { name: "CodeMirror", license: "MIT", url: "https://codemirror.net/5/", file: "licenses/codemirror-LICENSE.txt" },
    { name: "jsQR", license: "Apache-2.0", url: "https://github.com/cozmo/jsQR", file: "licenses/jsqr-LICENSE.txt" },
    { name: "ZXing (zxing-browser)", license: "MIT", url: "https://github.com/zxing-js/browser", file: "licenses/zxing-browser-LICENSE.txt" },
    { name: "ZXing (zxing-library, bundled)", license: "Apache-2.0", url: "https://github.com/zxing-js/library", file: "licenses/zxing-library-LICENSE.txt" },
    { name: "bwip-js", license: "MIT", url: "https://github.com/metafloor/bwip-js", file: "licenses/bwip-js-LICENSE.txt" },
    { name: "qrcode.js", license: "MIT", url: "https://github.com/davidshimjs/qrcodejs", file: "licenses/qrcodejs-LICENSE.txt" },
    { name: "CryptoJS", license: "MIT", url: "https://github.com/brix/crypto-js", file: "licenses/crypto-js-LICENSE.txt" },
    { name: "Marked", license: "MIT", url: "https://marked.js.org/", file: "licenses/marked-LICENSE.txt" },
    { name: "Turndown", license: "MIT", url: "https://github.com/mixmark-io/turndown", file: "licenses/turndown-LICENSE.txt" },
    { name: "Mammoth.js", license: "BSD-2-Clause", url: "https://github.com/mwilliamson/mammoth.js", file: "licenses/mammoth-LICENSE.txt" },
    { name: "PDF.js", license: "Apache-2.0", url: "https://mozilla.github.io/pdf.js/", file: "licenses/pdfjs-LICENSE.txt" },
    { name: "DOMPurify", license: "Apache-2.0 / MPL-2.0", url: "https://github.com/cure53/DOMPurify", file: "licenses/dompurify-LICENSE.txt" },
    { name: "diff-match-patch", license: "Apache-2.0", url: "https://github.com/google/diff-match-patch", file: "licenses/diff-match-patch-LICENSE.txt" },
    { name: "SQL Formatter", license: "MIT", url: "https://github.com/sql-formatter-org/sql-formatter", file: "licenses/sql-formatter-LICENSE.txt" },
    { name: "PeerJS", license: "MIT", url: "https://peerjs.com/", file: "licenses/peerjs-LICENSE.txt" },
    { name: "Archivo Black and Space Mono fonts (Google Fonts)", license: "OFL-1.1", url: "https://fonts.google.com/", file: "https://openfontlicense.org/open-font-license-official-text/" },
];

function getLicenseTableRows() {
    return THIRD_PARTY_LIBRARIES.map(lib => `
        <tr>
            <td>${lib.name}</td>
            <td>${lib.license}</td>
            <td>
                <a href="${lib.url}" target="_blank" rel="noopener noreferrer">Homepage</a>
                &middot;
                <a href="${lib.file}" target="_blank" rel="noopener noreferrer">License text</a>
            </td>
        </tr>
    `).join("");
}

function getFooter() {
    return `
        <footer class="site-footer">
            <div class="footer-inner">
                <span>&copy; ${new Date().getFullYear()} <span class="footer-brand">Codexael</span>. Released under the MIT License.</span>
                <div class="footer-links">
                    <a href="#" data-bs-toggle="modal" data-bs-target="#licensesModal">Third-party licenses</a>
                    <span class="dot-sep">&middot;</span>
                    <a href="${getFeedbackMailtoLink()}"><i class="bi bi-chat-dots"></i> Feedback</a>
                </div>
            </div>
        </footer>

        <div class="modal fade" id="licensesModal" tabindex="-1" aria-labelledby="licensesModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content welcome-modal-content">
                    <div class="modal-header welcome-modal-header">
                        <h5 class="modal-title" id="licensesModalLabel"><i class="bi bi-file-earmark-text"></i> Third-party licenses</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body welcome-modal-body">
                        <p class="welcome-intro">Toolstack is built with the following open-source libraries. Full notices are in THIRD_PARTY_NOTICES.md in the source repository.</p>
                        <div style="overflow-x:auto;">
                            <table class="license-table">
                                <thead>
                                    <tr><th>Library</th><th>License</th><th>Link</th></tr>
                                </thead>
                                <tbody>${getLicenseTableRows()}</tbody>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer welcome-modal-footer">
                        <button type="button" class="welcome-cta-btn" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}
