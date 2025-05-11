
describe('Public pages', () => {
  it('shows marketplace listings on the homepage', () => {
    cy.visit('/')
    cy.get('h2').should('contain', 'Marketplace Listings')
  })

  it('navigates to Login when clicking "Login"', () => {
    cy.visit('/')
    cy.contains('Login').click()
    cy.url().should('include', '/login')
  })
})
