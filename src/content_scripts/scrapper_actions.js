
export function processTransactions(
  localStorage,
  storedReferenceNumbers,
  transactionsExtractorFunction,
  shouldAddReferenceInTemporalStorage,
  copyToClipboardFunction,
) {
  transactionsExtractorFunction(document)
    .then((transactions) => {
      const missingTransactions = transactions
        .filter(transaction => {
          return !storedReferenceNumbers.has(transaction.referenceNumber);
        });
      missingTransactions.forEach(transaction => {
        storedReferenceNumbers.add(transaction.referenceNumber);
      });
      if (shouldAddReferenceInTemporalStorage) {
        localStorage.set({
          temporalReferenceNumbers: Array.from(storedReferenceNumbers),
        });
      }

      const joinedTable = missingTransactions
        .map(payment =>
          [
            payment.transactionDate,
            payment.business,
            '',
            '',
            payment.holder,
            payment.currency,
            payment.money,
          ].join('\t'))
        .join('\n');

      copyToClipboardFunction(joinedTable)
        .then(() => {
          alert("successfully copied");
        })
        .catch((error) => {
          console.log(error);
        });
    });
}

export function promoteStoredReferenceNumbers(localStorage) {
  localStorage.get()
    .then(storedData => {
      return localStorage.set({
        referenceNumbers: storedData.temporalReferenceNumbers,
        temporalReferenceNumbers: [],
      });
    })
    .then(() => {
      alert("Promoted!");
    });
}

export function resetStoredReferenceNumbers(localStorage, defaultStorageData) {
  localStorage.set(defaultStorageData)
    .then(() => {
      alert("Reset!");
    });
}
