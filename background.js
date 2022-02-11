chrome.runtime.onInstalled.addListener(async () => {
  chrome.tabs.onCreated.addListener(newTab);
  chrome.tabs.onUpdated.addListener(updatedTab);
});

let targetTab;
let pendingTabId;

function newTab(tab) {
  console.log(JSON.stringify(tab));
  if (!tab.pendingURL && !tab.url){
    pendingTabId = tab.id;
    return;
  }
  targetTab = tab;
  console.log("new tab with url: " + tab.pendingUrl);
  chrome.tabs.query({'url': stripQuery(unwrapURL(tab.pendingUrl))}, matchingTabs);

};

function updatedTab(tabid, changeInfo, tab) {
  if (tabid != pendingTabId) return;
  if (changeInfo.url) {
    targetTab = tab;
    pendingTabId = null;
    chrome.tabs.query({'url': stripQuery(unwrapURL(changeInfo.url))}, matchingTabs);
  }
}


function matchingTabs(tabs) {
  console.log("There are " + tabs.length + " existing tabs");
  if (tabs.length == 0) {
    console.log("no matching tabs");
    return;
  }
  if (tabs.length == 1 && tabs[0].id == targetTab.id) {
    console.log("one matching tab, but it is the target");
    return;
  }
  console.log("there are " + tabs.length + " matching tabs");
  let bounceTab = tabs[0].id == targetTab.id ? tabs[1] : tabs[0];
  console.log("target tab: " + JSON.stringify(targetTab));
  let url = chrome.runtime.getURL("bounce.html") + "?tabIndex=" + bounceTab.index + "&windowId=" + bounceTab.windowId + "&continueURL=" + (targetTab.url ? targetTab.url : targetTab.pendingUrl);
  chrome.tabs.update(targetTab.id, {'url': url}, bounceLoaded);
}

function stripQuery(url) {
  let queryPos = url.indexOf('?');
  if (queryPos == -1) {
    return url+"*";
  }
  let ret = url.substring(0,queryPos - 1) + "*";
  console.log(ret);
  return ret;

}

function unwrapURL(url) {
  if (url && url.startsWith("https://www.google.com/url?")) {
    let params = new URL(url).searchParams;
    console.log("unwrapping " + params.get("q"));
    return params.get("q");
  }
  console.log("url isn't wrapped: " + url);
  return url;
}


function bounceLoaded(event) {
  console.log("bounce loaded: " + JSON.stringify(event));
}
