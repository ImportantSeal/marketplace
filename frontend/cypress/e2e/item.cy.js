// frontend/cypress/e2e/item.cy.js

describe('Item CRUD with a freshly signed-up user', () => {
  const uniqueEmail = `user+${Date.now()}@test.com`
  const password    = 'password123'
  const itemName    = `Test Item ${Date.now()}`
  const updatedName = `${itemName} Updated`

  before(() => {
    cy.signup('Automated Tester', uniqueEmail, password)
  })

  beforeEach(() => {
    cy.login(uniqueEmail, password)
  })

  it('creates a new item and returns to the homepage', () => {
    cy.contains('Add Item').click()
    cy.get('input[placeholder="Name"]').type(itemName)
    cy.get('input[placeholder="Price"]').type('9.99')
    cy.get('select[name="category"]').select('Other')
    cy.get('textarea[placeholder="Description"]').type('Test item description')
    cy.get('form > button').click()
    cy.url().should('eq', `${Cypress.config('baseUrl')}/`)
    cy.contains(itemName).should('exist')
  })

  it('edits the item', () => {
    cy.visit('/')
    cy.contains(itemName).click()
    cy.contains('Edit Item').click()
    cy.get('input[name="name"]').clear().type(updatedName)
    cy.get('form > button').click()
    cy.contains(updatedName).should('exist')
  })

  it('deletes the item', () => {
    cy.visit('/')
    // locate the list item, then click its delete button
    cy.contains(updatedName)
      .closest('li')
      .find('button.delete-button')
      .click()
    cy.on('window:confirm', () => true)
    // reload homepage to update list
    cy.visit('/')
    cy.contains(updatedName).should('not.exist')
  })

  it('logs out successfully', () => {
    cy.logout()
    cy.contains('Login').should('exist')
  })
})
