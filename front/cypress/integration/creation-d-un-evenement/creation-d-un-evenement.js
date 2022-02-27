import '@testing-library/cypress/add-commands';
import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

Given('je suis un utilisateur', () => {
  cy.server()
    .route('GET', 'http://localhost:2000/v1/events', 'fixture:events0-response.json')
    .as('fetch-events');

  cy.server().route({
    url: 'http://localhost:2000/v1/events',
    method: 'POST',
    status: 201,
    response: {},
  });
  cy.visit('/');
});

And("il y a une erreur de l'api", () => {
  cy.server().route({
    url: 'http://localhost:2000/v1/events',
    method: 'POST',
    status: 500,
    response: {},
  });
  cy.visit('/');
});

When('je clique sur {string}', message => {
  cy.contains(message).click();
});

Then('une modale apparaît', () => {
  cy.get('.modal__form').should('exist');
});

And('le titre de la modale est {string}', titre => {
  cy.get('.modal__form__body').contains(titre);
});

And('un champ avec le label : {string}', label => {
  cy.get('.modal__form__body').contains(label);
});

And('le bouton {string} est activé', label => {
  cy.get('.modal__form').contains(label).should('not.be.disabled');
});

And('le bouton {string} est désactivé', label => {
  cy.get('.modal__form').contains(label).should('be.disabled');
});

And('je remplis le champs {string} {string} avec {string}', (type, label, value) => {
  cy.get(`${type}[name="${label}"]`).clear().type(value);
});

And('je supprime le contenu du champs {string} {string}', (type, label) => {
  cy.get(`${type}[name="${label}"]`).clear();
});

And("j'ai cliqué sur {string}", message => {
  cy.contains(message).click();
});

And("j'ai remplis les champs", message => {
  cy.get('input[name="name"]').clear().type('Meet-up');
  cy.get('textarea[name="description"]').clear().type('voici la description');
  cy.get('input[name="startDate"]').clear().type('23/02/2022 04:26 PM');
  cy.get('input[name="endDate"]').clear().type('23/02/2022 10:20 PM');
});

Then("la modale d'ajout est fermée", titre => {
  cy.get('.modal__form').should('not.exist');
});

And('une notification de succès est affichée', titre => {
  cy.contains("l'ajout de l'évènement Meet-up est un succès");
});

And("une notification d'erreur est affichée", titre => {
  cy.contains('Veuillez contacter le service technique !');
});
And('je ferme la notification', titre => {
  cy.get('button[aria-label="Close"]').click();
});

And('je ne vois plus la notification de succès', () => {
  cy.get('body')
    .not('.event_notification')
    .should('not.contain', "l'ajout de l'évènement Meet-up est un succès");
});

And("je ne vois plus la notification d'erreur", () => {
  cy.get('body')
    .not('.event_notification')
    .should('not.contain', 'Veuillez contacter le service technique !');
});

And("l'api getEvent est relancé", () => {
  cy.intercept('GET', 'http://localhost:2000/v1/events');
});

And("le message d'erreur {string} est present", label => {
  cy.get('.modal__form__body').contains(label);
});

And("le message d'erreur {string} n'est pas present", label => {
  cy.get('body').not('.modal__form__body').should('not.contain', label);
});

And('je vois le champs {string} {string} avec {string}', (type, label, value) => {
  if (value === 'now') {
  } else {
    cy.get(`${type}[name="${label}"]`).should('have.value', value);
  }
});
