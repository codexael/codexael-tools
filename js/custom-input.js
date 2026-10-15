/* Generic behavior for .input-stepper, .input-clear-wrap and .input-secret-wrap widgets. */
(function () {
    "use strict";

    function fireInput(el) {
        el.dispatchEvent(new Event("input", { bubbles: true }));
    }

    /* Steps the paired number input up or down and re-fires its input event. */
    function stepInput(wrap, direction) {
        var input = wrap.querySelector("input");
        var step = parseFloat(input.step) || 1;
        var min = input.min !== "" ? parseFloat(input.min) : -Infinity;
        var max = input.max !== "" ? parseFloat(input.max) : Infinity;
        var current = parseFloat(input.value) || 0;
        var next = Math.min(max, Math.max(min, current + direction * step));
        input.value = next;
        fireInput(input);
    }

    /* Empties the paired input, re-fires its input event and refocuses it. */
    function clearInputValue(wrap) {
        var input = wrap.querySelector("input");
        input.value = "";
        fireInput(input);
        input.focus();
    }

    /* Flips a secret input between password and plain text, swapping the eye icon. */
    function toggleSecretVisibility(btn) {
        var wrap = btn.closest(".input-secret-wrap");
        var input = wrap.querySelector("input");
        var icon = btn.querySelector("i");
        var showing = input.type === "text";
        input.type = showing ? "password" : "text";
        icon.className = showing ? "bi bi-eye" : "bi bi-eye-slash";
    }

    document.addEventListener("click", function (e) {
        var stepBtn = e.target.closest(".input-stepper button");
        if (stepBtn) {
            stepInput(stepBtn.closest(".input-stepper"), stepBtn.dataset.step === "inc" ? 1 : -1);
            return;
        }

        var clearBtn = e.target.closest(".input-clear-wrap .clear-btn");
        if (clearBtn) {
            clearInputValue(clearBtn.closest(".input-clear-wrap"));
            return;
        }

        var toggleBtn = e.target.closest(".input-secret-wrap .toggle-visibility");
        if (toggleBtn) {
            toggleSecretVisibility(toggleBtn);
        }
    });

    /* The clear button only shows once its input actually has a value. */
    document.querySelectorAll(".input-clear-wrap input").forEach(function (input) {
        var wrap = input.closest(".input-clear-wrap");
        var sync = function () { wrap.classList.toggle("has-value", input.value.length > 0); };
        input.addEventListener("input", sync);
        sync();
    });
})();
