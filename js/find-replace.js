// Adds a per-editor Find (Ctrl+F) / Replace (Ctrl+H) / Go to line (Ctrl+G) overlay to a CodeMirror instance.
// Desktop only. Each call creates fully isolated state and DOM, so containers never affect each other.

const FR_DESKTOP_BREAKPOINT = 768;

function attachFindReplace(cm) {
    const state = {
        cm,
        root: null,
        open: false,
        expanded: false,
        query: "",
        replacement: "",
        toggles: { regex: false, case: false, word: false, selection: false },
        matches: [],
        markers: [],
        currentIndex: -1
    };

    cm.on("keydown", (instance, e) => {
        if (window.innerWidth <= FR_DESKTOP_BREAKPOINT) return;
        const key = e.key.toLowerCase();
        if ((e.ctrlKey || e.metaKey) && !e.altKey && !e.shiftKey && key === "g") {
            e.preventDefault();
            e.stopPropagation();
            frOpenGoto(state);
        } else if ((e.ctrlKey || e.metaKey) && !e.altKey && (key === "f" || key === "h")) {
            e.preventDefault();
            e.stopPropagation();
            frOpen(state, key === "h");
        }
    });

    cm.on("cursorActivity", () => { if (state.open) frUpdateSelectionToggleState(state); });
    cm.on("change", () => { if (state.open) frRecompute(state); });
}

// Escapes regex special characters in a literal search string
function frEscapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Builds a RegExp from the current query and toggle state, or null if invalid/empty
function frBuildRegex(state) {
    if (!state.query) return null;
    let pattern = state.toggles.regex ? state.query : frEscapeRegExp(state.query);
    if (state.toggles.word) pattern = `\\b(?:${pattern})\\b`;
    try { return new RegExp(pattern, state.toggles.case ? "g" : "gi"); }
    catch (error) { return null; }
}

// Clears all match highlight markers
function frClearMarks(state) {
    state.markers.forEach(marker => marker.clear());
    state.markers = [];
}

// Recomputes matches against the editor's current content and re-renders highlights
function frRecompute(state) {
    const cm = state.cm;
    frClearMarks(state);
    state.matches = [];

    const regex = frBuildRegex(state);
    if (!regex) {
        state.currentIndex = -1;
        frUpdateUI(state);
        return;
    }

    let searchText = cm.getValue();
    let baseOffset = 0;
    const useSelection = state.toggles.selection && cm.somethingSelected();
    if (useSelection) {
        const from = cm.getCursor("from");
        baseOffset = cm.indexFromPos(from);
        searchText = cm.getRange(from, cm.getCursor("to"));
    }

    let match;
    regex.lastIndex = 0;
    while ((match = regex.exec(searchText))) {
        if (match[0].length === 0) { regex.lastIndex++; continue; }
        const from = cm.posFromIndex(baseOffset + match.index);
        const to = cm.posFromIndex(baseOffset + match.index + match[0].length);
        state.matches.push({ from, to });
        state.markers.push(cm.markText(from, to, { className: "cm-fr-match" }));
    }

    if (state.matches.length === 0) state.currentIndex = -1;
    else if (state.currentIndex < 0 || state.currentIndex >= state.matches.length) state.currentIndex = 0;

    frUpdateUI(state);
    if (state.matches.length) frGoToMatch(state, state.currentIndex);
}

// Moves the editor selection/scroll to the match at the given index (wrapping)
function frGoToMatch(state, index) {
    if (!state.matches.length) return;
    index = ((index % state.matches.length) + state.matches.length) % state.matches.length;
    state.currentIndex = index;
    const match = state.matches[index];
    state.cm.setSelection(match.from, match.to);
    state.cm.scrollIntoView(match.from, 60);
    frUpdateUI(state);
}

function frNext(state) { if (state.matches.length) frGoToMatch(state, state.currentIndex + 1); }
function frPrev(state) { if (state.matches.length) frGoToMatch(state, state.currentIndex - 1); }

// Selects every match as a multi-selection in the editor
function frSelectAll(state) {
    if (!state.matches.length) return;
    const ranges = state.matches.map(m => ({ anchor: m.from, head: m.to }));
    state.cm.setSelections(ranges, 0);
    state.cm.focus();
}

// Replaces the current match, respecting regex capture groups when regex mode is on
function frReplace(state) {
    const cm = state.cm;
    if (cm.getOption("readOnly") || !state.matches.length) return;
    if (state.currentIndex < 0) state.currentIndex = 0;

    const match = state.matches[state.currentIndex];
    const matchedText = cm.getRange(match.from, match.to);
    const replacementPattern = state.toggles.regex ? state.replacement : state.replacement.replace(/\$/g, "$$$$");
    const singleRegex = frBuildRegex({ ...state, query: state.toggles.regex ? state.query : matchedText });
    const replacementText = singleRegex ? matchedText.replace(singleRegex, replacementPattern) : replacementPattern;

    cm.replaceRange(replacementText, match.from, match.to);
    frRecompute(state);
}

// Replaces every match (within the selection scope if active), in one editor operation
function frReplaceAll(state) {
    const cm = state.cm;
    if (cm.getOption("readOnly") || !state.query) return;

    const regex = frBuildRegex(state);
    if (!regex) return;

    const replacementPattern = state.toggles.regex ? state.replacement : state.replacement.replace(/\$/g, "$$$$");

    if (state.toggles.selection && cm.somethingSelected()) {
        const from = cm.getCursor("from");
        const to = cm.getCursor("to");
        const replaced = cm.getRange(from, to).replace(regex, replacementPattern);
        cm.replaceRange(replaced, from, to);
    } else {
        const cursor = cm.getCursor();
        cm.setValue(cm.getValue().replace(regex, replacementPattern));
        cm.setCursor(cursor);
    }

    frRecompute(state);
}

// Enables/disables the "search in selection" toggle based on whether a selection currently exists
function frUpdateSelectionToggleState(state) {
    if (!state.root) return;
    const hasSelection = state.cm.somethingSelected();
    const btn = state.root.querySelector(".fr-toggle-selection");
    btn.disabled = !hasSelection;
    btn.classList.toggle("disabled", !hasSelection);
    if (!hasSelection && state.toggles.selection) {
        state.toggles.selection = false;
        btn.classList.remove("active");
        frRecompute(state);
    }
}

// Refreshes count text and enabled state of navigation/replace buttons
function frUpdateUI(state) {
    if (!state.root) return;
    const total = state.matches.length;
    const current = total ? state.currentIndex + 1 : 0;
    state.root.querySelector(".fr-count").textContent = `${current} of ${total}`;

    const noMatches = total === 0;
    state.root.querySelectorAll(".fr-prev, .fr-next, .fr-all").forEach(btn => btn.disabled = noMatches);
    state.root.querySelectorAll(".fr-replace, .fr-replace-all").forEach(btn => btn.disabled = noMatches || state.cm.getOption("readOnly"));
}

function frSetExpanded(state, expanded) {
    state.expanded = expanded && !state.cm.getOption("readOnly");
    state.root.querySelector(".fr-row-replace").style.display = state.expanded ? "flex" : "none";
    state.root.querySelector(".fr-toggle-expand").innerHTML = state.expanded
        ? '<i class="bi bi-dash-lg"></i>'
        : '<i class="bi bi-plus-lg"></i>';
    state.root.classList.toggle("fr-expanded", state.expanded);
    state.root.querySelector(".fr-row-replace").hidden = !state.expanded;

    const replaceControls = state.root.querySelectorAll(".fr-toggle-expand");
    replaceControls.forEach(btn => btn.disabled = state.cm.getOption("readOnly"));
}

function frClose(state) {
    state.open = false;
    if (state.root) state.root.style.display = "none";
    frClearMarks(state);
    state.cm.focus();
}

function frOpen(state, replaceMode) {
    frBuild(state);
    state.open = true;
    state.root.style.display = "flex";
    state.root.classList.remove("fr-goto-mode");
    frSetExpanded(state, replaceMode);
    frUpdateSelectionToggleState(state);

    const queryInput = state.root.querySelector(".fr-query-input");
    queryInput.focus();
    queryInput.select();

    if (state.query) frRecompute(state);
    else frUpdateUI(state);
}

// Opens the widget in go-to-line mode with the current line number selected.
function frOpenGoto(state) {
    frBuild(state);
    frClearMarks(state);
    state.open = true;
    state.root.style.display = "flex";
    state.root.classList.add("fr-goto-mode");

    const lineCount = state.cm.lineCount();
    const gotoInput = state.root.querySelector(".fr-goto-input");
    gotoInput.value = String(state.cm.getCursor().line + 1);
    gotoInput.placeholder = `Line 1-${lineCount}, or line:column`;
    gotoInput.classList.remove("fr-invalid");
    state.root.querySelector(".fr-goto-total").textContent = `of ${lineCount}`;
    gotoInput.focus();
    gotoInput.select();
}

// Reads "line" or "line:column" and clamps both to the editor content, or returns null when the text is not a number.
function frParseGotoTarget(cm, text) {
    const match = text.trim().match(/^(\d+)(?:\s*[:,]\s*(\d+))?$/);
    if (!match) return null;
    const line = Math.min(Math.max(parseInt(match[1], 10), 1), cm.lineCount()) - 1;
    const column = match[2] ? parseInt(match[2], 10) : 1;
    const ch = Math.min(Math.max(column, 1), cm.getLine(line).length + 1) - 1;
    return { line, ch };
}

// Moves the cursor to the typed line and scrolls it to the middle of the editor.
function frGoToLine(state) {
    const gotoInput = state.root.querySelector(".fr-goto-input");
    const target = frParseGotoTarget(state.cm, gotoInput.value);
    if (!target) {
        gotoInput.classList.add("fr-invalid");
        return;
    }

    frClose(state);
    const cm = state.cm;
    cm.setCursor(target);
    const top = cm.charCoords(target, "local").top;
    cm.scrollTo(null, top - cm.getScrollInfo().clientHeight / 2);
}

function frToggle(state, button, key) {
    state.toggles[key] = !state.toggles[key];
    button.classList.toggle("active", state.toggles[key]);
    frRecompute(state);
}

// Lazily builds the widget DOM once per editor and wires up its controls
function frBuild(state) {
    if (state.root) return;

    const cm = state.cm;
    const wrapper = document.createElement("div");
    wrapper.className = "fr-widget";
    wrapper.innerHTML = `
        <div class="fr-row fr-row-find">
            <input type="text" class="fr-input fr-query-input" placeholder="Search for" autocomplete="off" spellcheck="false">
            <button class="fr-btn fr-prev" title="Previous match (Shift+Enter)"><i class="bi bi-chevron-left"></i></button>
            <button class="fr-btn fr-next" title="Next match (Enter)"><i class="bi bi-chevron-right"></i></button>
            <button class="fr-btn fr-all fr-btn-text" title="Select all matches">All</button>
            <button class="fr-btn fr-close" title="Close (Esc)"><i class="bi bi-x-lg"></i></button>
        </div>
        <div class="fr-row fr-row-replace" hidden>
            <input type="text" class="fr-input fr-replace-input" placeholder="Replace with" autocomplete="off" spellcheck="false">
            <button class="fr-btn fr-replace fr-btn-text" title="Replace current match">Replace</button>
            <button class="fr-btn fr-replace-all fr-btn-text" title="Replace all matches">All</button>
        </div>
        <div class="fr-row fr-row-status">
            <button class="fr-btn fr-toggle-expand" title="Toggle replace"><i class="bi bi-plus-lg"></i></button>
            <span class="fr-count">0 of 0</span>
            <button class="fr-btn fr-goto-open" title="Go to line (Ctrl+G)"><i class="bi bi-arrow-down-up"></i></button>
            <span class="fr-spacer"></span>
            <button class="fr-toggle fr-toggle-regex" title="Use Regular Expression">.*</button>
            <button class="fr-toggle fr-toggle-case" title="Match Case">Aa</button>
            <button class="fr-toggle fr-toggle-word" title="Match Whole Word">\\b</button>
            <button class="fr-toggle fr-toggle-selection" title="Search in Selection">S</button>
        </div>
        <div class="fr-row fr-row-goto">
            <span class="fr-goto-label">Go to line</span>
            <input type="text" class="fr-input fr-goto-input" inputmode="numeric" autocomplete="off" spellcheck="false" aria-label="Line number">
            <span class="fr-goto-total"></span>
            <button class="fr-btn fr-goto-go" title="Go (Enter)"><i class="bi bi-arrow-return-left"></i></button>
            <button class="fr-btn fr-close" title="Close (Esc)"><i class="bi bi-x-lg"></i></button>
        </div>
    `;
    cm.getWrapperElement().appendChild(wrapper);
    state.root = wrapper;

    const queryInput = wrapper.querySelector(".fr-query-input");
    const replaceInput = wrapper.querySelector(".fr-replace-input");
    const gotoInput = wrapper.querySelector(".fr-goto-input");

    queryInput.addEventListener("input", () => { state.query = queryInput.value; frRecompute(state); });
    replaceInput.addEventListener("input", () => { state.replacement = replaceInput.value; });

    queryInput.addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); e.shiftKey ? frPrev(state) : frNext(state); }
        else if (e.key === "Escape") { e.preventDefault(); frClose(state); }
    });
    replaceInput.addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); frReplace(state); }
        else if (e.key === "Escape") { e.preventDefault(); frClose(state); }
    });
    gotoInput.addEventListener("keydown", e => {
        if (e.key === "Enter") { e.preventDefault(); frGoToLine(state); }
        else if (e.key === "Escape") { e.preventDefault(); frClose(state); }
    });
    gotoInput.addEventListener("input", () => gotoInput.classList.remove("fr-invalid"));

    wrapper.querySelector(".fr-prev").addEventListener("click", () => frPrev(state));
    wrapper.querySelector(".fr-next").addEventListener("click", () => frNext(state));
    wrapper.querySelector(".fr-all").addEventListener("click", () => frSelectAll(state));
    wrapper.querySelectorAll(".fr-close").forEach(btn => btn.addEventListener("click", () => frClose(state)));
    wrapper.querySelector(".fr-replace").addEventListener("click", () => frReplace(state));
    wrapper.querySelector(".fr-replace-all").addEventListener("click", () => frReplaceAll(state));
    wrapper.querySelector(".fr-toggle-expand").addEventListener("click", () => frSetExpanded(state, !state.expanded));
    wrapper.querySelector(".fr-goto-open").addEventListener("click", () => frOpenGoto(state));
    wrapper.querySelector(".fr-goto-go").addEventListener("click", () => frGoToLine(state));

    wrapper.querySelector(".fr-toggle-regex").addEventListener("click", e => frToggle(state, e.currentTarget, "regex"));
    wrapper.querySelector(".fr-toggle-case").addEventListener("click", e => frToggle(state, e.currentTarget, "case"));
    wrapper.querySelector(".fr-toggle-word").addEventListener("click", e => frToggle(state, e.currentTarget, "word"));
    wrapper.querySelector(".fr-toggle-selection").addEventListener("click", e => {
        if (e.currentTarget.disabled) return;
        frToggle(state, e.currentTarget, "selection");
    });
}
