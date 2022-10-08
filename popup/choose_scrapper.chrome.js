function listenForClicks (activeTab) {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('transaction_type')) {
      chrome.tabs.sendMessage(activeTab.id, {
        command: "cnb_scrap",
        transactionType: e.target.textContent.toLowerCase()
      });
    }
  });
}

chrome.tabs.query(
  { active: true, currentWindow: true },
  ([activeTab]) => {
    chrome.tabs
      .executeScript(
        { file: "/content_scripts/scrapper.js" },
        (result) => {
          listenForClicks(activeTab)
        }
      )
  }
)
