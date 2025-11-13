// Define the Turnstile callback function globally
window.turnstileCallback = function (token) {
    console.log('Turnstile verified with token:', token);
    overlay.remove();
};

// Create the overlay
const overlay = document.createElement('div');
overlay.style.cssText = `
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 9999;
  backdrop-filter: blur(5px);
`;

// Create container centered on screen
const container = document.createElement('div');
container.style.cssText = `
  position: absolute;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 10000;
`;

// Create loading text
const text = document.createElement('p');
text.textContent = "Making Sure You're Not A Bot...";
text.style.cssText = `
  color: #fff;
  font-size: 1.5rem;
  margin-bottom: 10px;
`;

// Create Turnstile placeholder div
const turnstileDiv = document.createElement('div');

// Assemble overlay
container.appendChild(text);
container.appendChild(turnstileDiv);
overlay.appendChild(container);
document.body.appendChild(overlay);

// Function to render Turnstile safely
function renderTurnstile() {
    if (window.turnstile && typeof window.turnstile.render === 'function') {
        window.turnstile.render(turnstileDiv, {
            sitekey: '0x4AAAAAAA4Dh3aGzUh-heP-', // Your Turnstile site key
            callback: window.turnstileCallback,
            theme: 'light',
        });
        console.log('Turnstile rendered successfully.');
    } else {
        // Retry until Turnstile API is ready
        setTimeout(renderTurnstile, 100);
    }
}

// Wait for the Turnstile script to load, then render
renderTurnstile();