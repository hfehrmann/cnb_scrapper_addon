import {container, mCopyToClipboard} from 'browser_dep'

(() => {
  'use strict'
  function getMoneyFromString(moneyString) {
    const regex = /(-?)\(?.?([\d,]+\.\d+)\)?/;
    const matches = regex.exec(moneyString);
    const sign = matches[1]
    const money = matches[2];
    return sign + money.replace(',', '');
  }

  function getDateFromString(date) {
    const regex = /(\w+) (\d\d), (\d\d\d\d)/;
    const regexMatch = regex.exec(date);
    const month = regexMatch[1];
    const day = regexMatch[2];
    const year = regexMatch[3];
    return `${year}/${monthMap[month]}/${day}`;
  }

  const postedTransactionObject = {
    tableID: 'mycardsPostedTransactionsTableMainTable',
    referenceNumberGetter: function (paymentData, transactionData) {
      let referenceNumber = '';
      for (let i = 0; i < transactionData.length; i++) {
        const data = transactionData[i];
        const regex = /Reference Number:(.*)/;
        const regexMatch = regex.exec(data.textContent);
        if (regexMatch != null) {
          referenceNumber = regexMatch[1];
          break;
        }
      }
      return referenceNumber;
    },
    dateGetter: function(paymentData, transactionData) {
      let datePosted = '';
      for (let i = 0; i < transactionData.length; i++) {
        const data = transactionData[i];
        const regex = /Transaction Date:(.*)/;
        const regexMatch = regex.exec(data.textContent);
        if (regexMatch != null) {
          datePosted = regexMatch[1];
          break;
        }
      }
      return getDateFromString(datePosted);
    }
  };

  const pendingTransactionObject = {
    tableID: 'mycardsPendingTxnTableMainTable',
    referenceNumberGetter: function (paymentData, transactionData) {
      return paymentData[2] + Math.random();
    },
    dateGetter: function(paymentData, transactionData) {
      let datePosted = '';
      for (let i = 0; i < transactionData.length; i++) {
        const data = transactionData[i];
        const regex = /Transaction Date:(.*)/;
        const regexMatch = regex.exec(data.textContent);
        if (regexMatch != null) {
          datePosted = regexMatch[1];
          break;
        }
      }
      return getDateFromString(datePosted);
    }
  };

  /**
   * Check and set a global guard variable.
   * If this content script is injected into the same page again,
   * it will do nothing next time.
   */
  if (window.cnb_scrapper_hasRun) {
    return;
  }
  window.cnb_scrapper_hasRun = true;

  const monthMap = {
    'Jan': '01',
    'Feb': '02',
    'Mar': '03',
    'Apr': '04',
    'May': '05',
    'Jun': '06',
    'Jul': '07',
    'Aug': '08',
    'Sep': '09',
    'Oct': '10',
    'Nov': '11',
    'Dec': '12',
  };

  function processTransactions(transactionObject) {
    const rows = document.querySelectorAll(`#${transactionObject.tableID} tbody tr`);

    const observer = new MutationObserver(mutations => {
      observer.disconnect();

      rows.forEach((element) => {
        element.click();
      })

      let referenceNumbers = new Set();
      let payments = [];

      rows.forEach((element) => {
        const paymentData = element.querySelectorAll('td:not(:first-child)');

        const transactionDataRow = element.nextSibling
        const transactionData = transactionDataRow.querySelectorAll('div p');

        const referenceNumber = transactionObject.referenceNumberGetter(paymentData, transactionData);
        if (referenceNumbers.has(referenceNumber)) {
          return;
        }
        referenceNumbers.add(referenceNumber);

        const transactionDate = transactionObject.dateGetter(paymentData, transactionData);

        const business = paymentData[2].textContent;

        const money = paymentData[5].querySelector('span').textContent;

        payments.push({
          'business': business,
          'referenceNumber': referenceNumber,
          'transactionDate': transactionDate,
          'money': getMoneyFromString(money)
        });
      });

      payments.reverse();

      const joinedTable = payments
        .map(payment => [payment.transactionDate, payment.business, '', '', '', payment.money].join('\t'))
        .join('\n');

      mCopyToClipboard(joinedTable)
        .then(() => {
          alert("successfully copied");
        })
        .catch((error) => {
          console.log(error);
        });
    });

    observer.observe(document.querySelector(`#${transactionObject.tableID}`), {
      childList: true,
      subtree: true
    });

    rows.forEach((element) => {
      element.click();
    });
  }

  container.runtime.onMessage.addListener((message) => {
    if (message.command === "cnb_scrap") {
      if (message.transactionType == 'posted') {
        processTransactions(postedTransactionObject);
      } else if (message.transactionType == 'pending') {
        processTransactions(pendingTransactionObject);
      }
    }
  });

})();
