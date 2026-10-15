// Shared helper that every page calling a free public API uses, so all of them handle failures the same way.

const API_DEFAULT_TIMEOUT_MS = 8000;
const API_DEFAULT_MAX_BYTES = 65536;

// An API failure whose message is safe to show to users, whose kind tells the page what went wrong, and whose status holds the HTTP code when there is one.
class ApiError extends Error {
    constructor(message, kind, status = null) {
        super(message);
        this.name = "ApiError";
        this.kind = kind;
        this.status = status;
    }
}

// Turns any fetch or read failure into an ApiError with a clear message.
function toApiError(error, controller, serviceName) {
    if (error instanceof ApiError) return error;
    if (controller.signal.reason === "timeout") return new ApiError(`${serviceName} timed out`, "timeout");
    if (controller.signal.aborted) return new ApiError("Request was cancelled", "aborted");
    if (!navigator.onLine) return new ApiError("You are offline", "offline");
    return new ApiError(`Could not reach ${serviceName}`, "network");
}

// Fetches JSON from a public API with an offline check, a timeout, a size limit and readable errors.
async function fetchPublicJson(url, { serviceName = "the service", timeoutMs = API_DEFAULT_TIMEOUT_MS, maxBytes = API_DEFAULT_MAX_BYTES, signal } = {}) {
    if (!navigator.onLine) throw new ApiError("You are offline", "offline");

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort("timeout"), timeoutMs);
    const forwardAbort = () => controller.abort(signal.reason);
    if (signal) {
        if (signal.aborted) forwardAbort();
        else signal.addEventListener("abort", forwardAbort, { once: true });
    }

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            cache: "no-store",
            credentials: "omit",
            referrerPolicy: "no-referrer",
            redirect: "error",
            mode: "cors"
        });

        if (response.status === 429) throw new ApiError(`${serviceName} is busy, please wait a minute and try again`, "rate-limit", 429);
        if (!response.ok) throw new ApiError(`${serviceName} returned HTTP ${response.status}`, "http", response.status);

        const declared = Number(response.headers.get("Content-Length"));
        if (declared > maxBytes) throw new ApiError(`${serviceName} sent a reply that was too large`, "invalid");

        const text = await response.text();
        if (text.length > maxBytes) throw new ApiError(`${serviceName} sent a reply that was too large`, "invalid");

        try {
            return JSON.parse(text);
        } catch {
            throw new ApiError(`${serviceName} sent an unreadable reply`, "invalid");
        }
    } catch (error) {
        throw toApiError(error, controller, serviceName);
    } finally {
        clearTimeout(timer);
        if (signal) signal.removeEventListener("abort", forwardAbort);
    }
}
