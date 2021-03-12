/// <reference types="cypress" />

context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Displays numbers clicked', () => {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    nums.forEach((n) => cy.dataCy(`numButton-${n}`).click());
    cy.get(`[data-cy=display]`).should((d) => {
      expect(d.get(0).innerText).to.eq('123456789');
    });
  });
});
