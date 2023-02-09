
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

function getDateFromString(date) {
  const regex = /(\w+) (\d\d), (\d\d\d\d)/;
  const regexMatch = regex.exec(date);
  const month = regexMatch[1];
  const day = regexMatch[2];
  const year = regexMatch[3];
  return `${year}/${monthMap[month]}/${day}`;
}

export const postedCategoryObject = {
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

export const pendingCategoryObject = {
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
