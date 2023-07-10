import { documentTransformer } from 'content_scripts/amex/document_transformer';

export function transactionsExtractor(doc, categoryObject) {
  return new Promise((resolve) => {
    resolve(documentTransformer(doc, categoryObject));
  });
}
