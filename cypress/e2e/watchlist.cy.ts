describe('Watchlist', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('adds and removes stocks from watchlist', () => {

    cy.get('[data-testid="stock-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="watchlist-button"]').click();
      });


    cy.get('[data-testid="watchlist-link"]')
      .should('contain', '(1)')
      .click();

    cy.url().should('include', '/watchlist');
    cy.get('[data-testid="stock-card"]').should('have.length', 1);


    cy.get('[data-testid="stock-card"]')
      .within(() => {
        cy.get('[data-testid="watchlist-button"]').click();
      });

    cy.get('[data-testid="empty-watchlist"]').should('exist');
    cy.get('[data-testid="watchlist-link"]').should('not.contain', '(');
  });


  it('persists watchlist after page reload', () => {

    cy.get('[data-testid="stock-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="watchlist-button"]').click();
      });


    cy.reload();


    cy.get('[data-testid="watchlist-link"]')
      .should('contain', '(1)')
      .click();

    cy.get('[data-testid="stock-card"]').should('have.length', 1);
  });
}); 