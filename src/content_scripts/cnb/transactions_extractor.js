import { documentTransformer } from 'content_scripts/cnb/document_transformer';

export function transactionsExtractor(doc, docCategoryObject) {
  return new Promise((resolve) => {
    const rows = doc.querySelectorAll(`#${docCategoryObject.tableID} tbody tr`);

    const observer = new MutationObserver(mutations => {
      observer.disconnect();

      rows.forEach((element) => {
        element.click();
      });

      resolve(documentTransformer(doc, docCategoryObject));
    });

    observer.observe(document.querySelector(`#${docCategoryObject.tableID}`), {
      childList: true,
      subtree: true,
    });

    rows.forEach((element) => {
      element.click();
    });
  });
}
