import { documentTransformer } from "content_scripts/cnb/document_transformer";

export function transactionsExtractor(doc, docCategoryObject) {
  return Promise((resolver) => {
    const rows = doc.querySelectorAll(`#${docCategoryObject.tableID} tbody tr`);

    const observer = new MutationObserver(mutations => {
      observer.disconnect();

      rows.forEach((element) => {
        element.click();
      });

      resolver(documentTransformer(doc, docCategoryObject));
    });

    observer.observe(document.querySelector(`#${docCategoryObject.tableID}`), {
      childList: true,
      subtree: true
    });

    rows.forEach((element) => {
      element.click();
    });
  });
}
