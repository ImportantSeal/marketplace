// frontend/cypress/e2e/auth.cy.js

describe('Authentication flow', () => {
  const uniqueEmail = `user+${Date.now()}@test.com`
  const password    = 'password123'

  it('allows a new user to sign up', () => {
    cy.visit('/signup')
    cy.get('#name').type('Test User')
    cy.get('#email').type(uniqueEmail)
    cy.get('#password').type(password)
    cy.get('form > button').click()
    // Sovellus ohjaa oletuksena login-sivulle
    cy.url().should('include', '/login')
  })

  it('allows that same user to log in', () => {
    cy.login(uniqueEmail, password)
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
  })

  it('allows logging out', () => {
    // Kirjaudutaan uudelleen, koska testit ajetaan erikseen
    cy.login(uniqueEmail, password)
    cy.logout()
    cy.contains('Login').should('exist')
})
})
