
import { PENDING, POSTED } from 'content_scripts/amex/category_objects'

function getMoneyFromString(moneyString) {
  const regex = /(-?)\(?.?([\d,]+\.\d+)\)?/;
  const matches = regex.exec(moneyString);
  const sign = matches[1]
  const money = matches[2];
  return sign + money.replace(',', '');
}

function getBusinessName(name) {
  let trimmedName = name.replace(/\s+/g," ");
  return trimmedName.replace(
    /\b\w+\b/g,
    function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

function itemTransformer(element, categoryObject) {
  const referenceNumber = element.id;
  const transactionDate = element.querySelector('div:first-child').textContent;
  const business = element.querySelector('div:nth-child(4)').textContent;
  const money = element.querySelector('div:nth-child(5)').textContent;

  const additionalInformation = element.querySelector('div:nth-child(2)').textContent;
  const isPending = additionalInformation == 'Pending';
  const shouldReturnPending =
    isPending && categoryObject.processType == PENDING;
  const shouldReturnPosted =
    !isPending && categoryObject.processType == POSTED;

  if (shouldReturnPending || shouldReturnPosted) {
    return {
      business: getBusinessName(business),
      referenceNumber: referenceNumber,
      transactionDate: transactionDate,
      money: getMoneyFromString(money)
    };
  } else {
    return null;
  }
}

export function documentTransformer(doc, categoryObject) {
  const rows = doc.querySelectorAll("div[data-module-name='axp-activity-feed'] div div.position-relative > div");
  const allTransactions = [...rows].map((element) => {
    return itemTransformer(element, categoryObject);
  });
  const transactions = allTransactions.filter(x => x);
  transactions.reverse()
  return transactions;
}
