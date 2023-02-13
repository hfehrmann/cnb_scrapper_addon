
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

function itemTransformer(element, docCategoryObject) {
  const paymentData = element.querySelectorAll('td:not(:first-child)');
  const transactionDataRow = element.nextElementSibling;
  const transactionData = transactionDataRow.querySelectorAll('div p');
  const referenceNumber = docCategoryObject.referenceNumberGetter(paymentData, transactionData);
  const transactionDate = docCategoryObject.dateGetter(paymentData, transactionData);
  const business = paymentData[2].textContent;
  const money = paymentData[5].querySelector('span').textContent;

  return {
    business: getBusinessName(business),
    referenceNumber: referenceNumber,
    transactionDate: transactionDate,
    money: getMoneyFromString(money)
  };
}

export function documentTransformer(doc, docCategoryObject) {
  const rows = doc.querySelectorAll(`#${docCategoryObject.tableID} tbody tr:nth-child(2n+1)`);
  const transactions = [...rows].map((element) => {
    return itemTransformer(element, docCategoryObject);
  });
  transactions.reverse()
  return transactions;
}
