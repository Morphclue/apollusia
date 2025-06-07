import { AppPage } from '../support/app.po';

describe('Create poll', () => {
  const page = new AppPage();

  it('should display the dashboard', () => {
    const id = 'aERnsOuSeZs8WXNX'
    cy.visit('/dashboard')
    page.acceptCookies();
    page.expectEmptyDashboardVisible();
    page.openCreatePollPage();
    page.fillPollForm();
    page.createPoll(id);
    page.selectDates(id);
  });
});
