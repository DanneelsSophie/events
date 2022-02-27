import '@testing-library/cypress/add-commands';

context('Affichag du menu', () => {
  beforeEach(() => {
    cy.server()
      .route('GET', 'http://localhost:2000/v1/events', 'fixture:omdbapi-response.json')
      .as('fetch-events');
    cy.visit('/');
  });

  it('vérifier si le nom du menu est bien Kumojin', () => {
    cy.contains('Kumojin');
  });
});
