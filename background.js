chrome.webNavigation.onCompleted.addListener(function (details) {
  chrome.tabs.sendMessage(details.tabId, { message: "LOADED" });
}, { url: [{ urlContains: 'trello.com' }] });