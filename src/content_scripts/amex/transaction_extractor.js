import { documentTransformer } from "content_scripts/amex/document_transformer";

export function transactionsExtractor(doc) {
  return new Promise((resolver) => {
    resolver(documentTransformer(doc))
  });
}
