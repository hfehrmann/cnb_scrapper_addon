import { USD, USD_PENDING } from 'constants/currency';

export const CNB_L = 'CNB(L)';
export const CNB_H = 'CNB(H)';

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

function matchTransactionData(transactionData, regex) {
  let matchData = '';
    for (let i = 0; i < transactionData.length; i++) {
      const data = transactionData[i];
      const regexMatch = regex.exec(data.textContent);
      if (regexMatch != null) {
        matchData = regexMatch[1];
        break;
      }
    }
    return matchData;
}

function getDateFromString(date) {
  const regex = /(\w+) (\d\d), (\d\d\d\d)/;
  const regexMatch = regex.exec(date);
  const month = regexMatch[1];
  const day = regexMatch[2];
  const year = regexMatch[3];
  return `${year}/${monthMap[month]}/${day}`;
}

function getHolder(holder) {
  if (holder.includes('L')) {
    return CNB_L;
  } else if (holder.includes('H')) {
    return CNB_H;
  } else {
    return '';
  }
}

export const postedCategoryObject = {
  tableID: 'mycardsPostedTransactionsTableMainTable',
  currency: USD,
  referenceNumberGetter: function (paymentData, transactionData) {
    return matchTransactionData(transactionData, /Reference Number:(.*)/);
  },
  holderGetter: function (paymentData, transactionData) {
    let holder = matchTransactionData(
      transactionData,
      /Card Name and Number:(.*)/,
    );
    return getHolder(holder);
  },
  dateGetter: function(paymentData, transactionData) {
    let datePosted = matchTransactionData(
      transactionData,
      /Transaction Date:(.*)/,
    );
    return getDateFromString(datePosted);
  },
};

export const pendingCategoryObject = {
  tableID: 'mycardsPendingTxnTableMainTable',
  currency: USD_PENDING,
  referenceNumberGetter: function (paymentData, transactionData) {
    return paymentData[2] + Math.random();
  },
  holderGetter: function (paymentData, transactionData) {
    let holder = matchTransactionData(
      transactionData,
      /Card Name and Number:(.*)/,
    );
    return getHolder(holder);
  },
  dateGetter: function(paymentData, transactionData) {
    let datePosted = matchTransactionData(
      transactionData,
      /Transaction Date:(.*)/,
    );
    return getDateFromString(datePosted);
  },
};
