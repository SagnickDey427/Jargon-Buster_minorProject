// Create the context menu item when the extension is installed
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "bust-jargon",
        title: "Bust Jargon",
        contexts: ["selection"]
    });
});

// Listen for clicks on the context menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "bust-jargon") {
        const selectedText = info.selectionText;

        // Call your local Express API
        fetch('http://localhost:3000/api/simplify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text: selectedText })
        })
        .then(response => response.json())
        .then(data => {
            // Manifest V3 background scripts can't use alert() directly.
            // We have to inject a script into the active tab to show it.
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: (resultText) => {
                    alert("🎯 JARGON BUSTED:\n\n" + resultText);
                },
                args: [data.simplifiedText]
            });
        })
        .catch(error => {
            console.error('Error:', error);
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => alert("Error connecting to the Jargon Buster server.")
            });
        });
    }
});