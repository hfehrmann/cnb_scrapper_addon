import css from './popup.css'
import browser from 'webextension-polyfill'

function listenForClicks (activeTab) {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('transaction_type')) {
      browser.tabs.sendMessage(activeTab.id, {
        command: "cnb_scrap",
        transactionType: e.target.textContent.toLowerCase()
      });
    }
  });

  document.getElementById("promote").addEventListener('click', (e) => {
    browser.tabs.sendMessage(activeTab.id, {
      command: "cnb_promote"
    });
   });

  document.getElementById("reset").addEventListener('click', (e) => {
    browser.tabs.sendMessage(activeTab.id, {
      command: "cnb_reset"
    });
  });
}

browser.tabs.query({ active: true, currentWindow: true })
.then(tabs => {
  const activeTab = tabs[0];

  const isCNBWebPage = activeTab.url.match(/https:\/\/cno\.cnb\.com\/.*/);

  if (!isCNBWebPage) { return; }

  browser.tabs
    .executeScript({ file: "scrapper.js" })
    .then(() => listenForClicks(activeTab))
    .catch(error => console.log('Error: ' + error));
});
