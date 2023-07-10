import browser from 'webextension-polyfill';
import {
  container,
  mCopyToClipboard,
} from 'browser_dep';

import {
  processTransactions,
  promoteStoredReferenceNumbers,
  resetStoredReferenceNumbers,
} from 'content_scripts/scrapper_actions';

// CNB
import {
  transactionsExtractor as cnbTransactionsExtractor,
} from 'content_scripts/cnb/transactions_extractor';

import {
  postedCategoryObject as cnbPostedCategoryObject,
  pendingCategoryObject as cnbPendingCategoryObject,
} from 'content_scripts/cnb/category_objects';

// AMEX
import {
  transactionsExtractor as amexTransactionsExtractor,
} from 'content_scripts/amex/transactions_extractor';

import {
  postedCategory as amexPostedCategory,
  pendingCategory as amexPendingCategory,
} from 'content_scripts/amex/category_objects';

import {
  CNB_WEBPAGE,
  AMEX_WEBPAGE,
} from 'constants/webpage';

import * as actions from 'constants/actions';

(() => {
  'use strict';

  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.cnb_scrapper_hasRun) {
    return;
  }
  window.cnb_scrapper_hasRun = true;

  const transactionExtractorMap = {
    [CNB_WEBPAGE]: {
      [actions.POSTED]: (doc) => {
        return cnbTransactionsExtractor(doc, cnbPostedCategoryObject);
      },
      [actions.PENDING]: (doc) => {
        return cnbTransactionsExtractor(doc, cnbPendingCategoryObject);
      },
    },
    [AMEX_WEBPAGE]: {
      [actions.POSTED]: (doc) => {
        return amexTransactionsExtractor(doc, amexPostedCategory);
      },
      [actions.PENDING]: (doc) => {
        return amexTransactionsExtractor(doc, amexPendingCategory);
      },
    },
  };

  const defaultStorageData = {
    referenceNumbers: [],
    temporalReferenceNumbers: [],
  };
  const localStorage = browser.storage.local;

  function checkStoredData(storedSettings) {
    if (!storedSettings.referenceNumbers || !storedSettings.temporalReferenceNumbers) {
      localStorage.set(defaultStorageData);
    }
  }

  localStorage.get().then(checkStoredData);

  container.runtime.onMessage.addListener((message) => {
    if (message.command === actions.SCRAP) {
      localStorage.get()
        .then(storedData => {
          const storedReferenceNumbers = new Set(storedData.referenceNumbers);
          const webpage = message.webpage;
          if (message.transactionType === actions.POSTED) {
            processTransactions(
              localStorage,
              storedReferenceNumbers,
              transactionExtractorMap[webpage][actions.POSTED],
              true,
              mCopyToClipboard,
            );
          } else if (message.transactionType === actions.PENDING) {
            processTransactions(
              localStorage,
              storedReferenceNumbers,
              transactionExtractorMap[webpage][actions.PENDING],
              false,
              mCopyToClipboard,
            );
          }
        });
    } else if (message.command === actions.PROMOTE) {
      promoteStoredReferenceNumbers(localStorage);
    } else if (message.command === actions.RESET) {
      resetStoredReferenceNumbers(localStorage, defaultStorageData);
    }
  });
})();
