describe('web', () => {
  beforeEach(() => cy.visit('/dashboard'));

  it('should display the dashboard', () => {
    cy.get('app-navbar').should('be.visible');
    cy.get('app-dashboard').should('be.visible');
  });
});
