/**
 * @jest-environment jsdom
 */

// jsdom has a problem when setting jest-environment into jsdom ¯\_(ツ)_/¯
// https://github.com/jsdom/whatwg-url/issues/209#issuecomment-1015559283
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { processTransactions } from 'content_scripts/scrapper_actions';

const dummyData = [
  {
    business: 'B1',
    referenceNumber: '1',
    transactionDate: 'D1',
    currency: 'C1',
    holder: 'H1',
    money: '12.34',
  },
  {
    business: 'B2',
    referenceNumber: '2',
    transactionDate: 'D2',
    currency: 'C2',
    holder: 'H2',
    money: '12.34',
  },
  {
    business: 'B3',
    referenceNumber: '3',
    transactionDate: 'D3',
    currency: 'C3',
    holder: 'H3',
    money: '12.34',
  },
  {
    business: 'B4',
    referenceNumber: '4',
    transactionDate: 'D4',
    currency: 'C4',
    holder: 'H4',
    money: '12.34',
  },
];

class DummyStorage {
  constructor() {
    this.storage = {};
  }

  set(data) {
    this.storage.set = data;
  }
}

describe('Process transactions', () => {
  describe('given empty local storage', () => {
    it('should pass all information into clipboard', () => {
      processTransactions(
        null,
        new Set(),
        () => {
          return new Promise(resolver => resolver(dummyData));
        },
        false,
        (transactions) => {
          expect(transactions).toEqual(
            [
              'D1\tB1\t\t\tH1\tC1\t12.34',
              'D2\tB2\t\t\tH2\tC2\t12.34',
              'D3\tB3\t\t\tH3\tC3\t12.34',
              'D4\tB4\t\t\tH4\tC4\t12.34',
            ].join('\n')
          );
          return new Promise(r => {});
        },
      );
    });
  });

  describe('given some data in local storage', () => {
    it('should pass all information into clipboard', () => {
      processTransactions(
        null,
        new Set(['1', '3']),
        () => {
          return new Promise(resolver => resolver(dummyData));
        },
        false,
        (transactions) => {
          expect(transactions).toEqual(
            [
              'D2\tB2\t\t\tH2\tC2\t12.34',
              'D4\tB4\t\t\tH4\tC4\t12.34',
            ].join('\n')
          );
          return new Promise(r => {});
        },
      );
    });
  });

  describe('given some data in local storage', () => {
    it('should save new information in local storage', () => {
      let dummyStorage = new DummyStorage();
      processTransactions(
        dummyStorage,
        new Set(['1', '3']),
        () => {
          return new Promise(resolver => resolver(dummyData));
        },
        true,
        (transactions) => {
          expect(dummyStorage.storage.set).toEqual(
            {temporalReferenceNumbers: ['1', '3', '2', '4']},
          );
          return new Promise(r => {});
        },
      );
    });
  });
})
