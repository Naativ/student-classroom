import moment from 'moment'

describe('Registration and Login Tests', function () {
  const mockUser = {
    name: 'Hexly Test',
    password: 'Password1',
    phone: '1234567890',
    username: `test-${moment().valueOf()}@test.net`,
    creditcard: '4242424242424242',
    cardexpiration: moment().add(1, 'month').add(1, 'year').format('MM/YY'),
    cvc: '123'
  }

  it('Simple Registration', function () {
    cy.visit('http://localhost:8080/')
    cy.get('[data-cy=\'Registration Name\']').type(mockUser.name)
    cy.get('[data-cy=\'Registration Phone\']').type(mockUser.phone)
    cy.get('[data-cy=\'Registration Email\']').type(mockUser.username)
    cy.get('[data-cy=\'Registration Password\']').type(mockUser.password)
    cy.get('[data-cy=\'Sign Up\']').click()
  })

  it('Simple Login', function () {
    cy.get('[data-cy=\'Logout\']').click()
    cy.get('[data-cy=\'Home Page Login\']').click()
    cy.get('[data-cy=\'Username\']').type(mockUser.username)
    cy.get('[data-cy=\'Password\']').type(mockUser.password)
    cy.get('[data-cy=\'Login\']').click()
  })

  it('Simple Subscription', function () {
    cy.get('[data-cy=\'Dashboard Purchase Subscription\']').click()
    cy.get('.subscriptions > div > div > .layout:nth-child(3) > .xs1').click()
    cy.get('[data-cy=\'Subscription Purchase Subscription\']').click()
    cy.get('.__PrivateStripeElement > iframe').then(($elements) => {
      const stripeElementsInputSelector = '.InputElement'
      const creditInput = $elements.eq(0).contents().find(stripeElementsInputSelector)
      cy.wrap(creditInput).type(mockUser.creditcard)
      const expirationInput = $elements.eq(1).contents().find(stripeElementsInputSelector)
      cy.wrap(expirationInput).type(mockUser.cardexpiration)
      const cvcInput = $elements.eq(2).contents().find(stripeElementsInputSelector)
      cy.wrap(cvcInput).type(mockUser.cvc)
    })
    cy.get('[data-cy=\'Purchase Subscription\']').click()
    cy.get('[data-cy=\'Close Subscription Dialog\']').click()
    cy.get('[data-cy=\'Hamburger Menu\']').click()
    cy.get('[data-cy=\'Dashboard\']').click()
  })
})
