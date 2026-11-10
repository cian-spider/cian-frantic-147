// Service worker: records navigation activity and serves an activity query.
const ENDPOINT = "http://127.0.0.1:8123/activity";
const KEY = "activity";
const INSTALL_ID = "cian-dogfood-" + Math.random().toString(36).slice(2, 10);

function nowIso() {
  return new Date().toISOString();
}

async function record(kind, detail) {
  const stored = await chrome.storage.local.get(KEY);
  const activity = stored[KEY] || [];
  const event = { seq: activity.length + 1, at: nowIso(), kind, ...detail };
  activity.push(event);
  await chrome.storage.local.set({ [KEY]: activity });
  try {
    await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        extension: {
          name: chrome.runtime.getManifest().name,
          id: chrome.runtime.id,
          version: chrome.runtime.getManifest().version
        },
        install_id: INSTALL_ID,
        installed: true,
        kind: "activity",
        source: "chrome",
        status: "ok",
        activity_query: { query: "chrome.storage.local.activity", count: activity.length },
        activity
      })
    });
  } catch (e) {
    // Loopback collector not running; storage still holds the record.
  }
  return event;
}

chrome.runtime.onInstalled.addListener(() => {
  record("installed", { reason: "onInstalled" });
});

chrome.webNavigation.onCommitted.addListener((d) => {
  if (d.frameId !== 0) return;
  record("navigation", { url: d.url });
});

chrome.tabs.onActivated.addListener((i) => {
  record("tab_activated", { tabId: i.tabId });
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg && msg.type === "get_activity") {
    chrome.storage.local.get(KEY).then((s) => sendResponse({ activity: s[KEY] || [] }));
    return true;
  }
});
