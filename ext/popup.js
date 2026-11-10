chrome.storage.local.get("activity").then((s) => {
  const activity = s.activity || [];
  const list = document.getElementById("list");
  activity.slice(-8).forEach((e) => {
    const li = document.createElement("li");
    li.textContent = e.kind + " " + (e.url || e.tabId || "");
    list.appendChild(li);
  });
  document.getElementById("meta").textContent =
    activity.length + " events · extension " + chrome.runtime.id;
});
