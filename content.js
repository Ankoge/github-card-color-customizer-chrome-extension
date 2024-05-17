function applyCustomColors() {
  chrome.storage.sync.get(
    ["issueColor", "childrenColor", "parentsColor"],
    function (result) {
      const issueColor = result.issueColor || "#ff0000";
      const childrenColor = result.childrenColor || "#00ff00";
      const parentsColor = result.parentsColor || "#0000ff";

      const issueElements = document.querySelectorAll(".fHtcQR");
      issueElements.forEach(function (issueElement) {
        issueElement.style.backgroundColor = issueColor;
      });

      const childIssueElements = document.querySelectorAll(
        'div.fHtcQR:has([data-testid^="tracked-by-label"])'
      );
      childIssueElements.forEach(function (childIssueElement) {
        childIssueElement.style.backgroundColor = childrenColor;
      });

      const parentIssueElements = Array.from(
        document.querySelectorAll(
          "div.fHtcQR:has(.VisuallyHidden-sc-d280cbd7-0.bcxNXA)"
        )
      ).filter((el) => el.textContent.includes("Size"));
      parentIssueElements.forEach(function (parentIssueElement) {
        parentIssueElement.style.backgroundColor = parentsColor;
      });
    }
  );
}

// Apply custom colors initially
applyCustomColors();

// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver(function (mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.type === "childList") {
      applyCustomColors();
    }
  });
});

// Configure the observer to watch for changes in the issue list
const issueList = document.querySelector(".hfaKjg");
if (issueList) {
  observer.observe(issueList, { childList: true, subtree: true });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "updateColors") {
    applyCustomColors();
  }
});
