describe('Watchlist', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('adds and removes stocks from watchlist', () => {
    // Add stock to watchlist
    cy.get('[data-testid="stock-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="watchlist-button"]').click();
      });

    // Verify stock is added to watchlist
    cy.get('[data-testid="watchlist-link"]')
      .should('contain', '(1)')
      .click();

    cy.url().should('include', '/watchlist');
    cy.get('[data-testid="stock-card"]').should('have.length', 1);

    // Remove stock from watchlist
    cy.get('[data-testid="stock-card"]')
      .within(() => {
        cy.get('[data-testid="watchlist-button"]').click();
      });

    cy.get('[data-testid="empty-watchlist"]').should('exist');
    cy.get('[data-testid="watchlist-link"]').should('not.contain', '(');
  });

  it('updates stock prices in watchlist', () => {
    // Add stock to watchlist
    cy.get('[data-testid="stock-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="watchlist-button"]').click();
        cy.get('[data-testid="stock-price"]').invoke('text').as('initialPrice');
      });

    // Go to watchlist and wait for price update
    cy.get('[data-testid="watchlist-link"]').click();
    cy.wait(30000); // Wait for price update interval

    cy.get('[data-testid="stock-card"]')
      .within(() => {
        cy.get('[data-testid="stock-price"]')
          .invoke('text')
          .then((currentPrice) => {
            cy.get('@initialPrice').then((initialPrice) => {
              expect(currentPrice).to.not.equal(initialPrice);
            });
          });
      });
  });

  it('persists watchlist after page reload', () => {
    // Add stock to watchlist
    cy.get('[data-testid="stock-card"]')
      .first()
      .within(() => {
        cy.get('[data-testid="watchlist-button"]').click();
      });

    // Reload page
    cy.reload();

    // Verify watchlist is preserved
    cy.get('[data-testid="watchlist-link"]')
      .should('contain', '(1)')
      .click();

    cy.get('[data-testid="stock-card"]').should('have.length', 1);
  });
}); 