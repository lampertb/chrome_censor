let censoredWords = [];

// Function to check if an element contains any censored words
function containsCensoredWord(element) {
    const text = element.textContent.toLowerCase();
    return censoredWords.some(word => text.includes(word.toLowerCase()));
}

// Function to remove divs containing censored words
function censorContent() {
    const divs = document.getElementsByTagName('div');
    for (let i = divs.length - 1; i >= 0; i--) {
        if (containsCensoredWord(divs[i])) {
            divs[i].remove();
        }
    }
}

// Load censored words and set up initial censoring
chrome.storage.local.get(['censoredWords'], (result) => {
    if (result.censoredWords) {
        censoredWords = result.censoredWords;
        
        // Run immediately if document is already loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            censorContent();
        }

        // Set up observers for both DOM ready and content loaded
        document.addEventListener('DOMContentLoaded', censorContent, { once: true });
        window.addEventListener('load', censorContent, { once: true });
    }
});

// Listen for updates to the censored words list
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'UPDATE_WORDS') {
        censoredWords = message.words;
        censorContent();
    }
});

// Create a style element to hide divs during initial page load
const style = document.createElement('style');
style.textContent = 'div { opacity: 0 !important; transition: opacity 0.1s; }';
document.documentElement.appendChild(style);

// Remove the style after a short delay to ensure content is checked
setTimeout(() => {
    style.remove();
    const divs = document.getElementsByTagName('div');
    for (let i = 0; i < divs.length; i++) {
        divs[i].style.opacity = '1';
    }
}, 100);

// Watch for dynamic content changes
const observer = new MutationObserver((mutations) => {
    let shouldCensor = false;
    for (const mutation of mutations) {
        if (mutation.addedNodes.length) {
            shouldCensor = true;
            break;
        }
    }
    if (shouldCensor) {
        censorContent();
    }
});

// Start observing as soon as possible
if (document.body) {
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
} else {
    // If body isn't available yet, wait for it
    const bodyObserver = new MutationObserver(() => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
            bodyObserver.disconnect();
        }
    });
    
    bodyObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });
}
