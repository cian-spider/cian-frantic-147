// Content script: proves the extension is really running in the page and shows
// the live activity count it has recorded.
(async () => {
  if (document.getElementById("cian-dogfood-banner")) return;
  let count = 0;
  try {
    const res = await chrome.runtime.sendMessage({ type: "get_activity" });
    count = (res && res.activity && res.activity.length) || 0;
  } catch (e) {
    count = 0;
  }
  const bar = document.createElement("div");
  bar.id = "cian-dogfood-banner";
  bar.setAttribute("data-extension", chrome.runtime.id);
  bar.textContent =
    "Cian dogfood probe · MV3 extension active on this page · activity events recorded: " +
    count +
    " · subject: " +
    location.host;
  Object.assign(bar.style, {
    position: "fixed",
    zIndex: "2147483647",
    left: "0",
    right: "0",
    bottom: "0",
    padding: "10px 14px",
    font: "600 13px/1.4 ui-monospace,SFMono-Regular,Menlo,monospace",
    background: "#111",
    color: "#9f9",
    borderTop: "2px solid #9f9",
    textAlign: "center"
  });
  document.documentElement.appendChild(bar);
})();
