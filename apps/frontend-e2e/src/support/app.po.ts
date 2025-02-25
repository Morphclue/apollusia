export class AppPage{
  acceptCookies(){
    cy.get('app-cookie-banner').should('be.visible');
    cy.get('app-cookie-banner .btn-link').click();
  }
}
