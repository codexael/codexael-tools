const MAX_FILE_SIZE_MB = 10;
const STORAGE_THEME_KEY = "theme";
window.PAGE_TITLE = window.location.pathname.split("/").pop().replaceAll(".html", "");

let openMenu = null;
let mobileOpen = false;

// Runs after HTML content has fully loaded, get theme local storage and update the page UI elements
window.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    const mobileThemeToggle = document.getElementById("mobileThemeToggle");

    themeToggle.addEventListener("change", () => themeUpdated(themeToggle.checked));
    mobileThemeToggle.addEventListener("change", () => themeUpdated(mobileThemeToggle.checked));

    var theme = getStorageString(STORAGE_THEME_KEY);
    if (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches) theme = "dark";
    themeUpdated(theme === "dark");
});

// Updates UI when theme is changed
function themeUpdated(toggleChecked) {
    themeToggle.checked = toggleChecked;
    mobileThemeToggle.checked = toggleChecked;
    document.body.classList.toggle("dark-theme", toggleChecked);
    const currentTheme = toggleChecked ? "dark" : "light";
    setStorageString(STORAGE_THEME_KEY, currentTheme);
}

function toggleMenu(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const el = document.getElementById(id);
    if (openMenu && openMenu !== el) openMenu.classList.remove('open');
    el.classList.toggle('open');
    openMenu = el.classList.contains('open') ? el : null;

    if (openMenu) {
        const dropdown = openMenu.querySelector('.simple-dropdown');
        if (dropdown) {
            const triggerRect = openMenu.querySelector('a').getBoundingClientRect();
            const dropdownWidth = parseInt(getComputedStyle(dropdown).width) || 200;
            const viewportWidth = window.innerWidth;

            if (triggerRect.left + dropdownWidth > viewportWidth - 16) {
                dropdown.style.left = 'auto';
                dropdown.style.right = (viewportWidth - triggerRect.right) + 'px';
            } else {
                dropdown.style.left = triggerRect.left + 'px';
                dropdown.style.right = 'auto';
            }
            dropdown.style.transform = 'none';
        }
    }

    document.getElementById('overlay').classList.toggle('active', openMenu !== null);
}

function toggleMobile() {
    mobileOpen = !mobileOpen;
    document.getElementById('mobileMenu').classList.toggle('open', mobileOpen);
    document.getElementById('overlay').classList.toggle('active', mobileOpen);
    document.getElementById('hamburgerIcon').className = mobileOpen ? 'bi bi-x' : 'bi bi-list';
}

function closeAll() {
    document.querySelectorAll('.has-dropdown.open').forEach(el => el.classList.remove('open'));
    openMenu = null;
    mobileOpen = false;
    document.getElementById('mobileMenu').classList.remove('open');
    document.getElementById('hamburgerIcon').className = 'bi bi-list';
    document.getElementById('overlay').classList.remove('active');
}

document.addEventListener('click', (e) => {
    if (!e.target.closest('.has-dropdown') && !e.target.closest('.mobile-menu') && !e.target.closest('.hamburger')) { closeAll(); }
});

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeAll(); });

window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && mobileOpen) closeAll();
});

// Clears the value of the specified input element
function clearInput(element) {
    element.setValue("");
}

// Copies element value to clipboard
function copyToClipboard(element, copyIconId) {
    try {
        const copyIcon = document.getElementById(copyIconId);
        const data = element.getValue();
        if (!data.trim()) {
            showInfoToast("Nothing to copy");
            return;
        }
        navigator.clipboard.writeText(data).then(() => {
            copyIcon.className = 'bi bi-check-lg icon-btn';
            setTimeout(() => copyIcon.className = 'bi bi-copy icon-btn', 1000);
            showSuccessToast("Code copied to clipboard");
        });
    } catch (error) {
        console.log("Copy to clipboard error:", error.message);
        showErrorToast("Error copying to clipboard");
    }
}

const TOAST_DURATION_MS = 3000;

const TOAST_META = {
    success: {
        tag: "[OK]",
        role: "status",
        icon: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.5L6.2 11.5L13 4.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    },
    error: {
        tag: "[ERR]",
        role: "alert",
        icon: '<svg viewBox="0 0 16 16" fill="none"><path d="M4 4L12 12M12 4L4 12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
    },
    warning: {
        tag: "[WARN]",
        role: "status",
        icon: '<svg viewBox="0 0 16 16" fill="none"><path d="M8 1.5L15 13.5H1L8 1.5Z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 6.2V9.2" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="11.3" r="0.9" fill="currentColor"/></svg>'
    },
    info: {
        tag: "[INFO]",
        role: "status",
        icon: '<svg viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6.3" stroke="currentColor" stroke-width="1.4"/><path d="M8 7.2V11.4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><circle cx="8" cy="4.9" r="0.9" fill="currentColor"/></svg>'
    },
    pending: {
        tag: "[SYNC]",
        role: "status",
        icon: '<svg class="toast-spin" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="6" stroke="currentColor" stroke-opacity="0.25" stroke-width="1.6"/><path d="M14 8A6 6 0 0 0 8 2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>'
    }
};

// Returns the toast stack for the current fullscreen element (if any) or the document body, creating it on first use.
function getToastStack() {
    const root = document.fullscreenElement || document.body;
    let stack = root.querySelector(":scope > .toast-stack");
    if (!stack) {
        stack = document.createElement("div");
        stack.className = "toast-stack";
        stack.setAttribute("aria-live", "polite");
        stack.setAttribute("aria-atomic", "false");
        root.appendChild(stack);
    }
    return stack;
}

function prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Fills a toast element with the markup for the given type and message, wiring up its close button, optional action button and auto-dismiss timer.
function renderToast(toast, type, message, { duration = TOAST_DURATION_MS, action = null } = {}) {
    const meta = TOAST_META[type];
    toast.style.setProperty("--tone", `var(--toast-${type})`);
    toast.setAttribute("role", meta.role);
    toast.innerHTML =
        `<div class="toast-top">` +
        `<span class="toast-icon">${meta.icon}</span>` +
        `<span class="toast-tag">${meta.tag}</span>` +
        `<span class="toast-msg"></span>` +
        (action ? `<button type="button" class="toast-action"></button>` : "") +
        `</div>` +
        `<button class="toast-close" aria-label="Dismiss">&times;</button>` +
        `<span class="toast-bar"></span>`;
    toast.querySelector(".toast-msg").textContent = message;

    const bar = toast.querySelector(".toast-bar");
    if (!prefersReducedMotion()) bar.style.animationDuration = `${duration}ms`;

    if (action) {
        const actionButton = toast.querySelector(".toast-action");
        actionButton.textContent = action.label;
        actionButton.addEventListener("click", () => {
            dismissToast(toast);
            action.onClick();
        });
    }

    toast.querySelector(".toast-close").addEventListener("click", () => dismissToast(toast));
    toast.dismissTimer = setTimeout(() => dismissToast(toast), duration);
}

function dismissToast(toast) {
    if (!toast.isConnected) return;
    clearTimeout(toast.dismissTimer);
    toast.classList.add("leave");
    setTimeout(() => toast.remove(), prefersReducedMotion() ? 0 : 260);
}

// Displays a toast notification of the given type and returns the toast element.
function showToast(type, message, options) {
    const stack = getToastStack();
    const toast = document.createElement("div");
    toast.className = "toast-line enter";
    renderToast(toast, type, message, options);
    stack.appendChild(toast);
    requestAnimationFrame(() => toast.classList.remove("enter"));
    return toast;
}

// Turns a pending toast (returned by showPendingToast) into its final success/error/info/warning state in place.
function resolvePendingToast(toast, type, message) {
    if (!toast.isConnected) return;
    clearTimeout(toast.dismissTimer);
    renderToast(toast, type, message);
}

function showSuccessToast(message) { return showToast("success", message); }
function showErrorToast(message) { return showToast("error", message); }
function showWarningToast(message) { return showToast("warning", message); }
function showInfoToast(message) { return showToast("info", message); }
function showPendingToast(message) { return showToast("pending", message); }

const UNDO_TOAST_DURATION_MS = 5000;

// Shows a toast with an Undo button that calls onUndo when clicked within five seconds.
function showUndoToast(message, onUndo) {
    return showToast("info", message, { duration: UNDO_TOAST_DURATION_MS, action: { label: "Undo", onClick: onUndo } });
}

// Snapshots the page in the capture phase before a data-undo-clear button's own handler runs, then offers Undo if anything changed.
document.addEventListener("click", event => {
    const button = event.target.closest("[data-undo-clear]");
    if (!button || button.disabled) return;

    const before = captureClearUndoState();
    // Waits one tick so the button's own click handler has finished clearing the page.
    setTimeout(() => {
        if (!hasClearUndoStateChanged(before, captureClearUndoState())) return;
        const message = button.dataset.undoClear || "Input cleared";
        showUndoToast(message, () => {
            restoreClearUndoState(before);
            showSuccessToast(message.replace("cleared", "restored"));
        });
    }, 0);
}, true);

// Lists the form fields that Undo can put back, leaving out file pickers, buttons and CodeMirror's hidden source textareas.
function getClearUndoFields() {
    const editorTextAreas = new Set(getClearUndoEditors().map(cm => cm.getTextArea && cm.getTextArea()).filter(Boolean));
    return Array.from(document.querySelectorAll("input, textarea, select")).filter(el =>
        !editorTextAreas.has(el) &&
        !el.closest(".fr-widget, #commandPalette, #navbar-container") &&
        !["file", "button", "submit", "reset", "image"].includes(el.type));
}

// Returns every CodeMirror editor on the page.
function getClearUndoEditors() {
    return Array.from(document.querySelectorAll(".CodeMirror")).map(el => el.CodeMirror).filter(Boolean);
}

// Records every editor value, every form field value and any extra state the page reports through getPageUndoState().
function captureClearUndoState() {
    return {
        editors: getClearUndoEditors().map(cm => ({ cm, value: cm.getValue(), cursor: cm.getCursor() })),
        fields: getClearUndoFields().map(el => ({ el, value: el.value, checked: el.checked })),
        page: typeof getPageUndoState === "function" ? getPageUndoState() : null
    };
}

// Checks whether any editor, field or page value is different between two snapshots.
function hasClearUndoStateChanged(before, after) {
    const editorChanged = before.editors.some(saved => saved.cm.getValue() !== saved.value);
    const fieldChanged = before.fields.some(saved => saved.el.value !== saved.value || saved.el.checked !== saved.checked);
    const pageChanged = before.page !== null && after.page !== null &&
        Object.keys(before.page).some(key => before.page[key] !== after.page[key]);
    return editorChanged || fieldChanged || pageChanged;
}

// Puts back choices, then text fields, then editors, firing user-edit events so each tool refreshes without a choice handler overwriting restored text.
function restoreClearUndoState(state) {
    const isChoice = el => el.tagName === "SELECT" || el.type === "radio" || el.type === "checkbox";

    state.fields.filter(saved => isChoice(saved.el)).forEach(saved => {
        const { el } = saved;
        if (el.tagName === "SELECT") {
            if (el.value === saved.value) return;
            el.value = saved.value;
            if (window.CustomDropdown) CustomDropdown.refresh(el);
            el.dispatchEvent(new Event("change", { bubbles: true }));
        } else if (el.checked !== saved.checked) {
            el.checked = saved.checked;
            // Fires change only on the option that becomes checked, which matches what the browser does.
            if (el.type === "checkbox" || el.checked) el.dispatchEvent(new Event("change", { bubbles: true }));
        }
    });

    state.fields.filter(saved => !isChoice(saved.el) && saved.el.value !== saved.value).forEach(saved => {
        saved.el.value = saved.value;
        saved.el.dispatchEvent(new Event("input", { bubbles: true }));
    });

    state.editors.filter(saved => saved.cm.getValue() !== saved.value).forEach(saved => {
        saved.cm.setValue(saved.value);
        saved.cm.setCursor(saved.cursor);
    });

    // Lets the page put back state that lives outside form fields, such as a loaded file or image.
    if (state.page !== null && typeof restorePageUndoState === "function") restorePageUndoState(state.page);
}

function toggleEditorFullScreen(elementId) {
    try {
        if (!document.fullscreenElement) { document.getElementById(elementId).requestFullscreen(); }
        else { document.exitFullscreen(); }
    } catch (error) {
        console.log("Fullscreen error:", error);
        showErrorToast("Error doing fullscreen");
    }
}

// Downloads element content as a file
function downloadData(file_name = "dev_tools.txt", isInput = true) {
    try {
        const content = isInput ? codeMirrorInput.getValue() : codeMirrorOutput.getValue();
        if (!content.trim()) {
            showInfoToast("Nothing to download");
            return;
        }

        let mime = file_name.endsWith(".json")
            ? "application/json"
            : file_name.endsWith(".xml")
                ? "application/xml"
                : file_name.endsWith(".html")
                    ? "text/html"
                    : "text/plain";
        
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = file_name;
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    } catch (error) {
        console.log("Download error:", error);
        showErrorToast("Error downloading");
    }
}

// Checks whether input element value is empty or blank
function isInputBlank(element) {
    try { return isBlank(element.getValue()); }
    catch (error) { console.log("Something went wrong validating input:", error); }
    return false;
}

// Checks if value is empty or blank and shows message
function isBlank(value, message = "Please enter content") {
    try {
        if (!value.trim())
        {
            showInfoToast(message);
            return true;
        }
    } catch (error) { console.log("Something went wrong validating input:", error); }
    return false;
}

// Clears input/output fields
function clearInputs() {
    clearInput(codeMirrorInput);
    clearInput(codeMirrorOutput);
}

// Opens file selection dialog
function openFilePicker(element = null) {
    if (element === null) {
        fileInput.value = "";
        fileInput.click();
    }
    else {
        element.value = "";
        element.click();
    }
}

// Handles selected file input with optional format validation
function handleFileSelect(event, fileFormat = null, element = null) {
    try {
        const file = event.target.files[0];
        if (!file) return;

        const sizeInMB = file.size / (1024 * 1024);
        if (sizeInMB > MAX_FILE_SIZE_MB) {
            showErrorToast(`File size exceeds ${MAX_FILE_SIZE_MB} MB limit`);
            return;
        }
        
        const fileReader = new FileReader();

        if (fileFormat === "QR" || fileFormat === "Barcode") {
            fileReader.onload = function (e) {
                var fileData = e.target.result;
                if (fileFormat === "QR") scanQRCodeImage(fileData);
                else if (fileFormat === "Barcode") scanBarcodeImage(fileData);
            };
            fileReader.readAsDataURL(file);
        }
        else {
            fileReader.onload = function (e) {
                if (element === null) {
                    codeMirrorInput.setValue(e.target.result);
                }
                else {
                    element.setValue(e.target.result);
                }
                if (fileFormat === "JSON") processJson();
                else if (fileFormat === "XML") processXml();
                else if (fileFormat === "HTML") processHtml();
                else if (fileFormat === "SQL") processQuery();
                else if (fileFormat === "data") convertData();
            };
            fileReader.readAsText(file);
        }
    } catch (error) {
        console.log("File select error:", error.message);
        showErrorToast(`Invalid ${fileFormat} file`);
    }
}

// Prints data with configurable title and format
function printData({ title, isInput = true, format = "data", value = null } = {}) {
    try {
        const data = value === null ? (isInput ? codeMirrorInput.getValue() : codeMirrorOutput.getValue()) : value;
        if (isBlank(data, "Nothing to print")) return;
        const printWindow = window.open("", "_blank");
        printWindow.document.write(`
            <html>
                <head>
                    <title>Toolstack - ${title}</title>
                    <style>
                        body { font-family: monospace; padding: 20px; }
                        pre { white-space: pre-wrap; word-break: break-word; }
                    </style>
                </head>
                <body>
                    <pre>${data.replace(/</g, "&lt;")}</pre>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    } catch (error) {
        console.log("Printing " + format + " error:", error.message);
        showErrorToast(`Error printing ${format}`);
    }
}

// Validates input or output data based on format
function validateData(format, isInput = true) {
    try {
        const data = isInput ? codeMirrorInput.getValue() : codeMirrorOutput.getValue();
        if (isBlank(data)) return;
        if (format == "JSON") JSON.parse(data);
        else if (format == "XML") parseXML(data);
        showSuccessToast(`Valid ${format}`);
    } catch (error) {
        console.log("Validate " + format + " error:", error.message);
        showErrorToast(`Invalid ${format}`);
    }
}

// Parses XML string into a DOM object
function parseXML(content) {
    const parser = new DOMParser();
    const xml = parser.parseFromString(content, "application/xml");
    const error = xml.querySelector("parsererror");
    if (error) { throw new Error(error.textContent); }
    return xml;
}

// Formats XML string with specified indentation
function formatXML(xml, tabSize) {
    const PADDING = " ".repeat(tabSize);
    let formatted = "";
    let indent = 0;

    xml.replace(/>\s*</g, ">\n<").split("\n").forEach(line => {
        line = line.trim();
        if (/^<\/.+>/.test(line)) { indent--; }
        formatted += PADDING.repeat(Math.max(indent, 0)) + line + "\n";
        if (/^<[^!?\/][^>]*>$/.test(line) && !line.includes("</") ) { indent++; }
    });

    return formatted.trim();
}

function createCodeMirrorEditor(textarea, format = null) {
    const editor = CodeMirror.fromTextArea(textarea, {
        lineNumbers: true,
        lineWrapping: true,
        mode: getEditorMode(format),
        styleActiveLine: true,
        autoCloseBrackets: true,
        autoCloseTags: true,
        matchTags: format !== "JSON",
        matchBrackets: true,
        foldGutter: true,
        gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"]
    });
    attachFindReplace(editor);
    return editor;
}

function getEditorMode(format) {
    if (format === "SQL") return "text/x-sql";
    return format === "JSON" ? "application/json" : (format === "XML" ? "application/xml" : (format === "HTML" ? "htmlmixed" : "text/plain"));
}

function setupEditors(editorsConfig) {
    function updateCursorInfo(editor, config) {
        const cursor = editor.getCursor();

        config.currentLine.textContent = cursor.line + 1;
        config.currentColumn.textContent = cursor.ch + 1;
        config.totalLines.textContent = editor.lineCount();
    }

    editorsConfig.forEach(({ editor, config }) => {
        const handler = () => updateCursorInfo(editor, config);
        editor.on("cursorActivity", handler);
        editor.on("change", handler);
        handler();
    });
}

function createEditorConfig(editor, total, line, column) {
    return {
        editor,
        config: {
            totalLines: total,
            currentLine: line,
            currentColumn: column
        }
    };
}

function toggleEditor(editor, expandCode = false) {
    if (expandCode === true) {
        editor.execCommand('unfoldAll')
    }
    else {
        editor.execCommand('foldAll')
    }
}