import css from './popup.css'; // eslint-disable-line no-unused-vars
import browser from 'webextension-polyfill';

import * as actions from 'constants/actions.js';

import { allowedURL } from 'constants/webpage';

function listenForClicks(activeTab, webpage) {
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('transaction_type')) {
      browser.tabs.sendMessage(activeTab.id, {
        command: actions.SCRAP,
        transactionType: e.target.textContent.toLowerCase(),
        webpage,
      });
    }
  });

  document.getElementById('promote').addEventListener('click', (e) => {
    browser.tabs.sendMessage(activeTab.id, {
      command: actions.PROMOTE,
    });
  });

  document.getElementById('reset').addEventListener('click', (e) => {
    browser.tabs.sendMessage(activeTab.id, {
      command: actions.RESET,
    });
  });
}

browser.tabs.query({ active: true, currentWindow: true })
  .then(tabs => {
    const activeTab = tabs[0];
    const matcher = allowedURL(activeTab.url);
    matcher.then(webpage => {
      browser.tabs
        .executeScript({ file: 'scrapper.js' })
        .then(() => listenForClicks(activeTab, webpage))
        .catch(error => console.log('Error: ' + error));
    });
  });
