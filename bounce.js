
window.addEventListener("load", setup);
//setup();

function setup() {
  console.log("load");
  document.getElementById("bounce").addEventListener("click", bounce);
  document.getElementById("continue").addEventListener("click", continueNav);
}

function bounce()  {
  chrome.tabs.getCurrent(currentTab);
}

function currentTab(tab) {
  const urlSearchParams = new URLSearchParams(window.location.search);
  let tabId = urlSearchParams.get("tabIndex");
  let windowId = urlSearchParams.get("windowId");
  chrome.tabs.highlight({'tabs': parseInt(tabId), windowId: parseInt(windowId)});
  chrome.tabs.remove(tab.id);
}

function continueNav() {
  const urlSearchParams = new URLSearchParams(window.location.search);
  let continueURL = urlSearchParams.get("continueURL");
  window.location = continueURL;
}
