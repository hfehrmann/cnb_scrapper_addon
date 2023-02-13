import { documentTransformer } from 'content_scripts/amex/document_transformer';

export function transactionsExtractor(doc, categoryObject) {
  return new Promise((resolver) => {
    resolver(documentTransformer(doc, categoryObject));
  });
}
