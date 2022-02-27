import '@testing-library/cypress/add-commands';
import { Given, When, Then, And } from 'cypress-cucumber-preprocessor/steps';

Given('je suis un utilisateur', () => {});
And("il y a une erreur de l'api", () => {
  cy.server()
    .route({
      method: 'GET',
      url: 'http://localhost:2000/v1/events',
      status: 500,
    })
    .as('fetch-events');
  cy.server().route({
    url: 'http://localhost:2000/v1/events',
    method: 'POST',
    status: 500,
    response: {},
  });
});
And('il y a {int} évènements sur la page', number => {
  cy.server()
    .route('GET', 'http://localhost:2000/v1/events', `fixture:events${number}-response.json`)
    .as('fetch-events');
});
When('je suis sur la page principale', () => {
  cy.visit('/');
});
Then('je visualise les {int} évènements :', (nombre, table) => {
  if (nombre != 0) {
    cy.get('.events__list').children().its('length').should('eq', nombre);
    const events = table.rawTable;
    const name = 0;
    const date = 1;
    const description = 2;
    const status = 3;

    for (let i = 1; i < nombre + 1; i++) {
      cy.get('.events__list')
        .children()
        .eq(i - 1)
        .contains(events[i][name]);
      cy.get('.events__list')
        .children()
        .eq(i - 1)
        .contains(events[i][date]);
      cy.get('.events__list')
        .children()
        .eq(i - 1)
        .contains(events[i][description]);
      cy.get('.events__list')
        .children()
        .eq(i - 1)
        .contains(events[i][status]);
    }
  }
});
And('sur la page il y a un message de chargement', message => {
  cy.contains('Loading ...');
});
And("sur la page il y a un message d'erreur", message => {
  cy.wait(5000);
  cy.contains(
    "Si vous voyez ce message, veuillez contacter le service technique. L'application n'est pas fonctionnelle",
  );
});
