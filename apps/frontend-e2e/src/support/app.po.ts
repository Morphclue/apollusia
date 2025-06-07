export class AppPage{
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

  createPoll() {
    cy.intercept('POST', '/api/v1/poll', {
      statusCode: 201,
      body: {
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
    });
    cy.contains('div.d-flex > button[type="submit"]', 'Create').click();
    cy.url().should('include', '/poll/aERnsOuSeZs8WXNX/date');
  }
}
