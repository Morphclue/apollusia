export class AppPage{
  pollBody = {
    "title": "My Poll",
    "description": "This is short description",
    "location": "Discord",
    "timeZone": "Europe/Berlin",
    "adminMail": false,
    "adminPush": false,
    "settings": {
      "deadline": "2222-10-15T04:20:00.000Z",
      "allowMaybe": true,
      "allowEdit": true,
      "anonymous": false,
      "allowComments": true,
      "logHistory": true,
      "showResult": "immediately"
    },
    "bookedEvents": {},
    "_id": "684467b0eb92799b3c597357",
    "createdAt": "2025-06-07T16:00:00.238Z",
    "updatedAt": "2025-06-07T16:00:00.238Z",
    "__v": 0,
    "id": "aERnsOuSeZs8WXNX"
  }

  pollEvents = [
    {
      "_id": "6844785ed2866d622a3a2ea4",
      "poll": "684467b0eb92799b3c597357",
      "start": "2025-06-08T20:30:00.000Z",
      "end": "2025-06-08T20:45:00.000Z",
      "__v": 0,
      "participants": 0
    },
    {
      "_id": "6844785ed2866d622a3a2ea3",
      "poll": "684467b0eb92799b3c597357",
      "start": "2025-06-08T23:30:00.000Z",
      "end": "2025-06-08T23:45:00.000Z",
      "__v": 0,
      "participants": 0
    }
  ]

  acceptCookies(){
    cy.get('app-cookie-banner').should('be.visible');
    cy.get('app-cookie-banner .btn-link').click();
  }

  expectEmptyDashboardVisible(){
    cy.get('app-navbar').should('be.visible');
    cy.get('app-dashboard').should('be.visible');
    cy.get('app-dashboard li').contains('There is nothing here.');
    cy.get('app-navbar').should('be.visible');
  }

  openCreatePollPage(){
    cy.get('app-navbar .btn-primary').contains('Create Poll').click();
    cy.url().should('include', '/poll/create');
    cy.get('app-create-edit-poll').should('be.visible');
    cy.get('button[type="submit"]').should('be.disabled')
  }

  fillPollForm() {
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
  }

  createPoll(id: string) {
    cy.intercept('POST', '/api/v1/poll', {
      statusCode: 201,
      body: this.pollBody
    });
    cy.contains('div.d-flex > button[type="submit"]', 'Create').click();
    cy.url().should('include', `/poll/${id}/date`);
  }

  selectDates(id: string) {
    cy.intercept('POST', `/api/v1/poll/${id}/events`, {
      statusCode: 200
    })
    cy.get('div.cal-hour-segment.cal-hour-start').last().click();
    cy.get('div.cal-hour-segment.cal-after-hour-start').last().click();
    cy.get('.btn-primary').contains('Update').click();
    cy.url().should('include', `/poll/${id}/participate`);
  }

  participateInPoll(id: string) {
    cy.intercept('GET', `/api/v1/poll/${id}/events`, {
      statusCode: 200,
      body: this.pollEvents
    })
    cy.intercept('GET', `/api/v1/poll/${id}/participate`, {
      statusCode: 200,
      body: []
    })
    cy.intercept('GET', `/api/v1/poll/${id}`, {
      statusCode: 200,
      body: this.pollBody
    })
    cy.intercept(`GET`, `/api/v1/poll/${id}/admin/admin-token-123`, {
      statusCode: 200,
      body: true
    })
  }
}
