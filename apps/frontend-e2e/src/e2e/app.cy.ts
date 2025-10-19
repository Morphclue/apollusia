import { AppPage } from '../support/app.po';

describe('Create poll and fill out information', () => {
  const page = new AppPage();

  it('Full e2e run', () => {
    const id = 'aERnsOuSeZs8WXNX'
    cy.visit('/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem('token', 'admin-token-123');
      }
    })
    page.prepareIntercepts(id);
    page.acceptCookies();
    page.expectEmptyDashboardVisible();
    page.openCreatePollPage();
    page.fillPollForm();
    page.createPoll(id);
    page.selectDates(id);
    page.participateInPoll(id);
  });
});
