/**
 * @jest-environment jsdom
 */
import { documentTransformer } from 'content_scripts/cnb/document_transformer';
import {
  postedCategoryObject,
  pendingCategoryObject,
} from 'content_scripts/cnb/category_objects';

// jsdom has a problem when setting jest-environment into jsdom ¯\_(ツ)_/¯
// https://github.com/jsdom/whatwg-url/issues/209#issuecomment-1015559283
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

const { readFileSync } = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

describe('CNB WebPage', () => {
  describe('Posted transaction with expanded html', () => {
    it('will extract relevant data from it in reverse order (first row is last)', () => {
      const filePath = 'tests/resources/htmls/cnb.html';
      const file = readFileSync(filePath, 'utf8');
      const dom = new JSDOM(file);

      const transactions = documentTransformer(
        dom.window.document,
        postedCategoryObject,
      );

      expect(transactions).toEqual(
        [
          {
            business: 'Foreign Transaction Fee',
            referenceNumber: '24692163025100218937207_ftr',
            transactionDate: '2023/01/26',
            currency: 'USD',
            holder: 'CNB(H)',
            money: '0.22',
          },
          {
            business: 'Netflix.Com',
            referenceNumber: '24692163025100218937207',
            transactionDate: '2023/01/26',
            currency: 'USD',
            holder: 'CNB(H)',
            money: '0.22',
          },
          {
            business: 'Uber Trip',
            referenceNumber: '24492153027717608073953',
            transactionDate: '2023/01/27',
            currency: 'USD',
            holder: 'CNB(H)',
            money: '16.43',
          },
          {
            business: 'Uber Trip',
            referenceNumber: '24492153029717925171033',
            transactionDate: '2023/01/29',
            currency: 'USD',
            holder: 'CNB(H)',
            money: '20.12',
          },
          {
            business: 'Uber Trip',
            referenceNumber: '24492153030719100021261',
            transactionDate: '2023/01/30',
            currency: 'USD',
            holder: 'CNB(H)',
            money: '15.17',
          },
          {
            business: 'Uber Trip',
            referenceNumber: '24492153028715900346712',
            transactionDate: '2023/01/28',
            currency: 'USD',
            holder: 'CNB(L)',
            money: '21.78',
          },
        ],
      );
    });
  });

  describe('Pending transaction with expanded html', () => {
    it('will extract relevant data from it in reverse order (first row is last)', () => {
      const filePath = 'tests/resources/htmls/cnb.html';
      const file = readFileSync(filePath, 'utf8');
      const dom = new JSDOM(file);

      const transactions = documentTransformer(
        dom.window.document,
        pendingCategoryObject,
      );

      const filteredTransactions = transactions.map(e => {
        const { referenceNumber, ...data } = { ...e };
        return data;
      });

      expect(filteredTransactions).toEqual(
        [
          {
            business: 'Ubr* Pending.Uber.Com',
            transactionDate: '2023/01/28',
            currency: 'USD(UNP)',
            holder: 'CNB(H)',
            money: '20.84',
          },
          {
            business: 'Ubr* Pending.Uber.Com',
            transactionDate: '2023/01/29',
            currency: 'USD(UNP)',
            holder: 'CNB(H)',
            money: '20.84',
          },
          {
            business: 'Starbucks Store 02810',
            transactionDate: '2023/02/01',
            currency: 'USD(UNP)',
            holder: 'CNB(L)',
            money: '18.21',
          },
          {
            business: 'Starbucks Store 02810',
            transactionDate: '2023/02/01',
            currency: 'USD(UNP)',
            holder: 'CNB(L)',
            money: '8.56',
          },
        ],
      );
    });
  });
});
