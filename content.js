function applyCustomColors() {
  chrome.storage.sync.get(
    ["issueColor", "childrenColor", "parentsColor"],
    function (result) {
      const issueColor = result.issueColor || "#82e8cf";
      const childrenColor = result.childrenColor || "#f9c976";
      const parentsColor = result.parentsColor || "#ff6b6b";

      const issueElements = document.querySelectorAll(
        'div[data-testid^="board-view-column-card"] > :first-child'
      );
      issueElements.forEach(function (issueElement) {
        issueElement.style.backgroundColor = issueColor;
      });

      const childIssueElements = Array.from(issueElements).filter((el) =>
        el.querySelector('[data-testid^="tracked-by-label"]')
      );
      childIssueElements.forEach(function (childIssueElement) {
        childIssueElement.style.backgroundColor = childrenColor;
      });
      const parentIssueElements = Array.from(issueElements).filter((el) =>
        el.textContent.includes("Size")
      );
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
