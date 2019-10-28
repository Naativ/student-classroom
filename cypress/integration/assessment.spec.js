import moment from 'moment'

describe('Assessment Booking Test', function () {
  const mockUser = {
    username: 'dave+naativ.student@hexly.io',
    password: 'Password1'
  }
  const studentProfile = {
    studentname: `test-${moment().valueOf()}`,
    birthdate: moment().subtract(10, 'years').format('MM/DD/YYYY')
  }

  it('Simple Login', function () {
    cy.visit('http://localhost:8080/')
    cy.get('[data-cy=\'Home Page Login\']').click()
    cy.get('[data-cy=\'Username\']').clear()
    cy.get('[data-cy=\'Password\']').clear()
    cy.get('[data-cy=\'Username\']').type(mockUser.username)
    cy.get('[data-cy=\'Password\']').type(mockUser.password)
    cy.get('[data-cy=\'Login\']').click()
  })

  it('Simple Learning Profile', function() {
    cy.get('[data-cy=\'Hamburger Menu\']').click()
    cy.get('[data-cy=\'Menu Profile\']').click()
    cy.get('[data-cy=\'Add Learning Profile\']').click()
    cy.get('.v-card__text > .v-form > .v-badge:nth-child(4) > .v-avatar > img').click()
    cy.get('[data-cy=\'Student Name\']').type(studentProfile.studentname)
    cy.get('[data-cy=\'Student Birthdate\']').type(studentProfile.birthdate)
    cy.get('[data-cy=\'Student Gender\']').click({ force: true })
    cy.get('.menuable__content__active > .v-select-list > .v-list > :nth-child(2) > .v-list__tile').click()
    cy.get('[data-cy=\'Create Profile\']').click()
  })

  it('Simple Assessment Booking', function () {
    cy.get('[data-cy=\'Hamburger Menu\']').click({ force: true })
    cy.get('[data-cy=\'Dashboard\']').click({ force: true })
    cy.get('[data-cy=\'Book Assessment\']').click()
    // fullcalendar icon to next week
    cy.get('.fc-toolbar > .fc-left > .fc-button-group > .fc-next-button > .fc-icon').click()
    cy.wait(3000)
    // Selecting time slot on fullcalendar.js
    cy.get(':nth-child(5) > .fc-content-col > .fc-bgevent-container > [style="background-color: rgb(0, 211, 228); top: 527px; bottom: -549px;"]').click({ force: true })
    // Button to Book First Teacher in List
    cy.get(':nth-child(1) > .v-card > .v-card__actions > .justify-space-around > .v-tooltip > span > .primary > .v-btn__content').click()
    // Button to Cancel Booking
    cy.get(':nth-child(2) > .v-list > .layout > .v-dialog__container > .v-dialog__activator > [data-cy="Cancel Booking"] > .v-btn__content').click()
    // Button to Confirm Cancel Booking
    cy.get('.v-dialog__content--active > .v-dialog > .v-card > .v-card__actions > [data-cy="Confirm Cancel Booking"] > .v-btn__content').click({ multiple: true })
  })
})
