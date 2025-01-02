// Create a flag to track Turnstile verification status
let isTurnstileVerified = false;

// Define the Turnstile callback function
function turnstileCallback(token) {
    // This function is called when Turnstile verification succeeds
    console.log('Turnstile verified with token:', token);
    isTurnstileVerified = true;

    // Remove the overlay automatically if Turnstile verification is successful
    if (isTurnstileVerified) {
        overlay.remove();
    }
}

// Create an overlay element
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black
overlay.style.zIndex = '9999'; // Ensure it's above everything else
overlay.style.backdropFilter = 'blur(5px)'; // Add a blur effect

// Create a container for content
const container = document.createElement('div');
container.style.position = 'absolute';
container.style.top = '50%';
container.style.left = '50%';
container.style.transform = 'translate(-50%, -50%)';
container.style.textAlign = 'center';
container.style.zIndex = '10000'; // Ensure it's above the overlay blur

// Create the text element with animated ellipsis
const text = document.createElement('p');
text.style.color = '#fff'; // White text
text.style.fontSize = '1.5rem';
text.style.marginBottom = '10px'; // Add spacing below the text
text.innerHTML = "Making Sure You're Not A Bot<span class='dots'></span>";

// Add styles for the animated ellipsis
const style = document.createElement('style');
style.textContent = `
.dots {
    display: inline-block;
    width: 1.5em; /* Fixed width for three dots */
    text-align: left; /* Align dots to the start of the span */
}

@keyframes dotAnimation {
    0%, 20% { content: ''; }
    40% { content: '.'; }
    60% { content: '..'; }
    80% { content: '...'; }
    100% { content: '...'; } /* Hold the third dot briefly */
}

.dots::after {
    display: inline-block;
    content: '';
    animation: dotAnimation 2s infinite steps(1);
}
`;
document.head.appendChild(style);

// Create the Turnstile widget container
const cfTurnstile = document.createElement('div');
cfTurnstile.className = 'cf-turnstile';
cfTurnstile.setAttribute('data-sitekey', '0x4AAAAAAA4Dh3aGzUh-heP-'); // Replace with your Turnstile site key
cfTurnstile.setAttribute('data-callback', 'turnstileCallback'); // Specify the callback function name

// Append elements to the container
container.appendChild(text);
container.appendChild(cfTurnstile);

// Add the container to the overlay
overlay.appendChild(container);

// Add the overlay to the page
document.body.appendChild(overlay);