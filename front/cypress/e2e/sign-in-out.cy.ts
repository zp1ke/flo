describe('Sign In & Out Test', () => {
  it('Sign In & Out flow', () => {
    const userName = 'Sign In User';
    const userEmail = 'sign-in@email.com';
    const userPassword = 'passworD1#';

    // Sign Up
    const signUpUrl = Cypress.env('apiBaseUrl') + '/auth/sign-up';
    cy.request('POST', signUpUrl, {
      name: userName,
      email: userEmail,
      password: userPassword,
    }).then((response) => {
      expect(response.status).to.eq(201);
    });

    // Sign In
    cy.visit('/sign-in');

    cy.get('.flo-app-loading').should('not.exist');
    cy.contains('Flo');

    cy.get('input[id="sign-in-email"]').type(userEmail);
    cy.get('input[id="sign-in-password"]').type(userPassword);

    cy.get('button[type="submit"]').click();

    cy.intercept('POST', '/api/v1/auth/sign-in').as('signInRequest');
    cy.intercept('GET', '/api/v1/user/me').as('getUserRequest');
    cy.wait('@signInRequest').its('response.statusCode').should('eq', 200);
    cy.wait('@getUserRequest').its('response.statusCode').should('eq', 200);
    cy.wait(500);
    cy.url().should('include', '/dashboard');

    cy.contains('Flo');
    cy.contains(userName);

    // Sign Out
    cy.get('#sign-out').click();
    cy.get('button[id="sign-out-confirm"]').click();

    cy.intercept('POST', '/api/v1/auth/sign-out').as('signOutRequest');
    cy.wait('@signOutRequest').its('response.statusCode').should('eq', 200);
    cy.wait(500);
    cy.url().should('not.include', '/dashboard');

    cy.contains('Flo');
    cy.contains(userName).should('not.exist');
  });
});
