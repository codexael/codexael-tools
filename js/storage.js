// Reads and parses a JSON value from local storage, or returns the fallback on missing or invalid data.
function getStorageItem(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw === null ? fallback : JSON.parse(raw);
    } catch (error) {
        return fallback;
    }
}

// Stringifies and writes a value to local storage under the given key.
function setStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

// Removes a key from local storage.
function removeStorageItem(key) {
    localStorage.removeItem(key);
}

// Reads a plain string value from local storage, or returns the fallback if missing.
function getStorageString(key, fallback) {
    const raw = localStorage.getItem(key);
    return raw === null ? fallback : raw;
}

// Writes a plain string value to local storage under the given key.
function setStorageString(key, value) {
    localStorage.setItem(key, value);
}

// Lists every key that holds the user's own data, grouped by what the "Clear my data" dialog shows.
// Theme and last-seen version are left out on purpose because they are settings, not user data.
// Cached live currency rates are left out on purpose because they are public data that refreshes itself.
const USER_DATA_STORAGE_GROUPS = [
    { label: "Favourite tools and recent usage", keys: ["favouriteTools", "toolUsageCounts"] },
    { label: "Notes", keys: ["toolstack_notes"], countKey: "toolstack_notes" },
    { label: "To-dos", keys: ["toolstack_todos"], countKey: "toolstack_todos" },
    { label: "Calculator history", keys: ["toolstack_calculator_history"], countKey: "toolstack_calculator_history" },
    { label: "Saved colour palettes", keys: ["toolstack_saved_palettes"], countKey: "toolstack_saved_palettes" },
    { label: "Custom currency rates", keys: ["toolstack_currency_custom_rates", "toolstack_currency_rates"] },
    { label: "Scrum Poker name and role", keys: ["toolstack_poker_name", "toolstack_poker_role"] },
    { label: "Party Games player name", keys: ["toolstack_party_name"] },
    { label: "Reaction Race best time", keys: ["toolstack_reaction_best_ms"] },
    { label: "Typing Race best speed", keys: ["toolstack_typing_best_wpm"] },
    { label: "Quiz Battle custom questions", keys: ["toolstack_quiz_custom"] },
    { label: "Would You Rather custom questions", keys: ["toolstack_wyr_custom"] },
    { label: "Trivia Quiz best score", keys: ["toolstack_trivia_best"] },
    { label: "Wildlife search location", keys: ["toolstack_wildlife_location"] },
    {
        label: "Saved tool options",
        keys: ["toolstack_unit_converter_category", "linear_code", "encoding", "b64_format", "checksum_output_format", "output_format", "qr_type", "text_editor_type", "display_mode", "query_language", "query_keyword_case", "query_indent", "cron_timezone", "toolstack_trivia_options", "toolstack_zip_country", "toolstack_metal_options"]
    }
];

// Returns the number of items stored under a key when it holds an array, or null otherwise.
function getStoredItemCount(key) {
    const value = getStorageItem(key, null);
    return Array.isArray(value) ? value.length : null;
}

// Checks whether any key in the group has a stored value.
function hasStoredData(group) {
    return group.keys.some(key => {
        try {
            return localStorage.getItem(key) !== null;
        } catch (error) {
            return false;
        }
    });
}

// Removes every user data key so the app starts fresh, and keeps the theme setting.
function clearAllUserData() {
    USER_DATA_STORAGE_GROUPS.forEach(group => group.keys.forEach(key => {
        try {
            removeStorageItem(key);
        } catch (error) {
            // Ignores blocked storage because there is nothing left to clear.
        }
    }));
}
