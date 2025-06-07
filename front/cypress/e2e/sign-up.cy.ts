describe('Sign Up Test', () => {
  it('Sign Up flow', () => {
    cy.intercept('POST', '/api/v1/auth/sign-up').as('signUpRequest');
    cy.intercept('GET', '/api/v1/user/me').as('getUserRequest');

    cy.visit('/sign-up');

    cy.get('.flo-app-loading').should('not.exist');
    cy.contains('Flo');

    const userName = 'Sign Up User';
    cy.get('input[id="sign-up-name"]').type(userName);
    cy.get('input[id="sign-up-email"]').type('sign-up@email.com');
    cy.get('input[id="sign-up-password"]').type('passworD1#');

    cy.get('button[type="submit"]').click();
    cy.wait('@signUpRequest').its('response.statusCode').should('eq', 201);
    cy.wait('@getUserRequest').its('response.statusCode').should('eq', 200);
    cy.wait(100);
    cy.url().should('include', '/dashboard');

    cy.contains('Flo');
    cy.contains(userName);
  });
});
