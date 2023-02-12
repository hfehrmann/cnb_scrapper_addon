/**
 * @jest-environment jsdom
 */

// jsdom has a problem when setting jest-environment into jsdom ¯\_(ツ)_/¯
// https://github.com/jsdom/whatwg-url/issues/209#issuecomment-1015559283
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

import { documentTransformer } from "content_scripts/amex/document_transformer";
import {
  pendingCategory,
  postedCategory,
} from "content_scripts/amex/category_objects";

const { readFileSync } = require("fs");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

describe("Amex WebPage", () => {
  describe("Posted transactions", () => {
    it("will extract relevant data from it in reverse order (first row is last)", () => {
      const file_path = "tests/resources/htmls/amex/amex.html";
      const file = readFileSync(file_path, "utf8");
      const dom = new JSDOM(file);

      const transactions = documentTransformer(
        dom.window.document,
        postedCategory,
      );

      expect(transactions).toEqual(
        [
          {
            business: 'Salt & Straw Ice Creseattle Wa',
            referenceNumber: 'transaction_320230270399561892',
            transactionDate: 'Jan 27',
            currency: 'USD',
            holder: 'AMEX(P)',
            money: '21.33',
          },
          {
            business: 'Happy Lamb Hot Pot 0seattle Wa',
            referenceNumber: 'transaction_320230300466267544',
            transactionDate: 'Jan 28',
            currency: 'USD',
            holder: 'AMEX(P)',
            money: '173.11',
          },
          {
            business: 'American Airlines 800-433-7300 Tx',
            referenceNumber: 'transaction_320230280428019389',
            transactionDate: 'Jan 28',
            currency: 'USD',
            holder: 'AMEX(P)',
            money: '163.40',
          },
          {
            business: 'Qfc Seattle Wa',
            referenceNumber: 'transaction_320230310502361382',
            transactionDate: 'Jan 29',
            currency: 'USD',
            holder: 'AMEX(P)',
            money: '11.57',
          },
          {
            business: 'Amazon Markeplace Na Pa',
            referenceNumber: 'transaction_320230330537104479',
            transactionDate: 'Feb 2',
            currency: 'USD',
            holder: 'AMEX(P)',
            money: '99.21',
          },
        ]
      )
    });
  });

  describe("Pending transactions", () => {
    it("will extract relevant data from it in reverse order (first row is last)", () => {
      const file_path = "tests/resources/htmls/amex/amex.html";
      const file = readFileSync(file_path, "utf8");
      const dom = new JSDOM(file);

      const transactions = documentTransformer(
        dom.window.document,
        pendingCategory,
      );

      expect(transactions).toEqual(
        [
          {
            business: 'Uber',
            referenceNumber: 'transaction_P0012771320230203170924',
            transactionDate: 'Feb 3',
            currency: 'USD(UNP)',
            holder: 'AMEX(P)',
            money: '12.48',
          },
          {
            business: 'Bajon En Seattle',
            referenceNumber: 'transaction_P0058378120230203193825',
            transactionDate: 'Feb 3',
            currency: 'USD(UNP)',
            holder: 'AMEX(P)',
            money: '105.55',
          },
          {
            business: 'Google Services',
            referenceNumber: 'transaction_P0020943020230204030927',
            transactionDate: 'Feb 4',
            currency: 'USD(UNP)',
            holder: 'AMEX(P)',
            money: '4.40',
          },
          {
            business: 'Gig Car Share',
            referenceNumber: 'transaction_P0018265020230204200159',
            transactionDate: 'Feb 4',
            currency: 'USD(UNP)',
            holder: 'AMEX(P)',
            money: '11.09',
          },
        ]
      )
    });
  });
});
