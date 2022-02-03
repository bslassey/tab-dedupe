chrome.runtime.onInstalled.addListener(async () => {
  chrome.tabs.onCreated.addListener(newTab);
});

let targetTab;

function newTab(tab) {
  console.log(JSON.stringify(tab));
  targetTab = tab;
  chrome.tabs.query({'url': unwrapURL(tab.pendingUrl)}, matchingTabs);

};


function matchingTabs(tabs) {
  console.log("There are " + tabs.length + " existing tabs");
  if (tabs.length == 0) {
    console.log("no matching tabs");
    return;
  }
  if (tabs.length == 1 && tabs[0] == targetTab) {
    console.log("one matching tab, but it is the target");
    return;
  }
  let bounceTab = tabs[0].id == targetTab.id ? tabs[1] : tabs[0];
  console.log("target tab: " + targetTab);
  let url = chrome.runtime.getURL("bounce.html") + "?tabIndex=" + bounceTab.index + "&windowId=" + bounceTab.windowId + "&continueURL=" + (targetTab.url ? targetTab.url : targetTab.pendingUrl);
  chrome.tabs.update(targetTab.id, {'url': url}, bounceLoaded);
}

function unwrapURL(url) {
  if (url.startsWith("https://www.google.com/url?")) {
    let params = new URL(url).searchParams;
    console.log("unwrapping " + params.get("q"));
    return params.get("q");
  }
  return url;
}


function bounceLoaded(event) {
  console.log("bounce loaded: " + JSON.stringify(event));
}
