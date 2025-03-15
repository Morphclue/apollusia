describe('Create poll', () => {
  it('should display the dashboard', () => {
    // TODO: refactor in separate it blocks
    cy.visit('/dashboard')
    cy.get('app-navbar').should('be.visible');
    cy.get('app-dashboard').should('be.visible');
    cy.get('app-dashboard li').contains('There is nothing here.');
    cy.get('app-navbar').should('be.visible');
    cy.get('app-navbar .btn-primary').contains('Create Poll').click();
    cy.url().should('include', '/poll/create');
    cy.get('app-create-edit-poll').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled')
    cy.get('input[id="title"]').type('My Poll');
    cy.get('button[type="submit"]').should('not.be.disabled')
    cy.get('textarea[id="description"]').type('This is short description');
    cy.get('.input-group-text').should('have.class', 'bi-geo');
    cy.get('input[id="location"]').type('Discord');
    cy.get('.input-group-text').should('have.class', 'bi-discord');
    cy.get('input[id="deadline"]').type('2222-10-15');
    cy.get('input[id="time"]').type('04:20');
    cy.get('fieldset div div').contains('Group').click();
    cy.get('button[aria-controls="collapseExample"]')
      .should('have.attr', 'aria-expanded', 'false');
    cy.wait(5000);
  });
});
