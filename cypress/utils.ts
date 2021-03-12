export enum specialOps {
  'ac',
  'plus-minus',
  'percent',
}

export enum operations {
  DIVISION,
  MULTIPLICATION,
  SUBTRACTION,
  ADDITION,
  EQUALS,
}

export const opSymbols = ['/', '*', '-', '+', '='];

export const rand = (n: number) => {
  return Math.floor(Math.random() * n);
};

export const inputNumber = (n: number) => {
  return n
    .toString()
    .split('')
    .forEach((d) => {
      cy.dataCy(`numButton-${d}`).click();
    });
};

export const testDisplay = (n: number) => {
  cy.get(`[data-cy=display]`).should((d) => {
    expect(d.get(0).innerText).to.eq(`${n}`);
  });
};

export const performOperation = (n: number, m: number, op: number) => {
  const result = eval(`${n} ${opSymbols[op]} ${m}`);

  inputNumber(n);
  cy.dataCy(`opButton-${op}`).click();
  inputNumber(m);
  cy.dataCy(`opButton-${operations.EQUALS}`).click();
  testDisplay(result);
};
