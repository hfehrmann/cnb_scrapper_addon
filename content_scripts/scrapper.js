(() => {
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

  rows = document.querySelectorAll('#mycardsPostedTransactionsTableMainTable tbody tr');

  function getMoneyFromString(moneyString) {
    const regex = /(\d+\.\d+)/;
    const money = regex.exec(moneyString.substring(1))[1];
    return money.replace(',', '').replace('.', ',');
  }

  function getDateFromString(date) {
    const regex = /(\w+) (\d\d), (\d\d\d\d)/;
    const regexMatch = regex.exec(date);
    const month = regexMatch[1];
    const day = regexMatch[2];
    const year = regexMatch[3];
    return `${year}/${monthMap[month]}/${day}`;
  }

  function processTransactions(transactionType) {
    observer = new MutationObserver(mutations => {
      observer.disconnect();
      rows.forEach((element) => {
        element.click();
      })

      var referenceNumbers = new Set();
      var payments = [];

      rows.forEach((element) => {
        const transactionDataRow = element.nextSibling
        const transactionData = transactionDataRow.querySelectorAll('div p');

        referenceNumber = '';
        for (var i = 0; i < transactionData.length; i++) {
          const data = transactionData[i];
          const regex = /Reference Number:(.*)/;
          const regexMatch = regex.exec(data.textContent);
          if (regexMatch != null) {
            referenceNumber = regexMatch[1];
            break;
          }
        }

        if (referenceNumbers.has(referenceNumber)) {
          return;
        }

        referenceNumbers.add(referenceNumber);

        datePosted = '';
        for (var i = 0; i < transactionData.length; i++) {
          const data = transactionData[i];
          const regex = /Transaction Date:(.*)/;
          const regexMatch = regex.exec(data.textContent);
          if (regexMatch != null) {
            datePosted = regexMatch[1];
            break;
          }
        }

        const business = element.children[3].textContent;
        const money = element.children[6].querySelector('span').textContent;

        payments.push({
          'business': business,
          'referenceNumber': referenceNumber,
          'datePosted': getDateFromString(datePosted),
          'money': getMoneyFromString(money)
        });
      });


      const joinedTable = payments
        .map(payment => [payment.datePosted, payment.business, payment.money].join('\t'))
        .join('\n');

      navigator.clipboard.writeText(joinedTable)
        .then(() => {
          alert("successfully copied");
        })
        .catch((error) => {
          console.log(error);
        });
    });

    observer.observe(document.querySelector('#mycardsPostedTransactionsTableMainTable'), {
      childList: true,
      subtree: true
    });

    rows.forEach((element) => {
      element.click();
    });
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message.command === "cnb_scrap") {
      processTransactions(message.transactionType);
    }
  });

})();
