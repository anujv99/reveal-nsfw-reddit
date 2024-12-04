// send message to content script when tab has finished loading
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "complete" || changeInfo.status === "loading") {
    chrome.tabs.sendMessage(tabId, { message: "tab-updated" });
  }
});
