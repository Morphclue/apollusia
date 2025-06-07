import { AppPage } from '../support/app.po';

describe('Create poll', () => {
  const page = new AppPage();

  it('should display the dashboard', () => {
    const id = 'aERnsOuSeZs8WXNX'
    cy.visit('/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'admin-token-123');
      }
    })
    page.acceptCookies();
    page.expectEmptyDashboardVisible();
    page.openCreatePollPage();
    page.fillPollForm();
    page.createPoll(id);
    page.selectDates(id);
    page.participateInPoll(id);
  });
});
