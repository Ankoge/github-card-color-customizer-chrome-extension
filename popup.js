document.addEventListener("DOMContentLoaded", function () {
  // Get the color picker inputs
  const issueColorInput = document.getElementById("issue-color");
  const childrenColorInput = document.getElementById("children-color");
  const parentsColorInput = document.getElementById("parents-color");

  // Load the saved colors from storage
  chrome.storage.sync.get(
    ["issueColor", "childrenColor", "parentsColor"],
    function (result) {
      if (result.issueColor) {
        issueColorInput.value = result.issueColor;
      }
      if (result.childrenColor) {
        childrenColorInput.value = result.childrenColor;
      }
      if (result.parentsColor) {
        parentsColorInput.value = result.parentsColor;
      }
    }
  );

  // Function to send a message to the content script
  function sendColorUpdateMessage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "updateColors" });
    });
  }

  // Save the selected colors to storage when they change and send a message to the content script
  issueColorInput.addEventListener("change", function () {
    chrome.storage.sync.set(
      { issueColor: issueColorInput.value },
      sendColorUpdateMessage
    );
  });

  childrenColorInput.addEventListener("change", function () {
    chrome.storage.sync.set(
      { childrenColor: childrenColorInput.value },
      sendColorUpdateMessage
    );
  });

  parentsColorInput.addEventListener("change", function () {
    chrome.storage.sync.set(
      { parentsColor: parentsColorInput.value },
      sendColorUpdateMessage
    );
  });
});
