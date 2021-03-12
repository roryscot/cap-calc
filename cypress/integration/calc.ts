/// <reference types="cypress" />
import { opSymbols, testDisplay, operations, performOperation, rand, inputNumber, specialOps } from '../utils';

context('Actions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  describe('Basic inputs', () => {
    it('Displays numbers clicked', () => {
      const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      nums.forEach((n) => cy.dataCy(`numButton-${n}`).click());
      testDisplay(parseInt(nums.join('')));
    });

    it('Includes decimals', () => {
      const nums = [4, 5, 6, -1, 7, 8, 9]; // -1 represents a decimal on input
      nums.forEach((n) => cy.dataCy(`numButton-${n}`).click());
      testDisplay(parseFloat('456.789'));
    });

    it('Adds', () => {
      performOperation(rand(10000), rand(10000), operations.ADDITION);
    });

    it('Subtracts', () => {
      performOperation(rand(10000), rand(10000), operations.SUBTRACTION);
    });

    it('Multiplies', () => {
      performOperation(rand(100), rand(100), operations.MULTIPLICATION);
    });

    it('Divides', () => {
      performOperation(rand(10000), rand(10000), operations.DIVISION);
    });

    it('Performs subsequent operations with running total', () => {
      const n1 = rand(10);
      const n2 = rand(10);
      const n3 = rand(10);
      const n4 = rand(10);

      const res1 = n1 + n2;
      const res2 = n3 + n4;

      inputNumber(n1);
      cy.dataCy(`opButton-${operations.ADDITION}`).click();
      inputNumber(n2);
      cy.dataCy(`opButton-${operations.ADDITION}`).click();
      testDisplay(res1);
      inputNumber(n3);
      cy.dataCy(`opButton-${operations.ADDITION}`).click();
      inputNumber(n4);
      cy.dataCy(`opButton-${operations.EQUALS}`).click();

      testDisplay(res1 + res2);
    });
  });

  describe('Special operations', () => {
    it('Clears display', () => {
      // TODO: check state as well as display
      const n = rand(100);
      inputNumber(n);
      cy.dataCy(`spButton-${specialOps[0]}`).click();
      cy.get(`[data-cy=display]`).should((d) => {
        expect(d.get(0).innerText).to.eq('0');
      });
    });

    it('Inverts display sign', () => {
      // TODO: check state as well as display
      const n = rand(100);
      inputNumber(n);
      console.log(`spButton-${specialOps[1]}`);

      cy.dataCy(`spButton-${specialOps[1]}`).click();
      testDisplay(n * -1);
    });

    it('Converts to percent', () => {
      // TODO: check state as well as display
      const n = rand(100);
      inputNumber(n);

      cy.dataCy(`spButton-${specialOps[2]}`).click();
      testDisplay(n / 100);
    });
  });

  describe('Abuse of calc', () => {
    it('Divides by 0', () => {
      performOperation(rand(10000), 0, operations.DIVISION);
    });

    it('Uses multiple decimals', () => {
      const nums = [4, -1, 5, 6, -1, 7, 8, 9]; // -1 represents a decimal on input
      nums.forEach((n) => cy.dataCy(`numButton-${n}`).click());
      testDisplay(parseFloat('456.789'));
    });

    it('Overwrites multiple operations', () => {
      const n = rand(100);
      const m = rand(100);
      const result = eval(`${n} + ${m}`);

      inputNumber(n);
      cy.dataCy(`opButton-${operations.MULTIPLICATION}`).click();
      cy.dataCy(`opButton-${operations.DIVISION}`).click();
      cy.dataCy(`opButton-${operations.ADDITION}`).click();
      inputNumber(m);
      cy.dataCy(`opButton-${operations.EQUALS}`).click();
      testDisplay(result);
    });

    it('Resets display after pressing "="', () => {
      const target = rand(100);
      performOperation(rand(10000), rand(10000), operations.ADDITION);
      inputNumber(target);
      testDisplay(target);
    });
  });
});
