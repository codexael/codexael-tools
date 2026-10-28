// Shared PeerJS room for the Party Games pages.
// The room creator is the referee: every player links straight to them, sends moves to them, and gets back only what they may see.

// This prefix keeps our room codes apart from other apps on the public PeerJS server.
const PARTY_CODE_PREFIX = "codexael-toolstack-party-";
const PARTY_NAME_STORAGE_KEY = "toolstack_party_name";
const PARTY_MAX_NAME_LENGTH = 20;
const PARTY_COLOUR_COUNT = 8;
const PARTY_REJECT_CLOSE_DELAY_MS = 1000;
const PARTY_JOIN_TIMEOUT_MS = 15000;

function partyEscapeHtml(value) {
    const div = document.createElement("div");
    div.textContent = String(value ?? "");
    return div.innerHTML;
}

// This trims a name and removes control characters so it is safe to show.
function partyCleanName(name) {
    return String(name ?? "").replace(/[\u0000-\u001f\u007f]/g, "").trim();
}

// This returns an error text for a bad name, or null for a good name.
function partyValidateName(name) {
    if (!name) return "Enter your name first";
    if (name.length > PARTY_MAX_NAME_LENGTH) return `The name must be ${PARTY_MAX_NAME_LENGTH} characters or less`;
    return null;
}

// This trims any text from another player and cuts it to a safe length.
function partyCleanText(value, maxLength) {
    return String(value ?? "").replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, "").trim().slice(0, maxLength);
}

function partyRandomCode() {
    const value = crypto.getRandomValues(new Uint32Array(1))[0];
    return String(value % 1000000).padStart(6, "0");
}

// This returns a random whole number from 0 up to but not including max.
function partyRandomInt(max) {
    return crypto.getRandomValues(new Uint32Array(1))[0] % max;
}

// This returns a shuffled copy of a list.
function partyShuffle(list) {
    const copy = [...list];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = partyRandomInt(i + 1);
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

// This returns the colour class of a player by their join order.
function partyColourClass(index) {
    return `party-c${((index % PARTY_COLOUR_COUNT) + PARTY_COLOUR_COUNT) % PARTY_COLOUR_COUNT}`;
}

// This makes guesses easy to compare by removing case, accents, punctuation and extra spaces.
function partyNormalizeGuess(text) {
    return String(text ?? "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9 ]+/g, " ")
        .replace(/\b(the|a|an)\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

// This checks a guess against an answer and allows one typo in longer answers.
function partyGuessMatches(guess, answer) {
    const a = partyNormalizeGuess(guess);
    const b = partyNormalizeGuess(answer);
    if (!a || !b) return false;
    if (a === b || a.replace(/ /g, "") === b.replace(/ /g, "")) return true;
    return b.length >= 6 && partyEditDistance(a, b) <= 1;
}

function partyEditDistance(a, b) {
    if (Math.abs(a.length - b.length) > 1) return 2;

    let previous = Array.from({ length: b.length + 1 }, (_, i) => i);

    for (let i = 1; i <= a.length; i++) {
        const current = [i];
        for (let j = 1; j <= b.length; j++) {
            current[j] = Math.min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        }
        previous = current;
    }

    return previous[b.length];
}

function partyCopyText(text, btn) {
    if (!text) {
        showInfoToast("Nothing to copy");
        return;
    }

    navigator.clipboard.writeText(text).then(() => {
        showSuccessToast("Copied to clipboard");
        const icon = btn && btn.querySelector("i");
        if (icon) {
            const original = icon.className;
            icon.className = "bi bi-check-lg";
            setTimeout(() => icon.className = original, 1000);
        }
    }).catch(() => showErrorToast("Could not copy to the clipboard"));
}

// This shares a result with the device share menu, or copies it where no share menu exists.
function partyShareText(text, btn) {
    if (navigator.share) {
        navigator.share({ text, url: location.href.split(/[?#]/)[0] }).catch(() => {});
        return;
    }

    partyCopyText(`${text}\n${location.href.split(/[?#]/)[0]}`, btn);
}

// This builds a timer bar that a page refreshes with updatePartyTimer.
function partyTimerHtml(id) {
    return `
        <div class="party-timer" id="${id}">
            <i class="bi bi-stopwatch"></i>
            <div class="party-timer-track"><div class="party-timer-fill"></div></div>
            <span class="party-timer-text">-</span>
        </div>`;
}

// This builds a row of option keys, where options is a list of [value, label] pairs.
function partySegmentHtml(setting, options, current, disabled) {
    return `<div class="party-segment" data-setting="${partyEscapeHtml(setting)}">${options.map(([value, label]) => `
        <button type="button" data-value="${partyEscapeHtml(value)}" class="${String(value) === String(current) ? "is-active" : ""}"${disabled ? " disabled" : ""}>${partyEscapeHtml(label)}</button>`).join("")}</div>`;
}

// This calls onChange with the setting name and value when any option key inside the container is clicked.
function bindPartySegments(container, onChange) {
    container.addEventListener("click", event => {
        const button = event.target.closest(".party-segment button");
        if (!button || button.disabled) return;
        onChange(button.closest(".party-segment").dataset.setting, button.dataset.value);
    });
}

// This turns a remaining time from the referee into a local deadline, so clocks on different machines do not matter.
function partyDeadlineFrom(remainingMs) {
    return Number.isFinite(remainingMs) && remainingMs > 0 ? performance.now() + remainingMs : null;
}

// This refreshes a timer bar from a local deadline and its full length.
function updatePartyTimer(el, deadline, totalMs) {
    if (!el) return;

    const left = deadline ? Math.max(0, deadline - performance.now()) : 0;
    const share = totalMs ? Math.min(1, left / totalMs) : 0;

    el.querySelector(".party-timer-fill").style.width = `${share * 100}%`;
    el.querySelector(".party-timer-text").textContent = deadline ? `${Math.ceil(left / 1000)}s` : "-";
    el.classList.toggle("is-low", deadline !== null && left < 5000);
}

// This builds a scoreboard from a list of players with name, colour, points and an optional gain.
function partyScoreboardHtml(rows) {
    const sorted = [...rows].sort((a, b) => b.points - a.points || a.order - b.order);
    const top = sorted.length ? sorted[0].points : 0;

    return `<div class="party-scoreboard">${sorted.map((row, index) => `
        <div class="party-score-row ${partyColourClass(row.order)}${row.points === top && top > 0 ? " is-top" : ""}">
            <span class="party-score-rank">#${index + 1}</span>
            <span class="party-score-name" title="${partyEscapeHtml(row.name)}">${partyEscapeHtml(row.name)}${row.self ? " (you)" : ""}</span>
            <span class="party-score-points">${row.points}${row.gain ? `<span class="party-score-gain">+${row.gain}</span>` : ""}</span>
        </div>`).join("")}</div>`;
}

// This creates the room for one game, draws its setup card and side panel, and returns the room controls.
// Options: gameId, title, icon, intro, colour, minPlayers, maxPlayers, footerNote, onEnter, onExit, onRoster, onView, onEvent,
// and host: { onJoin(player), onLeave(player), onAction(player, action) } for the referee.
function createPartyRoom(options) {
    const config = {
        minPlayers: 2,
        maxPlayers: 12,
        colour: "var(--blue)",
        footerNote: "Peer-to-peer, nothing is stored on a server",
        onEnter() {},
        onExit() {},
        onRoster() {},
        onView() {},
        onEvent() {},
        ...options,
        host: { onJoin() {}, onLeave() {}, onAction() {}, ...(options.host || {}) }
    };

    const setupEl = document.getElementById("partySetup");
    const roomEl = document.getElementById("partyRoom");
    const sideEl = document.getElementById("partyPanel");

    // This peer is our link to the room, and for the referee it also owns the room code.
    let peer = null;

    // This is our link to the referee when we joined someone else's room.
    let hostConn = null;

    let joined = false;
    let isHost = false;
    let code = "";
    let myId = "";
    let myName = "";
    let joinTimer = null;
    let roster = [];
    let badges = {};

    // This map holds each joined player by peer id with their link, name and join order, and only the referee fills it.
    const links = new Map();
    let nextOrder = 0;

    setupEl.innerHTML = `
        <div class="col-md-6 offset-md-3">
            <div class="editor-panel" style="--panel-c: ${config.colour}">
                <div class="editor-header">
                    <span class="editor-title">${partyEscapeHtml(config.title)}</span>
                </div>

                <div class="party-body invisible-scrollbars">
                    <div class="party-setup" style="--game-c: ${config.colour}">
                        <div class="party-setup-intro">
                            <i class="bi ${config.icon}"></i>
                            <p>${config.intro}</p>
                        </div>

                        <div class="party-field">
                            <label class="party-label" for="partyNameInput">Your name</label>
                            <input type="text" id="partyNameInput" class="input-cyan" maxlength="${PARTY_MAX_NAME_LENGTH}" placeholder="Enter your name (max ${PARTY_MAX_NAME_LENGTH} characters)" autocomplete="off">
                        </div>

                        <div class="party-divider">Create a room</div>

                        <button type="button" class="btn action-btn-primary" id="partyCreateBtn"><i class="bi bi-plus-lg"></i> Create Room</button>

                        <div class="party-divider">Or join a room</div>

                        <div class="party-field">
                            <label class="party-label" for="partyCodeInput">Room code</label>
                            <input type="text" id="partyCodeInput" class="input-cyan party-code-input" inputmode="numeric" maxlength="6" placeholder="000000" autocomplete="off">
                        </div>

                        <button type="button" class="btn action-btn-ghost" id="partyJoinBtn"><i class="bi bi-box-arrow-in-right"></i> Join Room</button>

                        <div class="party-status is-offline" id="partySetupStatus"><i class="party-status-dot"></i><span>Not connected</span></div>
                    </div>
                </div>

                <div class="editor-footer">
                    <div class="status">
                        <span>${partyEscapeHtml(config.footerNote)}</span>
                        <span>${config.minPlayers}-${config.maxPlayers} players</span>
                    </div>
                </div>
            </div>
        </div>`;

    sideEl.innerHTML = `
        <div class="editor-header">
            <span class="editor-title">Room</span>
            <div class="editor-actions">
                <button class="btn-danger" title="Leave room" id="partyLeaveBtn"><i class="bi bi-box-arrow-right icon-btn"></i></button>
            </div>
        </div>

        <div class="party-body invisible-scrollbars">
            <div class="party-code-box">
                <span class="party-label">Room code</span>
                <div class="party-code" id="partyCodeText">------</div>
                <div class="party-code-actions">
                    <button type="button" class="btn action-btn-ghost" id="partyCopyCodeBtn"><i class="bi bi-copy"></i> Code</button>
                    <button type="button" class="btn action-btn-ghost" id="partyCopyLinkBtn"><i class="bi bi-link-45deg"></i> Invite link</button>
                </div>
            </div>

            <div class="party-status is-offline" id="partyRoomStatus"><i class="party-status-dot"></i><span>Not connected</span></div>

            <div>
                <div class="party-section-header">
                    <span class="party-label">Players (<span id="partyPlayerCount">0</span>)</span>
                </div>
                <div class="party-members" id="partyMembers"></div>
            </div>

            <div class="party-hint" id="partySideHint"></div>
        </div>

        <div class="editor-footer">
            <div class="status">
                <span><b id="partyFooterPlayers">0</b> / ${config.maxPlayers} players</span>
                <span id="partyFooterRole">-</span>
            </div>
        </div>`;

    const nameInput = document.getElementById("partyNameInput");
    const codeInput = document.getElementById("partyCodeInput");
    const createBtn = document.getElementById("partyCreateBtn");
    const joinBtn = document.getElementById("partyJoinBtn");
    const membersEl = document.getElementById("partyMembers");

    // ---------- Status and views ----------

    function setStatus(state, text) {
        for (const el of [document.getElementById("partySetupStatus"), document.getElementById("partyRoomStatus")]) {
            el.className = `party-status is-${state}`;
            el.querySelector("span").textContent = text;
        }
    }

    function setSetupEnabled(enabled) {
        for (const element of [nameInput, codeInput, createBtn, joinBtn]) element.disabled = !enabled;
    }

    function getInviteLink() {
        return `${location.href.split(/[?#]/)[0]}?room=${code}`;
    }

    function renderMembers() {
        membersEl.innerHTML = roster.map(player => {
            const badge = badges[player.id];
            return `
                <div class="party-member ${partyColourClass(player.order)}${player.id === myId ? " is-self" : ""}">
                    <span class="party-avatar">${partyEscapeHtml(player.name.charAt(0).toUpperCase())}</span>
                    <span class="party-member-name" title="${partyEscapeHtml(player.name)}">${partyEscapeHtml(player.name)}${player.id === myId ? ` <span class="party-member-tag">(you)</span>` : ""}</span>
                    ${player.host ? `<i class="bi bi-star-fill party-host-icon" title="Room creator and referee"></i>` : ""}
                    ${badge && badge.note ? `<span class="party-member-note">${partyEscapeHtml(badge.note)}</span>` : ""}
                    ${badge && badge.icon ? `<i class="bi ${partyEscapeHtml(badge.icon)}" title="${partyEscapeHtml(badge.iconTitle || "")}"></i>` : ""}
                    ${badge && badge.chip !== undefined && badge.chip !== null ? `<span class="party-chip">${partyEscapeHtml(badge.chip)}</span>` : ""}
                </div>`;
        }).join("");

        document.getElementById("partyPlayerCount").textContent = roster.length;
        document.getElementById("partyFooterPlayers").textContent = roster.length;
        document.getElementById("partyFooterRole").textContent = isHost ? "You are the referee" : "Referee: room creator";

        const hint = document.getElementById("partySideHint");
        hint.textContent = roster.length < config.minPlayers
            ? `Waiting for players: this game needs at least ${config.minPlayers}. Share the code or the invite link.`
            : "";

        if (joined) setStatus("online", `Connected as ${myName} · ${roster.length} in room`);
    }

    function showRoom() {
        setupEl.classList.add("d-none");
        roomEl.classList.remove("d-none");
        document.getElementById("partyCodeText").textContent = code;

        try {
            setStorageString(PARTY_NAME_STORAGE_KEY, myName);
        } catch (error) {
            // This ignores blocked storage because the name is only a convenience.
        }

        config.onEnter();
        renderMembers();
    }

    function reset() {
        const wasJoined = joined;

        joined = false;
        isHost = false;
        code = "";
        myId = "";
        roster = [];
        badges = {};
        nextOrder = 0;
        links.clear();
        clearTimeout(joinTimer);

        if (peer) peer.destroy();
        peer = null;
        hostConn = null;

        roomEl.classList.add("d-none");
        setupEl.classList.remove("d-none");
        setSetupEnabled(true);

        if (wasJoined) config.onExit();
    }

    function fail(reason) {
        setStatus("error", reason);
        showErrorToast(reason);
        reset();
    }

    function leave() {
        const wasHost = isHost;
        reset();
        setStatus("offline", "Not connected");
        showInfoToast(wasHost ? "You left, so the room is closed for everyone" : "You left the room");
    }

    // ---------- Referee side ----------

    function getRosterList() {
        const list = [{ id: myId, name: myName, order: 0, host: true }];
        for (const [id, link] of links) list.push({ id, name: link.name, order: link.order, host: false });
        return list.sort((a, b) => a.order - b.order);
    }

    function sendTo(id, packet) {
        const link = links.get(id);
        if (link && link.conn.open) link.conn.send(packet);
    }

    function broadcastRoster() {
        roster = getRosterList();
        for (const id of links.keys()) sendTo(id, { t: "roster", players: roster });
        config.onRoster(roster);
        renderMembers();
    }

    function isNameTaken(name) {
        const key = name.toLowerCase();
        if (key === myName.toLowerCase()) return true;
        for (const link of links.values()) {
            if (link.name.toLowerCase() === key) return true;
        }
        return false;
    }

    function reject(conn, reason) {
        conn.on("open", () => {
            conn.send({ t: "rejected", reason });
            setTimeout(() => conn.close(), PARTY_REJECT_CLOSE_DELAY_MS);
        });
    }

    // This accepts a new player who knows the room code, or turns them away with a reason.
    function handleVisitor(conn) {
        const name = partyCleanName((conn.metadata || {}).name);
        const error = partyValidateName(name)
            || (isNameTaken(name) ? `The name "${name}" is already in use` : null)
            || (links.size + 1 >= config.maxPlayers ? `The room is full (${config.maxPlayers} players)` : null);

        if (error) {
            reject(conn, error);
            return;
        }

        conn.on("open", () => {
            nextOrder += 1;
            const link = { conn, name, order: nextOrder };
            links.set(conn.peer, link);

            conn.send({ t: "welcome", id: conn.peer, players: getRosterList() });
            showInfoToast(`${name} joined`);

            broadcastRoster();
            config.host.onJoin({ id: conn.peer, name, order: link.order, host: false });
        });

        conn.on("data", packet => {
            const link = links.get(conn.peer);

            // This uses the player bound to the link, so nobody can move under another name.
            if (!link || link.conn !== conn || !packet || packet.t !== "act") return;
            config.host.onAction({ id: conn.peer, name: link.name, order: link.order, host: false }, packet.a);
        });

        conn.on("close", () => {
            const link = links.get(conn.peer);
            if (!link || link.conn !== conn) return;

            links.delete(conn.peer);
            showInfoToast(`${link.name} left`);

            broadcastRoster();
            config.host.onLeave({ id: conn.peer, name: link.name, order: link.order, host: false });
        });

        conn.on("error", error => console.error(`Connection error with ${name}:`, error));
    }

    function claimCode() {
        code = partyRandomCode();
        peer = new Peer(PARTY_CODE_PREFIX + config.gameId + "-" + code);

        let isOpen = false;
        const thisPeer = peer;

        thisPeer.on("open", id => {
            isOpen = true;
            myId = id;
            joined = true;
            roster = getRosterList();
            showRoom();
            config.onRoster(roster);
            showSuccessToast(`Room ${code} created`);
        });

        thisPeer.on("connection", handleVisitor);

        // This reconnects to PeerJS so that new players can still find the room.
        thisPeer.on("disconnected", () => {
            if (peer === thisPeer && !thisPeer.destroyed) thisPeer.reconnect();
        });

        thisPeer.on("error", error => {
            console.error("Room error:", error);

            // This ignores PeerJS errors once the room is open, because player links are direct.
            if (isOpen) return;

            thisPeer.destroy();
            if (peer !== thisPeer) return;
            peer = null;

            // This picks a new code when the random one is already in use.
            if (error.type === "unavailable-id") {
                claimCode();
                return;
            }

            fail(`Could not create the room: ${error.type}`);
        });
    }

    function startCreate(name) {
        myName = name;
        isHost = true;
        setSetupEnabled(false);
        setStatus("pending", "Creating room...");
        claimCode();
    }

    // ---------- Player side ----------

    function handleHostPacket(packet) {
        if (!packet || typeof packet.t !== "string") return;

        switch (packet.t) {
            case "rejected":
                fail(String(packet.reason || "The room turned you away"));
                return;

            case "welcome":
                if (joined || !Array.isArray(packet.players)) return;
                clearTimeout(joinTimer);
                joined = true;
                myId = String(packet.id);
                roster = cleanRoster(packet.players);
                showRoom();
                config.onRoster(roster);
                showSuccessToast(`Joined room ${code}`);
                return;

            case "roster":
                if (!joined || !Array.isArray(packet.players)) return;
                roster = cleanRoster(packet.players);
                config.onRoster(roster);
                renderMembers();
                return;

            case "view":
                if (joined) config.onView(packet.v);
                return;

            case "event":
                if (joined) config.onEvent(packet.e);
                return;
        }
    }

    function cleanRoster(players) {
        return players
            .filter(p => p && typeof p.id === "string")
            .map(p => ({ id: p.id, name: partyCleanName(p.name).slice(0, PARTY_MAX_NAME_LENGTH) || "Player", order: Number(p.order) || 0, host: p.host === true }));
    }

    function startJoin(name, roomCode) {
        myName = name;
        isHost = false;
        code = roomCode;

        setSetupEnabled(false);
        setStatus("pending", "Joining room...");

        peer = new Peer();
        const thisPeer = peer;

        thisPeer.on("open", () => {
            hostConn = thisPeer.connect(PARTY_CODE_PREFIX + config.gameId + "-" + roomCode, { reliable: true, metadata: { name } });

            hostConn.on("data", handleHostPacket);

            hostConn.on("close", () => {
                if (peer !== thisPeer) return;
                if (joined) fail("The room creator left, so the room is closed");
                else fail("The room did not answer, so try again");
            });

            joinTimer = setTimeout(() => {
                if (!joined && peer === thisPeer) fail("The room did not answer, so try again");
            }, PARTY_JOIN_TIMEOUT_MS);
        });

        thisPeer.on("disconnected", () => {
            if (peer === thisPeer && !thisPeer.destroyed && !joined) thisPeer.reconnect();
        });

        thisPeer.on("error", error => {
            console.error("Player peer error:", error);
            if (joined || peer !== thisPeer) return;
            fail(error.type === "peer-unavailable" ? "Wrong code or the room is closed" : `Connection problem: ${error.type}`);
        });
    }

    // ---------- UI events ----------

    function readName() {
        const name = partyCleanName(nameInput.value);
        const error = partyValidateName(name);

        if (error) {
            showInfoToast(error);
            nameInput.focus();
            return null;
        }

        return name;
    }

    createBtn.addEventListener("click", () => {
        const name = readName();
        if (name) startCreate(name);
    });

    joinBtn.addEventListener("click", () => {
        const name = readName();
        if (!name) return;

        const roomCode = codeInput.value.trim();
        if (!/^\d{6}$/.test(roomCode)) {
            showInfoToast("Enter the 6-digit room code");
            codeInput.focus();
            return;
        }

        startJoin(name, roomCode);
    });

    codeInput.addEventListener("input", () => {
        codeInput.value = codeInput.value.replace(/\D/g, "").slice(0, 6);
    });

    codeInput.addEventListener("keydown", e => { if (e.key === "Enter") joinBtn.click(); });

    nameInput.addEventListener("keydown", e => {
        if (e.key === "Enter") (codeInput.value.trim() ? joinBtn : createBtn).click();
    });

    document.getElementById("partyLeaveBtn").addEventListener("click", leave);
    document.getElementById("partyCopyCodeBtn").addEventListener("click", e => partyCopyText(code, e.currentTarget));
    document.getElementById("partyCopyLinkBtn").addEventListener("click", e => partyCopyText(getInviteLink(), e.currentTarget));

    // This closes our links at once, so the others see us leave without waiting for a timeout.
    window.addEventListener("beforeunload", () => {
        const leaving = peer;

        // This clears the peer first, so our own close handlers do not report the room as closed.
        peer = null;
        if (leaving) leaving.destroy();
    });

    try {
        nameInput.value = getStorageString(PARTY_NAME_STORAGE_KEY, "") || getStorageString("toolstack_poker_name", "") || "";
    } catch (error) {
        // This ignores blocked storage because the name is only a convenience.
    }

    // This fills the room code from an invite link.
    const invitedCode = new URLSearchParams(location.search).get("room");
    if (/^\d{6}$/.test(invitedCode || "")) codeInput.value = invitedCode;

    if (typeof Peer === "undefined") {
        setSetupEnabled(false);
        setStatus("error", "The PeerJS library did not load");
    }

    // ---------- Room controls ----------

    return {
        get joined() { return joined; },
        get isHost() { return isHost; },
        get myId() { return myId; },
        get myName() { return myName; },
        get code() { return code; },

        // This returns everyone in the room in join order, each with id, name, order and host.
        get players() { return roster.map(p => ({ ...p })); },

        getPlayer(id) {
            const player = roster.find(p => p.id === id);
            return player ? { ...player } : null;
        },

        getInviteLink,

        // This sends a move to the referee, and the referee handles its own moves the same way.
        act(action) {
            if (!joined) return;

            if (isHost) {
                const me = { id: myId, name: myName, order: 0, host: true };
                queueMicrotask(() => config.host.onAction(me, action));
            } else if (hostConn && hostConn.open) {
                hostConn.send({ t: "act", a: action });
            }
        },

        // This sends each player their own view, built by the referee, so secrets stay with the right player.
        publish(buildView) {
            if (!joined || !isHost) return;

            for (const player of roster) {
                const view = buildView(player.id);
                if (view === undefined) continue;
                if (player.id === myId) config.onView(view);
                else sendTo(player.id, { t: "view", v: view });
            }
        },

        // This sends a short event to the given player ids, or to everyone when no ids are given.
        emit(event, ids = null) {
            if (!joined || !isHost) return;

            for (const player of roster) {
                if (ids && !ids.includes(player.id)) continue;
                if (player.id === myId) config.onEvent(event);
                else sendTo(player.id, { t: "event", e: event });
            }
        },

        // This sets the note, icon and score chip shown beside each player in the side panel.
        setBadges(map) {
            badges = map && typeof map === "object" ? map : {};
            renderMembers();
        },

        leave
    };
}
