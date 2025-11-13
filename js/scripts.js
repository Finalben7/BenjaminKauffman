// Force-success fallback in case Turnstile cannot run
function fallbackVerify() {
    console.warn("Turnstile unavailable — using fallback verification.");
    overlay.remove();
}

// Global callback Turnstile will call
window.turnstileCallback = function (token) {
    console.log("Turnstile verified:", token);
    overlay.remove();
};

// Create overlay
const overlay = document.createElement("div");
overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(5px);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const container = document.createElement("div");
container.style.cssText = `
    text-align: center;
    color: white;
    font-size: 1.5rem;
`;

const text = document.createElement("p");
text.textContent = "Making Sure You're Not A Bot...";

const turnstileDiv = document.createElement("div");
turnstileDiv.style.marginTop = "15px";

container.appendChild(text);
container.appendChild(turnstileDiv);
overlay.appendChild(container);
document.body.appendChild(overlay);

// Safe rendering with fallback
function renderTurnstile() {
    try {
        if (window.turnstile && typeof window.turnstile.render === "function") {
            window.turnstile.render(turnstileDiv, {
                sitekey: "0x4AAAAAAA4Dh3aGzUh-heP-",
                callback: window.turnstileCallback,
                appearance: "always",
                action: "demo",
                cData: "portfolio-showcase"
            });

            console.log("Turnstile rendered successfully");
        } else {
            // Retry until available
            setTimeout(renderTurnstile, 100);
        }
    } catch (e) {
        console.error("Turnstile error:", e);

        // Graceful fallback
        setTimeout(fallbackVerify, 800);
    }
}

// Fail-safe timeout: if turnstile can't render, just continue
setTimeout(() => {
    if (!window.turnstile) fallbackVerify();
}, 2000);

// Kick it off
renderTurnstile();