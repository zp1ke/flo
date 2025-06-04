describe('Sign Up Test', () => {
  it('Visits the Sign Up page', () => {
    cy.visit('http://localhost:3000/sign-up');

    cy.get('.flo-app-loading').should('not.exist');
    cy.contains('Flo');

    cy.get('input[id="sign-up-name"]').type('Fake User');
    cy.get('input[id="sign-up-email"]').type('fake@email.com');
    cy.get('input[id="sign-up-password"]').type('fakepassworD1#');

    cy.get('button[type="submit"]').click();

    cy.intercept('POST', '/api/v1/auth/sign-up').as('signUpRequest');
    cy.intercept('GET', '/api/v1/auth/me').as('getUserRequest');
    cy.wait('@signUpRequest').its('response.statusCode').should('eq', 201);
    cy.wait('@getUserRequest').its('response.statusCode').should('eq', 200);
    cy.wait(500);
    cy.url().should('include', '/dashboard');

    cy.getAllLocalStorage()
      .find('auth_token')
      .then((authToken) => {
        expect(authToken).to.exist;
      });
  });
});
