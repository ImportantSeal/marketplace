Cypress.Commands.add('signup', (name, email, password) => {
  cy.request({
    method: 'POST',
    url: 'http://localhost:5000/api/users/signup',
    headers: { 'Content-Type': 'application/json' },
    body: { name, email, password }
  }).its('status').should('eq', 201)
})

Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login')
  cy.get('#email').type(email)
  cy.get('#password').type(password)
  cy.get('form > button').click()
})

Cypress.Commands.add('logout', () => {
  cy.get('.navbar__logout').click()
})