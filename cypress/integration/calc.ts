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
      // TODO: prevent input of multiple decimals
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
});
