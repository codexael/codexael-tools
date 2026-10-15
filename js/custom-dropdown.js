/* Wraps a native <select> with a custom-styled dropdown while keeping the select as the source of truth. */
(function () {
    "use strict";

    /* Classes that must be copied onto the wrapper so existing row layouts keep working. */
    var LAYOUT_CLASSES = ["converter-unit", "currency-select", "ts-select"];

    function setOpen(wrap, open) {
        wrap.classList.toggle("open", open);
        var trigger = wrap.querySelector(".cdrop-trigger");
        if (trigger) trigger.setAttribute("aria-expanded", open ? "true" : "false");
    }

    function closeAll() {
        document.querySelectorAll(".cdrop.open").forEach(function (wrap) {
            setOpen(wrap, false);
        });
    }

    /* Flattens a select's <option>/<optgroup> children into a render-ready list. */
    function readEntries(select) {
        var entries = [];
        Array.prototype.forEach.call(select.children, function (node) {
            if (node.tagName === "OPTGROUP") {
                entries.push({ type: "group", label: node.label });
                Array.prototype.forEach.call(node.children, function (opt) {
                    entries.push({ type: "option", el: opt });
                });
            } else if (node.tagName === "OPTION") {
                entries.push({ type: "option", el: node });
            }
        });
        return entries;
    }

    function currentLabel(select) {
        var opt = select.options[select.selectedIndex];
        return opt ? opt.textContent : "";
    }

    /* Hides a group header once every option under it is filtered out. */
    function applyGroupVisibility(menu) {
        menu.querySelectorAll(".cdrop-group-label").forEach(function (label) {
            var anyVisible = false;
            var node = label.nextElementSibling;
            while (node && !node.classList.contains("cdrop-group-label")) {
                if (node.classList.contains("cdrop-option") && !node.classList.contains("hidden-by-search")) {
                    anyVisible = true;
                    break;
                }
                node = node.nextElementSibling;
            }
            label.classList.toggle("hidden-by-search", !anyVisible);
        });
    }

    function render(select, wrap) {
        var opts = select._cdropOpts || {};
        var trigger = wrap.querySelector(".cdrop-trigger");
        var valueEl = wrap.querySelector(".cdrop-value");
        var menu = wrap.querySelector(".cdrop-menu");

        valueEl.textContent = currentLabel(select);
        trigger.disabled = select.disabled;
        wrap.classList.toggle("cdrop-disabled", select.disabled);

        menu.innerHTML = "";

        if (opts.search) {
            var searchLi = document.createElement("li");
            searchLi.className = "cdrop-search";
            searchLi.innerHTML = '<i class="bi bi-search"></i><input type="text" placeholder="Search...">';
            menu.appendChild(searchLi);
            var searchInput = searchLi.querySelector("input");
            searchInput.addEventListener("input", function () {
                var q = searchInput.value.trim().toLowerCase();
                menu.querySelectorAll(".cdrop-option").forEach(function (row) {
                    row.classList.toggle("hidden-by-search", row.textContent.toLowerCase().indexOf(q) === -1);
                });
                applyGroupVisibility(menu);
            });
        }

        readEntries(select).forEach(function (entry) {
            if (entry.type === "group") {
                var groupLi = document.createElement("li");
                groupLi.className = "cdrop-group-label";
                groupLi.textContent = entry.label;
                menu.appendChild(groupLi);
                return;
            }

            var opt = entry.el;
            if (opt.disabled) return;

            var li = document.createElement("li");
            li.className = "cdrop-option" + (opt.selected ? " selected" : "");
            li.setAttribute("role", "option");
            li.setAttribute("aria-selected", opt.selected ? "true" : "false");

            var span = document.createElement("span");
            span.textContent = opt.textContent;
            var check = document.createElement("i");
            check.className = "bi bi-check2";
            li.appendChild(span);
            li.appendChild(check);

            li.addEventListener("click", function () {
                select.value = opt.value;
                select.dispatchEvent(new Event("change", { bubbles: true }));
                refresh(select);
                setOpen(wrap, false);
            });

            menu.appendChild(li);
        });
    }

    function refresh(select) {
        var wrap = select._cdropWrap;
        if (wrap) render(select, wrap);
    }

    function enhance(select, opts) {
        if (select._cdropWrap) return;
        select._cdropOpts = opts || {};

        var wrap = document.createElement("div");
        wrap.className = "cdrop";
        LAYOUT_CLASSES.forEach(function (c) {
            if (select.classList.contains(c)) wrap.classList.add(c);
        });

        wrap.innerHTML =
            '<button type="button" class="cdrop-trigger" aria-haspopup="listbox" aria-expanded="false">' +
            '<span class="cdrop-value"></span>' +
            '<i class="bi bi-chevron-down chev"></i>' +
            "</button>" +
            '<ul class="cdrop-menu" role="listbox"></ul>';

        select.style.display = "none";
        select.insertAdjacentElement("afterend", wrap);
        select._cdropWrap = wrap;

        var trigger = wrap.querySelector(".cdrop-trigger");
        var menu = wrap.querySelector(".cdrop-menu");

        menu.addEventListener("click", function (e) {
            e.stopPropagation();
        });

        trigger.addEventListener("click", function (e) {
            e.stopPropagation();
            if (select.disabled) return;
            var willOpen = !wrap.classList.contains("open");
            closeAll();
            if (willOpen) {
                setOpen(wrap, true);
                var searchInput = wrap.querySelector(".cdrop-search input");
                if (searchInput) searchInput.focus();
            }
        });

        render(select, wrap);
    }

    document.addEventListener("click", closeAll);
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeAll();
    });

    window.CustomDropdown = { enhance: enhance, refresh: refresh };
})();
