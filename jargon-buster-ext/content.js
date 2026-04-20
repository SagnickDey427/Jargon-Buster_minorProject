// Listen for commands from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "showLoading") {
        createPopup("Busting jargon... ⏳");
    } else if (request.action === "startStream") {
        updatePopup(""); // Clear the loading text so we can start typing
    } else if (request.action === "streamChunk") {
        appendPopup(request.text); // Add the new word
    } else if (request.action === "showError") {
        updatePopup("❌ Error: " + request.text);
    }
});

let popupContainer = null;
let shadowRoot = null;

function createPopup(text) {
    // Remove existing popup if user clicks multiple times
    if (popupContainer) popupContainer.remove();

    popupContainer = document.createElement('div');
    // Attach Shadow DOM to isolate our CSS from the host website
    shadowRoot = popupContainer.attachShadow({ mode: 'open' });

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
        <style>
            .jargon-card {
                position: fixed;
                bottom: 24px;
                right: 24px;
                width: 320px;
                background: #0f172a;
                color: #f8fafc;
                padding: 16px;
                border-radius: 12px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                z-index: 2147483647; /* Maximum z-index to sit on top of everything */
                border: 1px solid #334155;
                animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            }
            @keyframes slideUp {
                0% { transform: translateY(30px); opacity: 0; }
                100% { transform: translateY(0); opacity: 1; }
            }
            .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 12px;
                border-bottom: 1px solid #334155;
                padding-bottom: 8px;
            }
            .title { font-weight: 600; color: #38bdf8; font-size: 14px; }
            .close-btn {
                background: none;
                border: none;
                color: #94a3b8;
                cursor: pointer;
                font-size: 18px;
                padding: 0;
            }
            .close-btn:hover { color: #f8fafc; }
            .content { font-size: 14px; line-height: 1.6; color: #cbd5e1; white-space: pre-wrap; overflow-y:auto;}
        </style>
        
        <div class="jargon-card">
            <div class="header">
                <span class="title">🎯 Jargon Buster</span>
                <button class="close-btn" id="close-btn">&times;</button>
            </div>
            <div class="content" id="jargon-text">${text}</div>
        </div>
    `;

    shadowRoot.appendChild(wrapper);
    document.body.appendChild(popupContainer);

    // Add close button functionality
    shadowRoot.getElementById('close-btn').addEventListener('click', () => {
        popupContainer.remove();
        popupContainer = null;
    });
}

function updatePopup(text) {
    if (shadowRoot) {
        const contentDiv = shadowRoot.getElementById('jargon-text');
        if (contentDiv) {
            // Replace newlines with <br> tags for formatting
            contentDiv.innerHTML = text.replace(/\n/g, '<br>');
        }
    }
}

function appendPopup(text) {
    if (shadowRoot) {
        const contentDiv = shadowRoot.getElementById('jargon-text');
        if (contentDiv) {
            // Append the raw text (white-space: pre-wrap in CSS handles newlines automatically)
            contentDiv.textContent += text; 
        }
    }
}