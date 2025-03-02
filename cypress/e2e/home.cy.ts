describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('displays popular stocks', () => {
    cy.get('h1').should('contain', 'Popular Stocks');
    cy.get('[data-testid="stock-card"]').should('have.length.at.least', 1);
  });

  it('allows searching for stocks', () => {
    cy.get('input[type="text"]')
      .type('AAPL{enter}');
    
    cy.get('h1').should('contain', 'Search Results');
    cy.get('[data-testid="stock-card"]')
      .should('exist')
      .and('contain', 'AAPL');
  });

  it('navigates to stock details page', () => {
    cy.get('[data-testid="stock-card"]')
      .first()
      .click();

    cy.url().should('include', '/stock/');
    cy.get('[data-testid="stock-chart"]').should('exist');
  });
}); 