import {AppPage} from '../support/app.po';

describe('login', () => {
  const page = new AppPage();
  beforeEach(() => cy.visit('/dashboard'));

  it('should display the dashboard', () => {
    cy.get('app-navbar').should('be.visible');
    cy.get('app-dashboard').should('be.visible');
    page.acceptCookies();
  });
});
