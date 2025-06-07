import { AppPage } from '../support/app.po';

describe('Create poll', () => {
  const page = new AppPage();

  it('should display the dashboard', () => {
    cy.visit('/dashboard')
    page.acceptCookies();
    page.expectEmptyDashboardVisible();
    page.openCreatePollPage();
    page.fillPollForm();
  });
});
