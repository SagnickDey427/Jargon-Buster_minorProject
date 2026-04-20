chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "bust-jargon",
        title: "Bust Jargon",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "bust-jargon") {
        
        // Show loading state
        chrome.tabs.sendMessage(tab.id, { action: "showLoading" });

        try {
            const response = await fetch('http://localhost:3000/api/simplify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: info.selectionText })
            });

            if (!response.ok) throw new Error("Server error");

            // Tell the UI to clear the "loading" text and prepare for streaming
            chrome.tabs.sendMessage(tab.id, { action: "startStream" });

            const reader = response.body.getReader();
            const decoder = new TextDecoder();

            // Read the stream chunk by chunk
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                
                // Send each word/chunk to the UI instantly
                chrome.tabs.sendMessage(tab.id, { action: "streamChunk", text: chunk });
            }
        } catch (error) {
            console.error('Error:', error);
            chrome.tabs.sendMessage(tab.id, { 
                action: "showError", 
                text: "Could not connect to the server." 
            });
        }
    }
});